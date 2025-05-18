/**
 * Email Sending Utility
 * 
 * This module provides core functionality for sending emails in the Hablaquí platform.
 * It handles email template rendering, sending, and error handling.
 * 
 * @module utils/functions/mails/sendMails
 */

import { logError } from '../../../config/pino'
import nodemailer from 'nodemailer'
import { emailTemplates } from './templates'

/**
 * Creates a nodemailer transporter for sending emails
 * 
 * @returns {Object} Configured nodemailer transporter
 * @private
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

/**
 * Sends an email using the configured transporter
 * 
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body in HTML format
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send a simple email
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome to Hablaqui',
 *   html: '<h1>Welcome!</h1>'
 * });
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter()
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...options
    })
    return info
  } catch (error) {
    logError('Error sending email:', error)
    throw error
  }
}

/**
 * Sends a template-based email
 * 
 * @param {string} templateName - Name of the email template to use
 * @param {Object} data - Data to be used in template rendering
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send a template email
 * await sendTemplateEmail('welcome', { name: 'John' }, 'user@example.com', 'Welcome!');
 */
const sendTemplateEmail = async (templateName, data, to, subject) => {
  try {
    const template = emailTemplates[templateName](data)
    return await sendEmail({
      to,
      subject,
      html: template
    })
  } catch (error) {
    logError('Error sending template email:', error)
    throw error
  }
}

/**
 * Sends a bulk email to multiple recipients
 * 
 * @param {string} templateName - Name of the email template to use
 * @param {Array<Object>} recipients - Array of recipient data objects
 * @param {string} subject - Email subject
 * @returns {Promise<Array>} Array of send results
 * 
 * @example
 * // Send bulk emails
 * await sendBulkEmail('newsletter', [
 *   { email: 'user1@example.com', name: 'John' },
 *   { email: 'user2@example.com', name: 'Jane' }
 * ], 'Newsletter');
 */
const sendBulkEmail = async (templateName, recipients, subject) => {
  try {
    const results = await Promise.all(
      recipients.map(recipient =>
        sendTemplateEmail(templateName, recipient, recipient.email, subject)
      )
    )
    return results
  } catch (error) {
    logError('Error sending bulk email:', error)
    throw error
  }
}

module.exports = {
  sendEmail,
  sendTemplateEmail,
  sendBulkEmail
}
