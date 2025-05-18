/**
 * Evaluation Service
 * 
 * This module handles all evaluation-related functionality for the Hablaquí system.
 * It provides rating management, evaluation processing, and specialist feedback features.
 * 
 * Features:
 * - User ratings for specialists
 * - Evaluation submission and approval
 * - Rating calculations and averages
 * - Specialist performance metrics
 * - Email notifications for evaluations
 * - Evaluation moderation workflow
 * - Performance tracking
 * - Feedback management
 * 
 * @module services/evaluation
 * @requires ../models/specialist - Specialist model
 * @requires ../models/evaluation - Evaluation model
 * @requires ../models/sessions - Session model
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../utils/functions/evaluationFunction - Evaluation utilities
 * @requires ../utils/functions/mails/specialistStatus - Email service
 * @requires dayjs - Date handling
 */

'use strict'

import Specialist from '../models/specialist'
import Evaluation from '../models/evaluation'
import Sessions from '../models/sessions'
import { conflictResponse, okResponse } from '../utils/responses/functions'
import { getAllEvaluationsFunction } from '../utils/functions/evaluationFunction'
import mailServiceSpec from '../utils/functions/mails/specialistStatus'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Adds a new rating for a specialist
 * 
 * This function:
 * 1. Validates user-specialist relationship
 * 2. Creates rating object with user data
 * 3. Updates specialist's ratings array
 * 4. Returns updated specialist data
 * 
 * @async
 * @param {Object} user - User submitting the rating
 * @param {number} newRating - Rating value
 * @param {string} comment - Rating comment
 * @param {string} specialist - Specialist ID
 * @returns {Promise<Object>} Response with updated specialist data
 */
const addRating = async (user, newRating, comment, specialist) => {
  // Verifica que el usuario sea un especialista, crea el rating y lo agrega al especialista
  if (user.specialist != specialist) {
    return conflictResponse('Este no es tu especialista')
  }

  const rating = {
    author: user._id,
    comment,
    stars: newRating,
  }

  const updatedSpecialist = await Specialist.findByIdAndUpdate(
    specialist,
    { $push: { ratings: rating } },
    { new: true }
  )

  return okResponse('Rating actualizado', {
    specialist: updatedSpecialist,
  })
}

/**
 * Calculates and retrieves the average rating for a specialist
 * 
 * This function:
 * 1. Retrieves specialist data
 * 2. Validates existence of ratings
 * 3. Calculates average rating
 * 4. Returns rating value
 * 
 * @async
 * @param {string} specialist - Specialist ID
 * @returns {Promise<Object>} Response with average rating
 */
const getRating = async specialist => {
  // Obtiene el rating de un especialista, verifica que el especialista tenga al
  // menos una evaluacion y obtiene el promedio del rating
  const foundSpecialist = await Specialist.findById(specialist)
  if (!foundSpecialist.ratings || foundSpecialist.ratings.length == 0) {
    return okResponse('El especialista no tiene evaluaciones aun.')
  }

  let total = 0
  for (let i = 0; i < foundSpecialist.ratings.length; i++) {
    total += foundSpecialist.ratings[i].stars
  }

  return okResponse('Rating conseguido', {
    rating: total / foundSpecialist.ratings.length,
  })
}

/**
 * Retrieves all approved evaluations for a specialist
 * 
 * This function:
 * 1. Validates user role
 * 2. Retrieves specialist's evaluations
 * 3. Filters approved evaluations
 * 4. Returns formatted evaluation data
 * 
 * @async
 * @param {Object} user - Specialist user object
 * @returns {Promise<Object>} Response with evaluations
 */
const getEvaluationsSpec = async user => {
  if (user.role !== 'specialist') {
    return conflictResponse('No eres especialista')
  }

  // Verifica que el especialista tenga evaluaciones, si tiene las obtiene y las devuelve
  const spec = user.specialist
  let evaluations = await Evaluation.find({ specialist: spec })
  if (!evaluations) {
    return okResponse('Evaluaciones devueltas', {
      evaluations: [],
      global: 0,
      internet: 0,
      puntuality: 0,
      attention: 0,
    })
  }

  evaluations = await getAllEvaluationsFunction(spec)
  // Filtra las que han sido aprobadas
  evaluations = evaluations.filter(
    evaluation => evaluation.approved === 'approved'
  )

  return okResponse('Evaluaciones devueltas', {
    evaluations,
  })
}

