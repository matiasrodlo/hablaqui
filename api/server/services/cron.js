/**
 * Cron Service
 *
 * This module provides scheduled task functionality for the Hablaquí platform.
 * It includes background jobs for updating session statuses, sending scheduled emails,
 * managing immediate attention states, and unifying mailing operations.
 *
 * Key Features:
 * - Scheduled email notifications (chat, session, payment, etc.)
 * - Session status updates and automation
 * - Specialist immediate attention state management
 * - Batch email processing and mailing unification
 * - Secure token-based access for cron endpoints
 *
 * @module services/cron
 * @requires ../utils/functions/mails/mailing - Email management service
 * @requires ../models/email - Email model
 * @requires ../models/chat - Chat model
 * @requires ../models/user - User model
 * @requires ../models/specialist - Specialist model
 * @requires ../utils/functions/mails/reminder - Reminder email service
 * @requires ../utils/functions/mails/specialistStatus - Specialist email service
 * @requires dayjs - Date handling
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../models/sessions - Sessions model
 * @requires @sendgrid/client - SendGrid API client
 */
'use-strict'
import mailService from '../utils/functions/mails/mailing'
import email from '../models/email'
import Chat from '../models/chat'
import userModel from '../models/user'
import specialistModel from '../models/specialist'
import mailServiceRemider from '../utils/functions/mails/reminder'
import mailServiceSpec from '../utils/functions/mails/specialistStatus'
import dayjs from 'dayjs'
import { conflictResponse, okResponse } from '../utils/responses/functions'
import sessionsModel from '../models/sessions'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import sgClient from '@sendgrid/client' // sendgrid es una api que permite enviar correos masivos
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.tz.setDefault('America/Santiago')
sgClient.setApiKey(process.env.SENDGRID_API_KEY)

const authToken = 'MWYkx6jOiUcpx5w7UUhB'

/**
 * Updates the number of successful sessions for each user and triggers evaluation notifications
 * when a user reaches 3 successful sessions.
 * 
 * This function:
 * 1. Retrieves all users
 * 2. For each user, finds their sessions
 * 3. Counts successful sessions from paid plans
 * 4. Updates the session count and evaluation notification status
 * 5. Sends evaluation notification email when threshold is reached
 */
async function getNumberSuccess() {
  const users = await userModel.find()
  users.forEach(async user => {
    const sessions = await sessionsModel
      .find({ user: user._id })
      .populate('specialist', 'name')
    sessions.forEach(async item => {
      let successSessions = 0
      // Se filtran las citas que no hayan sido canceladas y se suman las sesiones exitosas
      const plans = item.plan.filter(plan => plan.payment === 'success')
      plans.forEach(plan => {
        successSessions += plan.session.filter(
          session => session.status === 'success'
        ).length
      })
      // Se actualiza el número de sesiones exitosas
      await sessionsModel.updateOne(
        {
          _id: item._id,
        },
        {
          $set: {
            numberSessionSuccess: successSessions,
            evaluationNotifcation: successSessions >= 3,
          },
        }
      )
      if (!item.evaluationNotifcation && successSessions === 3) {
        // Si el usuario tiene 3 citas exitosas, entonces se envía un correo electrónico para habilitar la evaluación del especialista
        await mailServiceSpec.sendEnabledEvaluation(user, item.specialist)
      }
    })
  })
}

/**
 * @description La idea general de esta función es obtener los correos electrónicos que no han sido programados
 * darles una fecha, o en su defecto verificar su fecha de envío y enviarlos.
 * @param {Array} pendingEmails - Correos electrónicos pendientes de programación
 */

