/**
 * Dashboard Service
 * 
 * This module provides dashboard-related functionality for the Hablaquí system.
 * It handles data aggregation, statistics, and reporting for the admin dashboard.
 * 
 * Features:
 * - User statistics and metrics
 * - Session analytics
 * - Revenue tracking
 * - Specialist performance metrics
 * - System health monitoring
 * - Data visualization support
 * 
 * @module services/dashboard
 * @requires ../models/user - User model
 * @requires ../models/sessions - Session model
 * @requires ../models/specialist - Specialist model
 * @requires ../utils/responses/functions - Response utilities
 * @requires dayjs - Date handling
 */

'use strict'

import Specialist from '../models/specialist'
import User from '../models/user'
import Appointments from '../models/appointments'
import { conflictResponse, okResponse } from '../utils/responses/functions'
import Coupon from '../models/coupons'
import Sessions from '../models/sessions'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import badMutable from 'dayjs/plugin/badMutable'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
dayjs.extend(badMutable)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.tz.setDefault('America/Santiago')

/**
 * Retrieves upcoming sessions for all specialists
 * 
 * This function:
 * 1. Retrieves all sessions with populated specialist and user data
 * 2. Filters out sessions without valid specialist or user
 * 3. Gets the latest active plan for each session
 * 4. Filters for active plans with pending sessions
 * 5. Sorts sessions by date
 * 
 * @returns {Object} Response containing upcoming sessions with user and specialist details
 */
const getNextSessions = async () => {
  /*
	Retorna las proximas sesiones de los especialistas.
	De momento esta función no tiene entradas.
	*/
  // Se obtienen las sesiones de todos los especialistas
  let sessions = await Sessions.find().populate('specialist user')

  // Se filtran las sesiones que no tienen especialista ni usuario
  sessions = sessions.filter(s => s.user !== null && s.specialist !== null)

  // Se obtienen el último plan activo con sesiones.
  const plans = sessions
    .flatMap(s => {
      // Se obtiene el último plan de la sesion, se verifica que el plan esté pagado y no haya expirado
      const plan = s.plan.pop()
      const planActived =
        plan.payment === 'success' && dayjs(plan.expiration).isAfter(dayjs())
      // Devuelve un objeto con el último plan
      return {
        user: s.user.name + ' ' + s.user.lastName,
        spec: s.specialist.name + ' ' + s.specialist.lastName,
        userPhone: s.user.phone ? s.user.phone : '--',
        specPhone: s.specialist.phone ? s.specialist.phone : '--',
        userEmail: s.user.email,
        specEmail: s.specialist.email,
        plan,
        planActived,
      }
    })
    .filter(p => p.planActived && p.plan.session.length !== 0)

  // Se filtra de plans las proximas sesiones y las ordena por fecha
  const nextSessions = plans
    .flatMap(p => {
      const plan = p.plan
      return plan.session.flatMap(s => {
        // Se obtiene si una sesion es proxima y se verifica que la sesion no haya expirado.
        const isNextSession =
          s.status !== 'success' && dayjs(s.date).isAfter(dayjs())
        // Devuelve un objeto con la proxima sesion
        return {
          _id: s._id,
          sessionNumber: s.sessionNumber + '/' + plan.totalSessions,
          date: s.date,
          user: p.user,
          userPhone: p.userPhone,
          specPhone: p.specPhone,
          userEmail: p.userEmail,
          specEmail: p.specEmail,
          specialist: p.spec,
          status: s.status,
          isNextSession,
        }
      })
    })
    .filter(ns => ns.isNextSession)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  return okResponse('especialistas obtenidos', { nextSessions })
}

/**
 * Retrieves payment information for sessions within a date range
 * 
 * This function:
 * 1. Retrieves all sessions with populated specialist and user data
 * 2. Flattens session data to include specialist and payment details
 * 3. Filters sessions within the specified date range
 * 4. Groups and aggregates payments by specialist
 * 
 * @param {string} startDate - Start date for payment period
 * @param {string} endDate - End date for payment period
 * @returns {Object} Response containing specialist payment summaries
 */
