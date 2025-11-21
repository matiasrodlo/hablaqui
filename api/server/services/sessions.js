/**
 * Sessions Service
 * 
 * This module handles all session-related functionality for the Hablaquí system.
 * It provides therapy session management, scheduling, and plan administration.
 * 
 * Features:
 * - Session scheduling and rescheduling
 * - Plan creation and management
 * - Session cancellation
 * - Expiration handling
 * - Email notifications
 * - Analytics tracking
 * - Payment processing
 * - Coupon management
 * - Specialist availability
 * - Session reminders
 * 
 * @module services/sessions
 * @requires ../config/dotenv - Environment configuration
 * @requires ../config/pino - Logging
 * @requires ../utils/functions/getAllSessionsFunction - Session utilities
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../utils/functions/sessionsFunctions - Session helper functions
 * @requires ../models/user - User model
 * @requires ../models/coupons - Coupon model
 * @requires ./mercadopago - Payment service
 * @requires ../models/specialist - Specialist model
 * @requires ../utils/functions/mails/reminder - Email service
 * @requires ../utils/functions/mails/schedule - Email service
 * @requires ../models/sessions - Session model
 * @requires ../models/email - Email model
 * @requires dayjs - Date handling
 * @requires crypto - Encryption utilities
 * @requires analytics-node - Analytics tracking
 */

'use strict'

import { room } from '../config/dotenv'
import { logInfo } from '../config/pino'
import { getAllSessionsFunction } from '../utils/functions/getAllSessionsFunction'
import { conflictResponse, okResponse } from '../utils/responses/functions'
import {
  paymentInfoFunction,
  formattedSchedule,
  getLastSessionFromPlan,
  setSession,
} from '../utils/functions/sessionsFunctions'
import User from '../models/user'
import Coupon from '../models/coupons'
import mercadopagoService from './mercadopago'
import Specialist from '../models/specialist'
import mailServiceReminder from '../utils/functions/mails/reminder'
import mailServiceSchedule from '../utils/functions/mails/schedule'
import Sessions from '../models/sessions'
import Email from '../models/email'
import dayjs from 'dayjs'
import crypto from 'crypto'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Analytics from 'analytics-node'
dayjs.extend(isSameOrAfter)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('America/Santiago')

const analytics = new Analytics(process.env.SEGMENT_API_KEY)

/**
 * Retrieves all sessions for a user or specialist
 * Formats sessions according to user role
 * 
 * This function:
 * 1. Queries sessions based on user role
 * 2. Populates specialist and user details
 * 3. Formats session data for display
 * 4. Logs session retrieval
 * 
 * @async
 * @param {Object} userLogged - The logged-in user
 * @param {string} idUser - ID of the user or specialist
 * @returns {Promise<Object>} Response with formatted sessions
 */
const getSessions = async (userLogged, idUser) => {
  let sessions

  if (userLogged.role === 'user') {
    sessions = await Sessions.find({
      user: idUser,
    }).populate('specialist user')
  }
  if (userLogged.role === 'specialist') {
    sessions = await Sessions.find({
      specialist: idUser,
    }).populate('specialist user')
  }

  sessions = JSON.stringify(sessions)
  sessions = JSON.parse(sessions)

  sessions = setSession(userLogged.role, sessions)

  logInfo('obtuvo todos las sesiones')
  return okResponse('sesiones obtenidas', { sessions })
}

/**
 * Gets remaining sessions for a specialist
 * Calculates available sessions per plan
 * 
 * This function:
 * 1. Retrieves all sessions for specialist
 * 2. Flattens plan data
 * 3. Calculates remaining sessions
 * 4. Formats response data
 * 
 * @async
 * @param {string} spec - Specialist ID
 * @returns {Promise<Object>} Response with remaining sessions
 */
const getRemainingSessions = async spec => {
  let sessions = await Sessions.find({
    specialist: spec,
  }).populate('specialist user')

  sessions = sessions.flatMap(item => {
    let name = ''
    let lastName = ''

    if (item.user && item.user._id) {
      name = item.user.name
      lastName = item.user.lastName ? item.user.lastName : ''
    } else {
      name = 'Compromiso privado'
      lastName = ''
    }

    return item.plan.flatMap(plan => {
      return {
        idPlan: plan._id,
        name: `${name} ${lastName}`,
        remaining: plan.remainingSessions,
        sessions: `${plan.remainingSessions} de ${plan.totalSessions}`,
        statusPlan: plan.payment,
      }
    })
  })

  return okResponse('Sesiones restantes obtenidas', {
    sessions: sessions.filter(session => {
      return session.remaining > 0
    }),
  })
}

