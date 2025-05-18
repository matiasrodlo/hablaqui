/**
 * Email Function Utilities
 * 
 * This module provides email-related utility functions for the Hablaquí system.
 * It handles email sending, scheduling, and management for various system events.
 * 
 * Features:
 * - Email sending with SendGrid
 * - Session confirmation emails
 * - Session reminders
 * - Password reset emails
 * - Welcome emails
 * - Payment reminders
 * - Subscription renewal notifications
 * 
 * @module utils/functions/emailFunction
 * @requires ../config/pino - Logging
 * @requires ../config/dotenv - Environment configuration
 * @requires dayjs - Date handling
 * @requires @sendgrid/mail - Email service
 */

'use strict'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Email from '../../models/email'
import { logError } from '../../config/pino'
import nodemailer from 'nodemailer'
import { emailTemplates } from './mails/templates'
const logger = require('../../utils/logger');

// Configure dayjs with required plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Creates a nodemailer transporter for sending emails
 * 
 * @returns {Object} Configured nodemailer transporter
 * 
 * @private
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

/**
 * Sends an email using the configured transporter
 * 
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body in HTML format
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send a simple email
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome to Hablaqui',
 *   html: '<h1>Welcome!</h1>'
 * });
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter()
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...options
    })
    return info
  } catch (error) {
    logError('Error sending email:', error)
    throw error
  }
}

/**
 * Sends a session confirmation email
 * 
 * @param {Object} session - Session data
 * @param {Object} user - User data
 * @param {Object} specialist - Specialist data
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send session confirmation
 * await sendSessionConfirmation(session, user, specialist);
 */
const sendSessionConfirmation = async (session, user, specialist) => {
  try {
    const template = emailTemplates.sessionConfirmation(session, user, specialist)
    return await sendEmail({
      to: user.email,
      subject: 'Session Confirmation - Hablaqui',
      html: template
    })
  } catch (error) {
    logError('Error sending session confirmation:', error)
    throw error
  }
}

/**
 * Sends a session reminder email
 * 
 * @param {Object} session - Session data
 * @param {Object} user - User data
 * @param {Object} specialist - Specialist data
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send session reminder
 * await sendSessionReminder(session, user, specialist);
 */
const sendSessionReminder = async (session, user, specialist) => {
  try {
    const template = emailTemplates.sessionReminder(session, user, specialist)
    return await sendEmail({
      to: user.email,
      subject: 'Session Reminder - Hablaqui',
      html: template
    })
  } catch (error) {
    logError('Error sending session reminder:', error)
    throw error
  }
}

/**
 * Sends a password reset email
 * 
 * @param {Object} user - User data
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send password reset email
 * await sendPasswordReset(user, resetToken);
 */
const sendPasswordReset = async (user, resetToken) => {
  try {
    const template = emailTemplates.passwordReset(user, resetToken)
    return await sendEmail({
      to: user.email,
      subject: 'Password Reset - Hablaqui',
      html: template
    })
  } catch (error) {
    logError('Error sending password reset:', error)
    throw error
  }
}

/**
 * Sends a welcome email to new users
 * 
 * @param {Object} user - User data
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send welcome email
 * await sendWelcomeEmail(user);
 */
const sendWelcomeEmail = async (user) => {
  try {
    const template = emailTemplates.welcome(user)
    return await sendEmail({
      to: user.email,
      subject: 'Welcome to Hablaqui',
      html: template
    })
  } catch (error) {
    logError('Error sending welcome email:', error)
    throw error
  }
}

/**
 * Creates email reminders for an upcoming session
 * Creates separate reminders for both user and specialist
 * 
 * @param {Object} payload - Session information
 * @param {string} payload.date - Session date in MM/DD/YYYY HH:mm format
 * @param {Object} user - User information
 * @param {Object} spec - Specialist information
 * @param {Object} sessions - Session document
 * @param {string} roomsUrl - URL for the session room
 * @param {string} idPlan - Plan ID for the session
 * 
 * @example
 * // Create session reminders
 * await createReminder(
 *   { date: '03/20/2024 14:30' },
 *   userData,
 *   specialistData,
 *   sessionData,
 *   'https://rooms.example.com/123',
 *   'plan123'
 * );
 */
