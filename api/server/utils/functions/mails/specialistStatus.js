'use strict'

import sendMails from './sendMails'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

const mailService = {
  /**
   * @description Send an internal email about a new spec application
   * @param {Object} recruitedSpec - A specialist object from the database, corresponding to recruited specialist
   */
  async sendRecruitmentConfirmationAdmin (recruitedSpec) {
    const { name, lastName, email } = recruitedSpec
    const dataPayload = {
      from: 'Hablaquí <internal@mail.hablaqui.cl>',
      to: 'direccion@hablaqui.com',
      subject: '[Internal] Nueva postulación de especialista',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-8ee906349e144427ad0103a31507541a',
      asm: {
        group_id: 16321
      },
      dynamicTemplateData: {
        psy_first_name: name,
        psy_last_name: lastName,
        psy_email: email
      }
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send an email to a specialist about his/her new application
   * @param {Object} recruitedSpec - A specialist object from the database, corresponding to recruited specialist
   */
  async sendRecruitmentConfirmation (recruitedSpec) {
    const { email, name } = recruitedSpec
    const dataPayload = {
      from: 'Hablaquí <reclutamiento@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Gracias por registrarse, acceda a su cuenta',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-d40470d41a3842ac9108bcdb6ac70022',
      asm: {
        group_id: 16321
      },
      dynamicTemplateData: {
        first_name: name
      }
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send an email to the user to evaluate the specialist.
   * @param {Object} user - A user object from the database, corresponding to the user that will evaluate the specialist
   * @param {Object} spec - A specialist object from the database, corresponding to the specialist that will be evaluated
   */
  async sendEnabledEvaluation (user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Evaluación de experiencia en Hablaquí',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-39a4dae7572448e08a7f0b8e9cc4adbd',
      asm: {
        group_id: 16321
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        psy_name: spec.name
      }
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send an email to the specialist who must pay the plan.
   * @param {Object} user - A user object from the database, corresponding to the specialist who must pay the plan
   * @param {Object} spec - A specialist object from the database, corresponding to the specialist who must pay the plan
   * @param {String} amount - The amount of the plan
   * @param {String} url - The url to pay the plan
   */
  async pendingPlanPayment (user, spec, amount, url) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Subscripción pendiente el pago',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-a9b7fe9d08254e9b91d1cddbe399292c',
      asm: {
        group_id: 16321
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: spec.name + ' ' + (spec.lastName ? spec.lastName : ''),
        amount,
        url
      }
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send an email to the specialist informing him/her that you have made a request for withdrawal from the platform.
   * @param {Object} spec - A specialist object from the database, corresponding to the specialist who has made the withdrawal request
   * @param {String} total - The total amount of the withdrawal request
   * @param {String} date - The date of the withdrawal request
   */
  async sendPaymentRequest (spec, total, date) {
    const dataPayload = {
      from: 'Hablaquí <retiros@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: '¡Has realizado una solicitud de retiro!',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-1b7f3153b2e64beca579cf634bcd2b7c',
      asm: {
        group_id: 16321
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        total,
        date
      }
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send an email to the specialist informing him/her that the withdrawal request has been completed.
   * @param {Object} spec - A specialist object from the database, corresponding to the specialist who has made the withdrawal request
   * @param {String} total - The total amount of the withdrawal request
   * @param {String} date - The date of the withdrawal request
   */
  async sendCompletePaymentRequest (spec, total, date) {
    const dataPayload = {
      from: 'Hablaquí <retiros@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Transferencia de recaudación semanal',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-478ea4a5f440447db1d7ec9dc0361b55',
      asm: {
        group_id: 16321
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        total,
        date
      }
    }
    await sendMails(dataPayload)
  },
  /**
   * @description sends an email to the user who has completed an evaluation to a specialist.
   * @param {Object} user - A user object from the database, corresponding to the user who has completed an evaluation
   * @param {Object} spec - - A specialist object from the database, corresponding to the specialist who has been evaluated
   */
  async sendAddEvaluation (user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: '¡Has completado una evaluación!',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-451461690169414ba91a86ee4c439c2a',
      asm: {
        group_id: 16321
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        user_name: user.name
      }
    }
    await sendMails(dataPayload)
  },
  /**
   * @description sends an email to the specialist informing him/her that a user has passed an evaluation
   * @param {Object} user - A user object from the database, corresponding to the user who has passed an evaluation
   * @param {Object} spec - A specialist object from the database, corresponding to the specialist who has been evaluated
   */
  async sendApproveEvaluationToSpec (user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Ha recibido una nueva evaluación',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-39a41d2dc58e4e35a5674cf03a2cb86e',
      asm: {
        group_id: 16321
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        user_name: user.name
      }
    }
    await sendMails(dataPayload)
  },
  /**
   * @description send an email to the specialist who has refused an evaluation
   * @param {Object} user - A user object of the database, corresponding to the user who has made the evaluation
   * @param {Object} spec - A specialist object from the database, corresponding to the specialist who has been evaluated
   */
  async sendRefuseEvaluation (user, spec) {
    const dataPayload = {
      from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Se ha rechazado tu evaluación',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-c88421c7ff9e4165b883255b9a35a701',
      asm: {
        group_id: 16321
      },
      dynamicTemplateData: {
        psy_name: spec.name,
        user_name: user.name
      }
    }
    await sendMails(dataPayload)
  }
}

export default Object.freeze(mailService)
