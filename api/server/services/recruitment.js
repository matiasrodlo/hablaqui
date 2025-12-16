/**
 * Recruitment Service
 * 
 * This module handles all recruitment-related functionality for the Hablaquí system.
 * It provides specialist application processing, profile management, and onboarding features.
 * 
 * Features:
 * - Specialist application registration
 * - Profile updates and verification
 * - Application approval workflow
 * - Onboarding status tracking
 * - Analytics tracking for applications
 * - Email notifications
 * 
 * @module services/recruitment
 * @requires ../models/recruitment - Recruitment model
 * @requires ../models/user - User model
 * @requires ../config/winston - Logging
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../utils/logger/infoMessages - Logging utilities
 * @requires ../models/specialist - Specialist model
 * @requires ../utils/functions/mails/accountsShares - Email service
 * @requires ../utils/functions/mails/specialistStatus - Email service
 * @requires analytics-node - Analytics tracking
 */

'use strict'

import Recruitment from '../models/recruitment' // Contiene la definición del modelo de recruitment para mongodb
import User from '../models/user' // Contiene la definición del modelo de user para mongodb
import { logInfo } from '../config/winston' // Se importa el log de info para poder imprimir en la consola
import { conflictResponse, okResponse } from '../utils/responses/functions' // funciones para generar respuestas http
import { actionInfo } from '../utils/logger/infoMessages' // recibe información sobre la acción que el usuario realiza
import specialist from '../models/specialist' // Contiene la definición del modelo de specialist para mongodb
import mailServiceAccount from '../utils/functions/mails/accountsShares' // Utiliza el servicio de mail
import mailServiceSpec from '../utils/functions/mails/specialistStatus'
import Analytics from 'analytics-node'

const analytics = new Analytics(process.env.SEGMENT_API_KEY)

/**
 * Recruitment service object containing all recruitment-related business logic
 * @type {Object}
 */
