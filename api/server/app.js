/**
 * Hablaquí API Application
 * 
 * This is the main Express application file that sets up the server,
 * middleware, database connection, and API routes.
 * 
 * @module app
 */

import './config/config.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import passportConfig from './config/passport'
import path from 'path'
import routes from './routes/index'
import { logError, logger } from './config/pino'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'

// Initialize Express application
const app = express()

// Initialize Google Cloud Debug Agent
require('@google-cloud/debug-agent').start({
  serviceContext: { enableCanary: true },
})

// Connect to MongoDB database
mongoose
  .connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(logger.info('Database connected successfully'))
  .catch(error => logError(error))

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

// Rate limiting configuration
// Limits each IP to 1000 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Maximum requests per window
})

/*
Código comentado porque no se está usando en ninguna parte
//limiter solve a brute attack problem in the api, every x time you're only allowed to send x quantity of requests
const whitelist = [process.env.VUE_APP_LANDING];

let corsOptions = {
	origin: function(origin, callback) {
		if (whitelist.indexOf(origin) !== -1) callback(null, true);
		else callback('Not allowed by CORS: ' + origin);
	},
};
*/

// Middleware configuration
app.use(limiter) // Apply rate limiting
app.use(helmet()) // Security headers
app.use(cors()) // Enable CORS
app.use(express.static(path.join(__dirname, 'static'))) // Serve static files
app.use(bodyParser.urlencoded({ extended: false })) // Parse URL-encoded bodies
app.use(bodyParser.json()) // Parse JSON bodies

// Authentication configuration
passportConfig(passport)
app.use(passport.initialize())

// Register API routes
routes(app)

// Swagger API documentation configuration
const swaggerOptions = {
  definition: {
    info: {
      version: '1.0.0',
      title: 'Hablaqui API',
      description: 'Hablaqui API documentation',
      contact: {
        name: 'Hablaqui',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['./server/routes/*.js'], // Path to API routes
}

// Example OpenAPI documentation
/**
 * @openapi
 * /specialists:
 *   get:
 *     description: Get all specialists
 *     responses:
 *       200:
 *         description: Successful response
 */

// Initialize Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

module.exports = app
