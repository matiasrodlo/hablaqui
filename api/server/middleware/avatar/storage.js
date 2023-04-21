import { s3, getPublicUrl } from '../../config/bucket'

/**
 * middlerware for save in google storage cloud
 * handler single image only
 */
const storage = (req, res, next) => {
  if (!req.file) return next()
  const { name, lastName } = req.body

  const awsname = `${Date.now()}-${name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')}-${
    lastName
      ? lastName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036F]/g, '')
      : ''
  }`
  const paramsFile = {
    Bucket: process.env.BUCKETNAME,
    Key: `${awsname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }
  s3.putObject(paramsFile, (err, data) => {
    if (err) {
      console.log(err)
      req.file.cloudStorageError = err
      next(err)
    } else {
      req.file.cloudStorageObject = req.file.originalname
      req.file.avatar = getPublicUrl(gcsname)
      req.file.avatarThumbnail = getPublicUrl(gcsname)
      console.log('Archivo subido exitosamente a S3')
      next()
    }
  })
}

export default storage
