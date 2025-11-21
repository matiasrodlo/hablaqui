/**
 * PDF Generation Utility
 * 
 * This module provides functionality for generating PDF documents from HTML content
 * and streaming them directly to the response.
 * 
 * @module utils/pdf/createToStream
 */

import pdf from 'html-pdf'
import { logError } from '../../config/pino'

/**
 * Default configuration for PDF generation
 * Sets up standard US Letter size and header/footer dimensions
 * 
 * @type {Object}
 */
const htmlPdfConfig = {
  height: '11.25in',  // US Letter height
  width: '8.5in',     // US Letter width
  header: {
    height: '20mm',   // Header height
  },
  footer: {
    height: '20mm',   // Footer height
  },
}

/**
 * Creates a PDF from HTML content and streams it to the response
 * 
 * @param {string} data - HTML content to convert to PDF
 * @param {Object} res - Express response object
 * 
 * @example
 * // Generate and stream a PDF
 * createPdfWithStreamAndSendResponse(htmlContent, res);
 * 
 * @returns {void} Streams the PDF directly to the response
 */
export const createPdfWithStreamAndSendResponse = (data, res) => {
  pdf.create(data, htmlPdfConfig).toStream(function(err, stream) {
    if (err) {
      logError(err)
      res.sendStatus(400)
    } else {
      res.header('Content-type', 'application/pdf')
      stream.pipe(res)
    }
  })
}
