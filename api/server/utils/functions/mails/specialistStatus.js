/**
 * Specialist Status Email Service
 * 
 * This module provides email notification functionality for specialist-related events
 * in the Hablaquí platform, including recruitment, evaluations, payments, and withdrawals.
 * It uses SendGrid templates for consistent email formatting.
 * 
 * @module utils/functions/mails/specialistStatus
 */

'use strict'

import sendMails from './sendMails'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

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
   * @param {Object} spec - Specialist information
   * 
   * @example
   * // Send evaluation request
   * await mailService.sendEnabledEvaluation(userData, specialistData);
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
   * @param {Object} spec - Specialist information (duplicate for template compatibility)
   * @param {string} amount - Plan payment amount
   * @param {string} url - Payment page URL
   * 
   * @example
   * // Send payment reminder
   * await mailService.pendingPlanPayment(
   *   specialistData,
   *   specialistData,
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
   * @param {string} total - Withdrawal amount
   * @param {string} date - Withdrawal request date
   * 
   * @example
   * // Send withdrawal request confirmation
   * await mailService.sendPaymentRequest(
   *   specialistData,
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
   * @param {string} total - Withdrawal amount
   * @param {string} date - Withdrawal completion date
   * 
   * @example
   * // Send withdrawal completion notification
   * await mailService.sendCompletePaymentRequest(
   *   specialistData,
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
   * @param {Object} spec - Specialist information
   * 
   * @example
   * // Send evaluation completion confirmation
   * await mailService.sendAddEvaluation(userData, specialistData);
   */
  async sendAddEvaluation(user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: '¡Has completado una evaluación!',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-451461690169414ba91a86ee4c439c2a',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        user_name: user.name,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a new evaluation notification email to a specialist
   * Notifies when they have received a new evaluation
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * 
   * @example
   * // Send new evaluation notification
   * await mailService.sendApproveEvaluationToSpec(userData, specialistData);
   */
  async sendApproveEvaluationToSpec(user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Ha recibido una nueva evaluación',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-39a41d2dc58e4e35a5674cf03a2cb86e',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        user_name: user.name,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends an evaluation rejection notification email to a specialist
   * Notifies when their evaluation has been rejected
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * 
   * @example
   * // Send evaluation rejection notification
   * await mailService.sendRefuseEvaluation(userData, specialistData);
   */
  async sendRefuseEvaluation(user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Se ha rechazado tu evaluación',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-c88421c7ff9e4165b883255b9a35a701',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        user_name: user.name,
      },
    }
    await sendMails(dataPayload)
  },
}

export default Object.freeze(mailService)
