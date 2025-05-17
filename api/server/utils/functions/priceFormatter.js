/**
 * Price Formatter Utility
 * 
 * This module provides functions for formatting prices in USD currency format.
 * It uses the Intl.NumberFormat API to ensure consistent price formatting across the application.
 * 
 * @module utils/functions/priceFormatter
 */

/**
 * Formats a number as USD currency
 * 
 * @param {number} price - The price to format
 * @returns {string} Formatted price string in USD (e.g., "$1,234")
 * 
 * @example
 * // Format a price
 * priceFormatter(1234.56); // Returns "$1,235"
 * 
 * @example
 * // Format a price with no decimal places
 * priceFormatter(1000); // Returns "$1,000"
 */
export const priceFormatter = price => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })

  return formatter.format(price)
}