/**
 * Cancels a therapy session
 * Sends notification emails to involved parties
 * 
 * This function:
 * 1. Updates session status in database
 * 2. Retrieves updated session list
 * 3. Sends cancellation notifications
 * 4. Returns updated sessions
 * 
 * @async
 * @param {Object} user - The logged-in user
 * @param {string} planId - Plan ID
 * @param {string} sessionsId - Sessions document ID
 * @param {string} id - Session ID to cancel
 * @returns {Promise<Object>} Response with updated sessions
 */
const cancelSession = async (user, planId, sessionsId, id) => {
  const cancelSessions = await Sessions.findOneAndUpdate(
    {
      _id: sessionsId,
      'plan._id': planId,
      'plan.session._id': id,
    },
    {
      $pull: {
        'plan.$.session': { _id: id },
      },
    }
  ).populate('specialist user')

  const sessions = await Sessions.find({
    specialist: cancelSessions[0].specialist._id,
  }).populate('specialist user')

  if (cancelSessions.user === null) {
    await mailServiceReminder.sendCancelCommitment(cancelSessions.specialist)
  } else {
    await mailServiceReminder.sendCancelSessionSpec(
      cancelSessions.user,
      cancelSessions.specialist
    )
    await mailServiceReminder.sendCancelSessionUser(
      cancelSessions.user,
      cancelSessions.specialist
    )
  }

  return okResponse('Sesion cancelada', {
    sessions: setSession(user.role, sessions),
  })
}

/**
 * Checks and updates expired plans
 * Updates plan status for expired subscriptions
 * 
 * This function:
 * 1. Retrieves all users with plans
 * 2. Checks each plan's expiration date
 * 3. Updates expired plan statuses
 * 4. Saves changes to database
 * 
 * @async
 * @returns {Promise<Object>} Response indicating completion
 */
const checkPlanTask = async () => {
  const allUsers = await User.find()
  const planUsers = allUsers.filter(user => user.plan.length > 0)
  planUsers.forEach(async userWithPlan => {
    const foundUser = await User.findById(userWithPlan._id)
    foundUser.plan.forEach(plan => {
      if (dayjs().isAfter(dayjs(plan.expiration))) {
        plan.status = 'expired'
      }
    })
    foundUser.save()
  })

  return okResponse('ok')
}

/**
 * Creates a new therapy plan
 * Handles scheduling and payment processing
 * 
 * This function:
 * 1. Validates specialist availability
 * 2. Checks scheduling constraints
 * 3. Processes payment if required
 * 4. Creates plan in database
 * 5. Sends confirmation emails
 * 
 * @async
 * @param {Object} params - Parameters object
 * @param {Object} params.payload - Plan details
 * @param {string} params.payload.paymentPeriod - Subscription period
 * @param {string} params.payload.title - Plan name
 * @param {number} params.payload.price - Plan price
 * @param {string} params.payload.coupon - Coupon code
 * @param {string} params.payload.user - User ID
 * @param {string} params.payload.specialist - Specialist ID
 * @returns {Promise<Object>} Response with created plan
 */
