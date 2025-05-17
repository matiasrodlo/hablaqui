/**
 * Chat Router
 * 
 * This module defines the routes for chat functionality in the Hablaquí API.
 * It handles conversation management, message sending, and message status updates.
 * 
 * @module routes/chat
 */

'use strict'

import { Router } from 'express'
import passport from 'passport'
import chatController from '../controllers/chat'

// Initialize Express router
const chatRouter = Router()

/**
 * Start Conversation
 * Initiates a new chat conversation between a user and a specialist
 * 
 * @route POST /api/v1/chat/start-conversation/:specialistId
 * @param {string} req.params.specialistId - ID of the specialist to chat with
 * @param {Object} req.user - Authenticated user object
 * @returns {Object} New chat conversation object
 * @throws {401} If not authenticated
 * @throws {404} If specialist not found
 */
chatRouter.post(
  '/chat/start-conversation/:specialistId',
  [passport.authenticate('jwt', { session: true })],
  chatController.startConversation
)

/**
 * Get User Chats
 * Retrieves all chat conversations for the authenticated user
 * 
 * @route GET /api/v1/chat/get-chats
 * @param {Object} req.user - Authenticated user object
 * @returns {Object[]} Array of chat conversations
 * @throws {401} If not authenticated
 */
chatRouter.get(
  '/chat/get-chats',
  [passport.authenticate('jwt', { session: true })],
  chatController.getChats
)

/**
 * Get Chat Messages
 * Retrieves all messages from a specific chat conversation
 * 
 * @route GET /api/v1/chat/get-messages/:spec/:user
 * @param {string} req.params.spec - Specialist ID
 * @param {string} req.params.user - User ID
 * @returns {Object[]} Array of chat messages
 * @throws {401} If not authenticated
 * @throws {404} If chat not found
 */
chatRouter.get(
  '/chat/get-messages/:spec/:user',
  [passport.authenticate('jwt', { session: true })],
  chatController.getMessages
)

/**
 * Send Message
 * Sends a new message in an existing chat conversation
 * 
 * @route POST /api/v1/chat/send-message/:specialistId/:userId
 * @param {string} req.params.specialistId - Specialist ID
 * @param {string} req.params.userId - User ID
 * @param {string} req.body.content - Message content
 * @returns {Object} Updated chat object with new message
 * @throws {401} If not authenticated
 * @throws {404} If chat not found
 * @throws {400} If message content is invalid
 */
chatRouter.post(
  '/chat/send-message/:specialistId/:userId',
  [passport.authenticate('jwt', { session: true })],
  chatController.sendMessage
)

/**
 * Create Report
 * @deprecated This endpoint is no longer in use
 * 
 * @route POST /api/v1/chat/create-report/:specialistId/:userId
 * @private
 */
chatRouter.post(
  '/chat/create-report/:specialistId/:userId',
  [passport.authenticate('jwt', { session: true })],
  chatController.createReport
)

/**
 * Mark Message as Read
 * Updates the read status of a specific message
 * 
 * @route PATCH /api/v1/chat/read-message/:messageId
 * @param {string} req.params.messageId - ID of the message to mark as read
 * @returns {Object} Updated chat object
 * @throws {401} If not authenticated
 * @throws {404} If message not found
 */
chatRouter.patch(
  '/chat/read-message/:messageId',
  [passport.authenticate('jwt', { session: true })],
  chatController.readMessage
)

// Export a frozen version of the router to prevent modifications
export default Object.freeze(chatRouter)
