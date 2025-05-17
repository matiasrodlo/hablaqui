/**
 * Email Management Utilities
 * 
 * This module provides utility functions for managing email notifications,
 * including session reminders, payment reminders, and subscription renewal notifications.
 * 
 * @module utils/functions/emailFunction
 */

'use strict'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Email from '../../models/email'

// Configure dayjs with required plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Creates email reminders for an upcoming session
 * Creates separate reminders for both user and specialist
 * 
 * @param {Object} payload - Session information
 * @param {string} payload.date - Session date in MM/DD/YYYY HH:mm format
 * @param {Object} user - User information
 * @param {Object} spec - Specialist information
 * @param {Object} sessions - Session document
 * @param {string} roomsUrl - URL for the session room
 * @param {string} idPlan - Plan ID for the session
 * 
 * @example
 * // Create session reminders
 * await createReminder(
 *   { date: '03/20/2024 14:30' },
 *   userData,
 *   specialistData,
 *   sessionData,
 *   'https://rooms.example.com/123',
 *   'plan123'
 * );
 */
export const createReminder = async (
  payload,
  user,
  spec,
  sessions,
  roomsUrl,
  idPlan
) => {
  // Se filtra el plan para obtener el id de la ultima sesion
  const planFiltered = sessions.plan.filter(plan => plan._id == idPlan)[0]

  const idSessionUltimate =
    planFiltered.session[sessions.plan[0].session.length - 1]._id
  // Email scheduling for appointment reminder for the user
  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-user-hour',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })
  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-user-day',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })
  // Email scheduling for appointment reminder for the spec
  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-spec-hour',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })
  await Email.create({
    sessionDate: dayjs
      .tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
      .format(),
    wasScheduled: false,
    type: 'reminder-spec-day',
    queuedAt: undefined,
    scheduledAt: undefined,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: idSessionUltimate,
    url: roomsUrl,
  })
}

/**
 * Creates payment reminder emails for a session
 * Creates hourly, daily, and weekly promotional reminders
 * 
 * @param {Object} user - User information
 * @param {Object} spec - Specialist information
 * @param {Object} sessions - Session document
 * 
 * @example
 * // Create payment reminders
 * await createPaymentReminder(userData, specialistData, sessionData);
 */
export const createPaymentReminder = async (user, spec, sessions) => {
  await Email.create({
    wasScheduled: false,
    type: 'reminder-payment-hour',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
  await Email.create({
    wasScheduled: false,
    type: 'reminder-payment-day',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
  await Email.create({
    wasScheduled: false,
    type: 'promocional-incentive-week',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
}

/**
 * Creates subscription renewal reminder emails
 * Creates hourly, daily, and weekly renewal reminders
 * 
 * @param {Object} user - User information
 * @param {Object} spec - Specialist information
 * @param {Object} sessions - Session document
 * 
 * @example
 * // Create renewal reminders
 * await createRenewalSubscription(userData, specialistData, sessionData);
 */
export const createRenewalSubscription = async (user, spec, sessions) => {
  await Email.create({
    wasScheduled: false,
    type: 'reminder-renewal-subscription-1-hour',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
  await Email.create({
    wasScheduled: false,
    type: 'reminder-renewal-subscription-1-day',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
  await Email.create({
    wasScheduled: false,
    type: 'reminder-renewal-subscription-1-week',
    queuedAt: null,
    scheduledAt: null,
    userRef: user._id,
    specRef: spec._id,
    sessionRef: sessions._id,
  })
}

/**
 * Deletes payment reminder emails for a user and specialist
 * 
 * @param {string} user - User ID
 * @param {string} spec - Specialist ID
 * 
 * @example
 * // Delete payment reminders
 * await deleteReminderPayment('user123', 'specialist456');
 */
export const deleteReminderPayment = async (user, spec) => {
  // Busca los correos de recordatorio de pago y los elimina
  const mailsToDeleted = await Email.find({
    wasScheduled: false,
    type: {
      $in: [
        'reminder-payment-hour',
        'reminder-payment-day',
        'promocional-incentive-week',
      ],
    },
    userRef: user,
    specRef: spec,
  })
  if (mailsToDeleted.length) {
    mailsToDeleted.forEach(async mail => {
      await Email.findByIdAndDelete(mail._id).catch(err => console.log(err))
    })
  }
}

/**
 * Deletes subscription renewal reminder emails for a user and specialist
 * 
 * @param {string} user - User ID
 * @param {string} spec - Specialist ID
 * 
 * @example
 * // Delete renewal reminders
 * await deleteRenewalEmails('user123', 'specialist456');
 */
export const deleteRenewalEmails = async (user, spec) => {
  // Busca los correos de recordatorio de pago y los elimina
  const mailsToDeleted = await Email.find({
    wasScheduled: false,
    type: {
      $in: [
        'reminder-renewal-subscription-1-hour',
        'reminder-renewal-subscription-1-day',
        'reminder-renewal-subscription-1-week',
      ],
    },
    userRef: user,
    specRef: spec,
  })
  if (mailsToDeleted.length) {
    mailsToDeleted.forEach(async mail => {
      await Email.findByIdAndDelete(mail._id).catch(err => console.log(err))
    })
  }
}
