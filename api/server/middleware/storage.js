import { bucket, getPublicUrl } from '../config/bucket'

/**
 * middlerware for save in google storage cloud
 * handler single image only
 */
const storage = (req, res, next) => {
  if (!req.file) return next()
  const gcsname = `${Date.now()}-${req.file.originalname}`
  const file = bucket.file(gcsname)
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  })
  stream.on('error', err => {
    req.file.cloudStorageError = err
    next(err)
  })
  stream.on('finish', () => {
    req.file.cloudStorageObject = req.file.originalname
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
    next()
  })
  stream.end(req.file.buffer)
}

export default storage