const recruitmentService = {
  /**
   * Registers a new specialist application
   * Creates recruitment profile and sends confirmation emails
   * Tracks application in analytics
   * 
   * @async
   * @param {Object} user - User object
   * @param {Object} body - Application data
   * @returns {Promise<Object>} Response with created profile
   */
  async register(user, body) {
    // Se crea un objeto que contiene los datos del perfil de recruitment
    const payload = {
      ...body,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      rut: user.rut,
    }
    if (await Recruitment.exists({ rut: payload.rut })) {
      return conflictResponse('Este postulante ya está registrado')
    }
    // Se crea un nuevo perfil de recruitment
    const recruited = await Recruitment.create(payload)
    // Se hace el trakeo en segment
    if (
      process.env.API_URL.includes('hablaqui.cl') ||
      process.env.DEBUG_ANALYTICS === 'true'
    ) {
      analytics.track({
        userId: user._id.toString(),
        event: 'spec-new-application',
        properties: {
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          source: recruited.howFindOut,
          isExclusiveActivity: recruited.isExclusiveActivity,
          isUnderSupervision: recruited.isUnderSupervision,
          isSupervisor: recruited.isSupervisor,
          isContentCreator: recruited.isContentCreator,
          isAffiliateExternal: recruited.isAffiliateExternal,
          isInterestedBusiness: recruited.isInterestedBusiness,
          professionalDescription: recruited.professionalDescription,
          personalDescription: recruited.personalDescription,
        },
      })
      analytics.track({
        userId: user._id.toString(),
        event: 'spec-application-step',
        properties: {
          step: 1,
        },
      })
      analytics.identify({
        userId: user._id.toString(),
        traits: {
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          source: recruited.howFindOut,
          isExclusiveActivity: recruited.isExclusiveActivity,
          isUnderSupervision: recruited.isUnderSupervision,
          isSupervisor: recruited.isSupervisor,
          isContentCreator: recruited.isContentCreator,
          isAffiliateExternal: recruited.isAffiliateExternal,
          isInterestedBusiness: recruited.isInterestedBusiness,
          professionalDescription: recruited.professionalDescription,
          personalDescription: recruited.personalDescription,
        },
      })
    }
    // Se envía un correo electrónico al especialista confirmando la solicitud. También se envía la confirmación interna.
    mailServiceSpec.sendRecruitmentConfirmation(recruited)
    mailServiceSpec.sendRecruitmentConfirmationAdmin(recruited)
    logInfo(actionInfo(recruited.email, 'se registró como postulante'))
    return okResponse('Registrado exitosamente', { recruited })
  },
  /**
   * Updates a recruitment profile
   * Tracks profile updates in analytics
   * 
   * @async
   * @param {Object} body - Updated profile data
   * @param {number} step - Application step number
   * @returns {Promise<Object>} Response with updated profile
   */
  async update(body, step) {
    if (!(await Recruitment.exists({ email: body.email }))) {
      return conflictResponse('Este postulante no existe')
    }
    // Se hace el trakeo en segment
    if (
      process.env.API_URL.includes('hablaqui.cl') ||
      process.env.DEBUG_ANALYTICS === 'true'
    ) {
      if (step !== undefined && step !== null && step !== '') {
        const specID = await User.findOne({ email: body.email })
        analytics.track({
          userId: specID._id.toString(),
          event: 'spec-application-step',
          properties: {
            step,
          },
        })
      }
    }
    // Se actualiza el perfil de recruitment
    const recruited = await Recruitment.findOneAndUpdate(
      { email: body.email },
      body,
      { new: true }
    )
    logInfo(actionInfo(recruited.email, 'actualizó su perfil'))
    return okResponse('Actualizado exitosamente', { recruited })
  },
  /**
   * Retrieves a recruitment profile by email
   * 
   * @async
   * @param {string} email - Profile email
   * @returns {Promise<Object>} Response with profile data
   */
  async get(email) {
    const recruited = await Recruitment.findOne({ email })
    return okResponse('Postulante obtenido', { recruited })
  },
  /**
   * Retrieves all unverified recruitment profiles
   * 
   * @async
   * @returns {Promise<Object>} Response with all profiles
   */
  async getAll() {
    const recruitment = await Recruitment.find({ isVerified: false })
    return okResponse('Postulantes obtenidos', { recruitment })
  },
  /**
   * Approves a recruitment profile and creates specialist account
   * Sends welcome email and updates user role
   * Tracks approval in analytics
   * 
   * @async
   * @param {Object} user - Admin user object
   * @param {string} email - Profile email
   * @returns {Promise<Object>} Response with new specialist profile
   */
  async approve(user, email) {
    if (user.role !== 'superuser') {
      return conflictResponse('No tienes los permisos suficientes')
    }

    if (!(await Recruitment.exists({ email }))) {
      return conflictResponse(
        'Este postulante no existe y el perfil no puede ser aprobado'
      )
    }
    if (await Recruitment.exists({ email, isVerified: true })) {
      return conflictResponse(
        'Este postulante ya está aprobado y no puede ser aprobado de nuevo'
      )
    }

    // Se actualiza el perfil de recruitment
    let payload = await Recruitment.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    )

    // Formateamos el payload para que nos deje editar
    payload = JSON.stringify(payload) // Se convierte el payload a string
    payload = JSON.parse(payload) // Se convierte el payload a JSON

    delete payload._id // Se elimina el id del payload
    delete payload.__v // Se elimina el __v del payload

    // Se crea un nuevo perfil de specialist
    const newProfile = await specialist.create(payload)
    mailServiceAccount.sendWelcomeNewSpecialist(payload)

    const userUpdated = await User.findOneAndUpdate(
      { email: payload.email },
      { $set: { specialist: newProfile._id } },
      { new: true }
    )

    // Se hace el trakeo en segment
    if (
      process.env.API_URL.includes('hablaqui.cl') ||
      process.env.DEBUG_ANALYTICS === 'true'
    ) {
      analytics.track({
        userId: userUpdated._id.toString(),
        event: 'new-spec-onboard',
      })
      analytics.identify({
        userId: userUpdated._id.toString(),
        traits: {
          role: userUpdated.role,
          specialist: newProfile._id,
          email: payload.email,
          name: payload.name,
          lastName: payload.lastName,
          rut: payload.rut,
          specId: newProfile._id,
        },
      })
    }

    logInfo(actionInfo(payload.email, 'fue aprobado y tiene un nuevo perfil'))
    return okResponse('Aprobado exitosamente', { newProfile })
  },
  /**
   * Updates a specialist's plan
   * 
   * This function:
   * 1. Validates if specialist exists
   * 2. Updates plan information
   * 3. Returns updated profile
   * 
   * @async
   * @param {string} recruitedId - Specialist ID
   * @param {Object} newPlan - New plan details
   * @returns {Promise<Object>} Response with updated profile
   */
  async updatePlan(recruitedId, newPlan) {
    if (!(await Recruitment.exists({ _id: recruitedId }))) {
      return conflictResponse('Este especialista no existe')
    }
    const recruited = await Recruitment.findOneAndUpdate(
      { _id: recruitedId },
      { plan: newPlan },
      { new: true }
    )
    return okResponse('Plan actualizado exitosamente', { recruited })
  },
  /**
   * Updates onboarding flags for a specialist
   * 
   * This function:
   * 1. Validates if specialist exists
   * 2. Updates onboarding flags
   * 3. Returns updated profile
   * 
   * @async
   * @param {string} recruitedId - Specialist ID
   * @param {Object} flags - Onboarding flag updates
   * @returns {Promise<Object>} Response with updated profile
   */
  async flagOnboarding(recruitedId, flags) {
    if (!(await Recruitment.exists({ _id: recruitedId }))) {
      return conflictResponse('Este especialista no existe')
    }
    const recruited = await Recruitment.findOneAndUpdate(
      { _id: recruitedId },
      { onboardingFlags: flags },
      { new: true }
    )
    return okResponse('Flags de onboarding actualizados exitosamente', { recruited })
  },
}

export default recruitmentService
