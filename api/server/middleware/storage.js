import { s3 } from '../config/bucket'

/**
 * middlerware for save in google storage cloud
 * handler single image only
 */
const storage = (req, res, next) => {
  if (!req.file) return next()
  const awsname = `${Date.now()}-${req.file.originalname}`
  const paramsFile = {
    Bucket: process.env.BUCKETNAME,
    Key: `${awsname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }
  s3.putObject(paramsFile, (err, data) => {
    if (err) {
      req.file.cloudStorageError = err
      console.log(err)
      next(err)
    } else {
      req.file.cloudStorageObject = req.file.originalname
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
      console.log('Archivo subido exitosamente a S3')
      next()
    }
  })
}

export default storage
