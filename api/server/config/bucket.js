'use strict'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3' // Se importa para poder usar el servicio de S3
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner' // Se utiliza para obtener la url

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})// Asignar objeto del S3

/**
 * @description Función para obtener la url de un archivo
 * @param {*} fileName - Nombre del archivo
 * @returns
 */
const getPublicUrl = (fileName) => {
  // Se utiliza para obtener la url del archivo
  const presigner = new S3RequestPresigner({ ...s3Client.config })

  // Se obtiene la url del archivo
  const command = presigner.presignCommand({
    command: {
      input: {
        Bucket: process.env.BUCKETNAME,
        Key: fileName,
      },
    },
    expiresIn: 3600, // Tiempo de expiración de la URL en segundos
  })

  // Se retorna la url
  const url = command.presignedRequest.url
  return url
}

/**
 * @description Función para subir un archivo al bucket
 * @param {*} key - Nombre del archivo
 * @param {*} data - Archivo
 */
const uploadFile = async (key, data, type) => {
  // Se utiliza para subir el archivo al bucket
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKETNAME,
    Key: key,
    Body: data,
    ContentType: type,
  })
  // Se sube el archivo
  try {
    const response = await s3Client.send(command)
    console.log(`Object uploaded successfully at ${response.Location}`)
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description Función para eliminar un archivo del bucket
 * @param {*} key - Nombre del archivo
 */
const deleteFile = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKETNAME,
    Key: key,
  })

  try {
    const response = await s3Client.send(command)
    console.log(
      `Object deleted successfully with status code ${response.$metadata.httpStatusCode}`
    )
  } catch (error) {
    console.log(error)
  }
}

export default { getPublicUrl, uploadFile, deleteFile, s3Client }
