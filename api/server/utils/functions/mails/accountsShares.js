/**
 * Account Shares Email Service
 * 
 * This module provides email notification functionality for account-related events
 * in the Hablaquí platform, including welcome emails, password recovery, email verification,
 * and account changes. It uses SendGrid templates for consistent email formatting.
 * 
 * @module utils/functions/mails/accountsShares
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
 * Account shares email service object containing methods for sending account-related notifications
 * 
 * @namespace mailService
 */
const mailService = {
  /**
   * Sends a welcome email to a new user
   * Notifies when a new user account is created
   * 
   * @param {Object} user - User information
   * @param {string} user.email - User's email address
   * @param {string} user.name - User's first name
   * 
   * @example
   * // Send welcome email to new user
   * await mailService.sendWelcomeNewUser({
   *   email: 'user@example.com',
   *   name: 'John'
   * });
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
   * Sends a welcome email to a new specialist
   * Notifies when a specialist's account is approved
   * 
   * @param {Object} user - Specialist information
   * @param {string} user.email - Specialist's email address
   * @param {string} user.name - Specialist's first name
   * 
   * @example
   * // Send welcome email to new specialist
   * await mailService.sendWelcomeNewSpecialist({
   *   email: 'specialist@example.com',
   *   name: 'Dr. Smith'
   * });
   */
  async sendWelcomeNewSpecialist(user) {
    const { email, name } = user
    const dataPayload = {
      from: 'Hablaquí para Especialistas <bienvenida-especialistas@mail.hablaqui.cl>',
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
   * Sends a welcome email to a new user created by a specialist
   * Notifies when a specialist invites a new user
   * 
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} spec.lastName - Specialist's last name
   * @param {Object} newUser - New user information
   * @param {string} newUser.name - User's first name
   * @param {string} newUser.email - User's email address
   * @param {string} pass - Temporary password for the new user
   * 
   * @example
   * // Send welcome email to invited user
   * await mailService.sendGuestNewUser(
   *   { name: 'Dr. Smith', lastName: 'Jones' },
   *   { name: 'John', email: 'john@example.com' },
   *   'temporary123'
   * );
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
   * Sends a password recovery email to a user
   * Notifies when a user requests password recovery
   * 
   * @param {Object} user - User information
   * @param {string} user.email - User's email address
   * @param {string} user.name - User's first name
   * @param {string} url - Password recovery URL
   * 
   * @example
   * // Send password recovery email
   * await mailService.sendPasswordRecovery(
   *   { email: 'user@example.com', name: 'John' },
   *   'https://recovery.example.com/token123'
   * );
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
   * Sends an email verification email to a new user
   * Notifies when a new user needs to verify their email
   * 
   * @param {Object} user - User information
   * @param {string} user.email - User's email address
   * @param {string} user.name - User's first name
   * @param {string} url - Email verification URL
   * 
   * @example
   * // Send email verification
   * await mailService.sendVerifyEmail(
   *   { email: 'user@example.com', name: 'John' },
   *   'https://verify.example.com/token123'
   * );
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
   * Sends an internal notification about a specialist's photo upload
   * Notifies support team when a specialist uploads a new photo
   * 
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {string} spec.lastName - Specialist's last name
   * @param {string} spec.email - Specialist's email address
   * 
   * @example
   * // Send photo upload notification
   * await mailService.sendUploadPicture({
   *   name: 'Dr. Smith',
   *   lastName: 'Jones',
   *   email: 'smith@example.com'
   * });
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
   * Sends a plan cancellation notification to a user
   * Notifies when a user cancels their plan
   * 
   * @param {Object} user - User information
   * @param {string} user.name - User's first name
   * @param {string} user.lastName - User's last name (optional)
   * @param {string} user.email - User's email address
   * @param {Object} spec - Specialist information
   * @param {string} spec.name - Specialist's first name
   * @param {Object} coupon - Coupon information
   * @param {string} coupon.code - Coupon code
   * @param {string} coupon.discount - Discount amount
   * @param {Date} coupon.expiration - Coupon expiration date
   * 
   * @example
   * // Send plan cancellation notification
   * await mailService.sendChangeSpeccologistToUser(
   *   { name: 'John', lastName: 'Doe', email: 'john@example.com' },
   *   { name: 'Dr. Smith' },
   *   { code: 'WELCOME20', discount: '20%', expiration: new Date('2024-12-31') }
   * );
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
