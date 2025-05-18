/**
 * Email Management Service
 * 
 * This module provides comprehensive email management functionality for the Hablaquí platform,
 * including session reminders, payment notifications, chat notifications, and subscription renewals.
 * It integrates with SendGrid for email delivery and includes batch processing capabilities.
 * 
 * Key features:
 * - Session reminder scheduling (hourly and daily)
 * - Payment reminder processing
 * - Chat notification handling
 * - Subscription renewal notifications
 * - Batch email processing
 * - Coupon generation
 * - Payment preference creation
 * - Timezone-aware scheduling
 * - MercadoPago integration
 * 
 * The service uses SendGrid for email delivery and includes timezone-aware scheduling
 * using dayjs for date handling. All emails are sent with unsubscribe groups for
 * email management.
 * 
 * @module utils/functions/mails/mailing
 */

'use strict'
import email from '../../../models/email'
import userModel from '../../../models/user'
import mercadopagoService from '../../../services/mercadopago'
import couponModel from '../../../models/coupons'
import specialistModel from '../../../models/specialist'
import mailServiceRemider from './reminder'
import mailServiceSpec from './specialistStatus'
import dayjs from 'dayjs'
import { conflictResponse } from '../../responses/functions'
import sessionsModel from '../../../models/sessions'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import sgClient from '@sendgrid/client'

// Configure dayjs with required plugins
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.tz.setDefault('America/Santiago')

// Configure SendGrid client
sgClient.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Generates payload for email scheduling updates
 * Creates the payload for updating email scheduling objects in the database
 * 
 * @param {dayjs} date - Date when the email should be scheduled
 * @param {string} batch - SendGrid batch ID for tracking
 * @param {string} reminderType - Type of reminder ('hour' or 'day')
 * @param {boolean} isSend - Whether the email has been sent
 * @returns {Object} Payload for email scheduling update
 * @property {boolean} wasScheduled - Whether the email was scheduled
 * @property {string} scheduledAt - Scheduled date in RFC2822 format
 * @property {string} batchId - SendGrid batch ID
 * 
 * @private
 * 
 * @example
 * // Generate payload for hourly reminder
 * const payload = generatePayload(
 *   dayjs().add(1, 'hour'),
 *   'batch123',
 *   'hour',
 *   false
 * );
 */
function generatePayload(date, batch, reminderType, isSend) {
  /**
   * @description Crea el payload para actualizar el objeto de programación de correo electrónico
   * @param {dayjs} date Fecha en la que se programará el correo electrónico (1 hora antes de la cita)
   * @param {string} mailId ID de Mailgun para identificar el correo electrónico internamente
   * @param {string} reminderType Tipo de recordatorio (1 hora antes, 1 día antes)
   * @returns un objeto con el payload
   */
  return {
    wasScheduled: isSend,
    scheduledAt: dayjs
      .tz(dayjs(date).subtract(1, reminderType))
      .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    batchId: batch,
  }
}

/**
 * Gets a new batch ID from SendGrid for email sending
 * Creates a new batch for tracking related emails in SendGrid
 * 
 * @returns {Promise<string>} SendGrid batch ID
 * @throws {Error} If batch creation fails
 * 
 * @private
 * 
 * @example
 * // Get new batch ID
 * const batchId = await getBatchId();
 * console.log(`Created batch: ${batchId}`);
 */
async function getBatchId() {
  /**
   * @description Se obtiene un batchId para el envío de correos electrónicos
   * @returns {string} batchId
   */
  const result = await sgClient
    .request({
      method: 'POST',
      url: '/v3/mail/batch',
    })
    .then(([response, body]) => {
      if (response.statusCode === 201) {
        return body
      }
      throw new Error('Failed to create batch ID')
    })
  const { batch_id } = result
  return batch_id
}

