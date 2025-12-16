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
 * @requires ./utils/logger - Custom logger utility
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

// Server Entry Point
// This file initializes and starts the Express server

const app = require('./app')
const mongoose = require('mongoose')
const { createServer } = require('http')
const { Server } = require('socket.io')
require('dotenv').config()
const logger = require('./utils/logger')

/**
 * Server Configuration
 * Environment variables with fallback values
 * @type {Object}
 */
const config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hablaqui',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
}

/**
 * Create HTTP server instance
 * Uses Express app for request handling
 * @type {http.Server}
 */
const httpServer = createServer(app)

/**
 * Initialize Socket.IO server
 * Configures CORS and WebSocket settings
 * @type {Server}
 */
const io = new Server(httpServer, {
  cors: {
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

/**
 * WebSocket Connection Handler
 * Manages real-time communication between clients
 */
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)

  /**
   * Handle incoming chat messages
   * Broadcasts messages to all connected clients
   * @param {Object} data - Message data containing sender, content, and timestamp
   */
  socket.on('chat:message', (data) => {
    io.emit('chat:message', data)
  })

  /**
   * Handle typing status updates
   * Broadcasts typing status to other clients
   * @param {Object} data - Typing status data
   */
  socket.on('chat:typing', (data) => {
    socket.broadcast.emit('chat:typing', data)
  })

  /**
   * Handle client disconnection
   * Logs when clients disconnect from the server
   */
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

/**
 * Connect to MongoDB database
 * Initializes database connection with error handling
 */
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  logger.info('MongoDB connected successfully');
  
  /**
   * Start HTTP server
   * Listens on configured port and logs server status
   */
  httpServer.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
    logger.info(`Environment: ${process.env.NODE_ENV}`)
  })
}).catch(error => {
  logger.error('MongoDB connection error:', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
})

/**
 * Global Error Handlers
 * Handle unhandled promise rejections and uncaught exceptions
 */

/**
 * Handle unhandled promise rejections
 * Logs error and gracefully shuts down server
 * @param {Error} error - The unhandled rejection error
 */
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Promise Rejection:', {
    error: error.message,
    stack: error.stack
  });
  httpServer.close(() => process.exit(1))
})

/**
 * Handle uncaught exceptions
 * Logs error and gracefully shuts down server
 * @param {Error} error - The uncaught exception error
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack
  });
  httpServer.close(() => process.exit(1))
})
