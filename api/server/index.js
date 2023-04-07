import http from 'http'
import { logger } from './config/pino'
import { Server as webSocketServer } from 'socket.io'
import { sendMessage } from './services/chat'
const app = require('./app')
const server = http.createServer(app)

server.listen(process.env.PORT || 3000, () => {
  logger.info(`Listen on port ${process.env.PORT}`)
})

// WEB SOCKETS

const io = new webSocketServer(server, {
  cors: {
    origin: process.env.VUE_APP_LANDING,
  },
})

const liveData = io.of('/liveData') // URL which will accept socket

// Socket event
liveData.on('connection', socket => {
  // actualizar chat
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
