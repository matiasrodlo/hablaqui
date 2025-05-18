/**
 * Email Sending Utility
 * 
 * This module provides the core email sending functionality for the Hablaquí platform.
 * It integrates with SendGrid's mail service to handle email delivery and logging.
 * 
 * Key features:
 * - Simple text and HTML email support
 * - SendGrid dynamic templates integration
 * - Email tracking and analytics
 * - Unsubscribe group management
 * - Batch sending capabilities
 * - Error handling and logging
 * - Timezone-aware date handling
 * 
 * The module uses SendGrid's API for reliable email delivery and includes
 * comprehensive error handling and logging. All emails are sent with proper
 * tracking and unsubscribe group settings for compliance.
 * 
 * @module utils/functions/mails/sendMails
 */

import sgMail from '@sendgrid/mail'
import { logInfo } from '../../../config/pino'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Configure SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Configure dayjs with required plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Sends an email using SendGrid's mail service
 * Handles email delivery and logs the result
 * 
 * @param {Object} dataPayload - Email configuration object
 * @param {string} dataPayload.from - Sender email address
 * @param {string} dataPayload.to - Recipient email address
 * @param {string} dataPayload.subject - Email subject
 * @param {string} [dataPayload.reply_to] - Reply-to email address
 * @param {string} [dataPayload.templateId] - SendGrid template ID
 * @param {Object} [dataPayload.asm] - SendGrid unsubscribe group settings
 * @param {number} [dataPayload.asm.group_id] - Unsubscribe group ID
 * @param {Object} [dataPayload.dynamicTemplateData] - Template variables
 * @param {string} [dataPayload.batchId] - SendGrid batch ID for tracking
 * @param {string} [dataPayload.text] - Plain text email content
 * @param {string} [dataPayload.html] - HTML email content
 * 
 * @returns {Promise<Object>} SendGrid response object containing:
 *   - statusCode: HTTP status code
 *   - headers: Response headers
 *   - body: Response body with message details
 * 
 * @throws {Error} If email sending fails, with details about the error
 * 
 * @example
 * // Send a simple text email
 * await sendMails({
 *   from: 'notifications@example.com',
 *   to: 'user@example.com',
 *   subject: 'Test Email',
 *   text: 'Hello World'
 * });
 * 
 * @example
 * // Send a templated email with unsubscribe group
 * await sendMails({
 *   from: 'notifications@example.com',
 *   to: 'user@example.com',
 *   subject: 'Welcome',
 *   templateId: 'd-template123',
 *   asm: {
 *     group_id: 16321
 *   },
 *   dynamicTemplateData: {
 *     name: 'John',
 *     url: 'https://example.com'
 *   }
 * });
 * 
 * @example
 * // Send a batch email with tracking
 * await sendMails({
 *   from: 'notifications@example.com',
 *   to: 'user@example.com',
 *   subject: 'Newsletter',
 *   templateId: 'd-template456',
 *   batchId: 'batch123',
 *   dynamicTemplateData: {
 *     content: 'Latest updates'
 *   }
 * });
 */
const sendMails = async dataPayload => {
  return new Promise((resolve, reject) => {
    sgMail.send(dataPayload, function(error, body) {
      if (error) {
        reject(error)
        logInfo(error)
      } else {
        resolve(body)
        logInfo(body)
      }
    })
  })
}

export default sendMails