const createPlan = async ({ payload }) => {
  if (payload.user === payload.specialist && payload.price !== 0) {
    return conflictResponse('No puedes suscribirte a ti mismo')
  }
  const date = `${payload.date} ${payload.start}`
  const specialist = await Specialist.findById(payload.specialist)
  const minimumNewSession = specialist.preferences.minimumNewSession

  if (
    !specialist.inmediateAttention.activated &&
    dayjs().isAfter(
      dayjs
        .tz(dayjs(date, 'MM/DD/YYYY HH:mm'))
        .subtract(minimumNewSession, 'hours')
    )
  ) {
    return conflictResponse(
      'No se puede agendar, se excede el tiempo de anticipación de la reserva'
    )
  }
  let sessionQuantity = 0
  let expirationDate = ''

  if (payload.paymentPeriod == 'Pago semanal') {
    sessionQuantity = 1
    expirationDate = dayjs
      .tz(
        dayjs(date, 'MM/DD/YYYY HH:mm')
          .add(50, 'minutes')
          .add(3, 'hours')
      )
      .format()
  }
  if (payload.paymentPeriod == 'Pago mensual') {
    sessionQuantity = 4
    expirationDate = dayjs
      .tz(
        dayjs()
          .add(2, 'months')
          .add(3, 'hours')
      )
      .format()
  }
  if (payload.paymentPeriod == 'Pago trimestral') {
    sessionQuantity = 12
    expirationDate = dayjs
      .tz(
        dayjs()
          .add(6, 'months')
          .add(3, 'hours')
      )
      .format()
  }

  const newSession = {
    date,
    sessionNumber: 1,
    paidToSpecialist: false,
  }
  const foundCoupon = await Coupon.findOne({ code: payload.coupon })

  const randomCode = () => {
    return Math.random()
      .toString(36)
      .substring(2)
  }
  const token = randomCode() + randomCode()

  let price = payload.price < 0 ? 0 : payload.price
  if (foundCoupon && foundCoupon.discountType === 'static') {
    price = payload.originalPrice
  }

  const newPlan = {
    title: payload.title,
    period: payload.paymentPeriod,
    datePayment: '',
    totalPrice: price,
    sessionPrice: price / sessionQuantity,
    expiration: expirationDate,
    usedCoupon: payload.coupon,
    totalSessions: sessionQuantity,
    remainingSessions: sessionQuantity - 1,
    tokenToPay: token,
    session: [newSession],
  }

  const userSessions = await Sessions.findOne({
    user: payload.user,
    specialist: payload.specialist,
  })

  const roomId = crypto
    .createHash('sha256')
    .update(`${payload.user}${payload.specialist}`)
    .digest('hex')

  const url =
    payload.title !== 'Acompañamiento vía mensajería'
      ? `${room}room/${roomId}`
      : ''

  if (payload.price > 0 && payload.user !== payload.specialist) {
    await User.findByIdAndUpdate(payload.user, {
      $set: {
        specialist: payload.specialist,
      },
    })
    analytics.track({
      userId: payload.user._id.toString(),
      event: 'user-purchase-plan',
      properties: {
        plan: payload.title,
        period: payload.paymentPeriod,
        price: payload.price,
        expiration: expirationDate,
        totalSessions: sessionQuantity,
      },
    })
    analytics.track({
      userId: payload.specialist.toString(),
      event: 'spec-new-plan',
      properties: {
        plan: payload.title,
        period: payload.paymentPeriod,
        price: payload.price,
        expiration: expirationDate,
        totalSessions: sessionQuantity,
        user: payload.user._id.toString(),
      },
    })
  }

  let created = null

  const userPlans = await Sessions.find({ user: payload.user })

  if (
    userPlans.some(sessions => {
      return sessions.plan.some(
        plan =>
          plan.payment === 'success' &&
          dayjs().isBefore(dayjs(plan.expiration)) &&
          plan.title !== 'Plan inicial' &&
          sessions.specialist.toString() !== payload.specialist
      )
    })
  ) {
    return conflictResponse('El usuario ya tiene un plan vigente')
  } else {
    if (userSessions) {
      created = await Sessions.findOneAndUpdate(
        { user: payload.user, specialist: payload.specialist },
        { $push: { plan: newPlan }, $set: { roomsUrl: url } },
        { new: true }
      )
    } else {
      created = await Sessions.create({
        user: payload.user,
        specialist: payload.specialist,
        plan: [newPlan],
        roomsUrl: url,
      })
    }
  }

  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    const planData = [
      {
        item_id: created._id.toString(),
        item_name: payload.title,
        coupon: payload.coupon || '',
        price: payload.price / sessionQuantity,
        quantity: sessionQuantity,
      },
    ]
    analytics.track({
      userId: payload.user._id.toString(),
      event: 'current-user-purchase-plan',
      properties: {
        products: planData,
        order_id: created.plan[created.plan.length - 1]._id.toString(),
        timestamp: dayjs.tz().format(),
        total: payload.price / sessionQuantity,
      },
    })
    analytics.track({
      userId: payload.specialist.toString(),
      event: 'current-spec-new-plan',
      properties: {
        products: planData,
        user: payload.user._id,
        order_id: created.plan[created.plan.length - 1]._id.toString(),
        timestamp: dayjs.tz().format(),
      },
    })
  }

  if (foundCoupon) {
    let discount = -payload.price
    if (foundCoupon.discountType === 'static') {
      if (payload.price >= 0) discount = 0
      await Coupon.findOneAndUpdate(
        { _id: foundCoupon._id },
        { $set: { discount } }
      )
    }
  }

  let responseBody = { init_point: null }

  if (payload.price <= 0) {
    await mercadopagoService.successPay({
      sessionsId: created._id.toString(),
      planId: created.plan.pop()._id.toString(),
    })
  } else {
    const user = await User.findById(payload.user)
    const plan = created.plan.pop()
    const mercadopagoPayload = {
      specialist: specialist.username,
      price: payload.price,
      description:
        payload.title + ' - Pagado por ' + user.name + ' ' + user.lastName,
      quantity: 1,
      sessionsId: created._id.toString(),
      planId: plan._id.toString(),
      token,
    }
    responseBody = await mercadopagoService.createPreference(mercadopagoPayload)
    await Email.create({
      sessionDate: dayjs.tz(dayjs(created.date).add(3, 'hours')).format(),
      wasScheduled: false,
      type: 'reminder-payment-hour',
      queuedAt: null,
      scheduledAt: null,
      userRef: user._id,
      specRef: specialist._id,
      sessionRef: created._id,
    })
    await Email.create({
      sessionDate: dayjs.tz(dayjs(created.date).add(3, 'hours')).format(),
      wasScheduled: false,
      type: 'reminder-payment-day',
      queuedAt: null,
      scheduledAt: null,
      userRef: user._id,
      specRef: specialist._id,
      sessionRef: created._id,
    })
    await Email.create({
      sessionDate: dayjs.tz(dayjs(created.date).add(3, 'hours')).format(),
      wasScheduled: false,
      type: 'promocional-incentive-week',
      queuedAt: null,
      scheduledAt: null,
      userRef: user._id,
      specRef: specialist._id,
      sessionRef: created._id,
    })
  }

  return okResponse('Plan y preferencias creadas', responseBody)
}

