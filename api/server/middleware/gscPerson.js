import {
  s3,
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
        const awsname = `${Date.now()}-${req.files.documents[i].originalname}`
        const paramsFile = {
          Bucket: process.env.BUCKETNAME,
          Key: `${awsname}`,
          Body: req.files.documents[i].buffer,
          ContentType: req.files.documents[i].mimetype,
        }
        s3.putObject(paramsFile, (err, data) => {
          if (err) {
            console.log(err)
            req.files.documents[i].cloudStorageError = err
            next(err)
          } else {
            console.log('Archivo subido exitosamente a S3')
            next()
          }
        })
      })
    )
  }
  req.body.hasDocuments = true
  await Promise.all(pendingPromises).then((res) => (req.body.documents = res))
  next()
}

const uploadAvatar = (req, res, next) => {
  if (
    typeof req.files.avatar === 'undefined' ||
    (isArray(req.files.avatar) && isEmpty(req.files.avatar))
  ) {
    return next()
  }
  const awsname = `${Date.now()}-${req.files.documents[i].originalname}`
  const paramsFile = {
    Bucket: process.env.BUCKETNAME,
    Key: `${awsname}`,
    Body: req.files.documents[i].buffer,
    ContentType: req.files.documents[i].mimetype,
  }
  s3.putObject(paramsFile, (err, data) => {
    if (err) {
      req.files.avatar[0].cloudStorageError = err
      console.log(err)
      next(err)
    } else {
      req.body.avatar = getPublicUrl(gcsname)
      req.body.thumbnail = getPublicUrl(gcsname)
      console.log('Archivo subido exitosamente a S3')
      next()
    }
  })
}

export { uploadAvatar, uploadDocuments }
