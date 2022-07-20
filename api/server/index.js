import { logger } from './config/pino';
import http from 'http';
import { Server } from 'socket.io';
const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:9000',
	},
});

io.on('connection', socket => {
	console.log('un usuario se ha conectado');
});

server.listen(process.env.PORT || 3000, () => {
	logger.info(`Listen on port ${process.env.PORT}`);
});
