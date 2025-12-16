/**
 * Specialist Status Email Service
 * 
 * This module provides email notification functionality for specialist-related events
 * in the Hablaquí platform, including recruitment, evaluations, payments, and withdrawals.
 * It uses SendGrid templates for consistent email formatting.
 * 
 * Key features:
 * - Recruitment notifications
 * - Evaluation requests and confirmations
 * - Payment reminders and confirmations
 * - Withdrawal requests and completions
 * - Internal notifications
 * - Timezone-aware date handling
 * 
 * The service uses SendGrid templates for consistent email formatting and includes
 * unsubscribe groups for email management. All emails are sent with proper reply-to
 * addresses and support contact information.
 * 
 * @module utils/functions/mails/specialistStatus
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
 * Specialist status email service object containing methods for sending specialist-related notifications
 * 
 * @namespace mailService
 */
const mailService = {
  /**
   * Sends an internal email about a new specialist application
   * Notifies administrators when a new specialist applies
   * 
   * @param {Object} recruitedSpec - Specialist information
   * @param {string} recruitedSpec.name - Specialist's first name
   * @param {string} recruitedSpec.lastName - Specialist's last name
   * @param {string} recruitedSpec.email - Specialist's email
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send recruitment confirmation to admin
   * await mailService.sendRecruitmentConfirmationAdmin({
   *   name: 'John',
   *   lastName: 'Doe',
   *   email: 'john@example.com'
   * });
   */
  async sendRecruitmentConfirmationAdmin(recruitedSpec) {
    const { name, lastName, email } = recruitedSpec
    const dataPayload = {
      from: 'Hablaquí <internal@mail.hablaqui.cl>',
      to: 'direccion@hablaqui.com',
      subject: '[Internal] Nueva postulación de especialista',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-8ee906349e144427ad0103a31507541a',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_first_name: name,
        psy_last_name: lastName,
        psy_email: email,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a confirmation email to a new specialist
   * Notifies when their application has been received
   * 
   * @param {Object} recruitedSpec - Specialist information
   * @param {string} recruitedSpec.name - Specialist's name
   * @param {string} recruitedSpec.email - Specialist's email
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send recruitment confirmation to specialist
   * await mailService.sendRecruitmentConfirmation({
   *   name: 'John',
   *   email: 'john@example.com'
   * });
   */
  async sendRecruitmentConfirmation(recruitedSpec) {
    const { email, name } = recruitedSpec
    const dataPayload = {
      from: 'Hablaquí <reclutamiento@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Gracias por registrarse, acceda a su cuenta',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-d40470d41a3842ac9108bcdb6ac70022',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        first_name: name,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends an evaluation request email to a user
   * Notifies when they can evaluate a specialist
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.lastName - User's last name (optional)
   * @param {string} user.email - User's email address
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send evaluation request
   * await mailService.sendEnabledEvaluation(
   *   { name: 'John', lastName: 'Doe', email: 'john@example.com' },
   *   { name: 'Dr. Smith' }
   * );
   */
  async sendEnabledEvaluation(user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Evaluación de experiencia en Hablaquí',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-39a4dae7572448e08a7f0b8e9cc4adbd',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        psy_name: spec.name,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a payment reminder email to a specialist
   * Notifies about pending plan payment
   * 
   * @param {Object} user - Specialist information
   * @param {string} user.name - Specialist's first name
   * @param {string} user.email - Specialist's email address
   * @param {Object} spec - Specialist information (duplicate for template compatibility)
   * @param {string} spec.name - Specialist's first name
   * @param {string} spec.lastName - Specialist's last name (optional)
   * @param {string} amount - Plan payment amount
   * @param {string} url - Payment page URL
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send payment reminder
   * await mailService.pendingPlanPayment(
   *   { name: 'Dr. Smith', email: 'smith@example.com' },
   *   { name: 'Dr. Smith', lastName: 'Jones' },
   *   '$50000',
   *   'https://payment.example.com/123'
   * );
   */
  async pendingPlanPayment(user, spec, amount, url) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Subscripción pendiente el pago',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-a9b7fe9d08254e9b91d1cddbe399292c',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: spec.name + ' ' + (spec.lastName ? spec.lastName : ''),
        amount,
        url,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a withdrawal request confirmation email to a specialist
   * Notifies when they have requested a withdrawal
   * 
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} spec.email - Specialist's email address
   * @param {string} total - Withdrawal amount
   * @param {string} date - Withdrawal request date (YYYY-MM-DD)
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send withdrawal request confirmation
   * await mailService.sendPaymentRequest(
   *   { name: 'Dr. Smith', email: 'smith@example.com' },
   *   '$100000',
   *   '2024-03-20'
   * );
   */
  async sendPaymentRequest(spec, total, date) {
    const dataPayload = {
      from: 'Hablaquí <retiros@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: '¡Has realizado una solicitud de retiro!',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-1b7f3153b2e64beca579cf634bcd2b7c',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        total,
        date,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a withdrawal completion email to a specialist
   * Notifies when their withdrawal request has been processed
   * 
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} spec.email - Specialist's email address
   * @param {string} total - Withdrawal amount
   * @param {string} date - Withdrawal completion date (YYYY-MM-DD)
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send withdrawal completion notification
   * await mailService.sendCompletePaymentRequest(
   *   { name: 'Dr. Smith', email: 'smith@example.com' },
   *   '$100000',
   *   '2024-03-20'
   * );
   */
  async sendCompletePaymentRequest(spec, total, date) {
    const dataPayload = {
      from: 'Hablaquí <retiros@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Transferencia de recaudación semanal',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-478ea4a5f440447db1d7ec9dc0361b55',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        total,
        date,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends an evaluation completion confirmation email to a user
   * Notifies when they have completed an evaluation
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.lastName - User's last name (optional)
   * @param {string} user.email - User's email address
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send evaluation completion confirmation
   * await mailService.sendAddEvaluation(
   *   { name: 'John', lastName: 'Doe', email: 'john@example.com' },
   *   { name: 'Dr. Smith' }
   * );
   */
  async sendAddEvaluation(user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Gracias por evaluar a su especialista',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-39a4dae7572448e08a7f0b8e9cc4adbd',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        psy_name: spec.name,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends an evaluation notification email to a specialist
   * Notifies when they have received a new evaluation
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.lastName - User's last name (optional)
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} spec.email - Specialist's email address
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send evaluation notification
   * await mailService.sendApproveEvaluationToSpec(
   *   { name: 'John', lastName: 'Doe' },
   *   { name: 'Dr. Smith', email: 'smith@example.com' }
   * );
   */
  async sendApproveEvaluationToSpec(user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Han evaluado su servicio',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-39a4dae7572448e08a7f0b8e9cc4adbd',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        psy_name: spec.name,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends an evaluation rejection email to a specialist
   * Notifies when their evaluation has been rejected
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.lastName - User's last name (optional)
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} spec.email - Specialist's email address
   * @returns {Promise<void>}
   * @throws {Error} If email sending fails
   * 
   * @example
   * // Send evaluation rejection
   * await mailService.sendRefuseEvaluation(
   *   { name: 'John', lastName: 'Doe' },
   *   { name: 'Dr. Smith', email: 'smith@example.com' }
   * );
   */
  async sendRefuseEvaluation(user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Han rechazado su evaluación',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-39a4dae7572448e08a7f0b8e9cc4adbd',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        psy_name: spec.name,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a specialist verification email
   * 
   * @param {Object} specialist - Specialist data
   * @param {string} verificationToken - Verification token
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send specialist verification email
   * await mailService.sendSpecialistVerification(specialistData, 'verification-token-123');
   */
  async sendSpecialistVerification(specialist, verificationToken) {
    try {
      const template = emailTemplates.specialistVerification(specialist, verificationToken)
      return await sendMails({
        to: specialist.email,
        subject: 'Specialist Verification - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending specialist verification email:', error)
      throw error
    }
  },

  /**
   * Sends a specialist status update email
   * 
   * @param {Object} specialist - Specialist data
   * @param {string} newStatus - New status
   * @param {string} reason - Reason for status change
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send status update email
   * await mailService.sendStatusUpdate(specialistData, 'active', 'Profile completed');
   */
  async sendStatusUpdate(specialist, newStatus, reason) {
    try {
      const template = emailTemplates.specialistStatusUpdate(specialist, newStatus, reason)
      return await sendMails({
        to: specialist.email,
        subject: 'Status Update - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending status update email:', error)
      throw error
    }
  },

  /**
   * Sends a specialist profile update notification email
   * 
   * @param {Object} specialist - Specialist data
   * @param {Object} changes - Profile changes
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send profile update notification
   * await mailService.sendProfileUpdate(specialistData, { specialties: ['New Specialty'] });
   */
  async sendProfileUpdate(specialist, changes) {
    try {
      const template = emailTemplates.specialistProfileUpdate(specialist, changes)
      return await sendMails({
        to: specialist.email,
        subject: 'Profile Updated - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending profile update email:', error)
      throw error
    }
  },

  /**
   * Sends a specialist onboarding completion email
   * 
   * @param {Object} specialist - Specialist data
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send onboarding completion email
   * await mailService.sendOnboardingComplete(specialistData);
   */
  async sendOnboardingComplete(specialist) {
    try {
      const template = emailTemplates.specialistOnboardingComplete(specialist)
      return await sendMails({
        to: specialist.email,
        subject: 'Onboarding Complete - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending onboarding completion email:', error)
      throw error
    }
  },

  /**
   * Sends a specialist account suspension email
   * 
   * @param {Object} specialist - Specialist data
   * @param {string} reason - Suspension reason
   * @param {string} duration - Suspension duration
   * @returns {Promise<Object>} Send result
   * 
   * @example
   * // Send account suspension email
   * await mailService.sendAccountSuspended(specialistData, 'Policy violation', '30 days');
   */
  async sendAccountSuspended(specialist, reason, duration) {
    try {
      const template = emailTemplates.specialistAccountSuspended(specialist, reason, duration)
      return await sendMails({
        to: specialist.email,
        subject: 'Account Suspended - Hablaqui',
        html: template
      })
    } catch (error) {
      logError('Error sending account suspension email:', error)
      throw error
    }
  },
}

export default Object.freeze(mailService)
