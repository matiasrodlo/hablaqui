'use strict'

import chatService from '../services/chat'
import { errorCallback } from '../utils/functions/errorCallback'
import { restResponse } from '../utils/responses/functions'

const chatController = {
  async startConversation (req, res) {
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
  async getChats (req, res) {
    try {
      const { user } = req
      const { data, code } = await chatService.getChats(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error consiguiendo los chats')
    }
  },
  async getMessages (req, res) {
    try {
      const { user, spec } = req.params
      const { data, code } = await chatService.getMessages(user, spec)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error consiguiendo los mensajes')
    }
  },
  async sendMessage (req, res) {
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
  async createReport (req, res) {
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
  async readMessage (req, res) {
    try {
      const { user } = req
      const { messageId } = req.params
      const { data, code } = await chatService.readMessage(user, messageId)

      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error actualizando el chat')
    }
  }
}

export default Object.freeze(chatController)
