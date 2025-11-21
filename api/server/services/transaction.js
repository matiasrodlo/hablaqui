/**
 * Transaction Service
 *
 * This module provides business logic for managing financial transactions, payments,
 * and withdrawal requests for specialists in the Hablaquí platform.
 *
 * Key Features:
 * - Payment completion and withdrawal request processing
 * - Transaction history retrieval
 * - Integration with analytics and email notifications
 * - Session and plan status updates
 *
 * @module services/transaction
 * @requires ../models/transaction - Transaction model
 * @requires ../models/sessions - Sessions model
 * @requires ../models/specialist - Specialist model
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../utils/functions/getAllSessionsFunction - Session utilities
 * @requires ../utils/functions/priceFormatter - Price formatting utilities
 * @requires ../utils/functions/mails/specialistStatus - Specialist email service
 * @requires dayjs - Date handling
 * @requires analytics-node - Analytics integration
 */
'use strict'

import Transaction from '../models/transaction'
import Sessions from '../models/sessions'
import Specialist from '../models/specialist'
import { conflictResponse, okResponse } from '../utils/responses/functions'
import { getAllSessionsFunction } from '../utils/functions/getAllSessionsFunction'
import { priceFormatter } from '../utils/functions/priceFormatter'
import mailServiceSpec from '../utils/functions/mails/specialistStatus'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Analytics from 'analytics-node'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

const analytics = new Analytics(process.env.SEGMENT_API_KEY)

/**
 * Completes a payment request for a specialist
 * 
 * This function:
 * 1. Retrieves all sessions for the specialist
 * 2. Filters for successful sessions with pending requests
 * 3. Updates session payment status and dates
 * 4. Creates transaction record
 * 5. Sends payment completion notification
 * 
 * @param {string} spec - Specialist ID
 * @returns {Object} Response with transaction details
 */
const completePaymentsRequest = async spec => {
  // Se obtienen todas las sessiones del especialista, obtiene el documento de especialista con su id
  let sessions = await getAllSessionsFunction(spec)
  const user = await Specialist.findById(spec)
  const now = dayjs.tz().format()

  // Se busca el documentro de transacciones con el id del spec, si no existe se crea
  const transactions = await Transaction.findOne({ specialist: spec })
  if (!transactions) {
    await Transaction.create({
      specialist: spec,
      transactionsRequest: [],
      transactionCompleted: [],
    })
  }

  // Filtra las sesiones obtenidas en base a un plan que haya sido pagado por el consultante
  // y que este en un estado pending, respecto a la solicitud de retiro que haya pedido el especialista
  sessions = sessions.filter(
    session =>
      session.status === 'success' &&
      session.statusPlan === 'success' &&
      session.request === 'pending'
  )

  // Se actualiza la fecha del pago y el estado de la solicitud de retiro
  sessions.forEach(async session => {
    await Sessions.findOneAndUpdate(
      {
        _id: session.sessionsId,
        'plan._id': session.idPlan,
        'plan.session._id': session._id,
      },
      {
        $set: {
          'plan.$.session.$[session].request': 'paid',
          'plan.$.session.$[session].paymentDate': now,
          'plan.$.session.$[session].paidToSpecialist': true,
        },
      },
      { arrayFilters: [{ 'session._id': session._id }], new: true }
    )
  })

  // Cuenta la cantidad de sesiones
  const total = sessions.reduce(
    (sum, value) => (typeof value.total === 'number' ? sum + value.total : sum),
    0
  )

  const transaction = {
    total,
    sessionsPaid: sessions.length,
    transactionDate: now,
  }

  // Se actualiza el documento de transacciones con la nueva transacción
  await Transaction.findOneAndUpdate(
    { specialist: spec },
    { $push: { transactionCompleted: transaction } }
  )

  // Enviar correo de dinero depositado a spec
  await mailServiceSpec.sendCompletePaymentRequest(user, total, now)

  return okResponse('Peticion completada', {
    total,
    sessions,
  })
}

