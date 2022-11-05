import dayjs from 'dayjs';
import { node_env } from './dotenv';
import expressWinston from 'express-winston';
import { createLogger, format, transports } from 'winston';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

const MESSAGE = Symbol.for('message');

const jsonFormatter = logEntry => {
	const base = {
		timestamp: dayjs.format(),
		severity: logEntry.level.toUpperCase(),
	};
	const json = Object.assign(base, logEntry);
	logEntry[MESSAGE] = JSON.stringify(json);
	return logEntry;
};
// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const isProdEnv = () => {
	if (node_env === 'production') return new transports.Console();
	else
		return new transports.Console({
			format: format.combine(
				// format.colorize(),
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

export const requestLogMiddleware = () => {
	if (node_env === 'development') {
		return expressWinston.logger({
			transports: [new transports.Console()],
			// format: format.combine(format.colorize(), format.simple()),
			format: format.combine(format.simple()),
			meta: false, // optional: control whether you want to log the meta data about the request (default to true)
			msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
			expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
			colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
			// eslint-disable-next-line no-unused-vars
			ignoreRoute: function(req, res) {
				return false;
			}, // optional: allows to skip some log messages based on request and/or response
		});
	}
};
