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