/**
 * Retrieves all evaluations for admin review
 * 
 * This function:
 * 1. Validates admin role
 * 2. Retrieves all evaluations
 * 3. Formats evaluation data
 * 4. Sorts by date
 * 
 * @async
 * @param {Object} user - Admin user object
 * @returns {Promise<Object>} Response with all evaluations
 */
const getAllEvaluations = async user => {
  if (user.role !== 'superuser') return conflictResponse('No admin')
  // Obtiene todas las evaluaciones de un especialista incluso las que no han sido aprobadas
  let evaluations = await Evaluation.find().populate('user specialist')

  evaluations = evaluations
    .flatMap(item =>
      item.evaluations.map(ev => {
        return {
          evsId: item._id,
          evId: ev._id,
          send: dayjs.tz(dayjs(ev.createdAt)).format('DD/MM/YYYY HH:mm'),
          updated: dayjs.tz(dayjs(ev.updatedAt)).format('DD/MM/YYYY HH:mm'),
          approved: ev.approved,
          comment: ev.comment,
          global: ev.global,
          puntuality: ev.puntuality,
          attention: ev.attention,
          internet: ev.internet,
          like: ev.like,
          improve: ev.improve,
          specialist: item.specialist.name + ' ' + item.specialist.lastName,
          username: item.specialist.username,
          user: item.user.name + ' ' + item.user.lastName,
        }
      })
    )
    .sort((a, b) => new Date(a.send) - new Date(b.send))
  return okResponse('Todas las sesiones devueltas', {
    evaluations,
  })
}

/**
 * Approves an evaluation and updates specialist ratings
 * Sends notification emails to both user and specialist
 * 
 * This function:
 * 1. Validates admin role
 * 2. Updates evaluation status
 * 3. Recalculates specialist ratings
 * 4. Sends notification emails
 * 5. Returns updated evaluation
 * 
 * @async
 * @param {Object} user - Admin user object
 * @param {string} evaluationsId - Evaluation collection ID
 * @param {string} evaluationId - Specific evaluation ID
 * @returns {Promise<Object>} Response with updated evaluation
 */
const approveEvaluation = async (user, evaluationsId, evaluationId) => {
  if (user.role !== 'superuser') return conflictResponse('No admin')
  // Encuentra la evaluacion y la aprueba
  const evaluation = await Evaluation.findOneAndUpdate(
    { _id: evaluationsId, 'evaluations._id': evaluationId },
    {
      $set: {
        'evaluations.$.approved': 'approved',
        'evaluations.$.moderatingDate': dayjs.tz().format(),
      },
    },
    { new: true }
  ).populate('specialist user')

  const spec = evaluation.specialist._id

  const evaluationApproved = evaluation.evaluations.find(
    ev => ev.approved === 'approved'
  )
  // Obtiene las puntuaciones promedio registradas para el especialista
  let rating = evaluation.specialist.attentionRating
  let internetRating = evaluation.specialist.internetRating
  let puntualityRating = evaluation.specialist.puntualityRating
  let attentionRating = evaluation.specialist.attentionRating
  const totalEvaluations = evaluation.specialist.totalEvaluations + 1

  // Se realiza el recalculo de los rating
  rating = (rating + evaluationApproved.global) / totalEvaluations
  internetRating =
    (internetRating + evaluationApproved.internet) / totalEvaluations
  puntualityRating =
    (puntualityRating + evaluationApproved.puntuality) / totalEvaluations
  attentionRating =
    (attentionRating + evaluationApproved.attention) / totalEvaluations

  // Actualiza el rating total del especialista y lo redondea a 2 decimales
  await Specialist.findOneAndUpdate(
    { _id: spec },
    {
      $set: {
        rating: rating.toFixed(2),
        internetRating: internetRating.toFixed(2),
        puntualityRating: puntualityRating.toFixed(2),
        attentionRating: attentionRating.toFixed(2),
        totalEvaluations,
      },
    }
  )

  // Envia correo donde se aprueba la evaluación
  await mailServiceSpec.sendApproveEvaluationToUser(
    evaluation.user,
    evaluation.specialist
  )

  await mailServiceSpec.sendApproveEvaluationToSpec(
    evaluation.user,
    evaluation.specialist
  )

  return okResponse('Evaluación aprobada', { evaluation })
}

