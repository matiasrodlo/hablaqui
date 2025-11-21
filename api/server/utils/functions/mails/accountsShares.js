/**
 * Accounts and Shares Email Utility
 * 
 * This module provides functions for sending account and share-related emails in the Hablaquí platform,
 * including account creation, sharing, and collaboration notifications.
 * 
 * @module utils/functions/mails/accountsShares
 */

import { logError } from '../../../config/pino'
import { sendEmail } from './sendMails'
import { emailTemplates } from './templates'
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
 * Sends an account creation confirmation email
 * 
 * @param {Object} user - User data
 * @param {string} verificationToken - Account verification token
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send account creation confirmation
 * await sendAccountCreated(userData, 'verification-token-123');
 */
const sendAccountCreated = async (user, verificationToken) => {
  try {
    const template = emailTemplates.accountCreated(user, verificationToken)
    return await sendEmail({
      to: user.email,
      subject: 'Account Created - Hablaqui',
      html: template
    })
  } catch (error) {
    logError('Error sending account creation email:', error)
    throw error
  }
}

/**
 * Sends a share invitation email
 * 
 * @param {Object} share - Share data
 * @param {Object} sender - Sender user data
 * @param {Object} recipient - Recipient user data
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send share invitation
 * await sendShareInvitation(shareData, senderData, recipientData);
 */
const sendShareInvitation = async (share, sender, recipient) => {
  try {
    const template = emailTemplates.shareInvitation(share, sender, recipient)
    return await sendEmail({
      to: recipient.email,
      subject: 'Share Invitation - Hablaqui',
      html: template
    })
  } catch (error) {
    logError('Error sending share invitation email:', error)
    throw error
  }
}

/**
 * Sends a share acceptance notification email
 * 
 * @param {Object} share - Share data
 * @param {Object} sender - Sender user data
 * @param {Object} recipient - Recipient user data
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send share acceptance notification
 * await sendShareAccepted(shareData, senderData, recipientData);
 */
const sendShareAccepted = async (share, sender, recipient) => {
  try {
    const template = emailTemplates.shareAccepted(share, sender, recipient)
    return await sendEmail({
      to: sender.email,
      subject: 'Share Accepted - Hablaqui',
      html: template
    })
  } catch (error) {
    logError('Error sending share acceptance email:', error)
    throw error
  }
}

/**
 * Sends a share rejection notification email
 * 
 * @param {Object} share - Share data
 * @param {Object} sender - Sender user data
 * @param {Object} recipient - Recipient user data
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send share rejection notification
 * await sendShareRejected(shareData, senderData, recipientData, 'Not interested');
 */
const sendShareRejected = async (share, sender, recipient, reason) => {
  try {
    const template = emailTemplates.shareRejected(share, sender, recipient, reason)
    return await sendEmail({
      to: sender.email,
      subject: 'Share Rejected - Hablaqui',
      html: template
    })
  } catch (error) {
    logError('Error sending share rejection email:', error)
    throw error
  }
}

/**
 * Sends a collaboration request email
 * 
 * @param {Object} collaboration - Collaboration data
 * @param {Object} sender - Sender user data
 * @param {Object} recipient - Recipient user data
 * @returns {Promise<Object>} Send result
 * 
 * @example
 * // Send collaboration request
 * await sendCollaborationRequest(collaborationData, senderData, recipientData);
 */
const sendCollaborationRequest = async (collaboration, sender, recipient) => {
  try {
    const template = emailTemplates.collaborationRequest(collaboration, sender, recipient)
    return await sendEmail({
      to: recipient.email,
      subject: 'Collaboration Request - Hablaqui',
      html: template
    })
  } catch (error) {
    logError('Error sending collaboration request email:', error)
    throw error
  }
}

module.exports = {
  sendAccountCreated,
  sendShareInvitation,
  sendShareAccepted,
  sendShareRejected,
  sendCollaborationRequest
}
