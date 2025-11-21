/**
 * MercadoPago Service
 * 
 * This module handles all payment-related functionality for the Hablaquí system.
 * It provides payment processing, subscription management, and plan handling features.
 * 
 * Features:
 * - Payment preference creation
 * - Plan subscription management
 * - Payment status tracking
 * - Email notifications
 * - Analytics tracking
 * - Session reminders
 * - Plan renewal handling
 * - Specialist plan management
 * 
 * @module services/mercadopago
 * @requires mercadopago - Payment processing SDK
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../models/specialist - Specialist model
 * @requires ../models/recruitment - Recruitment model
 * @requires ../config/pino - Logging
 * @requires ../config/dotenv - Environment configuration
 * @requires ../utils/functions/emailFunction - Email utilities
 * @requires ./recruitment - Recruitment service
 * @requires ../models/user - User model
 * @requires ../utils/functions/mails/payments - Payment email service
 * @requires ../utils/functions/mails/schedule - Schedule email service
 * @requires ../models/sessions - Session model
 * @requires dayjs - Date handling
 * @requires analytics-node - Analytics tracking
 */

'use strict'

import mercadopago from 'mercadopago' // Se importa el SDK de Mercado Pago
import { okResponse, conflictResponse } from '../utils/responses/functions'
import Specialist from '../models/specialist'
import Recruitment from '../models/recruitment'
import { logInfo } from '../config/pino'
import { api_url, landing_url, mercadopago_key } from '../config/dotenv' // dotenv contiene las variables de entorno
import {
  createReminder,
  createRenewalSubscription,
  deleteReminderPayment,
} from '../utils/functions/emailFunction'
import recruitmentService from './recruitment'
import User from '../models/user'
import mailServicePayments from '../utils/functions/mails/payments'
import mailServiceSchedule from '../utils/functions/mails/schedule'
import Sessions from '../models/sessions'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Analytics from 'analytics-node'
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

const analytics = new Analytics(process.env.SEGMENT_API_KEY)

mercadopago.configure({
  access_token: mercadopago_key,
})

/**
 * Creates a payment preference for a session
 * 
 * This function:
 * 1. Creates preference object with session details
 * 2. Sets up success/failure URLs
 * 3. Configures payment options
 * 4. Returns payment preference
 * 
 * @async
 * @param {Object} body - Session payment details
 * @returns {Promise<Object>} Payment preference data
 */
const createPreference = async body => {
  // la preferencia dentro de mercadopago se refiere un objeto que contiene todos los datos necesarios para realizar el pago
  const newPreference = {
    items: [
      {
        title: body.description,
        description: body.description,
        currency_id: 'CLP',
        unit_price: Number(body.price),
        quantity: 1,
      },
    ],
    back_urls: {
      success: `${landing_url}dashboard/pagos/success?sessionsId=${body.sessionsId}&planId=${body.planId}&token=${body.token}`,
      // redirection to profile specialist
      failure: `${landing_url}${body.specialist}`,
      pending: `${landing_url}${body.specialist}`,
    },
    auto_return: 'approved',
    binary_mode: true,
  }

  const responseBody = await mercadopago.preferences.create(newPreference)
  const resBody = responseBody.body
  return resBody
}

/**
 * Creates a payment preference for specialist plan subscription
 * 
 * This function:
 * 1. Determines plan type (free/premium)
 * 2. Creates appropriate payment preference
 * 3. Returns payment preference data
 * 
 * @async
 * @param {Object} body - Plan subscription details
 * @returns {Promise<Object>} Response with payment preference
 */
const createSpecialistPreference = async body => {
  // Se crea preferencia para que el especialista pueda pagar su plan
  const id = body.specialistId || body.recruitedId
  const isSpecialist = !!body.specialistId
  let preference = {}
  if (body.plan === 'premium') {
    preference.init_point = await setPlanPremium(body, isSpecialist, id)
  } else {
    preference = await setPlanFree(id, isSpecialist)
  }
  return okResponse('Preferecia creada', { preference })
}