/**
 * Creates a payment preference in MercadoPago
 * Generates a payment link for session or plan purchases
 * 
 * @param {Object} user - User information
 * @param {string} user.name - User's first name
 * @param {string} user.lastName - User's last name
 * @param {Object} specialist - Specialist information
 * @param {string} specialist.username - Specialist's username
 * @param {Object} plan - Plan information
 * @param {string} plan.title - Plan title
 * @param {number} plan.totalPrice - Plan price
 * @param {string} plan._id - Plan ID
 * @param {Object} session - Session information
 * @param {string} session._id - Session ID
 * @returns {Promise<string>} MercadoPago payment URL
 * @throws {Error} If payment preference creation fails
 * 
 * @private
 * 
 * @example
 * // Create payment preference
 * const paymentUrl = await preference(
 *   { name: 'John', lastName: 'Doe' },
 *   { username: 'dr.smith' },
 *   { title: 'Basic Plan', totalPrice: 50000, _id: 'plan123' },
 *   { _id: 'session123' }
 * );
 */
async function preference(user, specialist, plan, session) {
  // Se genera un código aleatorio para el token de pago
  const randomCode = () => {
    return Math.random()
      .toString(36)
      .substring(2)
  }
  const token = randomCode() + randomCode()
  const price = plan.totalPrice
  // Se crea el pago en mercadopago
  const mercadopagoPayload = {
    specialist: specialist.username,
    price,
    description:
      plan.title + ' - Pagado por ' + user.name + ' ' + user.lastName,
    quantity: 1,
    sessionsId: session._id.toString(),
    planId: plan._id.toString(),
    token,
  }
  const responseBody = await mercadopagoService.createPreference(
    mercadopagoPayload
  )
  return responseBody.init_point
}

/**
 * Creates a new discount coupon
 * Generates a unique coupon code with a 20% discount
 * 
 * @returns {Promise<string>} Generated coupon code
 * @throws {Error} If coupon creation fails
 * 
 * @private
 * 
 * @example
 * // Create new coupon
 * const couponCode = await createCoupon();
 * console.log(`Created coupon: ${couponCode}`);
 */
async function createCoupon() {
  // Generar un número entero random
  const randomInt = (min = 100, max = 999) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  const code = 'H' + randomInt()
  const coupon = {
    code,
    discount: 20,
    discountType: 'percentage',
    restrictions: {
      firstTimeOnly: true,
    },
    expiration: dayjs.tz(dayjs().add(1, 'week')).format(),
  }
  await couponModel.create(coupon)
  return coupon.code
}

/**
 * Processes and sends session reminder emails
 * Handles both hourly and daily reminders for users and specialists
 * 
 * The function:
 * 1. Finds pending reminder emails
 * 2. Processes each email based on type (hour/day) and recipient (user/spec)
 * 3. Sends reminders using appropriate templates
 * 4. Updates email status in database
 * 
 * @returns {Promise<number>} Number of processed emails
 * @throws {Error} If email processing fails
 * 
 * @example
 * // Process session reminders
 * const processedCount = await sessionReminder();
 * console.log(`Processed ${processedCount} reminder emails`);
 */
