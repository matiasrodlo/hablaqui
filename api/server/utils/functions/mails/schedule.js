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
   * @description Send an appointmet purchase confirmation to a user
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {string} date - The date of the appointment
   */
  async sendAppConfirmationUser(user, spec, price) {
    const { email, name } = user
    const dataPayload = {
      from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Confirmación de subscripción',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-f57ecb113d6d48a684203ebb82782976',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: spec.name + ' ' + (spec.lastName ? spec.lastName : ''),
        user_first_name: name,
        price,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send an appointmet purchase confirmation to a spec
   * @param {Object} spec - A Specialist object from the database, corresponding to the specialist attending the user
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {string} date - The date of the appointment
   */
  async sendAppConfirmationSpec(spec, user, price) {
    const nameUser = user.name
    const lastNameUser = user.lastName
    const { email, name } = spec
    const dataPayload = {
      from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Han contratado un nuevo plan con usted',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-2d162b2b082b4b21851d6e0be428e64f',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_first_name: nameUser,
        user_last_name: lastNameUser,
        psy_first_name: name,
        price,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Sends an email to the user notifying them that a specialist has scheduled a session with them.
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {Object} specialist - A Specialist object from the database, corresponding to the specialist attending the user
   * @param {String} paymentURL - The URL to the payment page
   * @param {String} date - The date of the appointment
   * @param {String} value - The value of the appointment
   * @param {String} type - The type of appointment
   */
  async sendCustomSessionToUser(
    user,
    specialist,
    paymentURL,
    date,
    value,
    type
  ) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: `${specialist.name} agendó una sesión usted en Hablaquí`,
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-2fc1f3015bb844caab2a725dd3167892',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
        payment_url: paymentURL,
        value,
        type,
        date: dayjs(date, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY'),
        hour: dayjs(date, 'MM/DD/YYYY HH:mm').format('HH:mm'),
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Sends an email to the specialist notifying them that a user has scheduled a session with them.
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {Object} specialist - A Specialist object from the database, corresponding to the specialist attending the user
   * @param {String} paymentURL - The URL to the payment page
   * @param {String} date - The date of the appointment
   * @param {String} value - The value of the appointment
   * @param {String} type - The type of appointment
   */
  async sendCustomSessionToSpec(
    user,
    specialist,
    paymentURL,
    date,
    value,
    type
  ) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: specialist.name + '<' + specialist.email + '>',
      subject: `Ha creado un agendamiento con ${user.name}`,
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-e935d9d8e9d8406581f909863491e41d',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
        payment_url: paymentURL,
        value,
        type,
        date: dayjs(date, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY'),
        hour: dayjs(date, 'MM/DD/YYYY HH:mm').format('HH:mm'),
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Sends an email to the user notifying them that they have successfully rescheduled.
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {Object} spec - A Specialist object from the database, corresponding to the specialist attending the user
   * @param {String} sessionDate - The date of the appointment
   */
  async sendRescheduleToUser(user, spec, sessionDate) {
    const dataPayload = {
      from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Su sesión ha sido reagendada exitosamente',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-54f94040924645be93ccdb21c243e6c2',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        date: sessionDate.date,
        hour: sessionDate.hour,
        psy_name: spec.name + ' ' + spec.lastName,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Sends an email to the specialist notifying them that a user has rescheduled.
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {Object} spec - A Specialist object from the database, corresponding to the specialist attending the user
   * @param {String} sessionDate - The date of the appointment
   * @param {String} url - The URL to the payment page
   */
  async sendRescheduleToSpec(user, spec, sessionDate, url) {
    const dataPayload = {
      from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Han reprogramado una sesión con usted',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-b336c59aa9d74750b13414954f7daee0',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        date: sessionDate.date,
        hour: sessionDate.hour,
        psy_name: spec.name,
        url,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Sends an email to the user notifying them that they have requested a rescheduled session.
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {Object} spec - A Specialist object from the database, corresponding to the specialist attending the user
   */
  async sendCancelSessionSpec(user, spec) {
    const dataPayload = {
      from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Has pedido una reprogramación de una sesión',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-3e3f90ac1108463dbb2abbbef767625c',
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
   * @description Sends an email to the user notifying him/her that the specialist has rescheduled the session.
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {Object} spec - A Specialist object from the database, corresponding to the specialist attending the user
   * @param {String} sessionDate - The date of the appointment
   * @param {String} url - The URL to the appointment page
   */
  async sendRescheduleToUserBySpec(user, spec, sessionDate, url) {
    const dataPayload = {
      from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Tu especialista ha reprogramado tu sesión',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-98b3e79f152d4416aa0ed58a50c309d2',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        date: sessionDate.date,
        hour: sessionDate.hour,
        psy_name: spec.name + ' ' + spec.lastName,
        url,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send an email to the specialist notifying him/her that you have rescheduled the session.
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {Object} spec - A Specialist object from the database, corresponding to the specialist attending the user
   * @param {String} sessionDate - The date of the appointment
   * @param {String} url - The URL to the appointment page
   */
  async sendRescheduleToSpecBySpec(user, spec, sessionDate, url) {
    const dataPayload = {
      from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Has reprogramado la sesión',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-3e3f90ac1108463dbb2abbbef767625c',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        date: sessionDate.date,
        hour: sessionDate.hour,
        psy_name: spec.name,
        url,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Sends an email to the user notifying them that a user has scheduled a session.
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {Object} spec - A Specialist object from the database, corresponding to the specialist attending the user
   * @param {String} date - The date of the appointment
   * @param {String} url - The URL to the appointment page
   * @param {String} session - The session number
   */
  async sendScheduleToSpec(user, spec, date, url, session) {
    const nameUser = user.name
    const lastNameUser = user.lastName
    const { name } = spec
    const dataPayload = {
      from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Se ha agendado una sesión',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-2d64663ef57743bfb061130fb49e1625',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_first_name: nameUser,
        user_last_name: lastNameUser,
        psy_name: name,
        url,
        date: dayjs(date).format('DD/MM/YYYY'),
        hour: dayjs(date).format('HH:mm'),
        session,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Sends an email to the user notifying them that they have scheduled a session.
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {Object} spec - A Specialist object from the database, corresponding to the specialist attending the user
   * @param {Object} date - The date of the appointment
   * @param {String} url - The URL to the appointment page
   * @param {String} session - The session number
   */
  async sendScheduleToUser(user, spec, date, url, session) {
    const { email, name } = user
    const dataPayload = {
      from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Su sesión ha sido agendada',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-93dcae8eaa45480286f29e25d88d173d',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: spec.name + ' ' + (spec.lastName ? spec.lastName : ''),
        user_first_name: name,
        url,
        date: dayjs(date).format('DD/MM/YYYY'),
        hour: dayjs(date).format('HH:mm'),
        session,
      },
    }
    await sendMails(dataPayload)
  },
}

export default Object.freeze(mailService)
