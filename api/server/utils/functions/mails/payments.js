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
   * @description Sends an email to the user who has paid for the session.
   * @param {Object} user - A User object from the database, corresponding to the user who has paid for the session.
   * @param {Object} spec - A User object from the database, corresponding to the specialist who has received the payment.
   * @param {String} paid - A ID of the payment.
   * @param {String} roomsUrl - A string that contains the URL of the room where the session will take place.
   * @param {String} date - A string that contains the date of the session.
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
   * @description Sends an email to the specialist who has received the payment.
   * @param {Object} user - A User object from the database, corresponding to the user who has paid for the session.
   * @param {Object} spec - A User object from the database, corresponding to the specialist who has received the payment.
   * @param {String} paid - A ID of the payment.
   * @param {String} roomsUrl - A string that contains the URL of the room where the session will take place.
   * @param {String} date - A string that contains the date of the session.
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
   * @description Sends an email to the specialist who has updated the payment account.
   * @param {Object} specialist - A User object from the database, corresponding to the specialist who has updated the payment account.
   * @param {String} period - A string that contains the period of the payment account.
   * @param {String} price - A string that contains the price of the payment account.
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
}

export default Object.freeze(mailService)