const sessionReminder = async () => {
  // Encuentra los correos que no han sido programados aún, los obtiene por el asunto.
  const pendingEmails = await email.find({
    wasScheduled: false,
    type: {
      $in: [
        'reminder-user-hour',
        'reminder-spec-hour',
        'reminder-user-day',
        'reminder-spec-day',
      ],
    },
  })
  // Se recorre el array de correos y se envían los correos
  // Busca los correos electrónicos que no han sido programados
  console.log('pendingEmails', pendingEmails)
  if (!pendingEmails.length > 0) {
    return pendingEmails.length
  }
  pendingEmails.forEach(async emailInfo => {
    // Se obtiene el tipo de correo y el destinatario (spec o user)
    let batch = null
    const mailType = emailInfo.type.split('-').pop()
    const addressee = emailInfo.type.split('-')[1]
    const sessionDate = dayjs(emailInfo.sessionDate)
    const urlRooms = emailInfo.url
    let isSend = false

    // Se verifica si en el correo de recordatorio de un día antes es parte del día
    // anterior para asegurar que se envíe el correo el día antes y no el día que corresponde
    // a la sessión con un máximo de 20 horas antes.
    if (
      !dayjs().isBefore(dayjs(sessionDate).subtract(20, 'hours')) &&
      mailType === 'day'
    ) {
      return
    }
    const user = await userModel.findById(emailInfo.userRef)
    const spec = await specialistModel.findById(emailInfo.specRef)
    if (!user || !spec) {
      return
    }
    try {
      // Se envía el correo electrónico al usuario o especialista para recordar la sesion
      // Si es null significa que aún no se le ha dado una fecha de envío
      if (emailInfo.scheduledAt !== null) {
        // Si la fecha actual está después que la fecha programada, entonces se envía el correo
        if (
          addressee === 'user' &&
          dayjs().isAfter(dayjs(emailInfo.scheduledAt))
        ) {
          batch = await getBatchId()
          // Este valor de verdad es para dejar en mongo que el correo ya fue enviado y no se vuelva a programar
          isSend = true
          console.log(sessionDate)
          await mailServiceRemider.sendReminderUser(
            user,
            spec,
            sessionDate,
            batch,
            mailType,
            urlRooms
          )
        } else if (
          addressee === 'spec' &&
          dayjs().isAfter(dayjs(emailInfo.scheduledAt))
        ) {
          batch = await getBatchId()
          isSend = true
          await mailServiceRemider.sendReminderSpec(
            user,
            spec,
            sessionDate,
            batch,
            mailType,
            urlRooms
          )
        }
      }
      // Se genera el payload y se actualiza el email
      const updatePayload = generatePayload(
        sessionDate,
        batch,
        mailType,
        isSend
      )
      await email.findByIdAndUpdate(emailInfo._id, updatePayload, {
        new: true,
      })
    } catch (error) {
      console.error('Error processing reminder:', error)
    }
  })
  return pendingEmails.length
}

/**
 * Processes and sends payment reminder emails
 * Handles payment notifications for pending and overdue payments
 * 
 * The function:
 * 1. Finds pending payment reminder emails
 * 2. Processes each email based on payment status
 * 3. Sends reminders using appropriate templates
 * 4. Updates email status in database
 * 
 * @returns {Promise<number>} Number of processed emails
 * @throws {Error} If email processing fails
 * 
 * @example
 * // Process payment reminders
 * const processedCount = await reminderPayment();
 * console.log(`Processed ${processedCount} payment reminder emails`);
 */