export const createReminder = async (
  payload,
  user,
  spec,
  sessions,
  roomsUrl,
  idPlan
) => {
  // Se filtra el plan para obtener el id de la ultima sesion
  const planFiltered = sessions.plan.filter(plan => plan._id == idPlan)[0]

  const idSessionUltimate =
    planFiltered.session[sessions.plan[0].session.length - 1]._id
  // Email scheduling for appointment reminder for the user
  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-user-hour',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: user._id,
    specRef: spec._id,
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
    userRef: user._id,
    specRef: spec._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })
  // Email scheduling for appointment reminder for the spec
  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-spec-hour',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: user._id,
    specRef: spec._id,
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
    userRef: user._id,
    specRef: spec._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })
}

/**
 * Creates payment reminder emails for a session
 * Creates hourly, daily, and weekly promotional reminders
 * 
 * @param {Object} user - User information
 * @param {Object} spec - Specialist information
 * @param {Object} sessions - Session document
 * 
 * @example
 * // Create payment reminders
 * await createPaymentReminder(userData, specialistData, sessionData);
 */
export const createPaymentReminder = async (user, spec, sessions) => {
  await Email.create({
    wasScheduled: false,
    type: 'reminder-payment-hour',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
  await Email.create({
    wasScheduled: false,
    type: 'reminder-payment-day',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
  await Email.create({
    wasScheduled: false,
    type: 'promocional-incentive-week',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
}

/**
 * Creates subscription renewal reminder emails
 * Creates hourly, daily, and weekly renewal reminders
 * 
 * @param {Object} user - User information
 * @param {Object} spec - Specialist information
 * @param {Object} sessions - Session document
 * 
 * @example
 * // Create renewal reminders
 * await createRenewalSubscription(userData, specialistData, sessionData);
 */
export const createRenewalSubscription = async (user, spec, sessions) => {
  await Email.create({
    wasScheduled: false,
    type: 'reminder-renewal-subscription-1-hour',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
  await Email.create({
    wasScheduled: false,
    type: 'reminder-renewal-subscription-1-day',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
  await Email.create({
    wasScheduled: false,
    type: 'reminder-renewal-subscription-1-week',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
}

/**
 * Deletes payment reminder emails for a user and specialist
 * 
 * @param {string} user - User ID
 * @param {string} spec - Specialist ID
 * 
 * @example
 * // Delete payment reminders
 * await deleteReminderPayment('user123', 'specialist456');
 */
export const deleteReminderPayment = async (user, spec) => {
  // Busca los correos de recordatorio de pago y los elimina
  const mailsToDeleted = await Email.find({
    wasScheduled: false,
    type: {
      $in: [
        'reminder-payment-hour',
        'reminder-payment-day',
        'promocional-incentive-week',
      ],
    },
    userRef: user,
    specRef: spec,
  })
  if (mailsToDeleted.length) {
    mailsToDeleted.forEach(async mail => {
      try {
        await Email.findByIdAndDelete(mail._id);
      } catch (err) {
        logger.error('Error deleting email:', err);
        throw err;
      }
    })
  }
}

/**
 * Deletes subscription renewal reminder emails for a user and specialist
 * 
 * @param {string} user - User ID
 * @param {string} spec - Specialist ID
 * 
 * @example
 * // Delete renewal reminders
 * await deleteRenewalEmails('user123', 'specialist456');
 */
export const deleteRenewalEmails = async (user, spec) => {
  // Busca los correos de recordatorio de pago y los elimina
  const mailsToDeleted = await Email.find({
    wasScheduled: false,
    type: {
      $in: [
        'reminder-renewal-subscription-1-hour',
        'reminder-renewal-subscription-1-day',
        'reminder-renewal-subscription-1-week',
      ],
    },
    userRef: user,
    specRef: spec,
  })
  if (mailsToDeleted.length) {
    mailsToDeleted.forEach(async mail => {
      try {
        await Email.findByIdAndDelete(mail._id);
      } catch (err) {
        logger.error('Error deleting email:', err);
        throw err;
      }
    })
  }
}

module.exports = {
  sendEmail,
  sendSessionConfirmation,
  sendSessionReminder,
  sendPasswordReset,
  sendWelcomeEmail,
  createReminder,
  createPaymentReminder,
  createRenewalSubscription,
  deleteReminderPayment,
  deleteRenewalEmails
}
