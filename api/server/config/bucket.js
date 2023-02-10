import { Storage } from '@google-cloud/storage' // Se importa para poder usar el servicio de Cloud Storage

const gcs = new Storage() // Asignar objeto del storage

const bucketName = process.env.BUCKETNAME // A traves de la variable de entorno se obtiene el nombre del bucket.

const bucket = gcs.bucket(bucketName) // Se crea el bucket

// general purpose public URL (static content)
const getPublicUrl = (filename) => {
  // Se define una función a la cual se le entrega un nonbre de archivo, y devuelve la URL pública.
  return `https://storage.googleapis.com/${bucketName}/general/${filename}`
}

// public URL for avatars (in full resolution)
const getPublicUrlAvatar = (filename) => {
  // Más especifico para las imágenes de perfil.
  return `https://cdn.hablaqui.cl/profile-pictures/${filename}`
}

// public URL for thumnail avatars (in thumbnail resolution)
const getPublicUrlAvatarThumb = (filename) => {
  // Especifico para las imágenes de perfil en miniatura para speccologos.
  return `https://cdn.hablaqui.cl/profile-pictures/thumbnails/${filename}_128x128`
}

export { bucket, getPublicUrl, getPublicUrlAvatar, getPublicUrlAvatarThumb }