const reminderPayment = async () => {
  // Se busca todos los correos no programados con los asuntos de pago
  const pendingEmails = await email.find({
    wasScheduled: false,
    type: {
      $in: [
        'reminder-payment-hour',
        'reminder-payment-day',
        'promocional-incentive-week',
      ],
    },
  })

  if (!pendingEmails.length > 0) {
    return pendingEmails.length
  }

  pendingEmails.forEach(async emailInfo => {
    // Se obtiene el tipo de correo y el destinatario (spec o user)
    let isSend = false
    let batch = null
    const user = await userModel.findById(emailInfo.userRef)
    const spec = await specialistModel.findById(emailInfo.specRef)
    const sessionDocument = await sessionsModel.findById(emailInfo.sessionRef)
    const mailType = emailInfo.type.split('-').pop()
    // Se obtiene el plan pendiente
    const plan = sessionDocument.plan
      .filter(plan => plan.payment === 'pending')
      .pop()

    // Se verifica que el usuario se haya encontrado al igual que el especialista y la sesión
    if (!user || !spec || !sessionDocument || !plan) {
      return
    }
    // Se obtiene la url de pago
    // Crea la preferencia de mercado pago para los correos de recordatorio de pago
    const url = await preference(user, spec, plan, sessionDocument)
    try {
      // Se envía el correo electrónico al usuario o especialista para recordar la sesion
      // Si es null significa que aún no se le ha dado una fecha de envío
      if (emailInfo.scheduledAt !== null) {
        // Si la fecha actual está después que la fecha programada, entonces se envía el correo
        if (
          dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
          emailInfo.type === 'reminder-payment-hour'
        ) {
          batch = await getBatchId()
          // Este valor de verdad es para dejar en mongo que el correo ya fue enviado y no se vuelva a programar
          isSend = true
          await mailServiceSpec.pendingPlanPayment(
            user,
            spec,
            plan.totalPrice,
            url
          )
        } else if (
          dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
          emailInfo.type === 'reminder-payment-day'
        ) {
          batch = await getBatchId()
          isSend = true
          await mailServiceRemider.sendPaymentDay(
            user,
            spec,
            plan.totalPrice,
            url
          )
        } else if (
          dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
          emailInfo.type === 'promocional-incentive-week'
        ) {
          batch = await getBatchId()
          isSend = true
          // Si ya pasó más de una semana, crea un cupón de descuento para
          // incentivar al usuario a pagar
          const code = await createCoupon()
          await mailServiceRemider.sendPromocionalIncentive(user, code)
        }
      }
      // Se genera el payload y se actualiza el email
      const updatePayload = {
        wasScheduled: isSend,
        scheduledAt: dayjs
          .tz(dayjs(plan.createdAt).add(1, mailType))
          .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
        batchId: batch,
      }
      await email.findByIdAndUpdate(emailInfo._id, updatePayload, {
        new: true,
      })
    } catch (error) {
      return conflictResponse('Email sheduling service found an error')
    }
  })

  return pendingEmails.length
}

/**
 * Processes and sends chat notification emails
 * Handles notifications for new chat messages
 * 
 * The function:
 * 1. Finds pending chat notification emails
 * 2. Processes each notification based on message type
 * 3. Sends notifications using appropriate templates
 * 4. Updates email status in database
 * 
 * @returns {Promise<number>} Number of processed emails
 * @throws {Error} If email processing fails
 * 
 * @example
 * // Process chat notifications
 * const processedCount = await reminderChat();
 * console.log(`Processed ${processedCount} chat notification emails`);
 */
const reminderChat = async () => {
  // Se busca todos los correos no programados con los asuntos de pago
  const pendingEmails = await email.find({
    wasScheduled: false,
    type: {
      $in: ['chat-spec-1-day', 'chat-user-1-day'],
    },
  })

  if (!pendingEmails.length > 0) {
    return pendingEmails.length
  }

  // Se recorren los correos pendientes
  pendingEmails.forEach(async emailInfo => {
    // Se obtiene el tipo de correo y el destinatario (spec o user)
    let isSend = false
    let batch = null
    const user = await userModel.findById(emailInfo.userRef)
    const spec = await specialistModel.findById(emailInfo.specRef)
    // Se verifica que el usuario se haya encontrado al igual que el especialista
    if (!user) {
      return conflictResponse('No se encontró el usuario')
    }
    if (!spec) {
      return conflictResponse('No se encontró el especialista')
    }
    try {
      if (
        dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
        emailInfo.type === 'chat-user-1-day'
      ) {
        batch = await getBatchId()
        // Este valor de verdad es para dejar en mongo que el correo ya fue enviado y no se vuelva a programar
        isSend = true
        await mailServiceRemider.sendChatNotificationToUser(user, spec, batch)
      } else if (
        dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
        emailInfo.type === 'chat-spec-1-day'
      ) {
        batch = await getBatchId()
        isSend = true
        await mailServiceRemider.sendChatNotificationToSpec(user, spec, batch)
      }
      // Se genera el payload y se actualiza el email
      const updatePayload = {
        wasScheduled: isSend,
        batchId: batch,
      }
      await email.findByIdAndUpdate(emailInfo._id, updatePayload, {
        new: true,
      })
    } catch (error) {
      return conflictResponse('Email sheduling service found an error')
    }
  })
  return pendingEmails.length
}

