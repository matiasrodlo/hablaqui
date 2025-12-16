/**
 * Hablaquí API Application
 * 
 * This is the main Express application file that sets up the server,
 * middleware, database connection, and API routes.
 * 
 * Key Features:
 * - Express server configuration
 * - MongoDB database connection
 * - Authentication with Passport.js
 * - Security middleware (Helmet, CORS, Rate Limiting)
 * - API documentation with Swagger/OpenAPI
 * - Static file serving
 * - Error logging with Pino
 * 
 * Security Features:
 * - Rate limiting (1000 requests per 15 minutes per IP)
 * - Security headers with Helmet
 * - CORS protection
 * - Body parsing limits
 * - Authentication middleware
 * 
 * @module app
 * @requires express - Web framework
 * @requires mongoose - MongoDB ODM
 * @requires passport - Authentication middleware
 * @requires helmet - Security headers
 * @requires cors - Cross-origin resource sharing
 * @requires swagger-ui-express - API documentation UI
 * @requires swagger-jsdoc - API documentation generator
 * 
 * @example
 * // Start the server
 * const app = require('./app')
 * const port = process.env.PORT || 3000
 * app.listen(port, () => {
 *   console.log(`Server running on port ${port}`)
 * })
 * 
 * @throws {Error} If database connection fails
 * @throws {Error} If required environment variables are missing
 * 
 * @see {@link https://expressjs.com/|Express Documentation}
 * @see {@link https://mongoosejs.com/|Mongoose Documentation}
 * @see {@link https://swagger.io/|Swagger Documentation}
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

const app = express()

/**
 * Connect to MongoDB database
 * Uses environment variable URLDB for connection string
 * @throws {Error} If connection fails
 */
mongoose
  .connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(logger.info('Database connected successfully'))
  .catch(error => logError(error))

// Trust proxy configuration (uncomment if behind reverse proxy like AWS ELB, Nginx, etc)
// See: https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

/**
 * Rate limiting configuration
 * Limits each IP to 1000 requests per 15 minutes
 * Helps prevent brute force attacks
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Maximum requests per window
})

app.use(limiter)
app.use(helmet())
app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * Authentication configuration
 * Initializes Passport.js for authentication
 * @see {@link ./config/passport.js|Passport Configuration}
 */
passportConfig(passport)
app.use(passport.initialize())

routes(app)

/**
 * Swagger API documentation configuration
 * Generates interactive API documentation
 * @see {@link https://swagger.io/|Swagger Documentation}
 */
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

/**
 * Example OpenAPI documentation
 * Demonstrates API endpoint documentation format
 * @openapi
 * /specialists:
 *   get:
 *     description: Get all specialists
 *     responses:
 *       200:
 *         description: Successful response
 */

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

module.exports = app
