/**
 * AWS S3 Bucket Configuration and Operations
 * 
 * This module provides functionality for managing files in an AWS S3 bucket,
 * specifically for handling profile pictures and their thumbnails in the Hablaquí system.
 * 
 * Features:
 * - S3 client configuration with AWS credentials
 * - Profile picture upload with automatic thumbnail generation
 * - Public URL generation for profile pictures and thumbnails
 * - File deletion from the bucket
 * 
 * @module config/bucket
 * @requires @aws-sdk/client-s3 - AWS SDK for S3 operations
 */

'use strict'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3' // Se importa para poder usar el servicio de S3
const logger = require('../utils/logger');

/**
 * Initialize S3 client with AWS credentials
 * Creates a new S3 client instance with region and access credentials
 */
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})// Asignar objeto del S3

/**
 * Generate public URL for a profile picture
 * 
 * @param {string} filename - Name of the profile picture file
 * @returns {string} Public URL for the profile picture
 */
const getPublicUrlAvatar = filename => {
  // Más especifico para las imágenes de perfil.
  return `https://cdn.hablaqui.cl/profile-pictures/${filename}`
}

/**
 * Generate public URL for a profile picture thumbnail
 * Creates a URL for the 128x128 thumbnail version of the profile picture
 * 
 * @param {string} filename - Name of the profile picture file
 * @returns {string} Public URL for the thumbnail
 */
// public URL for thumnail avatars (in thumbnail resolution)
const getPublicUrlAvatarThumb = filename => {
  // Especifico para las imágenes de perfil en miniatura para speccologos.
  return `https://cdn.hablaqui.cl/profile-pictures/thumbnails/${filename}_128x128`
}

/**
 * Upload a file to the S3 bucket
 * Uploads both the original file and a thumbnail version
 * 
 * @param {string} key - Name of the file to upload
 * @param {Buffer|Stream} data - File data to upload
 * @returns {Promise<void>}
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
    logger.info(`Object uploaded successfully at ${response.ETag}`)
    const response2 = await s3Client.send(command2)
    logger.info(`Object uploaded successfully at ${response2.ETag}`)
    return response;
  } catch (error) {
    logger.error('Error uploading file:', error)
    throw error;
  }
}

/**
 * Delete a file from the S3 bucket
 * 
 * @param {string} key - Name of the file to delete
 * @returns {Promise<void>}
 */
const deleteFile = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKETNAME,
    Key: key,
  })

  try {
    const response = await s3Client.send(command)
    logger.info(`Object deleted successfully with status code ${response.$metadata.httpStatusCode}`)
  } catch (error) {
    logger.error('Error deleting file:', error)
  }
}

export default { getPublicUrlAvatar, getPublicUrlAvatarThumb, uploadFile, deleteFile, s3Client }
