import { logger } from './config/pino';
import http from 'http';
import { Server as webSocketServer } from 'socket.io';
const app = require('./app');
import { sendMessage } from './services/chat';

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
	logger.info(`Listen on port ${process.env.PORT}`);
});

// WEB SOCKETS

const io = new webSocketServer(server, {
	cors: {
		origin: 'http://localhost:9000',
	},
});

const liveData = io.of('//liveData'); // URL which will accept socket

// Socket event
liveData.on('connection', socket => {
	console.log('USUARIO CONECTADO AL CHAT');
	socket.on('sendMessage', (data, callback) => {
		const { psychologistId, userId, content, user } = data;
		try {
			const sendMessageAsync = async () => {
				const response = await sendMessage(
					user,
					content,
					userId,
					psychologistId
				);
				liveData.emit('getMessage', response.emit);
				callback(response.chat);
			};
			sendMessageAsync();
		} catch (error) {
			callback({
				error: 'Ha ocurrido un error inesperado',
			});
		}
	});
});