const getSessionsPayment = async (startDate, endDate) => {
  /*
	Retorna las sesiones pagadas entre las fechas indicadas.
	Tiene como entrada las fechas de inicio y fin.
	*/
  // Se obtienen las sesiones unido con el especialista
  let sessions = await Sessions.find().populate('specialist user')

  // Se filtran las sesiones que se ha inicializado la variable de especialista
  sessions = sessions.filter(s => !!s.specialist)

  let flatSession = sessions.flatMap(s => {
    // Se obtiene el plan de una sesión
    const plan = s.plan.pop()
    return plan.session.flatMap(ss => {
      // Se deja en un mismo array los datos del especialista, la sesion y el precio del plan
      return {
        _id: s.specialist._id.toString(),
        spec: s.specialist.name + ' ' + s.specialist.lastName,
        specPhone: s.specialist.phone ? s.specialist.phone : '--',
        specEmail: s.specialist.email,
        price: plan.sessionPrice,
        date: ss.date,
        status: ss.status,
      }
    })
  })

  // Se filtra de flatSession las sesiones pagadas entre las fechas indicadas
  flatSession = flatSession.filter(s =>
    dayjs(s.date).isBetween(dayjs(startDate), dayjs(endDate))
  )

  // Se agrupan las sesiones por especialista y se suman los precios
  const auxFlatSession = []
  flatSession.forEach(s => {
    const resp = auxFlatSession.find(e => e && e._id === s._id)
    if (!resp) auxFlatSession.push(s)
    else auxFlatSession[auxFlatSession.indexOf(resp)].price += s.price
  })

  return okResponse('especialistas obtenidos', {
    specPayments: auxFlatSession,
  })
}

/**
 * Fixes and validates specialist specialties against available appointments
 * 
 * This function:
 * 1. Retrieves all specialists and appointments
 * 2. Creates a list of valid appointment types
 * 3. For each specialist:
 *    - Validates their specialties against available appointments
 *    - Updates their specialties list to only include valid ones
 * 4. Saves updated specialist data
 * 
 * @returns {Object} Response containing updated specialist data
 */
const fixSpecialities = async () => {
  const specialists = await Specialist.find()
  let appointments = await Appointments.find()
  appointments = JSON.stringify(appointments)
  appointments = JSON.parse(appointments)
  const arrayAppointments = []

  appointments.forEach(item => {
    arrayAppointments.push(item.name)
  })

  for (let j = 0; j < specialists.length; j++) {
    const arraySpecialities = []
    for (let i = 0; i < specialists[j].specialties.length; i++) {
      const index = arrayAppointments.indexOf(specialists[j].specialties[i])
      if (index !== -1) {
        arraySpecialities.push(specialists[j].specialties[i])
      }
    }
    specialists[j].specialties = arraySpecialities
    await specialists[j].save()
  }
  return okResponse('app', { specialists })
}

/**
 * Calculates pending payments for specialists (admin only)
 * 
 * This function:
 * 1. Validates user role (must be superuser)
 * 2. Retrieves all specialists and their sessions
 * 3. For each specialist:
 *    - Filters successful paid plans
 *    - Calculates session prices with coupon adjustments
 *    - Aggregates total pending payments
 * 4. Returns detailed payment information
 * 
 * @param {Object} user - User object (must be superuser)
 * @returns {Object} Response containing specialist payment details
 */