/**
 * Sets up premium plan payment preference
 * 
 * This function:
 * 1. Creates preference object for premium plan
 * 2. Configures payment URLs
 * 3. Returns payment initiation URL
 * 
 * @async
 * @param {Object} body - Premium plan details
 * @param {boolean} isSpecialist - Whether user is specialist
 * @param {string} id - User ID
 * @returns {Promise<string>} Payment initiation URL
 */
const setPlanPremium = async (body, isSpecialist, id) => {
  // Se crea preferencia para el plan premium
  // Se crea un objeto de preferencia que contiene la información necesaria para crear el pago
  const newPreference = {
    items: [
      {
        title: body.title,
        description: body.description,
        currency_id: 'CLP',
        unit_price: Number(body.price),
        quantity: 1,
      },
    ],
    back_urls: {
      success: `${api_url}api/v1/mercadopago/${
        isSpecialist ? 'specialist' : 'recruited'
      }-pay/${id}?period=${body.period}`,
      failure: `${landing_url}pago/failure-pay`,
      pending: `${landing_url}pago/pending-pay`,
    },
    auto_return: 'approved',
    binary_mode: true,
  }
  // Se manda a mercado pago y se retorna el link de pago
  const responseBody = await mercadopago.preferences.create(newPreference)
  const resBody = responseBody.body
  const { init_point } = resBody
  return init_point
}

/**
 * Sets up free plan for specialist/recruit
 * 
 * This function:
 * 1. Validates user existence
 * 2. Checks current plan status
 * 3. Creates free plan record
 * 4. Tracks plan creation in analytics
 * 
 * @async
 * @param {string} id - User ID
 * @param {boolean} isSpecialist - Whether user is specialist
 * @returns {Promise<Object>} Response with plan status
 */
const setPlanFree = async (id, isSpecialist) => {
  let response
  if (isSpecialist) response = await Specialist.findById(id)
  else response = await Recruitment.findById(id)

  if (!response) {
    return conflictResponse('No se encontró el postulante o especialista')
  }

  // Verifica si el especialista o postulante tiene o tuvo un plan
  if (response.specPlans && response.specPlans.length) {
    // Se obtiene el ultimo plan y se verifica las distintas situaciones
    const currentPlan = response.specPlans.pop()
    if (currentPlan.tier === 'free') {
      return okResponse('Ya tienes el plan gratuito')
    } else if (
      currentPlan.tier === 'premium' &&
      dayjs(currentPlan.expirationDate).isAfter(dayjs())
    ) {
      return okResponse('Tienes un plan premium vigente')
    }
    // Tiene un plan premium pero ya expiro
    else {
      response.specPlans = response.specPlans.map(item => ({
        ...item,
        planStatus: 'expired',
      }))
    }
  }

  // Si no tiene plan o el plan expiro se crea uno nuevo
  if (!response.specPlans) response.specPlans = []
  response.specPlans = [
    ...response.specPlans,
    {
      tier: 'free',
      paymentStatus: 'success',
      planStatus: 'active',
      expirationDate: '',
      subscriptionPeriod: '',
      price: 0,
    },
  ]
  response.isHide = true
  // Se realiza el trackeo de analytics
  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    const planData = [
      {
        item_id: 1,
        item_name: 'Plan de especialista gratuito',
        item_price: 0,
        item_quantity: 1,
      },
    ]
    const userID = User.findOne({ email: response.email })._id
    analytics.track({
      userId: userID.toString(),
      event: 'spec-free-plan',
      properties: {
        currency: 'CLP',
        products: planData,
        order_id: response.specPlans[
          response.specPlans.length - 1
        ]._id.toString(),
        total: 0,
      },
    })
  }
  // Se guarda el plan
  return await response.save()
}

/**
 * Handles successful payment for session
 * 
 * This function:
 * 1. Updates session payment status
 * 2. Creates session reminders
 * 3. Sets up renewal notifications
 * 4. Sends confirmation emails
 * 
 * @async
 * @param {Object} params - Payment parameters
 * @returns {Promise<Object>} Response with updated session
 */