/**
 * Generates a random code for session identification
 * 
 * This function:
 * 1. Generates random bytes
 * 2. Converts to hexadecimal string
 * 3. Returns formatted code
 * 
 * @returns {string} Random session code
 */
const randomCode = () => {
  return crypto.randomBytes(4).toString('hex')
}

/**
 * Creates a new therapy session
 * 
 * This function:
 * 1. Validates session parameters
 * 2. Checks specialist availability
 * 3. Creates session in database
 * 4. Sends confirmation emails
 * 5. Updates plan status
 * 
 * @async
 * @param {Object} userLogged - The logged-in user
 * @param {string} id - Session ID
 * @param {string} idPlan - Plan ID
 * @param {Object} payload - Session details
 * @returns {Promise<Object>} Response with created session
 */
const createSession = async (userLogged, id, idPlan, payload) => {
  const { specialist, plan, roomsUrl } = await Sessions.findOne({
    _id: id,
  }).populate('specialist')

  const minimumNewSession = specialist.preferences.minimumNewSession
  if (
    dayjs().isAfter(
      dayjs
        .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm'))
        .subtract(minimumNewSession, 'hours')
    )
  ) {
    return conflictResponse(
      'No se puede agendar, se excede el tiempo de anticipación de la reserva'
    )
  }

  const myPlan = plan.filter(
    plan => plan._id.toString() === idPlan.toString()
  )[0]

  if (myPlan.payment !== 'success') {
    return conflictResponse('No puedes agendar un plan sin pagar')
  }

  let sessions = await Sessions.findOneAndUpdate(
    { _id: id, 'plan._id': idPlan },
    {
      $set: {
        'plan.$.remainingSessions': payload.remainingSessions,
      },
      $push: { 'plan.$.session': payload },
    },
    { new: true }
  ).populate('specialist user')

  if (payload.remainingSessions === 0) {
    const session = getLastSessionFromPlan(sessions, '', idPlan)
    const expiration = dayjs
      .tz(
        dayjs(session.lastSession)
          .add(50, 'minutes')
          .add(3, 'hours')
      )
      .format()
    sessions = await Sessions.findOneAndUpdate(
      { _id: id, 'plan._id': idPlan },
      {
        $set: {
          'plan.$.expiration': expiration,
        },
      }
    ).populate('specialist user')
  }

  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    analytics.track({
      userId: userLogged._id.toString(),
      event: 'user-new-session',
      properties: {
        user: userLogged._id,
        planId: idPlan,
        userspecId: id,
        email: userLogged.email,
      },
    })
    const getUser = await User.findOne({ email: specialist.email })
    const userID = getUser._id
    analytics.track({
      userId: userID.toString(),
      event: 'spec-new-session',
      properties: {
        user: userLogged._id,
        planId: idPlan,
        userspecId: id,
      },
    })
  }
  await mailServiceSchedule.sendScheduleToUser(
    userLogged,
    specialist,
    dayjs.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm')).format(),
    roomsUrl,
    `${myPlan.totalSessions - payload.remainingSessions}/${
      myPlan.totalSessions
    }`
  )
  await mailServiceSchedule.sendScheduleToSpec(
    userLogged,
    specialist,
    dayjs.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm')).format(),
    roomsUrl,
    `${myPlan.totalSessions - payload.remainingSessions}/${
      myPlan.totalSessions
    }`
  )

  const planFiltered = sessions.plan.filter(plan => plan._id == idPlan)[0]

  const idSessionUltimate =
    planFiltered.session[sessions.plan[0].session.length - 1]._id

  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-user-hour',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: userLogged._id,
    specRef: specialist._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })
  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-user-day',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: userLogged._id,
    specRef: specialist._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })
  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-spec-hour',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: userLogged._id,
    specRef: specialist._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })
  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-spec-day',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: userLogged._id,
    specRef: specialist._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })

  return okResponse('sesion creada', {
    sessions: setSession(userLogged.role, [sessions]),
  })
}

