/**
 * Winston Logger Configuration
 * 
 * This module configures the Winston logging system for the Hablaquí API.
 * It provides structured logging with different transports and formats
 * based on the environment (development/production).
 * 
 * Features:
 * - JSON formatting for production logs
 * - Console formatting for development
 * - Request logging middleware
 * - Error and info logging utilities
 * - Stackdriver integration for production
 * 
 * @module config/winston
 * @requires winston - Logging library
 * @requires express-winston - Express logging middleware
 * @requires dayjs - Date handling library
 */

import dayjs from 'dayjs'
import { node_env } from './dotenv'
import expressWinston from 'express-winston'
import { createLogger, format, transports } from 'winston'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Symbol for message formatting
 * Used internally by Winston
 * @type {Symbol}
 */
const MESSAGE = Symbol.for('message')

/**
 * JSON Formatter
 * Formats log entries as JSON with timestamp and severity
 * 
 * @param {Object} logEntry - The log entry to format
 * @returns {Object} Formatted log entry
 */
const jsonFormatter = logEntry => {
  const base = {
    timestamp: dayjs.tz().format(),
    severity: logEntry.level.toUpperCase(),
  }
  const json = Object.assign(base, logEntry)
  logEntry[MESSAGE] = JSON.stringify(json)
  return logEntry
}

/**
 * Environment-specific transport configuration
 * Returns appropriate transport based on environment
 * 
 * @returns {Transport} Winston transport instance
 */
const isProdEnv = () => {
  if (node_env === 'production') return new transports.Console()
  else {
    return new transports.Console({
      format: format.combine(
        // format.colorize(),
        format.simple(),
        format.errors({ stack: true })
      ),
    })
  }
}

/**
 * Main logger instance
 * Configured with environment-specific settings
 * 
 * @type {Logger}
 */
export const logger = createLogger({
  level: 'debug',
  format: format(jsonFormatter)(),
  transports: [isProdEnv()],
})

/**
 * Error logging utility
 * Logs error messages with stack traces
 * 
 * @param {Error|string} err - Error object or message
 */
export const logError = err => logger.error(err.message || err)

/**
 * Info logging utility
 * Logs informational messages
 * 
 * @param {string} info - Information message
 */
export const logInfo = info => logger.info(info)

/**
 * Request logging middleware
 * Logs HTTP requests in development environment
 * 
 * @returns {Function} Express middleware function
 */
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
        return false
      }, // optional: allows to skip some log messages based on request and/or response
    })
  }
}

// Winston Logger Configuration
// This file configures the Winston logging system for the application

const winston = require('winston');
const path = require('path');

/**
 * Log format configuration
 * Combines timestamp, error stack, and JSON formatting
 * 
 * @type {Format}
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

/**
 * Log levels configuration
 * Defines severity levels for different types of logs
 * 
 * @type {Object}
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

/**
 * Log colors configuration
 * Defines colors for different log levels
 * 
 * @type {Object}
 */
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

// Add colors to Winston
winston.addColors(colors);

/**
 * Logger instance with file and console transports
 * 
 * @type {Logger}
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    // File transport for errors
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

/**
 * Stream object for Morgan integration
 * Allows Winston to work with Morgan HTTP request logging
 * 
 * @type {Object}
 */
logger.stream = {
  write: (message) => logger.http(message.trim())
};

module.exports = logger;
