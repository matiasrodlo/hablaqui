/**
 * Email Reminder Service
 * 
 * This module provides email reminder functionality for the Hablaquí platform,
 * including session reminders, chat notifications, and payment reminders.
 * It uses SendGrid templates for consistent email formatting.
 * 
 * Key features:
 * - Session reminders (hourly and daily)
 * - Chat notifications
 * - Payment reminders
 * - Session cancellation notifications
 * - Private commitment notifications
 * - Subscription renewal reminders
 * - Promotional incentives
 * 
 * The service uses SendGrid for email delivery and includes timezone-aware scheduling
 * using dayjs for date handling. All emails are sent with unsubscribe groups for
 * email management.
 * 
 * @module utils/functions/mails/reminder
 */

'use strict'

import { landing_url } from '../../../config/dotenv'
import sendMails from './sendMails'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { logError } from '../../../config/pino'
import { emailTemplates } from './templates'

// Configure dayjs with required plugins
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Email reminder service object containing methods for sending various types of notifications
 * 
 * @namespace mailService
 */
const mailService = {
  /**
   * Sends a chat notification email to a user
   * Notifies when a specialist sends a new message
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.email - User's email address
   * @param {Object} specialist - Specialist information
   * @param {string} specialist.name - Specialist's first name
   * @param {string} batch - SendGrid batch ID for tracking
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send chat notification to user
   * await mailService.sendChatNotificationToUser(
   *   { name: 'John', email: 'john@example.com' },
   *   { name: 'Dr. Smith' },
   *   'batch123'
   * );
   */
  async sendChatNotificationToUser(user, specialist, batch) {
    const dataPayload = {
      from: 'Hablaquí <notificaciones@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: `Tiene un nuevo mensaje no leído en Hablaquí de parte de ${specialist.name}`,
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-becad9021a1e4b34afbd466a84aea4e3',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
      },
      batchId: batch,
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a chat notification email to a specialist
   * Notifies when a user sends a new message
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {Object} specialist - Specialist information
   * @param {string} specialist.name - Specialist's first name
   * @param {string} specialist.email - Specialist's email address
   * @param {string} batch - SendGrid batch ID for tracking
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send chat notification to specialist
   * await mailService.sendChatNotificationToSpec(
   *   { name: 'John' },
   *   { name: 'Dr. Smith', email: 'smith@example.com' },
   *   'batch123'
   * );
   */
  async sendChatNotificationToSpec(user, specialist, batch) {
    const dataPayload = {
      from: 'Hablaquí <notificaciones@mail.hablaqui.cl>',
      to: specialist.name + '<' + specialist.email + '>',
      subject: `${user.name} te está hablando`,
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-89f251396ff64c7b8c671a51748b13a9',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
      },
      batchId: batch,
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a session cancellation notification to a user
   * Notifies when a session has been rescheduled
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.email - User's email address
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} [spec.lastName] - Specialist's last name (optional)
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send cancellation notification
   * await mailService.sendCancelSessionUser(
   *   { name: 'John', email: 'john@example.com' },
   *   { name: 'Dr. Smith', lastName: 'Jones' }
   * );
   */
  async sendCancelSessionUser(user, spec) {
    const dataPayload = {
      from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Has pedido una reprogramación de una sesión',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-72d35079d0c2482da9be18b7e9a71958',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: spec.name + ' ' + (spec.lastName ? spec.lastName : ''),
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a private commitment cancellation notification to a specialist
   * Notifies when a specialist cancels a private commitment
   * 
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} spec.email - Specialist's email address
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send commitment cancellation
   * await mailService.sendCancelCommitment({
   *   name: 'Dr. Smith',
   *   email: 'smith@example.com'
   * });
   */
  async sendCancelCommitment(spec) {
    const dataPayload = {
      from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Has cancelado una compromiso privado',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-67d67af2cc2a4af08ddf5a11945f0b8b',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: spec.name,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a private session commitment notification to a specialist
   * Notifies when a specialist schedules a private commitment
   * 
   * @param {Object} specialist - Specialist information
   * @param {string} specialist.name - Specialist's first name
   * @param {string} specialist.email - Specialist's email address
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send custom session commitment
   * await mailService.sendCustomSessionCommitment({
   *   name: 'Dr. Smith',
   *   email: 'smith@example.com'
   * });
   */
  async sendCustomSessionCommitment(specialist) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: specialist.name + '<' + specialist.email + '>',
      subject: 'Has agendado un compromiso privado',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-c012cf4a84014c31b12c422ac7e20faf',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: specialist.name,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a session reminder to a user
   * Can be sent either an hour before or a day before the session
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.email - User's email address
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} [spec.lastName] - Specialist's last name (optional)
   * @param {string} sessionDate - Session date and time
   * @param {string} batch - SendGrid batch ID for tracking
   * @param {string} mailType - Type of reminder ('hour' or 'day')
   * @param {string} urlRooms - URL for the session room
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send hourly reminder
   * await mailService.sendReminderUser(
   *   { name: 'John', email: 'john@example.com' },
   *   { name: 'Dr. Smith', lastName: 'Jones' },
   *   '2024-03-20 14:30',
   *   'batch123',
   *   'hour',
   *   'https://rooms.example.com/123'
   * );
   */
  async sendReminderUser(user, spec, sessionDate, batch, mailType, urlRooms) {
    const { email, name } = user
    const dataPayload = {
      from: 'Hablaquí <recordatorios@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Su sesión con ${spec.name} ${spec.lastname} está por comenzar',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-72d35079d0c2482da9be18b7e9a71958',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: name,
        psy_name: spec.name + ' ' + (spec.lastName ? spec.lastName : ''),
        session_date: dayjs(sessionDate).format('DD/MM/YYYY HH:mm'),
        url_rooms: urlRooms,
        reminder_type: mailType,
      },
      batchId: batch,
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a session reminder to a specialist
   * Can be sent either an hour before or a day before the session
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} spec.email - Specialist's email address
   * @param {string} sessionDate - Session date and time
   * @param {string} batch - SendGrid batch ID for tracking
   * @param {string} mailType - Type of reminder ('hour' or 'day')
   * @param {string} urlRooms - URL for the session room
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send hourly reminder to specialist
   * await mailService.sendReminderSpec(
   *   { name: 'John' },
   *   { name: 'Dr. Smith', email: 'smith@example.com' },
   *   '2024-03-20 14:30',
   *   'batch123',
   *   'hour',
   *   'https://rooms.example.com/123'
   * );
   */
  async sendReminderSpec(user, spec, sessionDate, batch, mailType, urlRooms) {
    const dataPayload = {
      from: 'Hablaquí <recordatorios@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Tiene una sesión con ${user.name}',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-72d35079d0c2482da9be18b7e9a71958',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: spec.name,
        session_date: dayjs(sessionDate).format('DD/MM/YYYY HH:mm'),
        url_rooms: urlRooms,
        reminder_type: mailType,
      },
      batchId: batch,
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a promotional incentive email to a user
   * Includes a discount coupon for subscription renewal
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.email - User's email address
   * @param {string} coupon - Discount coupon code
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send promotional incentive
   * await mailService.sendPromocionalIncentive(
   *   { name: 'John', email: 'john@example.com' },
   *   'H123'
   * );
   */
  async sendPromocionalIncentive(user, coupon) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: '¡Renueva tu suscripción con un 20% de descuento!',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-72d35079d0c2482da9be18b7e9a71958',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        coupon_code: coupon,
        discount_percentage: 20,
        landing_url: landing_url,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a daily payment reminder to a user
   * Includes payment link and amount
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.email - User's email address
   * @param {Object} specialist - Specialist information
   * @param {string} specialist.name - Specialist's first name
   * @param {number} price - Payment amount
   * @param {string} url - Payment URL
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send daily payment reminder
   * await mailService.sendPaymentDay(
   *   { name: 'John', email: 'john@example.com' },
   *   { name: 'Dr. Smith' },
   *   50000,
   *   'https://payment.example.com/123'
   * );
   */
  async sendPaymentDay(user, specialist, price, url) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Tiene un pago pendiente en Hablaquí',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-72d35079d0c2482da9be18b7e9a71958',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
        payment_amount: price,
        payment_url: url,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends an hourly subscription renewal reminder to a user
   * Notifies when subscription is about to expire
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.email - User's email address
   * @param {Object} specialist - Specialist information
   * @param {string} specialist.name - Specialist's first name
   * @param {string} expiracion - Subscription expiration date
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send hourly renewal reminder
   * await mailService.reminderRenewalSubscription1hour(
   *   { name: 'John', email: 'john@example.com' },
   *   { name: 'Dr. Smith' },
   *   '2024-03-20'
   * );
   */
  async reminderRenewalSubscription1hour(user, specialist, expiracion) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Su suscripción está por vencer',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-72d35079d0c2482da9be18b7e9a71958',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
        expiration_date: dayjs(expiracion).format('DD/MM/YYYY'),
        landing_url: landing_url,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a daily subscription renewal reminder to a user
   * Notifies when subscription is about to expire
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.email - User's email address
   * @param {Object} specialist - Specialist information
   * @param {string} specialist.name - Specialist's first name
   * @param {string} expiracion - Subscription expiration date
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send daily renewal reminder
   * await mailService.reminderRenewalSubscription1day(
   *   { name: 'John', email: 'john@example.com' },
   *   { name: 'Dr. Smith' },
   *   '2024-03-20'
   * );
   */
  async reminderRenewalSubscription1day(user, specialist, expiracion) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Su suscripción está por vencer',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-72d35079d0c2482da9be18b7e9a71958',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
        expiration_date: dayjs(expiracion).format('DD/MM/YYYY'),
        landing_url: landing_url,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a session reminder email
   * 
   * @param {Object} session - Session data
   * @param {Object} user - User data
   * @param {Object} specialist - Specialist data
   * @param {string} reminderType - Type of reminder ('day' or 'hour')
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send session reminder
   * await mailService.sendSessionReminder(sessionData, userData, specialistData, 'day');
   */
  async sendSessionReminder(session, user, specialist, reminderType) {
    try {
      const template = emailTemplates.sessionReminder(session, user, specialist, reminderType)
      return await sendMails({
        to: user.email,
        subject: `Session Reminder (${reminderType}) - Hablaqui`,
        html: template
      })
    } catch (error) {
      logError('Error sending session reminder email:', error)
      throw error
    }
  },

  /**
   * Sends a payment reminder email
   * 
   * @param {Object} payment - Payment data
   * @param {Object} user - User data
   * @param {string} dueDate - Payment due date
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send payment reminder
   * await mailService.sendPaymentReminder(paymentData, userData, '2024-03-20');
   */
  async sendPaymentReminder(payment, user, dueDate) {
    try {
      const template = emailTemplates.paymentReminder(payment, user, dueDate)
      return await sendMails({
        to: user.email,
        subject: 'Payment Reminder - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending payment reminder email:', error)
      throw error
    }
  },

  /**
   * Sends a subscription renewal reminder email
   * 
   * @param {Object} subscription - Subscription data
   * @param {Object} user - User data
   * @param {string} renewalDate - Subscription renewal date
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send subscription renewal reminder
   * await mailService.sendSubscriptionRenewalReminder(subscriptionData, userData, '2024-03-20');
   */
  async sendSubscriptionRenewalReminder(subscription, user, renewalDate) {
    try {
      const template = emailTemplates.subscriptionRenewal(subscription, user, renewalDate)
      return await sendMails({
        to: user.email,
        subject: 'Subscription Renewal Reminder - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending subscription renewal reminder email:', error)
      throw error
    }
  },

  /**
   * Sends a follow-up reminder email
   * 
   * @param {Object} session - Session data
   * @param {Object} user - User data
   * @param {Object} specialist - Specialist data
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send follow-up reminder
   * await mailService.sendFollowUpReminder(sessionData, userData, specialistData);
   */
  async sendFollowUpReminder(session, user, specialist) {
    try {
      const template = emailTemplates.followUpReminder(session, user, specialist)
      return await sendMails({
        to: user.email,
        subject: 'Follow-up Reminder - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending follow-up reminder email:', error)
      throw error
    }
  },

  /**
   * Sends a feedback reminder email
   * 
   * @param {Object} session - Session data
   * @param {Object} user - User data
   * @param {Object} specialist - Specialist data
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send feedback reminder
   * await mailService.sendFeedbackReminder(sessionData, userData, specialistData);
   */
  async sendFeedbackReminder(session, user, specialist) {
    try {
      const template = emailTemplates.feedbackReminder(session, user, specialist)
      return await sendMails({
        to: user.email,
        subject: 'Session Feedback - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending feedback reminder email:', error)
      throw error
    }
  },
}

export default Object.freeze(mailService)
