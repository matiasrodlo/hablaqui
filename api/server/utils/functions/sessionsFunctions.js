/**
 * Session Function Utilities
 * 
 * This module provides utility functions for managing therapy sessions
 * in the Hablaquí system. It handles session scheduling, rescheduling,
 * cancellation, and availability checking.
 * 
 * Features:
 * - Session scheduling and management
 * - Availability checking
 * - Session rescheduling
 * - Session cancellation
 * - Time slot validation
 * - Conflict detection
 * - Calendar integration
 * 
 * @module utils/functions/sessionsFunctions
 * @requires ../config/pino - Logging
 * @requires ../models/sessions - Session model
 * @requires ../models/specialist - Specialist model
 * @requires dayjs - Date handling
 */

'use strict'

import { logError } from '../../config/pino'
import Sessions from '../../models/sessions'
import Specialist from '../../models/specialist'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { priceFormatter } from './priceFormatter'

// Configure dayjs with required plugins
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Schedules a new therapy session
 * 
 * @async
 * @param {Object} sessionData - Session configuration
 * @param {string} sessionData.userId - User ID
 * @param {string} sessionData.specialistId - Specialist ID
 * @param {string} sessionData.date - Session date
 * @param {string} sessionData.time - Session time
 * @returns {Promise<Object>} Created session
 */
const scheduleSession = async sessionData => {
  try {
    // Validate session time is available
    const isAvailable = await checkAvailability(
      sessionData.specialistId,
      sessionData.date,
      sessionData.time
    )

    if (!isAvailable) {
      throw new Error('Selected time slot is not available')
    }

    // Create new session
    const session = new Sessions({
      user: sessionData.userId,
      specialist: sessionData.specialistId,
      date: new Date(`${sessionData.date}T${sessionData.time}`),
      status: 'scheduled',
      type: sessionData.type || 'regular'
    })

    await session.save()
    return session
  } catch (error) {
    logError('Error scheduling session:', error)
    throw error
  }
}

/**
 * Reschedules an existing session
 * 
 * @async
 * @param {string} sessionId - Session ID
 * @param {Object} newSchedule - New schedule data
 * @param {string} newSchedule.date - New date
 * @param {string} newSchedule.time - New time
 * @returns {Promise<Object>} Updated session
 */