/**
 * Processes and sends subscription renewal reminder emails
 * Handles notifications for upcoming subscription renewals
 * 
 * The function:
 * 1. Finds pending renewal reminder emails
 * 2. Processes each reminder based on renewal date
 * 3. Sends reminders using appropriate templates
 * 4. Updates email status in database
 * 
 * @returns {Promise<number>} Number of processed emails
 * @throws {Error} If email processing fails
 * 
 * @example
 * // Process renewal reminders
 * const processedCount = await reminderRenewal();
 * console.log(`Processed ${processedCount} renewal reminder emails`);
 */
const reminderRenewal = async () => {
  // Se busca todos los correos no programados con los asuntos de pago
  const pendingEmails = await email.find({
    wasScheduled: false,
    type: {
      $in: [
        'reminder-renewal-subscription-1-hour',
        'reminder-renewal-subscription-1-day',
        'reminder-renewal-subscription-1-week',
      ],
    },
  })

  if (!pendingEmails.length > 0) {
    return pendingEmails.length
  }

  // Se recorren los correos pendientes
  pendingEmails.forEach(async emailInfo => {
    // Se busca el usuario y el spec
    const user = await userModel.findById(emailInfo.userRef)
    const spec = await specialistModel.findById(emailInfo.specRef)
    const sessionDocument = await sessionsModel.findById(emailInfo.sessionRef)
    const mailType = emailInfo.type.split('-').pop()
    let batch = null
    let isSend = false
    if (!user || !spec || !sessionDocument) {
      return
    }
    // Se obtiene un plan expirado del usuario
    const plan = sessionDocument.plan.filter(plan =>
      dayjs().isAfter(dayjs(plan.expiration))
    )[0]
    if (!plan) {
      return
    }
    try {
      // Se envía el correo electrónico al usuario o especialista para recordar la sesion
      // Si es null significa que aún no se le ha dado una fecha de envío
      if (emailInfo.scheduledAt !== null) {
        // Si la fecha actual está después que la fecha programada, entonces se envía el correo
        if (
          dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
          emailInfo.type === 'reminder-renewal-subscription-1-hour'
        ) {
          batch = await getBatchId()
          // Este valor de verdad es para dejar en mongo que el correo ya fue enviado y no se vuelva a programar
          isSend = true
          await mailServiceRemider.reminderRenewalSubscription1hour(
            user,
            spec,
            plan.expiration
          )
        } else if (
          dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
          emailInfo.type === 'reminder-renewal-subscription-1-day'
        ) {
          batch = await getBatchId()
          isSend = true
          await mailServiceRemider.reminderRenewalSubscription1day(
            user,
            spec,
            plan.expiration
          )
        } else if (
          dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
          emailInfo.type === 'reminder-renewal-subscription-1-week'
        ) {
          batch = await getBatchId()
          isSend = true
          // Si ya pasó más de una semana, crea un cupón de descuento para
          // incentivar al usuario a pagar
          const code = await createCoupon()
          await mailServiceRemider.sendPromocionalIncentive(user, code)
        }
      }
      // Se genera el payload y se actualiza el email
      const updatePayload = {
        wasScheduled: isSend,
        scheduledAt: dayjs
          .tz(dayjs(plan.expiration).add(1, mailType))
          .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
        batchId: batch,
      }
      await email.findByIdAndUpdate(emailInfo._id, updatePayload, {
        new: true,
      })
    } catch (error) {
      return conflictResponse('Email sheduling service found an error')
    }
  })
  return pendingEmails.length
}

/**
 * Email Management Service
 * 
 * @exports mailService
 */
const mailService = {
  sessionReminder,
  reminderPayment,
  reminderChat,
  reminderRenewal,
  getBatchId,
}

export default Object.freeze(mailService)
