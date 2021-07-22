import { node_env } from './dotenv';
const { createLogger, format, transports } = require('winston');
const { combine, simple, errors, colorize } = format;
const MESSAGE = Symbol.for('message');
// Use JSON logging for log files
const jsonFormatter = logEntry => {
	const base = {
		timestamp: new Date(),
		severity: logEntry.level.toUpperCase(),
	};
	const json = Object.assign(base, logEntry);
	logEntry[MESSAGE] = JSON.stringify(json);
	return logEntry;
};
// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const isProdEnv = () => {
	if (node_env === 'production')
		return new transports.Console({
			format: combine(errors({ stack: true })),
		});
	else
		return new transports.Console({
			format: format.combine(
				format.colorize(),
				format.simple(),
				format.errors({ stack: true })
			),
		});
};
export const logger = createLogger({
	level: 'debug',
	format: format(jsonFormatter)(),
	transports: [isProdEnv()],
});

export const logError = err => logger.error(err.message || err);

export const logInfo = info => logger.info(info);