/**
 * Creates a new payment request for a specialist
 * 
 * This function:
 * 1. Validates user role (must be specialist)
 * 2. Retrieves all sessions for the specialist
 * 3. Filters for successful sessions without pending requests
 * 4. Calculates total amount
 * 5. Updates session request status
 * 6. Creates transaction record
 * 7. Tracks analytics event
 * 8. Sends payment request notification
 * 
 * @param {Object} user - User object
 * @returns {Object} Response with request details
 */
const createPaymentsRequest = async user => {
  if (user.role === 'user') {
    return conflictResponse('No estas autorizado para esta operacion')
  }
  // Se obtiene las sessiones del spec
  const spec = user.specialist
  let sessions = await getAllSessionsFunction(spec)
  const now = dayjs.tz().format()

  // Se busca el modelo de transacciones con el id del spec, si no existe se crea
  const transactions = await Transaction.findOne({ specialist: spec })
  if (!transactions) {
    await Transaction.create({
      specialist: spec,
      transactionsRequest: [],
      transactionCompleted: [],
    })
  }
  // Filtra las sesiones obtenidas en base a un plan que haya sido pagado por el consultante,
  // que este en un estado none (implicando que la solicitud de retiro por parte de un especialista no se ha hecho)
  // y que la sesión no sea un Compromiso privado
  sessions = sessions.filter(
    session =>
      session.status === 'success' &&
      session.statusPlan === 'success' &&
      session.request === 'none' &&
      session.name !== 'Compromiso privado '
  )

  // Se obtiene el total de las sesiones ya filtradas
  const total = sessions.reduce(
    (sum, value) => (typeof value.total === 'number' ? sum + value.total : sum),
    0
  )

  // Esto se podría deber a que el especialista no tiene sesiones pagadas
  if (total === 0) {
    return conflictResponse(
      'No puedes hacer una petición con saldo 0 disponible'
    )
  }

  // Se actualiza cada una de las sessiones con la solicitud pendiente y la fecha de solicitud (now)
  sessions.forEach(async session => {
    await Sessions.findOneAndUpdate(
      {
        _id: session.sessionsId,
        'plan._id': session.idPlan,
        'plan.session._id': session._id,
      },
      {
        $set: {
          'plan.$.session.$[session].request': 'pending',
          'plan.$.session.$[session].requestDate': now,
        },
      },
      { arrayFilters: [{ 'session._id': session._id }], new: true }
    )
  })

  const transaction = {
    total,
    sessionsPaid: sessions.length,
    transactionDate: now,
  }
  await Transaction.findOneAndUpdate(
    { specialist: spec },
    { $push: { transactionsRequest: transaction } }
  )

  // Se hace el trackeo en segment
  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    analytics.track({
      userId: user._id.toString(),
      event: 'spec-withdrawal-request',
      properties: {
        total,
        sessions: sessions.length,
      },
    })
  }
  // Crear correo de petición de retiro de dinero
  await mailServiceSpec.sendPaymentRequest(user, total, now)

  return okResponse('Peticion hecha', {
    total,
    sessions,
  })
}

/**
 * Retrieves transaction history and statistics for a specialist
 * 
 * This function:
 * 1. Validates user role (must be specialist)
 * 2. Retrieves all sessions and transactions
 * 3. Calculates total earnings
 * 4. Calculates available balance
 * 5. Counts successful and receivable sessions
 * 
 * @param {Object} user - User object
 * @returns {Object} Response with transaction statistics
 */
