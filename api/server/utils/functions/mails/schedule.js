/**
 * Schedule Email Service
 * 
 * This module provides email notification functionality for scheduling-related events
 * in the Hablaquí platform, including appointment confirmations, rescheduling notifications,
 * and session scheduling updates. It uses SendGrid templates for consistent email formatting.
 * 
 * @module utils/functions/mails/schedule
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
 * Schedule email service object containing methods for sending scheduling-related notifications
 * 
 * @namespace mailService
 */
const mailService = {
  /**
   * Sends a subscription confirmation email to a user
   * Notifies when a user has purchased a new plan
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {string} price - Plan price
   * 
   * @example
   * // Send subscription confirmation
   * await mailService.sendAppConfirmationUser(userData, specialistData, '$50000');
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
   * Sends a new plan notification email to a specialist
   * Notifies when a user has purchased a new plan
   * 
   * @param {Object} spec - Specialist information
   * @param {Object} user - User information
   * @param {string} price - Plan price
   * 
   * @example
   * // Send new plan notification
   * await mailService.sendAppConfirmationSpec(specialistData, userData, '$50000');
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
   * Sends a custom session notification email to a user
   * Notifies when a specialist has scheduled a session
   * 
   * @param {Object} user - User information
   * @param {Object} specialist - Specialist information
   * @param {string} paymentURL - Payment page URL
   * @param {string} date - Session date and time
   * @param {string} value - Session value
   * @param {string} type - Session type
   * 
   * @example
   * // Send custom session notification
   * await mailService.sendCustomSessionToUser(
   *   userData,
   *   specialistData,
   *   'https://payment.example.com/123',
   *   '2024-03-20 14:30',
   *   '$50000',
   *   'online'
   * );
   */
  async sendCustomSessionToUser(user, specialist, paymentURL, date, value, type) {
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
   * Sends a custom session notification email to a specialist
   * Notifies when a user has scheduled a session
   * 
   * @param {Object} user - User information
   * @param {Object} specialist - Specialist information
   * @param {string} paymentURL - Payment page URL
   * @param {string} date - Session date and time
   * @param {string} value - Session value
   * @param {string} type - Session type
   * 
   * @example
   * // Send custom session notification
   * await mailService.sendCustomSessionToSpec(
   *   userData,
   *   specialistData,
   *   'https://payment.example.com/123',
   *   '2024-03-20 14:30',
   *   '$50000',
   *   'online'
   * );
   */
  async sendCustomSessionToSpec(user, specialist, paymentURL, date, value, type) {
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
   * Sends a rescheduling confirmation email to a user
   * Notifies when a session has been successfully rescheduled
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {Object} sessionDate - Session date information
   * @param {string} sessionDate.date - Session date
   * @param {string} sessionDate.hour - Session hour
   * 
   * @example
   * // Send rescheduling confirmation
   * await mailService.sendRescheduleToUser(
   *   userData,
   *   specialistData,
   *   { date: '2024-03-20', hour: '14:30' }
   * );
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
   * Sends a rescheduling notification email to a specialist
   * Notifies when a user has rescheduled a session
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {Object} sessionDate - Session date information
   * @param {string} sessionDate.date - Session date
   * @param {string} sessionDate.hour - Session hour
   * @param {string} url - Payment page URL
   * 
   * @example
   * // Send rescheduling notification
   * await mailService.sendRescheduleToSpec(
   *   userData,
   *   specialistData,
   *   { date: '2024-03-20', hour: '14:30' },
   *   'https://payment.example.com/123'
   * );
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
   * Sends a rescheduling request notification email to a specialist
   * Notifies when a user has requested to reschedule a session
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * 
   * @example
   * // Send rescheduling request
   * await mailService.sendCancelSessionSpec(userData, specialistData);
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
   * Sends a specialist-initiated rescheduling notification email to a user
   * Notifies when a specialist has rescheduled a session
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {Object} sessionDate - Session date information
   * @param {string} sessionDate.date - Session date
   * @param {string} sessionDate.hour - Session hour
   * @param {string} url - Session page URL
   * 
   * @example
   * // Send specialist rescheduling notification
   * await mailService.sendRescheduleToUserBySpec(
   *   userData,
   *   specialistData,
   *   { date: '2024-03-20', hour: '14:30' },
   *   'https://session.example.com/123'
   * );
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
   * Sends a specialist-initiated rescheduling notification email to a specialist
   * Notifies when a specialist has rescheduled their own session
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {Object} sessionDate - Session date information
   * @param {string} sessionDate.date - Session date
   * @param {string} sessionDate.hour - Session hour
   * @param {string} url - Session page URL
   * 
   * @example
   * // Send specialist self-rescheduling notification
   * await mailService.sendRescheduleToSpecBySpec(
   *   userData,
   *   specialistData,
   *   { date: '2024-03-20', hour: '14:30' },
   *   'https://session.example.com/123'
   * );
   */
  async sendRescheduleToSpecBySpec(user, spec, sessionDate, url) {
    const dataPayload = {
      from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Has reprogramado una sesión',
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
   * Sends a session scheduling notification email to a specialist
   * Notifies when a new session has been scheduled
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {string} date - Session date
   * @param {string} url - Session page URL
   * @param {Object} session - Session information
   * 
   * @example
   * // Send session scheduling notification
   * await mailService.sendScheduleToSpec(
   *   userData,
   *   specialistData,
   *   '2024-03-20',
   *   'https://session.example.com/123',
   *   sessionData
   * );
   */
  async sendScheduleToSpec(user, spec, date, url, session) {
    const dataPayload = {
      from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
      to: spec.name + '<' + spec.email + '>',
      subject: 'Han agendado una sesión con usted',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-2d162b2b082b4b21851d6e0be428e64f',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        date,
        hour: session.hour,
        psy_name: spec.name,
        url,
      },
    }
    await sendMails(dataPayload)
  },

  /**
   * Sends a session scheduling notification email to a user
   * Notifies when a new session has been scheduled
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {string} date - Session date
   * @param {string} url - Session page URL
   * @param {Object} session - Session information
   * 
   * @example
   * // Send session scheduling notification
   * await mailService.sendScheduleToUser(
   *   userData,
   *   specialistData,
   *   '2024-03-20',
   *   'https://session.example.com/123',
   *   sessionData
   * );
   */
  async sendScheduleToUser(user, spec, date, url, session) {
    const dataPayload = {
      from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Su sesión ha sido agendada exitosamente',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-f57ecb113d6d48a684203ebb82782976',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        date,
        hour: session.hour,
        psy_name: spec.name + ' ' + spec.lastName,
        url,
      },
    }
    await sendMails(dataPayload)
  },
}

export default Object.freeze(mailService)
