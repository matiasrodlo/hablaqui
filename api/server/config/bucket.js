'use strict'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3' // Se importa para poder usar el servicio de S3

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})// Asignar objeto del S3

/**
 * @description Función para obtener la url de un avatar
 * @param {*} fileName - Nombre del archivo
 * @returns
 */
const getPublicUrlAvatar = filename => {
  // Más especifico para las imágenes de perfil.
  return `https://cdn.hablaqui.cl/profile-pictures/${filename}`
}

/**
 * @description Función para obtener la url de un avatar thumbnails
 * @param {*} filename - Nombre del archivo
 * @returns 
 */
// public URL for thumnail avatars (in thumbnail resolution)
const getPublicUrlAvatarThumb = filename => {
  // Especifico para las imágenes de perfil en miniatura para speccologos.
  return `https://cdn.hablaqui.cl/profile-pictures/thumbnails/${filename}_128x128`
}

/**
 * @description Función para subir un archivo al bucket
 * @param {*} key - Nombre del archivo
 * @param {*} data - Archivo
 */
const uploadFile = async (key, data) => {
  // Se utiliza para subir el archivo al bucket
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKETNAME,
    Key: `profile-pictures/${key}`,
    Body: data,
  })
  const command2 = new PutObjectCommand({
    Bucket: process.env.BUCKETNAME,
    Key: `profile-pictures/thumbnails/${key}_128x128`,
    Body: data,
  })
  // Se sube el archivo
  try {
    const response = await s3Client.send(command)
    console.log(`Object uploaded successfully at ${response.ETag}`)
    const response2 = await s3Client.send(command2)
    console.log(`Object uploaded successfully at ${response2.ETag}`)
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

export default { getPublicUrlAvatar, getPublicUrlAvatarThumb, uploadFile, deleteFile, s3Client }
