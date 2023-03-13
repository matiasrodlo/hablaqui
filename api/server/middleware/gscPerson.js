import {
  bucket,
  getPublicUrl,
  getPublicUrlAvatar,
  getPublicUrlAvatarThumb,
} from '../config/bucket'
import { isArray, isEmpty } from 'underscore'

/**
 * middlerware for save in google storage cloud
 * handler for multiple images and documents
 */
const uploadDocuments = async (req, res, next) => {
  if (
    typeof req.files.documents === 'undefined' ||
    (isArray(req.files.documents) && isEmpty(req.files.documents))
  ) {
    return next()
  }

  const pendingPromises = []
  for (let i = 0; i < req.files.documents.length; i++) {
    pendingPromises.push(
      new Promise((resolve, reject) => {
        const gcsname = `${Date.now()}-${req.files.documents[i].originalname}`
        const file = bucket.file(gcsname)
        const stream = file.createWriteStream({
          metadata: {
            contentType: req.files.documents[i].mimetype,
          },
        })
        stream.on('error', err => {
          req.files.documents[i].cloudStorageError = err
          reject(err)
        })
        stream.on('finish', () => {
          resolve({
            name: req.files.documents[i].originalname,
            url: getPublicUrl(gcsname),
          })
        })
        stream.end(req.files.documents[i].buffer)
      })
    )
  }
  req.body.hasDocuments = true
  await Promise.all(pendingPromises).then(res => (req.body.documents = res))
  next()
}

const uploadAvatar = (req, res, next) => {
  if (
    typeof req.files.avatar === 'undefined' ||
    (isArray(req.files.avatar) && isEmpty(req.files.avatar))
  ) {
    return next()
  }

  const gcsname = `${Date.now()}-${req.files.avatar[0].originalname}`
  const file = bucket.file(gcsname)
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.files.avatar[0].mimetype,
    },
  })
  stream.on('error', err => {
    req.files.avatar[0].cloudStorageError = err
    next(err)
  })
  stream.on('finish', () => {
    req.body.avatar = getPublicUrlAvatar(gcsname)
    req.body.thumbnail = getPublicUrlAvatarThumb(gcsname)
    next()
  })
  stream.end(req.files.avatar[0].buffer)
}

export { uploadAvatar, uploadDocuments }
