import { s3Client } from '../config/bucket'
import { PutObjectCommand } from '@aws-sdk/client-s3'

/**
 * middlerware for save in google storage cloud
 * handler single image only
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
    console.log(`Object uploaded successfully at ${response.Location}`)
    req.file.cloudStorageObject = req.file.originalname
    req.file.cloudStoragePublicUrl = getPublicUrl(awsname)
    next()
  } catch (error) {
    req.file.cloudStorageError = error
    console.log(error)
    next(err)
  }
}

export default storage
