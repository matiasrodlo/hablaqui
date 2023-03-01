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
   * @description Send a welcome email to a new user using the mailgun API with the template 'welcome-new-user'
   * @param {Object} user - A User object from the database, corresponding to a new client
   */
  async sendWelcomeNewUser(user) {
    const { email, name } = user
    const dataPayload = {
      from: 'Hablaquí <bienvenida@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Bienvenido/a a Hablaquí',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-0c5ca742f0df44b48f445bdedf6f85a8',
      dynamicTemplateData: {
        user_first_name: name,
      },
      asm: {
        group_id: 16321,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send a welcome email to a new specialist using the mailgun API with the template 'welcome-new-spec'
   * @param {Object} user - A User object from the database, corresponding to the new specialist
   */
  async sendWelcomeNewSpecialist(user) {
    const { email, name } = user
    const dataPayload = {
      from:
        'Hablaquí para Especialistas <bienvenida-especialistas@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Enhorabuena, hemos aprobado a su cuenta',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-78caf64c2f9340a39abd4d5af7d4a0f6',
      dynamicTemplateData: {
        first_name: name,
      },
      asm: {
        group_id: 16321,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send a welcome email to a new  user created by a specialist
   * @param {Object} spec - A User object from the database, corresponding to the specialist
   * @param {Object} newUser -  A User object from the database, corresponding to the specialist
   * @param {String} pass - Password to login
   */
  async sendGuestNewUser(spec, newUser, pass) {
    const { name, email } = newUser
    const dataPayload = {
      from: 'Hablaquí <invitaciones@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Ha sido invitado a Hablaquí por su especialista',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-785749c477ff43e0bdd8b5a8fe9ec17e',
      dynamicTemplateData: {
        name,
        email,
        password: pass,
        psy_first_name: spec.name,
        psy_last_name: spec.lastName,
      },
      asm: {
        group_id: 16321,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send a recovery password email to a user
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {String} url - URL to password recovery
   */
  async sendPasswordRecovery(user, url) {
    const { email, name } = user
    const dataPayload = {
      from: 'Hablaquí <recuperacion@mail.hablaqui.cl>',
      to: name + '<' + email + '>',
      subject: 'Recupera tu contraseña de Hablaquí',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-f025d6b8c63a4567897817ecd8f31aee',
      dynamicTemplateData: {
        url,
      },
      asm: {
        group_id: 16321,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send a verification email to a new user created
   * @param {Object} user - A User object from the database, corresponding to the client
   * @param {String} url - URL to verify account
   */
  async sendVerifyEmail(user, url) {
    const dataPayload = {
      from: 'Hablaquí <verificacion@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Verificación de cuenta de Hablaquí',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-8e397d37317c403ea7bb53cbbadac30a',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name,
        verify_url: url,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Send an email to support to notify that a specialist has uploaded a photo.
   * @param {Object} spec - A User object from the database, corresponding to the specialist
   */
  async sendUploadPicture(spec) {
    const dataPayload = {
      from: 'Hablaquí <notifiaciones@mail.hablaqui.cl>',
      to: 'Hablaquí <soporte@hablaqui.cl>',
      subject: '[Internal] Nueva fotografía de especialista',
      templateId: 'd-d0ad663db5c64f0f965d5aeab027a7aa',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        psy_name: spec.name + ' ' + spec.lastName,
        psy_email: spec.email,
      },
    }
    await sendMails(dataPayload)
  },
  /**
   * @description Sends an email to the user who has cancelled his plan
   * @param {Object} user - A User object from the database, corresponding to the specialist
   * @param {Object} spec - A User object from the database, corresponding to the specialist
   * @param {String} coupon - Coupon code
   */
  async sendChangeSpeccologistToUser(user, spec, coupon) {
    const dataPayload = {
      from: 'Hablaquí <pagos@mail.hablaqui.cl>',
      to: user.name + '<' + user.email + '>',
      subject: 'Has cancelado tu plan',
      reply_to: 'Hablaquí <soporte@hablaqui.cl>',
      templateId: 'd-efbfc3aba77142fcaf1a24f693d71429',
      asm: {
        group_id: 16321,
      },
      dynamicTemplateData: {
        user_name: user.name + ' ' + (user.lastName ? user.lastName : ''),
        psy_name: spec.name,
        code: coupon.code,
        amount: coupon.discount,
        expiration_date: dayjs(coupon.expiration).format('DD/MM/YYYY'),
      },
    }
    await sendMails(dataPayload)
  },
}

export default Object.freeze(mailService)
