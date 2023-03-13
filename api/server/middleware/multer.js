import multer, { memoryStorage } from 'multer'

// instace multer to export
export default multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
})
