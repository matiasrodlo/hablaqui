/**
 * Chat Service
 * 
 * This module handles all chat-related functionality for the Hablaquí system.
 * It provides conversation management, message handling, and reporting features.
 * 
 * Features:
 * - Chat creation and initialization
 * - Message sending and retrieval
 * - Chat history management
 * - Message read status tracking
 * - Chat reporting system
 * - Analytics tracking for messages
 * - Email notification integration
 * - Real-time message delivery
 * 
 * @module services/chat
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../models/chat - Chat model
 * @requires ../config/pino - Logging
 * @requires ../models/email - Email model
 * @requires analytics-node - Analytics tracking
 */

'use strict'

import { conflictResponse, okResponse } from '../utils/responses/functions'
import Chat from '../models/chat'
import { logInfo } from '../config/pino'
import Email from '../models/email'
import Analytics from 'analytics-node'

/**
 * Creates a new chat instance between a user and specialist
 * 
 * This function:
 * 1. Creates a new chat document in the database
 * 2. Links the user and specialist
 * 3. Initializes empty message array
 * 
 * @async
 * @param {Object} user - User object
 * @param {string} specialistId - Specialist's ID
 * @returns {Promise<Object>} New chat instance
 */
const createChat = async (user, specialistId) => {
  const newChat = await Chat.create({
    specialist: specialistId,
    user,
  })
  return newChat
}

/**
 * Searches for an existing chat between a user and specialist
 * 
 * This function:
 * 1. Queries the database for a chat document
 * 2. Populates user and specialist details
 * 3. Returns null if no chat exists
 * 
 * @async
 * @param {Object} user - User object
 * @param {string} spec - Specialist's ID
 * @returns {Promise<Object|null>} Chat instance or null
 */
const buscarChat = async (user, spec) => {
  const chat = await Chat.findOne({
    user,
    specialist: spec,
  }).populate('user specialist')
  return chat
}

/**
 * Initializes a new conversation between user and specialist
 * Creates new chat if none exists
 * 
 * This function:
 * 1. Checks for existing chat
 * 2. Creates new chat if none exists
 * 3. Returns appropriate response
 * 
 * @async
 * @param {string} specialistId - Specialist's ID
 * @param {Object} user - User object
 * @returns {Promise<Object>} Response with chat status
 */
const startConversation = async (specialistId, user) => {
  const hasChats = await buscarChat(user, specialistId)
  if (hasChats) {
    return okResponse('chat inicializado anteriormente')
  }
  const newChat = await createChat(user._id, specialistId)
  return okResponse('chat inicializado', { newChat })
}

/**
 * Retrieves messages for a specific chat
 * Creates new chat if none exists
 * 
 * This function:
 * 1. Searches for existing chat
 * 2. Creates new chat if not found
 * 3. Returns all messages in the chat
 * 
 * @async
 * @param {Object} user - User object
 * @param {string} spec - Specialist's ID
 * @returns {Promise<Object>} Response with messages
 */
const getMessages = async (user, spec) => {
  let messages = await buscarChat(user, spec)

  if (!messages) messages = await createChat(user, spec)

  return okResponse('Mensajes conseguidos', {
    // retorna un mensaje de éxito y los mensajes
    messages,
  })
}

/**
 * Retrieves all chats for a user based on their role
 * 
 * This function:
 * 1. Validates user role
 * 2. Queries chats based on role (specialist or user)
 * 3. Populates user and specialist details
 * 4. Logs chat retrieval
 * 
 * @async
 * @param {Object} user - User object with role information
 * @returns {Promise<Object>} Response with chat list
 */
const getChats = async user => {
  const roles = ['specialist', 'user']
  const idRoles = ['specialist', '_id']
  const spanishRoles = { specialist: 'especialista', user: 'usuario' }
  let chat
  if (user.role === 'specialist') user.role = 'specialist'
  // Es para verificar que sea un rol valido
  if (!roles.includes(user.role)) {
    return conflictResponse(
      'Ha ocurrido un error intentando recuperar tus chats'
    )
  }
  // Se encuentra el rol y se devuelven los chats
  for (const i in roles) {
    if (roles[i] == user.role) {
      logInfo(
        `El ${spanishRoles[roles[i]]} ${user.email} ha conseguido sus chats`
      )
      chat = await Chat.find({ [roles[i]]: user[idRoles[i]] }).populate(
        'user specialist'
      )
    }
  }
  return okResponse('Chats conseguidos', { chats: chat })
}

