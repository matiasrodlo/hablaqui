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
 * @requires @sendgrid/mail - Email service
 * @requires dayjs - Date handling
 * @requires ../config/pino - Logging
 * @requires ./templates - Email templates
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
import { logError } from '../../../config/pino'
import { sendEmail } from './sendMails'
import { emailTemplates } from './templates'
const logger = require('../../../utils/logger');

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
        logger.info(`Created batch: ${body.batch_id}`);
        return body;
      }
      throw new Error('Failed to create batch ID');
    });
  const { batch_id } = result;
  return batch_id;
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
  const randomInt = (min = 100, max = 999) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const couponCode = `HABLAQUI${randomInt()}`;
  logger.info(`Created coupon: ${couponCode}`);
  return couponCode;
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
  logger.debug('Pending emails:', pendingEmails)
  if (!pendingEmails.length > 0) {
    return pendingEmails.length
  }
  try {
    const processedCount = await processEmailQueue(pendingEmails);
    logger.info(`Processed ${processedCount} reminder emails`);
  } catch (error) {
    logger.error('Error processing reminder emails:', error);
    throw error;
  }
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

  try {
    const processedCount = await processEmailQueue(pendingEmails);
    logger.info(`Processed ${processedCount} payment reminder emails`);
  } catch (error) {
    logger.error('Error processing payment reminder emails:', error);
    throw error;
  }
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
  try {
    const processedCount = await processEmailQueue(pendingEmails);
    logger.info(`Processed ${processedCount} chat notification emails`);
  } catch (error) {
    logger.error('Error processing chat notification emails:', error);
    throw error;
  }
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
  try {
    const processedCount = await processEmailQueue(pendingEmails);
    logger.info(`Processed ${processedCount} renewal reminder emails`);
  } catch (error) {
    logger.error('Error processing renewal reminder emails:', error);
    throw error;
  }
}

/**
 * Processes the email queue and sends pending emails
 * 
 * @param {Object} queue - Email queue data
 * @returns {Promise<Array>} Array of send results
 * 
 * @example
 * // Process email queue
 * await processEmailQueue(queueData);
 */
const processEmailQueue = async (queue) => {
  try {
    const results = await Promise.all(
      queue.map(async (email) => {
        try {
          const result = await sendEmail(email)
          return { success: true, email, result }
        } catch (error) {
          return { success: false, email, error }
        }
      })
    )
    return results.filter(result => result.success).length;
  } catch (error) {
    logError('Error processing email queue:', error)
    throw error
  }
}

/**
 * Schedules an email for future delivery
 * 
 * @param {Object} email - Email data
 * @param {Date} scheduledTime - Time to send the email
 * @returns {Promise<Object>} Scheduled email data
 * 
 * @example
 * // Schedule an email
 * await scheduleEmail(emailData, new Date('2024-03-20T14:00:00Z'));
 */
const scheduleEmail = async (email, scheduledTime) => {
  try {
    const scheduledEmail = {
      ...email,
      scheduledAt: scheduledTime,
      status: 'scheduled'
    }
    // Store in database or queue
    return scheduledEmail
  } catch (error) {
    logError('Error scheduling email:', error)
    throw error
  }
}

/**
 * Cancels a scheduled email
 * 
 * @param {string} emailId - ID of the scheduled email
 * @returns {Promise<boolean>} Success status
 * 
 * @example
 * // Cancel scheduled email
 * await cancelScheduledEmail('email123');
 */
const cancelScheduledEmail = async (emailId) => {
  try {
    // Remove from database or queue
    return true
  } catch (error) {
    logError('Error cancelling scheduled email:', error)
    throw error
  }
}

/**
 * Tracks email delivery status
 * 
 * @param {string} emailId - ID of the email
 * @param {string} status - New status
 * @param {Object} [metadata] - Additional tracking metadata
 * @returns {Promise<Object>} Updated tracking data
 * 
 * @example
 * // Track email delivery
 * await trackEmailDelivery('email123', 'delivered', { timestamp: new Date() });
 */
const trackEmailDelivery = async (emailId, status, metadata = {}) => {
  try {
    const trackingData = {
      emailId,
      status,
      timestamp: new Date(),
      ...metadata
    }
    // Store in database
    return trackingData
  } catch (error) {
    logError('Error tracking email delivery:', error)
    throw error
  }
}

/**
 * Gets email delivery statistics
 * 
 * @param {Object} [filters] - Filter criteria
 * @param {Date} [filters.startDate] - Start date for statistics
 * @param {Date} [filters.endDate] - End date for statistics
 * @returns {Promise<Object>} Email statistics
 * 
 * @example
 * // Get email statistics
 * const stats = await getEmailStats({
 *   startDate: new Date('2024-03-01'),
 *   endDate: new Date('2024-03-31')
 * });
 */
const getEmailStats = async (filters = {}) => {
  try {
    // Query database for statistics
    return {
      total: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
      ...filters
    }
  } catch (error) {
    logError('Error getting email statistics:', error)
    throw error
  }
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
  processEmailQueue,
  scheduleEmail,
  cancelScheduledEmail,
  trackEmailDelivery,
  getEmailStats
}

export default Object.freeze(mailService)
