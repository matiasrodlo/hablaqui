// Chat Controller
// This controller handles HTTP requests related to chat operations, such as starting conversations, retrieving chats and messages, sending messages, creating reports, and marking messages as read.

'use strict'

import chatService from '../services/chat'
import { errorCallback } from '../utils/functions/errorCallback'
import { restResponse } from '../utils/responses/functions'

// Controller object containing chat-related operations
const chatController = {
  // Start a new conversation between a user and a specialist
  async startConversation(req, res) {
    try {
      const { params, user } = req
      const { data, code } = await chatService.startConversation(
        params.specialistId,
        user
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error iniciando el chat')
    }
  },

  // Retrieve all chats for the current user
  async getChats(req, res) {
    try {
      const { user } = req
      const { data, code } = await chatService.getChats(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error consiguiendo los chats')
    }
  },

  // Retrieve all messages between a user and a specialist
  async getMessages(req, res) {
    try {
      const { user, spec } = req.params
      const { data, code } = await chatService.getMessages(user, spec)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error consiguiendo los mensajes')
    }
  },

  // Send a message in a chat
  async sendMessage(req, res) {
    try {
      const { specialistId, userId } = req.params
      const { content } = req.body
      const { user } = req
      const { data, code } = await chatService.sendMessage(
        user,
        content,
        userId,
        specialistId
      )

      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error enviando el mensaje')
    }
  },

  // Create a report for a chat issue
  async createReport(req, res) {
    try {
      const { specialistId, userId } = req.params
      const { reportType, issue } = req.body
      const { user } = req
      const { data, code } = await chatService.createReport(
        user,
        specialistId,
        userId,
        reportType,
        issue
      )

      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error creando el reporte')
    }
  },

  // Mark a message as read
  async readMessage(req, res) {
    try {
      const { user } = req
      const { messageId } = req.params
      const { data, code } = await chatService.readMessage(user, messageId)

      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error actualizando el chat')
    }
  },
}

export default Object.freeze(chatController)
