import s3 from '../../config/bucket'
import { PutObjectCommand } from '@aws-sdk/client-s3'

/**
 * middlerware for save in google storage cloud
 * handler single image only
 */
const storage = async (req, res, next) => {
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

  // Se utiliza para subir el archivo al bucket
  const s3Params = [{
    Bucket: process.env.BUCKETNAME,
    Key: `profile-pictures/${awsname}`,
    Body: req.file.buffer,
  },{
    Bucket: process.env.BUCKETNAME,
    Key: `profile-pictures/thumbnails/${awsname}_128x128`,
    Body: req.file.buffer,
  }]
  // Se sube el archivo
  try {
    const putObjectCommand = new PutObjectCommand(s3Params[0])
    const putObjectResponse = await s3.s3Client.send(putObjectCommand)
    console.log(`Object uploaded successfully at ${putObjectResponse.ETag}`)
    req.file.cloudStorageObject = req.file.originalname
    req.file.avatar = s3.getPublicUrlAvatar(awsname)
    const putObjectCommandThumb = new PutObjectCommand(s3Params[1])
    const putObjectResponseThumb = await s3.s3Client.send(putObjectCommandThumb)
    console.log(`Object uploaded successfully at ${putObjectResponseThumb.ETag}`)
    req.file.avatarThumbnail = s3.getPublicUrlAvatarThumb(awsname)
    next()
  } catch (error) {
    req.file.cloudStorageError = error
    console.log(error)
    next(error)
  }
}

export default storage