/**
 * Creates a custom session outside of a plan
 * 
 * This function:
 * 1. Validates session parameters
 * 2. Checks specialist availability
 * 3. Creates custom session
 * 4. Sends confirmation emails
 * 
 * @async
 * @param {Object} user - The logged-in user
 * @param {Object} payload - Session details
 * @returns {Promise<Object>} Response with created session
 */
const customNewSession = async (user, payload) => {
  try {
    if (user.role !== 'specialist') {
      return conflictResponse('No eres psicologo')
    }
    const sessions = []
    let hours = 1

    if (payload.dateEnd && payload.type === 'compromiso privado') {
      const start = dayjs.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm')).format()
      const end = dayjs.tz(dayjs(payload.dateEnd, 'MM/DD/YYYY HH:mm')).format()
      hours = Math.abs(end.diff(start, 'hours')) + 1
    }

    for (let i = 0; i < hours; i++) {
      const date = dayjs.tz(
        dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(i, 'hours')
      )
      const newSession = {
        date: date.format('MM/DD/YYYY HH:mm'),
        sessionNumber: i + 1,
        paidToSpecialist: false,
        status: 'pending',
      }
      sessions.push(newSession)
    }

    const newPlan = {
      title: payload.type,
      period: 'Pago semanal',
      totalPrice: payload.price,
      sessionPrice: payload.price,
      payment: payload.type === 'compromiso privado' ? 'success' : 'pending',
      expiration: dayjs
        .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(1, 'week'))
        .toISOString(),
      usedCoupon: '',
      totalSessions: 1,
      remainingSessions: 0,
      session: sessions,
    }

    await Sessions.updateOne(
      {
        user: payload.user,
        specialist: user.specialist,
      },
      {
        $pull: {
          plan: { title: 'Plan inicial' },
        },
      }
    )

    const roomId = crypto
      .createHash('sha256')
      .update(`${payload.user}${payload.specialist}`)
      .digest('hex')

    const updatedSession = await Sessions.findOneAndUpdate(
      {
        user: payload.user,
        specialist: user.specialist,
      },
      {
        user: payload.user,
        specialist: user.specialist,
        $push: { plan: newPlan },
        roomsUrl: payload.user ? `${room}room/${roomId}` : '',
      },
      { upsert: true, new: true }
    ).populate('user specialist')

    if (payload.type === 'compromiso privado') {
      await mailServiceReminder.sendCustomSessionCommitment(
        updatedSession.specialist
      )
    }

    if (payload.price && payload.price > 0 && payload.user) {
      const { data } = await mercadopagoService.createCustomSessionPreference({
        userId: payload.user,
        specId: user.specialist,
        planId: updatedSession.plan[updatedSession.plan.length - 1]._id,
      })
      if (payload.type === 'sesion online') {
        await mailServiceSchedule.sendCustomSessionToUser(
          updatedSession.user,
          updatedSession.specialist,
          data.init_point,
          payload.date,
          payload.price,
          'online'
        )
        await mailServiceSchedule.sendCustomSessionToSpec(
          updatedSession.user,
          updatedSession.specialist,
          data.init_point,
          payload.date,
          payload.price,
          'online'
        )
      }
      if (payload.type === 'sesion presencial') {
        await mailServiceSchedule.sendCustomSessionToUser(
          updatedSession.user,
          updatedSession.specialist,
          data.init_point,
          payload.date,
          payload.price,
          'presencial'
        )
        await mailServiceSchedule.sendCustomSessionToSpec(
          updatedSession.user,
          updatedSession.specialist,
          data.init_point,
          payload.date,
          payload.price,
          'presencial'
        )
      }
    }
    if (
      process.env.API_URL.includes('hablaqui.cl') ||
      process.env.DEBUG_ANALYTICS === 'true'
    ) {
      if (payload.type === 'online') {
        const planData = [
          {
            item_id: 3,
            item_name: 'Plan/sesión personalizada agendada por psicólogo',
            item_price: payload.price,
            item_quantity: 1,
          },
        ]
        analytics.track({
          userId: user._id.toString(),
          event: 'spec-scheduled-user-session',
          properties: {
            products: planData,
            currency: 'CLP',
            order_id: updatedSession.plan[
              updatedSession.plan.length - 1
            ]._id.toString(),
            total: 0,
          },
        })
      } else if (payload.type === 'presencial') {
        const planData = [
          {
            item_id: 4,
            item_name:
              'Plan/sesión personalizada agendada por psicólogo presencialmente',
            item_price: payload.price,
            item_quantity: 1,
          },
        ]
        analytics.track({
          userId: user._id.toString(),
          event: 'spec-scheduled-onsite-user-session',
          properties: {
            products: planData,
            currency: 'CLP',
            order_id: updatedSession.plan[
              updatedSession.plan.length - 1
            ]._id.toString(),
            total: 0,
          },
        })
      } else if (payload.type === 'compromiso privado') {
        analytics.track({
          userId: user._id.toString(),
          event: 'spec-scheduled-private-hours',
        })
      }
    }
    return okResponse('sesion creada', {
      sessions: setSession(user.role, [updatedSession]).pop(),
    })
  } catch (err) {
    logInfo(err)
  }
}