const successPay = async params => {
  // Busca y actualiza el pago de la sesion
  const { sessionsId, planId } = params
  const foundPlan = await Sessions.findOneAndUpdate(
    {
      _id: sessionsId,
      'plan._id': planId,
    },
    {
      $set: {
        'plan.$.payment': 'success',
        'plan.$.datePayment': dayjs.tz().format(),
      },
    },
    { new: true }
  )

  // Se crea recordatorio de la primera sesion
  const planData = foundPlan.plan.filter(
    plan => plan._id.toString() === planId
  )[0]
  const sessionData = planData.session[0]
  await createReminder(
    sessionData,
    foundPlan.user,
    foundPlan.specialist,
    foundPlan,
    foundPlan.roomsUrl,
    planId
  )
  // Filtra al plan si es plan semanal para enviar o no el correo de renovacion
  if (planData.period === 'Pago semanal') {
    // Se crean correos de recordatorio de renovacion de plan
    await createRenewalSubscription(
      foundPlan.user,
      foundPlan.specialist,
      foundPlan
    )
  }

  await deleteReminderPayment(foundPlan.user._id, foundPlan.specialist._id)

  const user = await User.findById(foundPlan.user)
  const spec = await Specialist.findById(foundPlan.specialist)
  // Send appointment confirmation for user and specialist
  await mailServiceSchedule.sendAppConfirmationUser(
    user,
    spec,
    planData.totalPrice
  )
  await mailServiceSchedule.sendAppConfirmationSpec(
    spec,
    user,
    planData.totalPrice
  )

  // --Faltaría indicar estos emails--
  await mailServiceSchedule.sendScheduleToUser(
    user,
    spec,
    dayjs.tz(dayjs(sessionData.date, 'MM/DD/YYYY HH:mm')).format(),
    foundPlan.roomsUrl,
    `1/${planData.totalSessions}`
  )
  await mailServiceSchedule.sendScheduleToSpec(
    user,
    spec,
    dayjs.tz(dayjs(sessionData.date, 'MM/DD/YYYY HH:mm')).format(),
    foundPlan.roomsUrl,
    `1/${planData.totalSessions}`
  )

  logInfo('Se ha realizado un pago')
  return okResponse('Pago aprobado')
}

/**
 * Processes payment for specialist plan subscription
 * 
 * This function:
 * 1. Validates specialist existence
 * 2. Updates specialist plan details
 * 3. Sends confirmation emails
 * 4. Tracks analytics
 * 5. Handles plan expiration and renewal
 * 
 * @async
 * @param {Object} params - Route parameters containing specialist ID
 * @param {Object} query - Query parameters containing subscription period
 * @returns {Promise<Object>} Response with updated specialist data
 * @throws {Error} If specialist not found or payment processing fails
 */
const specialistPay = async (params, query) => {
  const { specialistId } = params
  const { period } = query

  // Verifica el periodo del plan que se quiere contratar
  let expirationDate
  if (period === 'anual') {
    expirationDate = dayjs.tz(dayjs().add(12, 'month')).format()
  }
  if (period === 'mensual') {
    expirationDate = dayjs.tz(dayjs().add(1, 'month')).format()
  }
  // Precio del plan premium por un año, crea el plan y actualiza el especialista con el plan
  const pricePaid = 69000 * 12
  const newPlan = {
    tier: 'premium',
    paymentStatus: 'success',
    planStatus: 'active',
    expirationDate,
    price: pricePaid,
    subscriptionPeriod: period,
  }
  const foundSpecialist = await Specialist.findOneAndUpdate(
    { _id: specialistId },
    { $push: { specPlans: newPlan }, $set: { isHide: false } },
    { new: true }
  )
  // Se realiza el trackeo de analytics
  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    const planData = [
      {
        item_id: 2,
        item_name: 'Plan de especialista premium',
        item_price: pricePaid,
        item_quantity: 1,
      },
    ]
    const userID = User.findOne({ email: foundSpecialist.email })._id
    analytics.track({
      userId: userID.toString(),
      event: 'spec-premium-plan',
      properties: {
        currency: 'CLP',
        products: planData,
        order_id: foundSpecialist.specPlans[
          foundSpecialist.specPlans.length - 1
        ]._id.toString(),
        total: pricePaid,
      },
    })
  }
  await mailServicePayments.sendSpecialistPay(
    foundSpecialist,
    period,
    pricePaid
  )
  return okResponse('plan actualizado', { foundSpecialist })
}

