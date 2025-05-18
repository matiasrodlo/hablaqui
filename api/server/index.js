/**
 * Hablaquí API Server
 * 
 * This is the main server file that initializes the HTTP server and WebSocket connections.
 * It sets up the Express application, HTTP server, and Socket.IO for real-time communication.
 * 
 * Key Features:
 * - HTTP server initialization
 * - WebSocket server setup with Socket.IO
 * - Real-time chat functionality
 * - CORS configuration for WebSocket connections
 * - Environment-based port configuration
 * - Error handling for chat messages
 * 
 * WebSocket Features:
 * - Real-time message broadcasting
 * - Chat message handling
 * - Specialist-user communication
 * - Error handling and callbacks
 * 
 * @module server
 * @requires http - Node.js HTTP module
 * @requires socket.io - WebSocket server
 * @requires ./app - Express application
 * @requires ./config/pino - Logging configuration
 * @requires ./services/chat - Chat service
 * 
 * @example
 * // Start the server
 * const server = require('./server')
 * // Server will listen on process.env.PORT or 3000
 * 
 * @throws {Error} If server fails to start
 * @throws {Error} If WebSocket connection fails
 * @throws {Error} If chat message sending fails
 * 
 * @see {@link https://socket.io/|Socket.IO Documentation}
 */

import http from 'http'
import { logger } from './config/pino'
import { Server as webSocketServer } from 'socket.io'
import { sendMessage } from './services/chat'

// Initialize Express application and HTTP server
const app = require('./app')
const server = http.createServer(app)

/**
 * Start HTTP server
 * Listens on environment port or defaults to 3000
 * @throws {Error} If server fails to start
 */
server.listen(process.env.PORT || 3000, () => {
  logger.info(`Listen on port ${process.env.PORT}`)
})

/**
 * Initialize WebSocket server
 * Configures Socket.IO with CORS support
 * @type {webSocketServer}
 */
const io = new webSocketServer(server, {
  cors: {
    origin: '*', // Allow all origins for WebSocket connections
  },
})

/**
 * Create namespace for live data
 * Handles real-time chat functionality
 * @type {Namespace}
 */
const liveData = io.of('/liveData')

/**
 * WebSocket connection handler
 * Manages chat message events and real-time communication
 * 
 * @event connection
 * @param {Socket} socket - WebSocket connection instance
 * 
 * @event sendMessage
 * @param {Object} data - Message data
 * @param {string} data.specialistId - ID of the specialist
 * @param {string} data.userId - ID of the user
 * @param {string} data.content - Message content
 * @param {Object} data.user - User information
 * @param {Function} callback - Callback function for response
 */
liveData.on('connection', socket => {
  socket.on('sendMessage', (data, callback) => {
    const { specialistId, userId, content, user } = data
    try {
      const sendMessageAsync = async () => {
        const response = await sendMessage(user, content, userId, specialistId)
        liveData.emit('getMessage', response.emit)
        callback(response.chat)
      }
      sendMessageAsync()
    } catch (error) {
      callback({
        error: 'Ha ocurrido un error inesperado',
      })
    }
  })
})
