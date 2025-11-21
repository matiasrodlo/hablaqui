/**
 * Price Formatter Utility
 * 
 * This module provides functions for formatting and manipulating price values
 * in the Hablaquí platform, including currency formatting and price calculations.
 * 
 * @module utils/functions/priceFormatter
 */

/**
 * Formats a number as a currency string
 * 
 * @param {number} price - Price value to format
 * @param {string} [currency='CLP'] - Currency code
 * @param {string} [locale='es-CL'] - Locale for formatting
 * @returns {string} Formatted price string
 * 
 * @example
 * // Format price in Chilean Pesos
 * const formatted = formatPrice(15000);
 * // Returns: "$15.000"
 * 
 * @example
 * // Format price in USD
 * const formatted = formatPrice(15.99, 'USD', 'en-US');
 * // Returns: "$15.99"
 */
const formatPrice = (price, currency = 'CLP', locale = 'es-CL') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'CLP' ? 0 : 2,
    maximumFractionDigits: currency === 'CLP' ? 0 : 2
  }).format(price)
}

/**
 * Extracts numeric value from a formatted price string
 * 
 * @param {string} formattedPrice - Formatted price string (e.g., "$15.000")
 * @returns {number} Numeric price value
 * 
 * @example
 * // Extract numeric value
 * const value = extractPriceValue("$15.000");
 * // Returns: 15000
 */
const extractPriceValue = (formattedPrice) => {
  return Number(formattedPrice.replace(/[^0-9.-]+/g, ''))
}

/**
 * Calculates price with tax
 * 
 * @param {number} price - Base price
 * @param {number} [taxRate=0.19] - Tax rate (default: 19% for Chile)
 * @returns {number} Price with tax
 * 
 * @example
 * // Calculate price with tax
 * const total = calculatePriceWithTax(10000);
 * // Returns: 11900
 */
const calculatePriceWithTax = (price, taxRate = 0.19) => {
  return Math.round(price * (1 + taxRate))
}

/**
 * Calculates price without tax
 * 
 * @param {number} priceWithTax - Price including tax
 * @param {number} [taxRate=0.19] - Tax rate (default: 19% for Chile)
 * @returns {number} Price without tax
 * 
 * @example
 * // Calculate price without tax
 * const basePrice = calculatePriceWithoutTax(11900);
 * // Returns: 10000
 */
const calculatePriceWithoutTax = (priceWithTax, taxRate = 0.19) => {
  return Math.round(priceWithTax / (1 + taxRate))
}

/**
 * Formats a price range
 * 
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {string} [currency='CLP'] - Currency code
 * @returns {string} Formatted price range
 * 
 * @example
 * // Format price range
 * const range = formatPriceRange(10000, 20000);
 * // Returns: "$10.000 - $20.000"
 */
const formatPriceRange = (minPrice, maxPrice, currency = 'CLP') => {
  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`
}

module.exports = {
  formatPrice,
  extractPriceValue,
  calculatePriceWithTax,
  calculatePriceWithoutTax,
  formatPriceRange
}