/**
 * Processes payment for a custom session
 * 
 * This function:
 * 1. Validates session existence
 * 2. Updates session payment status
 * 3. Sends confirmation emails
 * 4. Updates session schedule
 * 
 * @async
 * @param {Object} params - Route parameters containing session ID
 * @returns {Promise<Object>} Response with updated session data
 * @throws {Error} If session not found or payment processing fails
 */
const customSessionPay = async params => {
  // Busca la sesion y actualiza el pago
  const { userId, specId, planId } = params
  const updatePlan = await Sessions.findOneAndUpdate(
    {
      'plan._id': planId,
      user: userId,
      specialist: specId,
    },
    {
      $set: {
        'plan.$.payment': 'success',
        'plan.$.datePayment': dayjs.tz().format(),
      },
    },
    { new: true }
  ).populate('specialist user')
  // Obtiene el id del plan
  const plan = updatePlan.plan.filter(plan => plan._id.toString() === planId)[0]
  await mailServicePayments.sendSuccessCustomSessionPaymentSpec(
    updatePlan.user,
    updatePlan.specialist,
    plan.totalPrice,
    updatePlan.roomsUrl,
    plan.session[0].date
  )
  await mailServicePayments.sendSuccessCustomSessionPaymentUser(
    updatePlan.user,
    updatePlan.specialist,
    plan.totalPrice,
    updatePlan.roomsUrl,
    plan.session[0].date
  )
  return okResponse('plan actualizado', { body: updatePlan })
}

const createCustomSessionPreference = async params => {
  const { userId, specId, planId } = params
  // Encuentra la sesion y el plan, utiliza el id del plan para obtener el precio
  const foundPlan = await Sessions.findOne({
    'plan._id': planId,
    user: userId,
    specialist: specId,
  })
  const planData = foundPlan.plan[foundPlan.plan.length - 1]
  // Crea la preferencia de pago de mercado pago
  const newPreference = {
    items: [
      {
        title: 'Sesion personalizada',
        description: 'Sesion personalizada creada por especialista',
        currency_id: 'CLP',
        unit_price: planData.totalPrice,
        quantity: 1,
      },
    ],
    back_urls: {
      success: `${api_url}api/v1/mercadopago/custom-session-pay/${userId}/${specId}/${planId}`,
      failure: `${landing_url}pago/failure-pay`,
      pending: `${landing_url}pago/pending-pay`,
    },
    auto_return: 'approved',
    binary_mode: true,
  }

  const responseBody = await mercadopago.preferences.create(newPreference)
  const resBody = responseBody.body
  const { init_point } = resBody
  return okResponse('preference created', { init_point })
}

/**
 * Processes payment for recruited specialist plan subscription
 * 
 * This function:
 * 1. Validates recruited specialist existence
 * 2. Updates recruitment plan details
 * 3. Sends confirmation emails
 * 4. Tracks analytics
 * 5. Handles plan expiration and renewal
 * 
 * @async
 * @param {Object} params - Route parameters containing recruited specialist ID
 * @param {Object} query - Query parameters containing subscription period
 * @returns {Promise<Object>} Response with updated recruitment data
 * @throws {Error} If recruited specialist not found or payment processing fails
 */
const recruitedPay = async (params, query) => {
  // Se encarga de actualizar el plan del especialista
  const { recruitedId } = params
  const { period } = query

  // Verifica el periodo del plan que se quiere contratar
  let expirationDate
  if (period == 'anual') {
    expirationDate = dayjs.tz(dayjs().add(12, 'month')).format()
  }
  if (period == 'mensual') {
    expirationDate = dayjs.tz(dayjs().add(1, 'month')).format()
  }
  // Precio del plan premium por un año, crea el plan y actualiza el especialista con el plan
  const pricePaid = 69000 * 12
  const newPlan = {
    tier: 'premium',
    expirationDate,
    price: pricePaid,
    subscriptionPeriod: period,
  }
  await recruitmentService.updatePlan(recruitedId, newPlan)
  return okResponse('plan actualizado/creado')
}

const mercadopagoService = {
  createPreference,
  createSpecialistPreference,
  successPay,
  specialistPay,
  recruitedPay,
  createCustomSessionPreference,
  customSessionPay,
}

export default Object.freeze(mercadopagoService)
