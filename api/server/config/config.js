/**
 * Main Configuration File
 * 
 * This module exports configuration settings for the Hablaquí API.
 * It manages environment variables and provides default values for development.
 * 
 * Features:
 * - Server configuration (port, environment, CORS)
 * - Database connection settings
 * - Authentication parameters
 * - Email service configuration
 * - Payment gateway settings
 * - Cloud storage configuration
 * 
 * @module config/config
 * @requires dotenv - Environment variable management
 */

const dotenv = require('dotenv');
dotenv.config();

/**
 * Application Configuration
 * Centralized configuration object with environment-specific settings
 * 
 * @type {Object}
 */
const config = {
  /**
   * Server Configuration
   * @type {Object}
   * @property {number} port - Server port number
   * @property {string} env - Node environment (development/production)
   * @property {Object} cors - CORS settings
   */
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    }
  },

  /**
   * Database Configuration
   * @type {Object}
   * @property {string} uri - MongoDB connection string
   * @property {Object} options - Mongoose connection options
   */
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hablaqui',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  /**
   * Authentication Configuration
   * @type {Object}
   * @property {string} jwtSecret - Secret key for JWT signing
   * @property {string} jwtExpiration - JWT token expiration time
   * @property {string} refreshTokenExpiration - Refresh token expiration time
   */
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d'
  },

  /**
   * Email Configuration
   * @type {Object}
   * @property {string} host - SMTP server host
   * @property {number} port - SMTP server port
   * @property {boolean} secure - Use TLS/SSL
   * @property {Object} auth - SMTP authentication credentials
   */
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },

  /**
   * Payment Configuration
   * @type {Object}
   * @property {string} stripeSecretKey - Stripe API secret key
   * @property {string} stripeWebhookSecret - Stripe webhook signing secret
   * @property {string} mercadoPagoAccessToken - MercadoPago access token
   */
  payment: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    mercadoPagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
  },

  /**
   * Storage Configuration
   * @type {Object}
   * @property {string} bucketName - Cloud storage bucket name
   * @property {string} region - Cloud storage region
   * @property {string} accessKeyId - AWS access key ID
   * @property {string} secretAccessKey - AWS secret access key
   */
  storage: {
    bucketName: process.env.STORAGE_BUCKET_NAME,
    region: process.env.STORAGE_REGION,
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY
  }
};

module.exports = config;

/**
 * Development Environment Configuration
 * Sets default values for local development
 * These values are used when environment variables are not set
 */

// Database configuration
process.env.URLDB = process.env.URLDB || 'mongodb://localhost:27017/hablaqui'

// Server configuration
process.env.PORT = process.env.PORT || 3000
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080/#'

// JWT configuration
process.env.JWT_SECRET = process.env.JWT_SECRET || 'sochamar12345'
process.env.JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256'
process.env.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '30d'
process.env.PASSWORD_RECOVERY_JWT_EXPIRATION =
  process.env.PASSWORD_RECOVERY_JWT_EXPIRATION || '4m'

// API configuration
process.env.API_URL = process.env.API_URL || 'http://app.hablaqui.cl/'

// Google OAuth configuration
process.env.GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  '326428183768-n5t9r18fekpb722933s3sv07q3sd6n0a.apps.googleusercontent.com'
process.env.GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || 'sUkgN-R-0vIYMKhaOhOD0WVh'
process.env.GOOGLE_STRATEGY_CALLBACK =
  process.env.GOOGLE_STRATEGY_CALLBACK ||
  'http://localhost:3000/api/v1/auth/google/callback'

// Storage configuration
process.env.BUCKETNAME = process.env.BUCKETNAME || 'plhain-staging-bucket'

// Twilio configuration
process.env.TWILIO_PROD_ACCOUNTSID =
  process.env.TWILIO_PROD_ACCOUNTSID || 'AC67899c3ed7cba76e23be9660a586f7ff'
process.env.TWILIO_PROD_AUTHTOKEN =
  process.env.TWILIO_PROD_AUTHTOKEN || '9009e4a8030a4a9a2189ddb447da5b43'
process.env.TWILIO_PROD_LODGING_VALIDATIONS_NUMBER = 
  process.env.TWILIO_PROD_LODGING_VALIDATIONS_NUMBER || '+19143025205'
