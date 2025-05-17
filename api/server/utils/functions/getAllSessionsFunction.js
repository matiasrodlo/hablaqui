/**
 * Session Retrieval Utilities
 * 
 * This module provides utility functions for retrieving and formatting session information,
 * including session details, payment status, and scheduling information.
 * 
 * @module utils/functions/getAllSessionsFunction
 */

import Sessions from '../../models/sessions'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Configure dayjs with required plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Retrieves and formats all sessions for a specialist
 * Includes session details, payment information, and scheduling status
 * 
 * @param {string} spec - Specialist ID
 * @returns {Promise<Array>} Array of formatted session objects
 * 
 * @example
 * // Get all sessions for a specialist
 * const sessions = await getAllSessionsFunction('specialist123');
 * 
 * @returns {Promise<Array<{
 *   _id: string,
 *   date: string,
 *   sessionPrice: number,
 *   idSpecialist: string,
 *   name: string,
 *   paidToSpecialist: boolean,
 *   sessionsNumber: string,
 *   sessionsId: string,
 *   status: string,
 *   statusPlan: string,
 *   suscription: string,
 *   idPlan: string,
 *   paymentPlanDate: string,
 *   requestDate: string,
 *   paymentDate: string,
 *   request: string,
 *   hablaquiPercentage: number,
 *   mercadoPercentage: number,
 *   total: number,
 *   percentage: string,
 *   expiration: boolean
 * }>>}
 */
export const getAllSessionsFunction = async spec => {
  let sessions = await Sessions.find({
    specialist: spec,
  }).populate('specialist user')

  sessions = sessions.flatMap(item => {
    let name = ''
    let lastName = ''

    // Establece nombre de quien pertenece cada sesion
    if (item.user && item.user._id) {
      name = item.user.name
      lastName = item.user.lastName ? item.user.lastName : ''
    } else {
      name = 'Compromiso privado'
      lastName = ''
    }
    return item.plan.flatMap(plan => {
      return plan.session.map(session => {
        const expiration =
          plan.payment === 'pending' && dayjs().isAfter(dayjs(plan.expiration))
        let requestDate = session.requestDate
          ? session.requestDate
          : 'Por cobrar'
        if (requestDate !== 'Por cobrar') {
          requestDate = dayjs.tz(dayjs(requestDate)).format('YYYY/MM/DD HH:mm')
        }
        let paymentDate = session.requestDate
          ? session.requestDate
          : 'Por cobrar'
        if (paymentDate !== 'Por cobrar') {
          paymentDate = dayjs.tz(dayjs(paymentDate)).format('YYYY/MM/DD HH:mm')
        }
        return {
          _id: session._id,
          date: session.date,
          sessionPrice: plan.sessionPrice,
          idSpecialist: item.specialist._id,
          name: `${name} ${lastName}`,
          paidToSpecialist: session.paidToSpecialist,
          sessionsNumber: `${session.sessionNumber}/${plan.totalSessions}`,
          sessionsId: item._id,
          status: session.status,
          statusPlan: plan.payment,
          suscription: plan.period,
          idPlan: plan._id,
          paymentPlanDate: dayjs
            .tz(dayjs(plan.datePayment))
            .format('YYYY/MM/DD HH:mm'),
          requestDate,
          paymentDate,
          request: session.request ? session.request : 'none',
          hablaquiPercentage: 0,
          mercadoPercentage: plan.sessionPrice * 0.0351,
          total: +(plan.sessionPrice * (1 - 0.0351)).toFixed(),
          percentage: '3.51%',
          expiration,
        }
      })
    })
  })
  sessions = sessions.filter(session => !session.expiration)
  return sessions
}
