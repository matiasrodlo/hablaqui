/**
 * Storage Middleware
 * 
 * This middleware handles file uploads to AWS S3 storage.
 * It processes uploaded files and stores them in the configured S3 bucket.
 * 
 * @module middleware/storage
 */

import { s3Client } from '../config/bucket'
import { PutObjectCommand } from '@aws-sdk/client-s3'
const logger = require('../utils/logger');

/**
 * Middleware for saving files to AWS S3 storage
 * Handles single file uploads and attaches cloud storage information to the request
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.file - Uploaded file information from multer
 * @param {Buffer} req.file.buffer - File buffer
 * @param {string} req.file.originalname - Original filename
 * @param {string} req.file.mimetype - File MIME type
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @example
 * // Use after multer middleware
 * router.post('/upload', 
 *   multerMiddleware.single('file'),
 *   storage,
 *   uploadController.handleUpload
 * );
 * 
 * @returns {Promise<void>} Resolves when file is uploaded or error occurs
 */
const storage = async (req, res, next) => {
  if (!req.file) return next()
  const awsname = `${Date.now()}-${req.file.originalname}`
  // Se utiliza para subir el archivo al bucket
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKETNAME,
    Key: `${awsname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  })
  // Se sube el archivo
  try {
    const response = await s3Client.send(command)
    logger.info(`Object uploaded successfully at ${response.Location}`)
    req.file.cloudStorageObject = req.file.originalname
    req.file.cloudStoragePublicUrl = getPublicUrl(awsname)
    next()
  } catch (error) {
    req.file.cloudStorageError = error
    logger.error('Error uploading file:', error)
    next(err)
  }
}

export default storage
