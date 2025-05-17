/**
 * Email Reminder Service
 * 
 * This module provides email reminder functionality for the Hablaquí platform,
 * including session reminders, chat notifications, and payment reminders.
 * It uses SendGrid templates for consistent email formatting.
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
   * @param {Object} specialist - Specialist information
   * @param {string} batch - SendGrid batch ID
   * 
   * @example
   * // Send chat notification to user
   * await mailService.sendChatNotificationToUser(userData, specialistData, 'batch123');
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
   * @param {Object} specialist - Specialist information
   * @param {string} batch - SendGrid batch ID
   * 
   * @example
   * // Send chat notification to specialist
   * await mailService.sendChatNotificationToSpec(userData, specialistData, 'batch123');
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
   * @param {Object} spec - Specialist information
   * 
   * @example
   * // Send cancellation notification
   * await mailService.sendCancelSessionUser(userData, specialistData);
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
   * 
   * @example
   * // Send commitment cancellation
   * await mailService.sendCancelCommitment(specialistData);
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
   * 
   * @example
   * // Send custom session commitment
   * await mailService.sendCustomSessionCommitment(specialistData);
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
   * @param {Object} spec - Specialist information
   * @param {string} sessionDate - Session date and time
   * @param {string} batch - SendGrid batch ID
   * @param {string} mailType - Type of reminder ('hour' or 'day')
   * @param {string} urlRooms - URL for the session room
   * 
   * @example
   * // Send hourly reminder
   * await mailService.sendReminderUser(
   *   userData,
   *   specialistData,
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
      templateId: 'd-3ab0f381fc2f4a579165cc6c36ed8586',
      dynamicTemplateData: {
        user_first_name: name,
        psy_first_name: spec.name,
        psy_last_name: spec.lastName,
        date: dayjs.tz(sessionDate).format('DD/MM/YYYY'),
        hour: dayjs.tz(sessionDate).format('HH:mm'),
        url_rooms: urlRooms,
      },
      asm: {
        group_id: 16321,
      },
      batchId: batch,
    }
    if (mailType === 'day') {
      dataPayload.subject = 'Mañana es su sesión en Hablaquí'
      dataPayload.templateId = 'd-cb455abcd59a4553a1fa3a16770dbdc6'
    }
    await sendMails(dataPayload)
  },
  /**
   * Sends a session reminder to a specialist
   * Can be sent either an hour before or a day before the session
   * 
   * @param {Object} user - User information
   * @param {Object} spec - Specialist information
   * @param {string} sessionDate - Session date and time
   * @param {string} batch - SendGrid batch ID
   * @param {string} mailType - Type of reminder ('hour' or 'day')
   * @param {string} urlRooms - URL for the session room
   * 
   * @example
   * // Send hourly reminder
   * await mailService.sendReminderSpec(
   *   userData,
   *   specialistData,
   *   '2024-03-20 14:30',
   *   'batch123',
   *   'hour',
   *   'https://rooms.example.com/123'
   * );
   */
  async sendReminderSpec(user, spec, sessionDate, batch, mailType, urlRooms) {
    const { email, name } = spec
    const dataPayload = {
      from: 'Hablaquí <recordatorios-especialistas@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: `Su sesión con ${user.name} en Hablaquí está por comenzar`,
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-3b8cc80917614591b078cf83d3ec3bc9',
      dynamicTemplateData: {
        psy_first_name: name,
        user_first_name: user.name,
        date: dayjs.tz(sessionDate).format('DD/MM/YYYY'),
        hour: dayjs.tz(sessionDate).format('HH:mm'),
        url_rooms: urlRooms,
      },
      asm: {
        group_id: 16321,
      },
      batchId: batch,
    }
    if (mailType === 'day') {
      dataPayload.subject = 'Mañana es su sesión en Hablaquí'
      dataPayload.templateId = 'd-cb455abcd59a4553a1fa3a16770dbdc6'
    }
    await sendMails(dataPayload)
  },
  /**
   * Sends a promotional incentive email to a user
   * Notifies about special offers and discounts
   * 
   * @param {Object} user - User information
   * @param {string} coupon - Discount coupon code
   * 
   * @example
   * // Send promotional incentive
   * await mailService.sendPromocionalIncentive(userData, 'WELCOME50');
   */
  async sendPromocionalIncentive(user, coupon) {
    const dataPayload = {
      from: 'Hablaquí <promociones@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: '¡Tienes un descuento especial en Hablaquí!',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-3e3f90ac1108463dbb2abbbef767625c',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        coupon,
        landing_url,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * Sends a payment reminder email to a user
   * Notifies about upcoming or overdue payments
   * 
   * @param {Object} user - User information
   * @param {Object} specialist - Specialist information
   * @param {string} price - Payment amount
   * @param {string} url - Payment page URL
   * 
   * @example
   * // Send payment reminder
   * await mailService.sendPaymentDay(
   *   userData,
   *   specialistData,
   *   '$50000',
   *   'https://payment.example.com/123'
   * );
   */
  async sendPaymentDay(user, specialist, price, url) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Recordatorio de pago en Hablaquí',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-3e3f90ac1108463dbb2abbbef767625c',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
        price,
        url,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * Sends a subscription renewal reminder email to a user
   * Notifies 1 hour before subscription expiration
   * 
   * @param {Object} user - User information
   * @param {Object} specialist - Specialist information
   * @param {string} expiracion - Expiration date and time
   * 
   * @example
   * // Send hourly renewal reminder
   * await mailService.reminderRenewalSubscription1hour(
   *   userData,
   *   specialistData,
   *   '2024-03-20 14:30'
   * );
   */
  async reminderRenewalSubscription1hour(user, specialist, expiracion) {
    const dataPayload = {
      from: 'Hablaquí <renovaciones@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Tu suscripción en Hablaquí está por vencer',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-3e3f90ac1108463dbb2abbbef767625c',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
        expiracion: dayjs.tz(expiracion).format('DD/MM/YYYY HH:mm'),
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * Sends a subscription renewal reminder email to a user
   * Notifies 1 day before subscription expiration
   * 
   * @param {Object} user - User information
   * @param {Object} specialist - Specialist information
   * @param {string} expiracion - Expiration date and time
   * 
   * @example
   * // Send daily renewal reminder
   * await mailService.reminderRenewalSubscription1day(
   *   userData,
   *   specialistData,
   *   '2024-03-20 14:30'
   * );
   */
  async reminderRenewalSubscription1day(user, specialist, expiracion) {
    const dataPayload = {
      from: 'Hablaquí <renovaciones@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Tu suscripción en Hablaquí vence mañana',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-3e3f90ac1108463dbb2abbbef767625c',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        psy_name: specialist.name,
        expiracion: dayjs.tz(expiracion).format('DD/MM/YYYY HH:mm'),
      },
    }
    await sendMails(dataPayload)
  },
}

export default Object.freeze(mailService)
