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

require('@google-cloud/debug-agent').start({
  serviceContext: { enableCanary: true }
})

// fisrt connect to data base
mongoose
  .connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(logger.info('Data base online'))
  .catch(error => logError(error))

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
})
// limiter solve a brute attack problem in the api, every x time you're only allowed to send x quantity of requests
const whitelist = [process.env.VUE_APP_LANDING]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) callback(null, true)
    else callback('Not allowed by CORS: ' + origin)
  }
}

app.use(limiter)
app.use(helmet())
app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

passportConfig(passport)
app.use(passport.initialize())

routes(app)

// Swagger
const swaggerOptions = {
  definition: {
    info: {
      version: '1.0.0',
      title: 'Hablaqui API',
      description: 'Hablaqui API documentation',
      contact: {
        name: 'Hablaqui'
      },
      servers: ['http://localhost:3000']
    }
  },
  apis: ['./server/routes/*.js']
}
/**
 * @openapi
 * /psychologists:
 * 	get:
 * 	description: Get all psychologists
 * 	responses:
 * 		200:
 * 			description: Successful response
 */

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

module.exports = app
