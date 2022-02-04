import { logger } from './config/pino';
const app = require('./app');

app.listen(process.env.PORT || 3000, () => {
	logger.info(`Listen on port ${process.env.PORT}`);
});
