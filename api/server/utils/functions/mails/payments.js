/**
 * Payment Email Service
 * 
 * This module provides email notification functionality for payment-related events
 * in the Hablaquí platform, including session payments, plan purchases, and account updates.
 * It uses SendGrid templates for consistent email formatting.
 * 
 * @module utils/functions/mails/payments
 */

'use strict'

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
 * Payment email service object containing methods for sending payment-related notifications
 * 
 * @namespace mailService
 */
const mailService = {
  /**
   * Sends a payment confirmation email to a user
   * Notifies when a session payment has been successfully processed
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {string} paid - Payment ID
   * @param {string} roomsUrl - URL for the session room
   * @param {string} date - Session date
   * 
   * @example
   * // Send payment confirmation to user
   * await mailService.sendSuccessCustomSessionPaymentUser(
   *   userData,
   *   specialistData,
   *   'payment123',
   *   'https://rooms.example.com/123',
   *   '2024-03-20 14:30'
   * );
   */
  async sendSuccessCustomSessionPaymentUser(user, spec, paid, roomsUrl, date) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Has realizado el pago de la sesión',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-3eb4b9d7bc4048ffbc0ce31ab6d97e83',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        paid,
        roomsUrl,
        psy_name: spec.name + ' ' + spec.lastName,
        date,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a payment notification email to a specialist
   * Notifies when a user has purchased a new plan
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {string} paid - Payment ID
   * @param {string} roomsUrl - URL for the session room
   * @param {string} date - Session date
   * 
   * @example
   * // Send payment notification to specialist
   * await mailService.sendSuccessCustomSessionPaymentSpec(
   *   userData,
   *   specialistData,
   *   'payment123',
   *   'https://rooms.example.com/123',
   *   '2024-03-20 14:30'
   * );
   */
  async sendSuccessCustomSessionPaymentSpec(user, spec, paid, roomsUrl, date) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Han contratado un nuevo plan con usted',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-6ac128fe8f804757ad45c5dfab571e12',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        paid,
        roomsUrl,
        psy_name: spec.name,
        date,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a premium account confirmation email to a specialist
   * Notifies when a specialist's payment account has been updated
   * 
   * @param {Object} specialist - Specialist information
   * @param {string} period - Payment period
   * @param {string} price - Payment amount
   * 
   * @example
   * // Send premium account confirmation
   * await mailService.sendSpecialistPay(
   *   specialistData,
   *   'monthly',
   *   '$50000'
   * );
   */
  async sendSpecialistPay(specialist, period, price) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: specialist.name + '<' + specialist.email + '>',
      subject: 'Enhorabuena, bienvenido a premium',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-f5eb2f1bfaf14d888b3276f8010dacc4',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: specialist.name,
        period,
        price,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a payment confirmation email
   * 
   * @param {Object} payment - Payment data
   * @param {string} payment.id - Payment ID
   * @param {number} payment.amount - Payment amount
   * @param {string} payment.currency - Payment currency
   * @param {Object} user - User data
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send payment confirmation
   * await sendPaymentConfirmation({
   *   id: 'pay_123',
   *   amount: 10000,
   *   currency: 'CLP'
   * }, userData);
   */
  async sendPaymentConfirmation(payment, user) {
    try {
      const template = emailTemplates.paymentConfirmation(payment, user)
      return await sendMails({
        to: user.email,
        subject: 'Payment Confirmation - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending payment confirmation:', error)
      throw error
    }
  },

  /**
   * Sends a payment receipt email
   * 
   * @param {Object} payment - Payment data
   * @param {Object} user - User data
   * @param {Object} session - Session data
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send payment receipt
   * await sendPaymentReceipt(paymentData, userData, sessionData);
   */
  async sendPaymentReceipt(payment, user, session) {
    try {
      const template = emailTemplates.paymentReceipt(payment, user, session)
      return await sendMails({
        to: user.email,
        subject: 'Payment Receipt - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending payment receipt:', error)
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
   * await sendPaymentReminder(paymentData, userData, '2024-03-20');
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
      logError('Error sending payment reminder:', error)
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
   * await sendSubscriptionRenewalReminder(subscriptionData, userData, '2024-03-20');
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
      logError('Error sending subscription renewal reminder:', error)
      throw error
    }
  },
}

export default Object.freeze(mailService)