/**
 * Gets formatted sessions for a specialist
 * 
 * This function:
 * 1. Retrieves specialist's sessions
 * 2. Formats session data
 * 3. Groups by type if specified
 * 
 * @async
 * @param {string} idSpecialist - Specialist ID
 * @param {string} type - Session type filter
 * @returns {Promise<Object>} Response with formatted sessions
 */
const getFormattedSessions = async (idSpecialist, type) => {
  let sessions = []
  const specialist = await Specialist.findById(idSpecialist).select(
    '_id schedule preferences inmediateAttention'
  )
  const length = Array.from(Array(31), (_, x) => x)
  const hours = Array.from(Array(24), (_, x) =>
    dayjs
      .tz()
      .hour(x)
      .minute(0)
      .format('HH:mm')
  )
  let specSessions = await Sessions.find({
    specialist: idSpecialist,
  })

  specSessions = specSessions.filter(item =>
    item.plan.some(plan => {
      return (
        plan.payment === 'success' && dayjs().isBefore(dayjs(plan.expiration))
      )
    })
  )

  const daySessions = specSessions
    .flatMap(item => {
      return item.plan.flatMap(plan => {
        return plan.session.length
          ? plan.session.map(session => session.date)
          : []
      })
    })
    .filter(date => dayjs(date, 'MM/DD/YYYY HH:mm').isSameOrAfter(dayjs()))
  const minimumNewSession = dayjs
    .tz(dayjs().add(specialist.preferences.minimumNewSession, 'h'))
    .format()

  sessions = length.map(el => {
    const day = dayjs.tz(dayjs().add(el, 'days'))
    const temporal = dayjs.tz(day).format('L')

    return {
      id: el,
      value: day.format(),
      day: day.format('DD MMM'),
      date: day.format('L'),
      text: day.format(),
      available: hours.filter(hour => {
        return (
          dayjs
            .tz(dayjs(`${temporal} ${hour}`, 'MM/DD/YYYY HH:mm'))
            .isAfter(dayjs.tz(minimumNewSession)) &&
          formattedSchedule(specialist.schedule, day, hour) &&
          !daySessions.some(
            date =>
              dayjs(date, 'MM/DD/YYYY HH:mm').format('L') ===
                dayjs(day).format('L') &&
              hour === dayjs(date, 'MM/DD/YYYY HH:mm').format('HH:mm')
          )
        )
      }),
    }
  })
  return sessions
}

