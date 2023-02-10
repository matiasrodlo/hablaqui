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

const recruitmentService = {
  /**
   * @description - Este controlador se utiliza para crear un nuevo perfil de contratación
   * @param {Object} user - El objeto usuario con todos los detalles del perfil
   * @param {Object} body - El cuerpo bruto de la solicitud
   * @returns Código de respuesta, mensaje y perfil de contratación creado
   */
  async register (user, body) {
    // Se crea un objeto que contiene los datos del perfil de recruitment
    const payload = {
      ...body,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      rut: user.rut
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
          personalDescription: recruited.personalDescription
        }
      })
      analytics.track({
        userId: user._id.toString(),
        event: 'spec-application-step',
        properties: {
          step: 1
        }
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
          personalDescription: recruited.personalDescription
        }
      })
    }
    // Se envía un correo electrónico al especialista confirmando la solicitud. También se envía la confirmación interna.
    mailServiceSpec.sendRecruitmentConfirmation(recruited)
    mailServiceSpec.sendRecruitmentConfirmationAdmin(recruited)
    logInfo(actionInfo(recruited.email, 'se registró como postulante'))
    return okResponse('Registrado exitosamente', { recruited })
  },
  /**
   * @description - Este servicio se utiliza para actualizar un perfil de contratación
   * @param {Object} body - El cuerpo de la solicitud con los nuevos valores
   * @returns El código de respuesta, el mensaje y el perfil de contratación actualizado (si lo hay)
   */
  async update (body, step) {
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
            step
          }
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
   * @description - Este servicio se utiliza para obtener un perfil de contratación por correo
   * @param {Object} mail - El correo del perfil de contratación
   * @returns El código de respuesta, el mensaje y el perfil de contratación obtenido (si existe)
   */
  async get (email) {
    const recruited = await Recruitment.findOne({ email })
    return okResponse('Postulante obtenido', { recruited })
  },
  /**
   * @description - Este servicio se utiliza para obtener toda la contratación
   * @returns El código de respuesta, el mensaje y el perfil de contratación obtenidos
   */
  async getAll () {
    const recruitment = await Recruitment.find({ isVerified: false })
    return okResponse('Postulantes obtenidos', { recruitment })
  },
  /**
   * @description - Este controlador comprueba si existe un perfil de contratación y no ha sido verificado.
   * @returns El código de respuesta, el mensaje y el nuevo perfil de especialista creado con éxito
   **/
  async approve (user, email) {
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
        event: 'new-spec-onboard'
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
          specId: newProfile._id
        }
      })
    }

    logInfo(actionInfo(payload.email, 'fue aprobado y tiene un nuevo perfil'))
    return okResponse('Aprobado exitosamente', { newProfile })
  },
  async updatePlan (recruitedId, newPlan) {
    // Actualizar el plan de un perfil de recruitment
    const recruitedToUpdate = await Recruitment.findOneAndUpdate(
      { _id: recruitedId },
      {
        $push: {
          specPlans: { paymentStatus: 'success', ...newPlan }
        }
      },
      { new: true }
    )
    return okResponse('Plan actualizado/creado', { recruitedToUpdate })
  },
  async flagOnboarding (recruitedId, flags) {
    // Actualiza los flags de onboarding de un perfil de recruitment
    const recruitedOnboarding = await Recruitment.findOneAndUpdate(
      { _id: recruitedId },
      {
        $set: {
          flagOnboarding: flags
        }
      },
      { new: true }
    )
    return okResponse('Onboarding actualizado', { recruitedOnboarding }) // Se retorna el perfil de recruitment
  }
}

export default recruitmentService
