/**
 * Multer Middleware
 * 
 * This middleware provides file upload functionality using Multer.
 * It handles multipart/form-data for file uploads with memory storage.
 * 
 * @module middleware/multer
 */

import multer, { memoryStorage } from 'multer'

/**
 * Multer instance configured for memory storage
 * 
 * Configuration:
 * - Uses memory storage (files are stored in memory as Buffer objects)
 * - Maximum file size: 10MB
 * 
 * @type {multer.Multer}
 * 
 * @example
 * // Use in route handler for file upload
 * router.post('/upload', multerMiddleware.single('avatar'), uploadController.handleUpload);
 * 
 * @example
 * // Use for multiple files
 * router.post('/upload-multiple', multerMiddleware.array('photos', 5), uploadController.handleMultipleUpload);
 */
export default multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
})