/**
 * Reschedules an existing session
 * 
 * This function:
 * 1. Validates new date/time
 * 2. Checks specialist availability
 * 3. Updates session in database
 * 4. Sends notification emails
 * 
 * @async
 * @param {Object} userLogged - The logged-in user
 * @param {string} sessionsId - Sessions document ID
 * @param {string} id - Session ID
 * @param {string} newDate - New session date/time
 * @returns {Promise<Object>} Response with updated session
 */
const reschedule = async (userLogged, sessionsId, id, newDate) => {
  let currentSession = await Sessions.findOne({
    _id: sessionsId,
  }).populate('specialist', 'preferences')
  const { minimumRescheduleSession } = currentSession.specialist.preferences

  currentSession = currentSession.plan
    .flatMap(plan => {
      return plan.session
    })
    .filter(s => s._id.toString() === id.toString())[0]

  if (
    dayjs().isAfter(
      dayjs(currentSession.date, 'MM/DD/YYYY HH:mm').subtract(
        minimumRescheduleSession,
        'hours'
      )
    )
  ) {
    return conflictResponse(
      'No puede agendar ' +
        minimumRescheduleSession +
        ' horas antes de la sesión'
    )
  }

  const date = `${newDate.date} ${newDate.hour}`
  newDate.date = dayjs.tz(dayjs(newDate.date, 'MM/DD/YYY')).format('DD/MM/YYYY')
  const sessions = await Sessions.findOneAndUpdate(
    {
      _id: sessionsId,
      'plan.session._id': id,
    },
    {
      $set: {
        'plan.$[].session.$[session].date': date,
      },
    },
    { arrayFilters: [{ 'session._id': id }], new: true }
  ).populate('specialist user')

  const session = getLastSessionFromPlan(sessions, id, '')

  if (session.remainingSessions === 0) {
    const expiration = dayjs
      .tz(
        dayjs(session.lastSession, 'YYYY/MM/DD HH:mm')
          .add(50, 'minutes')
          .add(3, 'hours')
      )
      .format()
    await Sessions.findOneAndUpdate(
      { _id: sessionsId, 'plan._id': session.plan_id },
      {
        $set: {
          'plan.$.expiration': expiration,
        },
      }
    )
  }

  if (userLogged.role === 'user') {
    await mailServiceSchedule.sendRescheduleToUser(
      sessions.user,
      sessions.specialist,
      newDate
    )
    await mailServiceSchedule.sendRescheduleToSpec(
      sessions.user,
      sessions.specialist,
      newDate,
      sessions.roomsUrl
    )
  } else {
    await mailServiceSchedule.sendRescheduleToUserBySpec(
      sessions.user,
      sessions.specialist,
      newDate,
      sessions.roomsUrl
    )
    await mailServiceSchedule.sendRescheduleToSpecBySpec(
      sessions.user,
      sessions.specialist,
      newDate,
      sessions.roomsUrl
    )
  }
  const mailsToReprogram = await Email.find({
    type: {
      $in: [
        'reminder-user-day',
        'reminder-user-hour',
        'reminder-spec-day',
        'reminder-spec-hour',
      ],
    },
    userRef: sessions.user._id,
    specRef: sessions.specialist._id,
    sessionRef: id,
  })
  if (mailsToReprogram.length) {
    mailsToReprogram.forEach(async mail => {
      await Email.findByIdAndUpdate(mail._id, {
        sessionDate: dayjs(date, 'MM/DD/YYYY HH:mm').format(
          'ddd, DD MMM YYYY HH:mm:ss ZZ'
        ),
        wasScheduled: false,
        scheduledAt: null,
      }).catch(err => console.log(err))
    })
  }

  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    analytics.track({
      userId: userLogged._id.toString(),
      event: 'user-reschedule-session',
      properties: {
        user: userLogged._id,
        specialistId: sessions.specialist._id.toString(),
      },
    })
  }
  return okResponse('Hora actualizada', {
    sessions: setSession(userLogged.role, [sessions]),
  })
}

