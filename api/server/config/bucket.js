// import { Storage } from '@google-cloud/storage' // Se importa para poder usar el servicio de Cloud Storage
import AWS from 'aws-sdk' // Se importa para poder usar el servicio de S3

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
}) // Asignar objeto del S3

const getPublicUrl = (fileName) => {
  const params = {
    Bucket: process.env.BUCKETNAME,
    Key: fileName,
    Expires: 60,
  }
  return s3.getSignedUrl('getObject', params)
}

export { s3, getPublicUrl }