const getMountToPay = async user => {
  if (user.role !== 'superuser') {
    return conflictResponse('No puedes emplear esta acción')
  }
  const specialists = await Specialist.find()
  const amounts = []

  for (const spec in specialists) {
    let sessions = await Sessions.find({
      specialist: specialists[spec]._id,
    }).populate('user')
    sessions = sessions.filter(s => !!s.user)
    const plans = sessions
      .flatMap(s =>
        s.plan.map(p => {
          return {
            title: p.title,
            payment: p.payment,
            session: p.session,
            sessionPrice: p.sessionPrice,
            usedCoupon: p.usedCoupon,
            name: s.user.name,
            email: s.user.email,
          }
        })
      )
      .filter(p => p.title !== 'Plan inicial' && p.payment === 'success')
    let session = plans.flatMap(p => {
      return {
        sessions: p.session.filter(
          item => !item.paidToSpecialist && item.status === 'success'
        ),
        price: p.sessionPrice,
        coupon: p.usedCoupon,
        name: p.name,
        email: p.email,
      }
    })
    let total = 0
    for (let i = 0; i < session.length; i++) {
      if (session[i].coupon) {
        const coupon = await Coupon.findOne({
          code: session[i].coupon,
        })
        if (coupon.discountType === 'percentage') {
          session[i].price = session[i].price / (coupon.discount / 100)
        } else session[i].price += coupon.discount
      }
      total += session[i].price * session[i].sessions.length
    }
    session = session.flatMap(item =>
      item.sessions.flatMap(s => {
        return {
          date: dayjs
            .tz(dayjs(s.date, 'MM/DD/YYYY HH:mm'))
            .format('DD/MM/YYYY HH:mm'),
          _id: s._id,
          status: s.status,
          name: item.name,
          email: item.email,
          sessionNumber: s.sessionNumber,
          price: item.price,
          coupon: item.coupon,
        }
      })
    )
    amounts.push({
      _id: specialists[spec]._id,
      name: specialists[spec].name,
      lastName: specialists[spec].lastName,
      email: specialists[spec].email,
      username: specialists[spec].username,
      paymentMethod: specialists[spec].paymentMethod,
      total,
      session,
    })
  }

  return okResponse('Planes', { amounts })
}

/**
 * Updates specialist visibility status
 * 
 * This function:
 * 1. Finds specialist by ID
 * 2. Updates their visibility status
 * 3. Saves changes
 * 
 * @param {string} specId - Specialist ID
 * @param {boolean} visibility - New visibility status
 * @returns {Object} Response indicating update status
 */
const specialistVisibility = async (specId, visibility) => {
  try {
    const isVisible = visibility === 'true'
    // Actualizar el campo de visibilidad de los especialistas
    await Specialist.findByIdAndUpdate(specId, {
      $set: { 'preferences.marketplaceVisibility': isVisible },
    })
    return okResponse('Visibilidad actualizada', { specId })
  } catch (error) {
    return conflictResponse('Error al actualizar la visibilidad', error)
  }
}

/**
 * Retrieves all users with their details
 * 
 * This function:
 * 1. Retrieves all users from database
 * 2. Formats user data for display
 * 3. Returns user list
 * 
 * @returns {Object} Response containing user list
 */
const getUsers = async () => {
  // Se busca en la base de datos los usuarios y las sessiones
  const users = await User.find({ role: 'user' })
  const sessions = await Sessions.find()
  if (!users.length) {
    return okResponse('No hay usuarios registrados', { users: [] })
  }
  // Se formatean los datos de los usuarios y se agregan las sesiones
  const usersFormatted = users.map(user => {
    let sessionsUser = sessions.filter(
      session => session.user.toString() === user._id.toString()
    )

    // Verifica si el usuario tiene sesiones y las formatea
    if (sessionsUser.length) {
      sessionsUser = sessionsUser.flatMap(session => {
        if (!session.plan) return []
        return session.plan.flatMap(plan => {
          if (!plan.session) return []
          if (plan.payment !== 'success') return []
          return plan.session
        })
      })
    }

    // Se retorna el usuario formateado
    return {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      rut: user.rut,
      sessions: sessionsUser,
    }
  })
  // Se retorna la respuesta
  return okResponse('Usuarios', { users: usersFormatted })
}

const dashboardService = {
  getNextSessions,
  getSessionsPayment,
  fixSpecialities,
  getMountToPay,
  specialistVisibility,
  getUsers,
}

export default Object.freeze(dashboardService)