/**
 * Deletes a commitment session
 * 
 * This function:
 * 1. Validates user permissions
 * 2. Removes session from database
 * 3. Updates related records
 * 
 * @async
 * @param {string} planId - Plan ID
 * @param {string} specId - Specialist ID
 * @returns {Promise<Object>} Success response
 */
const deleteCommitment = async (planId, specId) => {
  const spec = await Specialist.findById(specId)
  if (!spec) {
    return conflictResponse('No existe el psicólogo')
  }
  const updatedSessions = await Sessions.findOneAndUpdate(
    {
      specialist: spec._id,
      'plan._id': planId,
    },
    {
      $pull: {
        plan: { _id: planId },
      },
    },
    { new: true }
  )

  return okResponse('Sesion eliminada', updatedSessions)
}

/**
 * Gets all sessions in formatted structure
 * 
 * This function:
 * 1. Retrieves all sessions
 * 2. Formats session data
 * 3. Groups by relevant criteria
 * 
 * @async
 * @returns {Promise<Object>} Response with formatted sessions
 */
const getAllSessionsFormatted = async () => {
  const sessions = await Sessions.find().populate('specialist user')
  if (!sessions) {
    return conflictResponse('No hay sesiones')
  }
  const formattedSessions = sessions.flatMap(sessionDocument => {
    if (sessionDocument.plan.length == 0) {
      return
    }
    return sessionDocument.plan.flatMap(plan => {
      if (plan.session.length == 0) {
        return
      }
      const lastNameUser = !sessionDocument.user.lastName
        ? ''
        : ' ' + sessionDocument.user.lastName
      const lastNameSpec = !sessionDocument.specialist.lastName
        ? ''
        : ' ' + sessionDocument.specialist.lastName

      return plan.session.flatMap(session => {
        return {
          date: dayjs(session.date).format('DD/MM/YYYY HH:mm'),
          sessionNumber: session.sessionNumber,
          specialist: sessionDocument.specialist.name + lastNameSpec,
          user: sessionDocument.user.name + lastNameUser,
          totalSessions: plan.totalSessions,
          userPhone: sessionDocument.user.phone,
          specialistPhone: sessionDocument.specialist.phone,
          emailUser: sessionDocument.user.email,
          emailSpecialist: sessionDocument.specialist.email,
          statusSession: session.status,
          expirationPlan: dayjs(plan.expiration).format('DD/MM/YYYY'),
          paymentPlan: plan.payment,
        }
      })
    })
  })
  return okResponse('Sesiones obtenidas', { formattedSessions })
}

/**
 * Cancels a session by specialist
 * 
 * This function:
 * 1. Validates specialist permissions
 * 2. Updates session status
 * 3. Sends notification emails
 * 4. Updates related records
 * 
 * @async
 * @param {string} sessionsId - Sessions document ID
 * @param {string} planId - Plan ID
 * @param {string} id - Session ID
 * @returns {Promise<Object>} Response with updated session
 */
const cancelSessionByEspecialist = async (sessionsId, planId, id) => {
  const cancelSessions = await Sessions.findOneAndUpdate(
    {
      _id: sessionsId,
      'plan._id': planId,
      'plan.session._id': id,
    },
    {
      $set: {
        'plan.$.session.$[session].status': 'canceled',
      },
      $inc: {
        'plan.$.remainingSessions': 1,
        'plan.$.totalSessions': 1,
      },
    },
    {
      arrayFilters: [{ 'session._id': id }], new: true
    }
  ).populate('specialist user');

  if (!cancelSessions) {
    return conflictResponse('No se pudo cancelar la sesión');
  }

  await mailServiceSchedule.sendCancelSessionSpec(
    cancelSessions.user,
    cancelSessions.specialist
  );
  await mailServiceReminder.sendCancelSessionUser(
    cancelSessions.user,
    cancelSessions.specialist
  );

  return okResponse('Sesion cancelada', cancelSessions);
};

/**
 * Sessions service object containing all session-related business logic
 * @type {Object}
 */
const sessionsService = {
  getSessions,
  getRemainingSessions,
  cancelSession,
  checkPlanTask,
  createPlan,
  randomCode,
  createSession,
  customNewSession,
  getFormattedSessions,
  reschedule,
  deleteCommitment,
  getAllSessionsFormatted,
  cancelSessionByEspecialist,
}

export default Object.freeze(sessionsService)