const getTransactions = async user => {
  if (user.role === 'user') {
    return conflictResponse('No estas autorizado para esta operacion')
  }
  const spec = user.specialist

  // Se obtienen las sessiones del spec y se obtiene el documento de transacciones con el id del spec
  let sessions = await getAllSessionsFunction(spec)
  let transactions = await Transaction.findOne({ specialist: spec })

  // Si existe el documento de transacciones se obtiene el total de las transacciones en solicitud
  if (transactions) transactions = transactions.transactionsRequest
  else transactions = []

  sessions = sessions.filter(
    session =>
      session.status === 'success' &&
      session.statusPlan === 'success' &&
      session.name !== 'Compromiso privado '
  )

  // Se obtiene el total de dinero ya pagado
  const total = sessions
    .filter(session => {
      return (
        session.status === 'success' &&
        session.statusPlan === 'success' &&
        session.name !== 'Compromiso privado '
      )
    })
    .reduce(
      (sum, value) =>
        typeof value.total === 'number' ? sum + value.total : sum,
      0
    )

  // Se obtiene el total de dinero a cobrar
  const totalAvailable = sessions
    .filter(
      session =>
        session.status === 'success' &&
        session.request === 'none' &&
        session.name !== 'Compromiso privado '
    )
    .reduce(
      (sum, value) =>
        typeof value.total === 'number' ? sum + value.total : sum,
      0
    )

  // Se obtiene el total de las sesiones realizadas y las sessiones a cobrar
  const sessionsReceivable = sessions.filter(
    session => session.request === 'none'
  ).length

  const successSessions = sessions.filter(
    session => session.status === 'success'
  ).length

  return okResponse('Transacciones devueltas', {
    transactions: {
      total: priceFormatter(total),
      totalAvailable: priceFormatter(totalAvailable),
      successSessions,
      sessionsReceivable,
      sessions,
      transactions,
    },
  })
}

/**
 * Generates a new transaction record (admin only)
 * 
 * This function:
 * 1. Validates user role (must be superuser)
 * 2. Updates session payment status
 * 3. Creates transaction record
 * 
 * @param {Object} user - User object
 * @param {number} total - Transaction amount
 * @param {Array} session - Session data
 * @param {string} idSpec - Specialist ID
 * @returns {Object} Response with transaction details
 */
const generateTransaction = async (user, total, session, idSpec) => {
  if (user.role !== 'superuser') return conflictResponse('No tienes permiso')
  if (session.length === 0) {
    return conflictResponse('No hay sesiones para pagar')
  }
  await session.forEach(async s => {
    await Sessions.updateOne(
      {
        'plan.session._id': s._id,
      },
      {
        $set: {
          'plan.$[].session.$[session].paidToSpecialist': true,
        },
      },
      { arrayFilters: [{ 'session._id': s._id }] }
    )
  })
  const transaction = await Transaction.create({
    total,
    sessions: session,
    specialist: idSpec,
  })
  return okResponse('Pago completado', { transaction })
}

/**
 * Retrieves all transactions (admin only)
 * 
 * This function:
 * 1. Validates user role (must be superuser)
 * 2. Retrieves all transactions with specialist details
 * 3. Formats dates and transaction data
 * 4. Sorts by creation date
 * 
 * @param {Object} user - User object
 * @returns {Object} Response with all transactions
 */
const getAllTransactions = async user => {
  if (user.role !== 'superuser') return conflictResponse('No tienes permiso')

  let transactions = await Transaction.find().populate('specialist')

  transactions = transactions
    .map(t => {
      return {
        createdAt: dayjs.tz(dayjs(t.createdAt)).format('DD/MM/YYYY HH:mm'),
        session: t.sessions.map(s => {
          return {
            ...s,
            date: dayjs
              .tz(dayjs(s.date, 'MM/DD/YYYY HH:mm'))
              .format('DD/MM/YYYY HH:mm'),
          }
        }),
        total: t.total,
        name: t.specialist.name,
        lastName: t.specialist.lastName,
        username: t.specialist.username,
        email: t.specialist.email,
        specId: t.specialist._id,
      }
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  return okResponse('Todas las transacciones', { transactions })
}

const transactionService = {
  completePaymentsRequest,
  createPaymentsRequest,
  getTransactions,
  generateTransaction,
  getAllTransactions,
}

export default Object.freeze(transactionService)
