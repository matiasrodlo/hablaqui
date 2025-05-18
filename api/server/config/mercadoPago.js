/**
 * MercadoPago Payment Configuration
 * 
 * This module configures the MercadoPago payment integration for the Hablaquí system.
 * It sets up the payment gateway, URLs, and default preferences for payment processing.
 * 
 * Features:
 * - Sandbox/Production environment configuration
 * - Payment success/failure/pending URLs
 * - Webhook notification URL
 * - Payment method restrictions
 * - Default preference maker for payment requests
 * 
 * @module config/mercadoPago
 * @requires mercadopago - MercadoPago SDK
 * @requires ../utils/mercadopago/maker - URL maker utility
 */

import MercadoPago from 'mercadopago'
import maker from '../utils/mercadopago/maker'
/* remember to change this when you get the mercadoPago production key */
MercadoPago.configure({
  sandbox: true,
  access_token: process.env.MERCADOPAGO_SANDBOX_KEY,
})
/* if we want to use this microservice in another project,
this function is useful to make differents urls */
const back_urls = maker.backUrl(
  process.env.MERCADOPAGO_SUCCESS_URL,
  process.env.MERCADOPAGO_FAILURE_URL,
  process.env.MERCADOPAGO_PENDING_URL
)
/* same from back url apply here, but a string doesn't need a functional approach. */
const notification_url = process.env.MERCADOPAGO_NOTIFICATION_URL
/* if we wish to auto return after finishing the payment */
const auto_return = 'approved'
/* if you want to configure the maximun number of installments/cuotas or exclude payments methods or types */
/* in our case, we need to exclude 'ticket' type, with this we are not going to see servipag in the payments options */
const payment_methods = {
  excluded_payment_types: [{ id: 'ticket' }],
}

/**
 * Create default payment preference
 * Generates a standardized payment preference object with configured settings
 * 
 * @param {Array} items - Array of items to be purchased
 * @param {Object} payer - Payer information
 * @param {string} external_reference - External reference for the payment
 * @returns {Object} Payment preference configuration
 */
const defaultPreferenceMaker = (items, payer, external_reference) => ({
  items,
  payer,
  external_reference,
  back_urls,
  notification_url,
  auto_return,
  payment_methods,
})

export { MercadoPago, defaultPreferenceMaker }