const cronService = {
  /**
   * Manages the immediate attention status for specialists
   * 
   * This function:
   * 1. Verifies authentication token
   * 2. Finds all specialists
   * 3. Checks each specialist's immediate attention status
   * 4. Deactivates immediate attention if expiration date has passed
   * 
   * @param {string} token - Authentication token for cron job
   * @returns {Object} Response indicating status change
   */
  async statusInmediateAttention(token) {
    if (token !== authToken) {
      return conflictResponse(
        'ERROR! You are not authorized to use this endpoint.'
      )
    }
    const specialists = await specialistModel.find()

    // Se recorre el array de especialistas si el estado de la atención inmediata
    // esta activo y la fecha de expiracion es antes de la fecha actual
    specialists.forEach(async spec => {
      if (spec.inmediateAttention.activated) {
        const expiration = spec.inmediateAttention.expiration
        if (dayjs(expiration).isBefore(dayjs(Date.now()))) {
          await specialistModel.findOneAndUpdate(
            { _id: spec._id },
            {
              $set: {
                inmediateAttention: {
                  activated: false,
                  expiration: '',
                },
              },
            }
          )
        }
      }
    })
    return okResponse('Estados cambiados')
  },
  /**
   * Schedules and sends chat notification emails
   * 
   * This function:
   * 1. Verifies authentication token
   * 2. Finds unread chat messages
   * 3. For each unread message:
   *    - Sends notification to appropriate recipient (user or specialist)
   *    - Creates email record for tracking
   *    - Schedules follow-up notification
   * 4. Updates message read status
   * 
   * @param {string} token - Authentication token for cron job
   * @returns {Object} Response indicating email status
   */
  async scheduleChatEmails(token) {
    if (token !== authToken) {
      return conflictResponse(
        'ERROR! You are not authorized to use this endpoint.'
      )
    }
    const dontReadMess = await Chat.find({ isLastRead: false }).populate(
      'user specialist'
    )

    dontReadMess.forEach(async mess => {
      const user = mess.user
      const spec = mess.specialist
      const batch = await mailService.getBatchId()
      if (mess.lastMessageSendBy === 'user') {
        await mailServiceRemider.sendChatNotificationToSpec(user, spec, batch)
        email.create({
          userRef: user._id,
          specRef: spec._id,
          type: 'chat-spec-1-day',
          batch: null,
          wasScheduled: false,
          scheduledAt: dayjs.tz(dayjs().add(1, 'day')).format(),
        })
      } else if (mess.lastMessageSendBy === 'specialist') {
        await mailServiceRemider.sendChatNotificationToUser(user, spec, batch)
        email.create({
          userRef: user._id,
          specRef: spec._id,
          type: 'chat-user-1-day',
          batch: null,
          wasScheduled: false,
          scheduledAt: dayjs.tz(dayjs().add(1, 'day')).format(),
        })
      }
    })
    // Se actualizan los mensajes que ya fueron notificados
    await Chat.updateMany({ isLastRead: false }, { $set: { isLastRead: true } })

    return okResponse('Se han enviado los correos')
  },
  /**
   * Updates the status of pending sessions
   * 
   * This function:
   * 1. Verifies authentication token
   * 2. Retrieves all pending sessions
   * 3. For each session:
   *    - Checks session date and status
   *    - Updates status to 'success' if session time has passed
   * 4. Updates successful session count
   * 
   * @param {string} token - Authentication token for cron job
   * @returns {Object} Response indicating session updates
   */
  async sessionStatus(token) {
    if (token !== authToken) {
      return conflictResponse(
        'ERROR! You are not authorized to use this endpoint.'
      )
    }

    // Obtiene todas las sessiones y comienza a recorrerlas, luego se recorre entre los planes, y finalmente
    // se recorre las sessiones, para poder cambiar de estado a las sessiones pendientes que estén dentro
    // de las preferencias minimas del especialista se le cambia el estado a "upnext" como sessión próxima a realizarse.
    // También verifica si la session ya se realizó, y si es así, cambia el estado a "success".
    const pendingSessions = await sessionsModel.find()

    await Promise.allSettled(
      pendingSessions.map(async item => {
        // const specInfo = await specialist.findOne(item.specialist);
        await item.plan.map(async plan => {
          await plan.session.map(async session => {
            const date = dayjs(session.date, 'MM/DD/YYYY HH:mm')
              .add(4, 'hour')
              .format()
            // if (
            // 	session.status === 'pending' &&
            // 	dayjs(date)
            // 		.subtract(
            // 			specInfo.preferences
            // 				.minimumRescheduleSession,
            // 			'hours'
            // 		)
            // 		.isBefore(dayjs()) &&
            // 	dayjs().isBefore(dayjs(date)) &&
            // 	dayjs().isBefore(dayjs(plan.expiration))
            // ) {
            // 	session.status = 'upnext';}
            if (
              session.status === 'pending' && // || session.status === 'upnext'
              dayjs().isAfter(date)
            ) {
              session.status = 'success'
            }
            await sessionsModel.findOneAndUpdate(
              {
                'plan.session._id': session._id,
              },
              {
                $set: {
                  'plan.$[].session.$[element].status': session.status,
                },
              },
              {
                arrayFilters: [{ 'element._id': session._id }],
              }
            )
          })
        })
      })
    )
    await getNumberSuccess()
    return okResponse('Sesiones actualizadas')
  },
  /**
   * Manages payment deadlines for session plans
   * 
   * This function:
   * 1. Verifies authentication token
   * 2. Finds all sessions with pending payments
   * 3. For each pending payment:
   *    - Checks if payment deadline (3 hours) has passed
   *    - Updates payment status to 'failed' if deadline exceeded
   *    - Clears remaining sessions and session data
   * 
   * @param {string} token - Authentication token for cron job
   * @returns {Object} Response indicating plan updates
   */
  async limitToPayPlan(token) {
    if (token !== authToken) {
      return conflictResponse(
        'ERROR! You are not authorized to use this endpoint.'
      )
    }
    const sessions = await sessionsModel.find().populate('user specialist')
    sessions.forEach(item => {
      // Filtro de sesiones que están en estado pending
      const plans = item.plan.filter(plan => plan.payment === 'pending')

      plans.forEach(async plan => {
        if (dayjs().isSameOrAfter(dayjs(plan.createdAt).add(3, 'hours'))) {
          // Se actualiza el estado el pago a cancelado
          await sessionsModel.findOneAndUpdate(
            {
              _id: item._id,
              'plan._id': plan._id,
            },
            {
              $set: {
                'plan.$.payment': 'failed',
                'plan.$.remainingSessions': 0,
                'plan.$.session': [],
              },
            }
          )
          // Se actualiza el estado de la sesión a cancelada
          // await mailServiceRemider.sendPaymentFailed(
          // 	item.user,
          // 	item.specialist
          // );
        }
      })
    })
    return okResponse('Planes actualizados')
  },
  /**
   * Unifies and processes all pending email notifications
   * 
   * This function:
   * 1. Verifies authentication token
   * 2. Processes different types of email notifications:
   *    - Session reminders
   *    - Payment reminders
   *    - Chat reminders
   *    - Renewal reminders
   * 3. Returns total count of scheduled emails
   * 
   * @param {string} token - Authentication token for cron job
   * @returns {Object} Response with total scheduled emails count
   */
  async unifyMailing(token) {
    if (token !== authToken) {
      return conflictResponse(
        'ERROR! You are not authorized to use this endpoint.'
      )
    }
    // Se busca a llamar a todas las funciones de envío de correos
    const totalEmailSchedule =
      (await mailService.sessionReminder()) +
      (await mailService.reminderPayment()) +
      (await mailService.reminderChat()) +
      (await mailService.reminderRenewal())

    return okResponse(
      'Se han programado un total de ' + totalEmailSchedule + ' correos'
    )
  },
}

export default cronService