/**
 * Refuses an evaluation and sends notification emails
 * 
 * This function:
 * 1. Validates admin role
 * 2. Updates evaluation status
 * 3. Sends notification emails
 * 4. Returns updated evaluation
 * 
 * @async
 * @param {Object} user - Admin user object
 * @param {string} evaluationsId - Evaluation collection ID
 * @param {string} evaluationId - Specific evaluation ID
 * @returns {Promise<Object>} Response with updated evaluation
 */
const refuseEvaluation = async (user, evaluationsId, evaluationId) => {
  if (user.role !== 'superuser') return conflictResponse('No admin')
  // Encuentra la evaluacion y la rechaza
  const evaluations = await Evaluation.findOneAndUpdate(
    { _id: evaluationsId, 'evaluations._id': evaluationId },
    {
      $set: {
        'evaluations.$.approved': 'refuse',
        'evaluations.$.moderatingDate': dayjs.tz().format(),
      },
    }
  ).populate('specialist user')

  // Enviar correo donde se rechaza la evaluación
  await mailServiceSpec.sendRefuseEvaluation(
    evaluations.user,
    evaluations.specialist
  )

  return okResponse('Sesion rechazada', { evaluations })
}

/**
 * Adds a new evaluation for a specialist
 * 
 * This function:
 * 1. Validates user-specialist relationship
 * 2. Creates evaluation object
 * 3. Updates specialist's evaluations
 * 4. Sends notification emails
 * 
 * @async
 * @param {Object} user - User submitting evaluation
 * @param {string} specId - Specialist ID
 * @param {Object} payload - Evaluation data
 * @returns {Promise<Object>} Response with created evaluation
 */
const addEvaluation = async (user, specId, payload) => {
  if (user.role !== 'user') return conflictResponse('No eres usuario')

  // Obtiene todas las sessiones del usuario que ha tenido con el especialista
  let sessions = await Sessions.findOne({
    specialist: specId,
    user: user._id,
  })

  // Crea un array con el id y el estatus de las sesiones
  sessions = sessions.plan.flatMap(plan => {
    return plan.session.map(session => {
      return {
        _id: session._id,
        status: session.status,
      }
    })
  })

  // Verifica que la sesion este finalizada
  const countSessions = sessions.filter(session => session.status === 'success')
    .length

  if (countSessions < 3) {
    return conflictResponse('No puede escribir un comentario')
  }

  // Devuelve las evaluaciones de un usuario en un especialista
  const collEvaluation = await Evaluation.findOne({
    specialist: specId,
    user: user._id,
  })

  const evaluation = {
    comment: payload.comment,
    global: payload.global,
    puntuality: payload.puntuality,
    attention: payload.attention,
    internet: payload.internet,
    like: payload.like,
    improve: payload.improve,
  }
  let created = {}
  // Si no ha escrito una evaluacion crea una nueva, de lo contrario la actualiza
  if (collEvaluation) {
    created = await Evaluation.findOneAndUpdate(
      { user: user._id, specialist: specId },
      { $push: { evaluations: evaluation } }
    )
  } else {
    created = await Evaluation.create({
      user: user._id,
      specialist: specId,
      evaluations: [evaluation],
    })
  }

  const spec = await Specialist.findById(specId)

  await mailServiceSpec.sendAddEvaluation(user, spec)
  return okResponse('Evaluación guardada', created)
}

const getEvaluationsById = async userId => {
  // Obtiene todas las evaluaciones de un especialista
  let evaluations = await Evaluation.find({ user: userId }).populate(
    'specialist',
    '_id name lastname code'
  )

  evaluations = evaluations.flatMap(e => {
    return {
      _id: e._id,
      specialistId: e.specialist._id,
      name: e.specialist.name,
      lastname: e.specialist.lastName,
      code: e.specialist.code,
      evaluations: e.evaluations,
    }
  })

  return okResponse('evaluaciones', { evaluations })
}

/**
 * Evaluation service object containing all evaluation-related business logic
 * @type {Object}
 */
const evaluationService = {
  addRating,
  getRating,
  getEvaluationsSpec,
  getAllEvaluations,
  approveEvaluation,
  refuseEvaluation,
  addEvaluation,
  getEvaluationsById,
}

export default Object.freeze(evaluationService)