/**
 * Sends a new message in a chat
 * Updates chat status and tracks message in analytics
 * 
 * This function:
 * 1. Creates new message object
 * 2. Updates chat document with new message
 * 3. Updates read status and last message sender
 * 4. Tracks message in analytics
 * 5. Returns updated chat and emit data for real-time updates
 * 
 * @async
 * @param {Object} user - User sending the message
 * @param {string} content - Message content
 * @param {string} userId - User's ID
 * @param {string} specialistId - Specialist's ID
 * @returns {Promise<Object>} Updated chat and emit data
 */
export const sendMessage = async (user, content, userId, specialistId) => {
  // función para enviar un mensaje, recibe el usuario, el contenido del mensaje, el id del usuario y el id del especialista
  const newMessage = {
    // crea un nuevo mensaje
    sentBy: user._id, // con el id del usuario que lo envía
    message: content, // y el contenido del mensaje
  }

  const updatedChat = await Chat.findOneAndUpdate(
    // busca un chat en la base de datos
    {
      user: userId,
      specialist: specialistId,
    },
    {
      $set: {
        isLastRead: false,
        lastMessageSendBy: user.role,
      },
      $push: {
        messages: newMessage,
      },
      read: false,
    },
    { new: true }
  )
  const data = {
    userId,
    specialistId,
    _id: updatedChat._id,
    content: [...updatedChat.messages].pop(),
  }

  const analytics = new Analytics(process.env.SEGMENT_API_KEY)
  analytics.track({
    userId: user._id.toString(),
    event: 'message-sent',
  })

  return { chat: updatedChat, emit: data }
}

/**
 * Creates a report for a chat
 * 
 * This function:
 * 1. Creates new report object with user details
 * 2. Updates chat document with report
 * 3. Logs report creation
 * 4. Returns updated chat
 * 
 * @async
 * @param {Object} user - User creating the report
 * @param {string} specialistId - Specialist's ID
 * @param {string} userId - User's ID
 * @param {string} reportType - Type of report
 * @param {string} issue - Report description
 * @returns {Promise<Object>} Response with updated chat
 */
const createReport = async (user, specialistId, userId, reportType, issue) => {
  // Crea un nuevo reporte del chat y lo guarda en el modelo de chat
  const newReport = {
    reportedBy: user._id,
    reportType,
    issue,
  }

  const updatedChat = await Chat.findOneAndUpdate(
    {
      user: userId,
      specialist: specialistId,
    },
    {
      $push: {
        reports: newReport,
      },
    },
    { new: true }
  )

  logInfo(`El usuario ${user.email} de tipo ${user.role} ha hecho un reporte`)
  return okResponse('Reporte creado', { chat: updatedChat })
}

/**
 * Marks messages as read in a chat
 * Cleans up related email notifications
 * 
 * This function:
 * 1. Finds chat by ID
 * 2. Determines user role and appropriate ID
 * 3. Deletes related email notifications
 * 4. Updates chat read status
 * 
 * @async
 * @param {Object} user - User marking messages as read
 * @param {string} chatId - Chat ID
 * @returns {Promise<Object>} Success response
 */
const readMessage = async (user, chatId) => {
  // Se obtiene el documento de chat, verifica el rol del usuario y marca el chat como leido
  const chat = await Chat.findById(chatId)
  const id = user.role == 'specialist' ? chat.user : user.specialist

  await Email.deleteMany({
    type: {
      $in: ['chat-spec-1-day', 'chat-user-1-day'],
    },
    wasScheduled: false,
    userRef: chat.user,
    specRef: chat.specialist,
  })

  await Email.deleteMany({
    type: {
      $in: ['chat-psy-1-hour', 'chat-user-1-hour'],
    },
    wasScheduled: false,
    userRef: chat.user,
    psyRef: chat.psychologist,
  })

  await Chat.updateOne(
    { _id: chatId, sentBy: id },
    {
      $set: { 'messages.$[].read': true, isLastRead: true },
    },
    { new: true }
  )

  return okResponse('Mensajes leidos', {})
}

/**
 * Chat service object containing all chat-related business logic
 * @type {Object}
 */
const chatService = {
  createChat,
  buscarChat,
  startConversation,
  getMessages,
  getChats,
  sendMessage,
  createReport,
  readMessage,
}

export default Object.freeze(chatService) // exporta el objeto con las funciones del servicio