const rescheduleSession = async (sessionId, newSchedule) => {
  try {
    const session = await Sessions.findById(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    // Check if new time is available
    const isAvailable = await checkAvailability(
      session.specialist,
      newSchedule.date,
      newSchedule.time
    )

    if (!isAvailable) {
      throw new Error('Selected time slot is not available')
    }

    // Update session
    session.date = new Date(`${newSchedule.date}T${newSchedule.time}`)
    session.status = 'rescheduled'
    await session.save()

    return session
  } catch (error) {
    logError('Error rescheduling session:', error)
    throw error
  }
}

/**
 * Cancels a scheduled session
 * 
 * @async
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Cancelled session
 */
const cancelSession = async sessionId => {
  try {
    const session = await Sessions.findById(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    session.status = 'cancelled'
    session.cancellationReason = reason
    session.cancelledAt = new Date()
    await session.save()

    return session
  } catch (error) {
    logError('Error cancelling session:', error)
    throw error
  }
}

/**
 * Checks session availability
 * 
 * @async
 * @param {string} specialistId - Specialist ID
 * @param {string} date - Date to check
 * @param {string} time - Time to check
 * @returns {Promise<boolean>} Availability status
 */
const checkAvailability = async (specialistId, date, time) => {
  try {
    const sessionTime = new Date(`${date}T${time}`)
    
    // Check for existing sessions at the same time
    const existingSession = await Sessions.findOne({
      specialist: specialistId,
      date: sessionTime,
      status: { $in: ['scheduled', 'rescheduled'] }
    })

    return !existingSession
  } catch (error) {
    logError('Error checking availability:', error)
    throw error
  }
}

/**
 * Retrieves and formats payment information for a specialist's sessions
 * 
 * @param {string} specId - Specialist ID
 * @returns {Promise<Array>} Array of payment information objects
 * 
 * @example
 * // Get payment info for a specialist
 * const payments = await paymentInfoFunction('specialist123');
 * 
 * @returns {Promise<Array<{
 *   idPlan: string,
 *   sessionsId: string,
 *   name: string,
 *   lastname: string,
 *   plan: string,
 *   payment: string,
 *   suscription: string,
 *   user: string,
 *   datePayment: string,
 *   amount: string,
 *   finalAmount: string,
 *   sessions: Array<{
 *     _id: string,
 *     datePayment: string,
 *     name: string,
 *     lastname: string,
 *     date: string,
 *     sessionsNumber: string,
 *     amount: string,
 *     hablaquiPercentage: number,
 *     mercadoPercentage: string,
 *     percentage: string,
 *     total: string,
 *     status: string,
 *     transDate: string
 *   }>,
 *   transState: string,
 *   sessionsNumber: string
 * }>>}
 */
export const paymentInfoFunction = async specId => {
  let allSessions = await Sessions.find({
    specialist: specId,
  }).populate('user')

  // Filtramos que cada session sea de usuarios con pagos success y no hayan expirado
  allSessions = allSessions.filter(item =>
    item.plan.some(plan => {
      return plan.payment === 'success' && plan.title !== 'compromiso privado'
    })
  )
  const validPayments = allSessions.flatMap(item => {
    if (item.user) {
      return item.plan.flatMap(plans => {
        // Cantidad de dinero a restar
        let amountDueTotal = 0
        let amountDue = 0
        let paymentPlanDate = dayjs
          .tz(dayjs(plans.datePayment))
          .format('DD/MM/YYYY')

        const sessions = plans.session.map(session => {
          let transDate =
            session.paymentDate &&
            dayjs(session.paymentDate, 'MM/DD/YYYY').isValid()
              ? dayjs(session.paymentDate, 'MM/DD/YYYY').format('DD/MM/YYYY')
              : session.requestDate && dayjs(session.requestDate).isValid()
              ? 'Pendiente'
              : 'Por cobrar'
          transDate = session.status === 'pending' ? 'Por realizar' : transDate
          return {
            _id: session._id,
            datePayment: dayjs(session.date, 'MM/DD/YYYY HH:mm').format(
              'DD/MM/YYYY'
            ),
            name: item.user.name ? item.user.name : '',
            lastname: item.user.lastName ? item.user.lastName : '',
            date: dayjs(session.date, 'MM/DD/YYYY HH:mm').format(
              'DD/MM/YYYY HH:mm'
            ),
            sessionsNumber: `${session.sessionNumber} de ${plans.totalSessions}`,
            amount: priceFormatter(+plans.sessionPrice),
            hablaquiPercentage: 0,
            mercadoPercentage: (plans.sessionPrice * 0.0351).toFixed(2),
            percentage: '3.51%',
            total: priceFormatter(
              +(plans.sessionPrice * (1 - 0.0351)).toFixed(0)
            ),
            status: session.status,
            transDate,
          }
        })

        const lastSession = sessions[sessions.length - 1]
        const pendingsToPay = sessions.filter(s => s.transDate === 'Pendiente')
          .length

        const pendingsToDo = sessions.filter(
          s => s.transDate === 'Por realizar'
        ).length

        const receivable = sessions.filter(
          session => session.transDate === 'Por cobrar'
        ).length

        for (let i = sessions.length + 1; i <= plans.totalSessions; i++) {
          const session = {
            _id: null,
            datePayment: '---',
            name: item.user.name ? item.user.name : '',
            lastname: item.user.lastName ? item.user.lastName : '',
            date: '---',
            sessionsNumber: `${i} de ${plans.totalSessions}`,
            amount: priceFormatter(+plans.sessionPrice),
            hablaquiPercentage: 0,
            mercadoPercentage: (plans.sessionPrice * 0.0351).toFixed(2),
            percentage: '3.51%',
            total: priceFormatter(
              +(plans.sessionPrice * (1 - 0.0351)).toFixed(0)
            ),
            status: 'pending',
            transDate: 'Por agendar',
          }
          if (Date.parse(plans.expiration) < Date.now()) {
            session.transDate = 'Expirado'
            amountDueTotal += Number(extractPrice(session.total))
            amountDue += Number(extractPrice(session.amount))
            session.total = '$0'
            session.amount = '$0'
            session.mercadoPercentage = '0'
          }
          sessions.push(session)
        }
        const expirated = sessions.filter(
          session => session.transDate === 'Expirado'
        ).length

        if (
          expirated > 0 &&
          pendingsToPay === 0 &&
          receivable === 0 &&
          pendingsToDo === 0
        ) {
          paymentPlanDate = 'Expirado'
        }

        /* sessions = sessions.filter(
					session => session.status === 'success'
				); */

        const lastname = item.user.lastName ? item.user.lastName : ''
        return {
          idPlan: plans._id,
          sessionsId: item._id,
          name: item.user.name ? item.user.name + ' ' + lastname : lastname,
          lastname,
          plan: plans.title,
          payment: plans.payment,
          suscription: plans.period,
          user: item.user._id,
          datePayment: paymentPlanDate,
          amount: priceFormatter(+plans.totalPrice - amountDue),
          finalAmount: priceFormatter(
            +(plans.totalPrice * (1 - 0.0351) - amountDueTotal).toFixed(0)
          ),
          sessions,
          transState:
            pendingsToPay > 0
              ? 'Pendiente'
              : receivable > 0
              ? 'Por cobrar'
              : pendingsToDo > 0
              ? 'Por realizar'
              : 'Cobrado',
          sessionsNumber: lastSession
            ? lastSession.sessionsNumber
            : '- de ' + sessions.length,
        }
      })
    }
  })
  const payments = validPayments.filter(item => {
    return (
      item &&
      item.payment === 'success' &&
      item.plan !== 'compromiso privado' &&
      item.suscription !== 'Plan inicial'
    )
  })
  return payments
}

/**
 * Formats a schedule object for a specific day and hour
 * 
 * @param {Object} schedule - Schedule object containing availability
 * @param {string} day - Day of the week
 * @param {string} hour - Hour in HH:mm format
 * @returns {Object} Formatted schedule object
 * 
 * @example
 * // Format schedule for Monday at 14:30
 * const formatted = formattedSchedule(scheduleData, 'monday', '14:30');
 * 
 * @returns {{
 *   day: string,
 *   hour: string,
 *   available: boolean,
 *   formattedHour: string
 * }}
 */
export const formattedSchedule = (schedule, day, hour) => {
  let validHour = false
  const week = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]
  day = dayjs.tz(day).format('dddd')
  week.forEach(weekDay => {
    if (day.toLowerCase() === weekDay) {
      if (Array.isArray(schedule[weekDay])) {
        validHour = schedule[weekDay].some(interval => {
          return dayjs(hour, 'HH:mm').isBetween(
            dayjs(interval[0], 'HH:mm'),
            dayjs(interval[1], 'HH:mm'),
            undefined,
            '[)'
          )
        })
      } else if (schedule[weekDay] === 'busy') validHour = false
    }
  })

  return {
    day: day,
    hour: hour,
    available: validHour,
    formattedHour: validHour ? 'Disponible' : 'No disponible',
  }
}

/**
 * Gets the last session from a plan
 * 
 * @param {Object} sessions - Sessions document
 * @param {string} sessionId - Session ID
 * @param {string} planId - Plan ID
 * @returns {Object|null} Last session object or null if not found
 * 
 * @example
 * // Get last session from plan
 * const lastSession = getLastSessionFromPlan(sessionsData, 'session123', 'plan456');
 * 
 * @returns {{
 *   _id: string,
 *   date: string,
 *   sessionNumber: number,
 *   status: string
 * }|null}
 */
export const getLastSessionFromPlan = (sessions, sessionId, planId) => {
  const session = sessions.plan
    .flatMap(plan => {
      let maxSession = plan.session.map(session =>
        dayjs(session.date, 'MM/DD/YYYY HH:mm').format('YYYY/MM/DD HH:mm')
      )
      maxSession = maxSession.sort((a, b) => new Date(b) - new Date(a))
      return plan.session.flatMap(session => {
        return {
          session_id: session._id,
          plan_id: plan._id,
          totalSessions: plan.totalSessions,
          date: session.date,
          datePayment: plan.datePayment,
          lastSession: maxSession[0],
          remainingSessions: plan.remainingSessions,
        }
      })
    })
    .filter(
      session =>
        sessionId === session.session_id.toString() ||
        planId === session.plan_id.toString()
    )

  return session[0]
}

/**
 * Sets session status based on user role
 * 
 * @param {string} role - User role ('user' or 'specialist')
 * @param {Object} sessions - Sessions document
 * @returns {Object} Updated sessions document
 * 
 * @example
 * // Set session status for user
 * const updatedSessions = setSession('user', sessionsData);
 * 
 * @returns {{
 *   _id: string,
 *   plan: Array<{
 *     _id: string,
 *     session: Array<{
 *       status: string,
 *       date: string,
 *       sessionNumber: number
 *     }>
 *   }>
 * }}
 */
export const setSession = (role, sessions) => {
  return sessions.flatMap(item => {
    let name = ''
    let lastName = ''
    const idUser = item.user && item.user._id ? item.user._id : item._id

    // Establece nombre de quien pertenece cada sesion
    if (role === 'specialist') {
      if (item.user && item.user._id) {
        name = item.user.name
        lastName = item.user.lastName ? item.user.lastName : ''
      } else {
        name = 'Compromiso privado'
        lastName = ''
      }
    } else if (role === 'user') {
      name = item.specialist.name
      lastName = item.specialist.lastName ? item.specialist.lastName : ''
    }
    return item.plan.flatMap(plan => {
      if (plan.title === 'Mensajería y videollamada') {
        plan.title = 'sesion online'
      } else if (plan.title === 'Acompañamiento vía mensajería') {
        plan.title = 'sesion online'
      } else if (plan.title === 'Sesiones por videollamada') {
        plan.title = 'sesion online'
      }

      return plan.session.map(session => {
        const start = dayjs(session.date, 'MM/DD/YYYY HH:mm').format(
          'YYYY-MM-DD HH:mm'
        )
        const end = dayjs(session.date, 'MM/DD/YYYY HH:mm')
          .add(60, 'minutes')
          .format('YYYY-MM-DD HH:mm')

        return {
          _id: session._id,
          date: session.date,
          title: plan.title,
          details: `Sesion con ${name}`,
          totalPrice: plan.totalPrice,
          sessionPrice: plan.sessionPrice,
          end,
          idSpecialist: item.specialist._id,
          idUser,
          name: `${name} ${lastName}`,
          paidToSpecialist: session.paidToSpecialist,
          sessionNumber: session.sessionNumber,
          sessionsId: item._id,
          start,
          status: session.status,
          statusPlan: plan.payment,
          idPlan: plan._id,
          url: item.roomsUrl,
          numberSessionSuccess: item.numberSessionSuccess,
          activePlan:
            plan.payment === 'success' &&
            dayjs().isBefore(dayjs(plan.expiration)),
        }
      })
    })
  })
}

module.exports = {
  scheduleSession,
  rescheduleSession,
  cancelSession,
  checkAvailability
}
