/**
 * Environment Variable Configuration
 * 
 * This module loads and exports environment variables for the Hablaquí system.
 * It uses dotenv to load variables from .env file and provides default values where needed.
 * 
 * Environment Variables:
 * - Server Configuration (port, node_env)
 * - Database Configuration (url_db)
 * - Authentication (jwt_secret, jwt_algorithm, jwt_expiration)
 * - Google OAuth (google_client_id, google_client_secret)
 * - MercadoPago Integration (mercadopago keys and URLs)
 * - SMS Service Configuration
 * - Email Configuration
 * - Cloud Storage Configuration
 * 
 * @module config/dotenv
 * @requires dotenv - Environment variable loader
 */

import dotenv from 'dotenv'
dotenv.config()
export const room = 'https://rooms.hablaqui.cl/'
export const port = process.env.PORT
export const node_env = process.env.NODE_ENV
export const url_db = process.env.URLDB
export const vue_app_origin = process.env.VUE_APP_ORIGIN
export const frontend_url = process.env.FRONTEND_URL
export const jwt_secret = process.env.JWT_SECRET
export const jwt_algorithm = process.env.JWT_ALGORITHM
export const jwt_expiration = process.env.JWT_EXPIRATION
export const password_recovery_jwt_expiration =
  process.env.PASSWORD_RECOVERY_JWT_EXPIRATION
export const api_url = process.env.API_URL
export const google_client_id = process.env.GOOGLE_CLIENT_ID
export const google_client_secret = process.env.GOOGLE_CLIENT_SECRET
export const google_strategy_callback = process.env.GOOGLE_STRATEGY_CALLBACK
export const bucketname = process.env.BUCKETNAME
export const mercadopago_sandbox_key = process.env.MERCADOPAGO_SANDBOX_KEY
export const mercadopago_production_key = process.env.MERCADOPAGO_PRODUCTION_KEY
export const mercadopago_success_url = process.env.MERCADOPAGO_SUCCESS_URL

export const mercadopago_failure_url = process.env.MERCADOPAGO_FAILURE_URL
export const mercadopago_pending_url = process.env.MERCADOPAGO_PENDING_URL
export const mercadopago_notification_url =
  process.env.MERCADOPAGO_NOTIFICATION_URL
export const send_sms_message_service_url =
  process.env.SEND_SMS_MESSAGE_SERVICE_URL
export const send_sms_message_task_queue =
  process.env.SEND_SMS_MESSAGE_TASK_QUEUE
export const send_lodging_confirmation_sms_service_url =
  process.env.SEND_LODGING_CONFIRMATION_SMS_SERVICE_URL
export const send_lodging_confirmation_sms_task_queue =
  process.env.SEND_LODGING_CONFIRMATION_SMS_TASK_QUEUE
export const trigger_lodging_confirmation_service_url =
  process.env.TRIGGER_LODGING_CONFIRMATION_TASK_SERVICE_URL
export const trigger_lodging_confirmation_task_queue =
  process.env.TRIGGER_LODGING_CONFIRMATION_TASK_QUEUE
export const push_person_verify_url = process.env.PUSH_PERSON_VERIFY_URL
export const push_person_verify = process.env.PUSH_PERSON_VERIFY
export const no_reply_email = process.env.NO_REPLY_EMAIL
export const no_reply_password = process.env.NO_REPLY_PASSWORD
export const landing_url = process.env.VUE_APP_LANDING
export const mercadopago_key = process.env.MERCADOPAGO_KEY
