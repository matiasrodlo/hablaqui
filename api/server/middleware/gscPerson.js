import { s3Client, getPublicUrl } from '../config/bucket'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { isArray, isEmpty } from 'underscore'
const logger = require('../utils/logger');

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
      new Promise(async (resolve, reject) => {
        const awsname = `${Date.now()}-${req.files.documents[i].originalname}`
        // Se utiliza para subir el archivo al bucket
        const command = new PutObjectCommand({
          Bucket: process.env.BUCKETNAME,
          Key: awsname,
          Body: req.files.documents[i].buffer,
          ContentType: req.files.documents[i].mimetype,
        })
        // Se sube el archivo
        try {
          const response = await s3Client.send(command)
          logger.info(`Object uploaded successfully at ${response.Location}`)
          next()
        } catch (error) {
          logger.error('Error uploading GSC person:', error)
          req.files.documents[i].cloudStorageError = error
          next(error)
        }
      })
    )
  }
  req.body.hasDocuments = true
  await Promise.all(pendingPromises).then((res) => (req.body.documents = res))
  next()
}

const uploadAvatar = async (req, res, next) => {
  if (
    typeof req.files.avatar === 'undefined' ||
    (isArray(req.files.avatar) && isEmpty(req.files.avatar))
  ) {
    return next()
  }
  const awsname = `${Date.now()}-${req.files.documents[i].originalname}`
  // Se utiliza para subir el archivo al bucket
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKETNAME,
    Key: awsname,
    Body: req.files.documents[i].buffer,
    ContentType: req.files.documents[i].mimetype,
  })
  // Se sube el archivo
  try {
    const response = await s3Client.send(command)
    logger.info(`Object uploaded successfully at ${response.Location}`)
    req.body.avatar = getPublicUrl(gcsname)
    req.body.thumbnail = getPublicUrl(gcsname)
    next()
  } catch (error) {
    console.log(err)
    req.files.avatar[0].cloudStorageError = err
    next(error)
  }
}

export { uploadAvatar, uploadDocuments }
