import { logger } from './config/winston';
import { port } from './config/dotenv';
const app = require('./app');

app.listen(port, () => {
	logger.info(`Listen on port ${port}`);
});
