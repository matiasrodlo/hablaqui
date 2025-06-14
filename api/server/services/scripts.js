/**
 * Scripts Service
 * 
 * This module handles various database migration and maintenance scripts for the Hablaquí system.
 * It provides functionality for role changes, document migrations, and data cleanup.
 * 
 * Features:
 * - Role management scripts
 * - Document migration utilities
 * - Data cleanup operations
 * - Field renaming utilities
 * - Cloud storage migration
 * - Database schema updates
 * - Bulk data operations
 * 
 * @module services/scripts
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../models/user - User model
 * @requires ../models/specialist - Specialist model
 * @requires ../models/recruitment - Recruitment model
 * @requires ../models/sessions - Session model
 * @requires ../models/chat - Chat model
 * @requires ../models/email - Email model
 * @requires ../models/evaluation - Evaluation model
 * @requires ../models/psychologist - Psychologist model
 * @requires ../models/transaction - Transaction model
 * @requires ../config/bucket - AWS S3 configuration
 * @requires @aws-sdk/client-s3 - AWS SDK
 * @requires @google-cloud/storage - Google Cloud Storage
 */

'use strict'

import { okResponse, conflictResponse } from '../utils/responses/functions'
import userModel from '../models/user'
import specModel from '../models/specialist'
import recruitmentsModel from '../models/recruitment'
import sessionModel from '../models/sessions'
import Chat from '../models/chat'
import Email from '../models/email'
import Evaluation from '../models/evaluation'
import Psychologist from '../models/psychologist'
import transactionModel from '../models/transaction'
import s3 from '../config/bucket'
import { PutObjectCommand } from '@aws-sdk/client-s3'
const { Storage } = require('@google-cloud/storage')

/**
 * Changes user role from psychologist to specialist
 * 
 * This function:
 * 1. Finds all users with psychologist role
 * 2. Updates their role to specialist
 * 3. Returns updated user list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated users
 */
const changeRole = async () => {
  // Se buca a todos los usuarios con el rol de especialista
  const user = await userModel.find({ role: 'psychologist' })
  if (!user) return conflictResponse('No se encontro ningun usuario')
  // Se cambia el rol de especialista a especialista
  await userModel.updateMany({ role: 'psychologist' }, { role: 'specialist' })
  return okResponse('Rol cambiado', { user })
}

/**
 * Adds profession field to users, specialists, and recruitments
 * 
 * This function:
 * 1. Finds all relevant documents without profession field
 * 2. Updates them with psychologist profession
 * 3. Returns updated document list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated documents
 */
const addProfesion = async () => {
  // Se busca a todos los usuarios con el rol de especialista que no tengan el atributo profesion
  const users = await userModel.find({
    role: 'specialist',
    profession: { $exists: false },
  })
  const specialists = await specModel.find({
    profession: { $exists: false },
  })
  const recruitments = await recruitmentsModel.find({
    profession: { $exists: false },
  })
  if (!users) return conflictResponse('No se encontro ningun usuario')
  if (!specialists) {
    return conflictResponse('No se encontro ningun especialista')
  }
  if (!recruitments) {
    return conflictResponse('No se encontro ningun reclutamiento')
  }
  // Se obtienen los id de los usuarios y especialistas
  const spec = specialists.map((spec) => spec._id)
  const user = users.map((user) => user._id)
  const recruitment = recruitments.map((recruitment) => recruitment._id)
  // Se agrega la profesion a los especialistas
  await specModel.updateMany(
    { _id: { $in: spec } },
    { $set: { profession: 'psychologist' } }
  )
  await userModel.updateMany(
    { _id: { $in: user } },
    { $set: { profession: 'psychologist' } }
  )
  await recruitmentsModel.updateMany(
    { _id: { $in: recruitment } },
    { $set: { profession: 'psychologist' } }
  )
  return okResponse('Profesion agregada', { user })
}

/**
 * Migrates chat documents from psychologist to specialist reference
 * 
 * This function:
 * 1. Finds all chats with psychologist field
 * 2. Renames field to specialist
 * 3. Returns updated chat list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated chats
 */
const migrateDocumentChat = async () => {
  const psychologist = await Chat.find({
    psychologist: { $exists: true },
  })
  if (!psychologist) return okResponse('No hay chats por actualizar')
  const chats = psychologist.map((chat) => chat._id)
  await Chat.updateMany(
    { _id: { $in: chats } },
    { $rename: { psychologist: 'specialist' } }
  )
  return okResponse('Chats actualizados', { psychologist })
}

/**
 * Migrates email documents from psychologist to specialist reference
 * 
 * This function:
 * 1. Finds all emails with psyRef field
 * 2. Renames field to specRef
 * 3. Updates lastMessageSendBy field
 * 4. Returns updated email list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated emails
 */
const migrateDocumentEmail = async () => {
  const psychologist = await Email.find({
    psyRef: { $exists: true },
  })
  if (!psychologist) return okResponse('No hay correos por actualizar')
  const emails = psychologist.map((email) => email._id)
  await Email.updateMany(
    { _id: { $in: emails } },
    {
      $rename: { psyRef: 'specRef' },
      $set: { lastMessageSendBy: 'specialist' },
    }
  )
  return okResponse('Correos actualizados', { psychologist })
}

/**
 * Migrates evaluation documents from psychologist to specialist reference
 * 
 * This function:
 * 1. Finds all evaluations with psychologist field
 * 2. Renames field to specialist
 * 3. Returns updated evaluation list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated evaluations
 */
const migrateDocumentEvaluation = async () => {
  const psychologist = await Evaluation.find({
    psychologist: { $exists: true },
  })
  if (!psychologist) return okResponse('No hay evaluaciones por actualizar')
  const evaluations = psychologist.map((evaluation) => evaluation._id)
  await Evaluation.updateMany(
    { _id: { $in: evaluations } },
    { $rename: { psychologist: 'specialist' } }
  )
  return okResponse('Evaluaciones actualizadas', { psychologist })
}

/**
 * Migrates psychologist documents to specialist model
 * 
 * This function:
 * 1. Finds all psychologist documents
 * 2. Creates corresponding specialist documents
 * 3. Deletes original psychologist documents
 * 4. Returns migration status
 * 
 * @async
 * @returns {Promise<Object>} Response with migration status
 */
const migrateDocumentPsychologist = async () => {
  const psychologist = await Psychologist.find()
  if (!psychologist) return okResponse('No hay especialistas por actualizar')
  psychologist.forEach(async (psy) => {
    const specialist = JSON.parse(JSON.stringify(psy))
    await specModel.create(specialist)
  })
  await Psychologist.deleteMany()
  return okResponse('Especialistas actualizados', { psychologist })
}

/**
 * Migrates session documents from psychologist to specialist reference
 * 
 * This function:
 * 1. Finds all sessions with psychologist field
 * 2. Renames field to specialist
 * 3. Returns updated session list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated sessions
 */
const migrateDocumentSessions = async () => {
  const psychologist = await sessionModel.find({
    psychologist: { $exists: true },
  })
  if (!psychologist) return okResponse('No hay sesiones por actualizar')
  const sessions = psychologist.map((session) => session._id)
  await sessionModel.updateMany(
    { _id: { $in: sessions } },
    { $rename: { psychologist: 'specialist' } }
  )
  return okResponse('Sesiones actualizadas', { psychologist })
}

/**
 * Migrates transaction documents from psychologist to specialist reference
 * 
 * This function:
 * 1. Finds all transactions with psychologist field
 * 2. Renames field to specialist
 * 3. Returns updated transaction list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated transactions
 */
const migrateDocumentTransactions = async () => {
  const psychologist = await transactionModel.find({
    psychologist: { $exists: true },
  })
  if (!psychologist) return okResponse('No hay transacciones por actualizar')
  const transactions = psychologist.map((transaction) => transaction._id)
  await transactionModel.updateMany(
    { _id: { $in: transactions } },
    { $rename: { psychologist: 'specialist' } }
  )
  return okResponse('Transacciones actualizadas', { psychologist })
}

/**
 * Migrates user documents from psychologist to specialist reference
 * 
 * This function:
 * 1. Finds all users with psychologist field
 * 2. Renames field to specialist
 * 3. Returns updated user list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated users
 */
const migrateDocumentUsers = async () => {
  const psychologist = await userModel.find({
    specialist: { $exists: false },
    psychologist: { $exists: true },
  })
  if (!psychologist) return okResponse('No hay usuarios por actualizar')
  const users = psychologist.map((psy) => psy._id)
  await userModel.updateMany(
    { _id: { $in: users } },
    { $rename: { psychologist: 'specialist' } }
  )
  return okResponse('Usuarios actualizados', { psychologist })
}

/**
 * Renames plan fields from psyPlans to specPlans
 * 
 * This function:
 * 1. Finds all documents with psyPlans field
 * 2. Renames field to specPlans
 * 3. Returns updated document list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated documents
 */
const renamePsyPlans = async () => {
  const psychologist = await Psychologist.find({
    specPlans: { $exists: false },
  })
  const recruitment = await recruitmentsModel.find({
    specPlans: { $exists: false },
  })
  if (!psychologist) return okResponse('No hay especialistas por actualizar')
  if (!recruitment) return okResponse('No hay reclutamientos por actualizar')
  const psy = psychologist.map((psy) => psy._id)
  const rec = recruitment.map((rec) => rec._id)
  // Cambiar el nombre de psyPlans a specPlans
  await Psychologist.updateMany(
    { _id: { $in: psy } },
    { $rename: { psyPlans: 'specPlans' } },
    { multi: true }
  )
  await recruitmentsModel.updateMany(
    { _id: { $in: rec } },
    { $rename: { psyPlans: 'specPlans' } },
    { multi: true }
  )
  return okResponse('Especialistas actualizados', { psychologist })
}

/**
 * Executes all migration scripts in sequence
 * 
 * This function:
 * 1. Renames plan fields
 * 2. Migrates all document types
 * 3. Returns overall migration status
 * 
 * @async
 * @returns {Promise<Object>} Response with migration status
 */
const migrateAll = async () => {
  await renamePsyPlans()
  await migrateDocumentChat()
  await migrateDocumentEmail()
  await migrateDocumentEvaluation()
  await migrateDocumentPsychologist()
  await migrateDocumentSessions()
  await migrateDocumentTransactions()
  await migrateDocumentUsers()
  return okResponse('Migracion completada')
}

/**
 * Removes profession field from users, specialists, and recruitments
 * 
 * This function:
 * 1. Finds all documents with profession field
 * 2. Removes the field
 * 3. Returns updated document list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated documents
 */
const removeProfesion = async () => {
  // Se busca a todos los usuarios con el rol de especialista que no tengan el atributo profesion
  const users = await userModel.find({
    role: 'specialist',
    profession: { $exists: true },
  })
  const specialists = await specModel.find({
    profession: { $exists: true },
  })
  const recruitments = await recruitmentsModel.find({
    profession: { $exists: true },
  })
  if (!users) return conflictResponse('No se encontro ningun usuario')
  if (!specialists) {
    return conflictResponse('No se encontro ningun especialista')
  }
  if (!recruitments) {
    return conflictResponse('No se encontro ningun reclutamiento')
  }
  // Se obtienen los id de los usuarios y especialistas
  const spec = specialists.map((spec) => spec._id)
  const user = users.map((user) => user._id)
  const recruitment = recruitments.map((recruitment) => recruitment._id)
  // Se agrega la profesion a los especialistas
  await specModel.updateMany(
    { _id: { $in: spec } },
    { $unset: { profession: '' } }
  )
  await userModel.updateMany(
    { _id: { $in: user } },
    { $unset: { profession: '' } }
  )
  await recruitmentsModel.updateMany(
    { _id: { $in: recruitment } },
    { $unset: { profession: '' } }
  )
  return okResponse('Profesion eliminada', { user })
}

/**
 * Changes user role from specialist to psychologist
 * 
 * This function:
 * 1. Finds all users with specialist role
 * 2. Updates their role to psychologist
 * 3. Returns updated user list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated users
 */
const removeRole = async () => {
  // Se buca a todos los usuarios con el rol de especialista
  const user = await userModel.find({ role: 'specialist' })
  if (!user) return conflictResponse('No se encontro ningun usuario')
  // Se cambia el rol de especialista a especialista
  await userModel.updateMany({ role: 'specialist' }, { role: 'psychologist' })
  return okResponse('Rol cambiado', { user })
}

/**
 * Reverts chat documents from specialist to psychologist reference
 * 
 * This function:
 * 1. Finds all chats with specialist field
 * 2. Renames field to psychologist
 * 3. Returns updated chat list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated chats
 */
const returnDocumentChat = async () => {
  const psychologist = await Chat.find({
    psychologist: { $exists: false },
  })
  if (!psychologist) return okResponse('No hay chats por actualizar')
  const chats = psychologist.map((chat) => chat._id)
  await Chat.updateMany(
    { _id: { $in: chats } },
    {
      $rename: { specialist: 'psychologist' },
      $set: { lastMessageSendBy: 'psychologist' },
    }
  )
  return okResponse('Chats actualizados', { psychologist })
}

/**
 * Reverts email documents from specialist to psychologist reference
 * 
 * This function:
 * 1. Finds all emails with specRef field
 * 2. Renames field to psyRef
 * 3. Updates lastMessageSendBy field
 * 4. Returns updated email list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated emails
 */
const returnDocumentEmail = async () => {
  const psychologist = await Email.find({
    psyRef: { $exists: false },
  })
  if (!psychologist) return okResponse('No hay correos por actualizar')
  const emails = psychologist.map((email) => email._id)
  await Email.updateMany(
    { _id: { $in: emails } },
    { $rename: { specRef: 'psyRef' } }
  )
  return okResponse('Correos actualizados', { psychologist })
}

/**
 * Reverts evaluation documents from specialist to psychologist reference
 * 
 * This function:
 * 1. Finds all evaluations with specialist field
 * 2. Renames field to psychologist
 * 3. Returns updated evaluation list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated evaluations
 */
const returnDocumentEvaluation = async () => {
  const psychologist = await Evaluation.find({
    psychologist: { $exists: false },
  })
  if (!psychologist) return okResponse('No hay evaluaciones por actualizar')
  const evaluations = psychologist.map((evaluation) => evaluation._id)
  await Evaluation.updateMany(
    { _id: { $in: evaluations } },
    { $rename: { specialist: 'psychologist' } }
  )
  return okResponse('Evaluaciones actualizadas', { psychologist })
}

/**
 * Reverts specialist documents to psychologist model
 * 
 * This function:
 * 1. Finds all specialist documents
 * 2. Creates corresponding psychologist documents
 * 3. Deletes original specialist documents
 * 4. Returns migration status
 * 
 * @async
 * @returns {Promise<Object>} Response with migration status
 */
const returnDocumentPsychologist = async () => {
  const psychologist = await specModel.find()
  if (!psychologist) return okResponse('No hay especialistas por actualizar')
  psychologist.forEach(async (psy) => {
    const specialist = JSON.parse(JSON.stringify(psy))
    await Psychologist.create(specialist)
  })
  await specModel.deleteMany()
  return okResponse('Especialistas actualizados', { psychologist })
}

/**
 * Reverts session documents from specialist to psychologist reference
 * 
 * This function:
 * 1. Finds all sessions with specialist field
 * 2. Renames field to psychologist
 * 3. Returns updated session list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated sessions
 */
const returnDocumentSessions = async () => {
  const psychologist = await sessionModel.find({
    psychologist: { $exists: false },
  })
  if (!psychologist) return okResponse('No hay sesiones por actualizar')
  const sessions = psychologist.map((session) => session._id)
  await sessionModel.updateMany(
    { _id: { $in: sessions } },
    { $rename: { specialist: 'psychologist' } }
  )
  return okResponse('Sesiones actualizadas', { psychologist })
}

/**
 * Reverts transaction documents from specialist to psychologist reference
 * 
 * This function:
 * 1. Finds all transactions with specialist field
 * 2. Renames field to psychologist
 * 3. Returns updated transaction list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated transactions
 */
const returnDocumentTransactions = async () => {
  const psychologist = await transactionModel.find({
    psychologist: { $exists: false },
  })
  if (!psychologist) return okResponse('No hay transacciones por actualizar')
  const transactions = psychologist.map((transaction) => transaction._id)
  await transactionModel.updateMany(
    { _id: { $in: transactions } },
    { $rename: { specialist: 'psychologist' } }
  )
  return okResponse('Transacciones actualizadas', { psychologist })
}

/**
 * Reverts user documents from specialist to psychologist reference
 * 
 * This function:
 * 1. Finds all users with specialist field
 * 2. Renames field to psychologist
 * 3. Returns updated user list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated users
 */
const returnDocumentUsers = async () => {
  const psychologist = await userModel.find({
    specialist: { $exists: true },
    psychologist: { $exists: false },
  })
  if (!psychologist) return okResponse('No hay usuarios por actualizar')
  const users = psychologist.map((psy) => psy._id)
  await userModel.updateMany(
    { _id: { $in: users } },
    { $rename: { specialist: 'psychologist' } }
  )
  return okResponse('Usuarios actualizados', { psychologist })
}

/**
 * Reverts plan fields from specPlans to psyPlans
 * 
 * This function:
 * 1. Finds all documents with specPlans field
 * 2. Renames field to psyPlans
 * 3. Returns updated document list
 * 
 * @async
 * @returns {Promise<Object>} Response with updated documents
 */
const returnPsyPlans = async () => {
  const psychologist = await Psychologist.find({
    specPlans: { $exists: true },
  })
  const recruitment = await recruitmentsModel.find({
    specPlans: { $exists: true },
  })
  if (!psychologist) return okResponse('No hay especialistas por actualizar')
  if (!recruitment) return okResponse('No hay reclutamientos por actualizar')
  const psy = psychologist.map((psy) => psy._id)
  const rec = recruitment.map((rec) => rec._id)
  // Cambiar el nombre de psyPlans a specPlans
  await Psychologist.updateMany(
    { _id: { $in: psy } },
    { $rename: { specPlans: 'psyPlans' } },
    { multi: true }
  )
  await recruitmentsModel.updateMany(
    { _id: { $in: rec } },
    { $rename: { specPlans: 'psyPlans' } },
    { multi: true }
  )
  return okResponse('Especialistas actualizados', { psychologist })
}

/**
 * Executes all reversion scripts in sequence
 * 
 * This function:
 * 1. Reverts all document types
 * 2. Renames plan fields
 * 3. Returns overall reversion status
 * 
 * @async
 * @returns {Promise<Object>} Response with reversion status
 */
const stepBack = async () => {
  await returnDocumentChat()
  await returnDocumentEmail()
  await returnDocumentEvaluation()
  await returnDocumentPsychologist()
  await returnDocumentSessions()
  await returnDocumentTransactions()
  await returnDocumentUsers()
  await returnPsyPlans()
  return okResponse('Todo actualizado')
}

/**
 * Migrates files from Google Cloud Storage to AWS S3
 * 
 * This function:
 * 1. Initializes cloud storage clients
 * 2. Lists files in GCP bucket
 * 3. Downloads files from GCP
 * 4. Uploads files to AWS
 * 5. Returns migration status
 * 
 * @async
 * @returns {Promise<Object>} Response with migration status
 */
const migrationGcpBucketToAws = async () => {
  const gcs = new Storage()
  const gcsBucket = ['hablaqui-email', 'hablaqui-content', 'hablaqui-blog']
  gcsBucket.forEach(async (gcsBucketName) => {
    try {
      // Obtiene los archivos del bucket de GCP
      const [gcsFiles] = await gcs.bucket(gcsBucketName).getFiles()
      if (!gcsFiles) return okResponse('No hay archivos en el bucket')
      for (const file of gcsFiles) {
        if (!file) 
          continue
        if (!file.name) {
          continue
        }
        // Descarga el archivo
        const [contents] = await file.download()
        if (!contents || contents.length === 0) {
          continue
        }
        // Sube el archivo a S3 + carpeta
        const s3Key = file.name
        
        const s3Params = {
          Bucket: gcsBucketName,
          Key: s3Key,
          Body: contents,
        }
        const putObjectCommand = new PutObjectCommand(s3Params)
        const putObjectResponse = await s3.s3Client.send(putObjectCommand)
        console.log(
          `Uploaded ${s3Key} to S3 with ETag: ${putObjectResponse.ETag}`
        )
      }
    } catch (error) {
      console.error(error)
    }
  })
  return okResponse('Todo actualizado')
}

const scriptsService = {
  changeRole,
  addProfesion,
  migrateDocumentChat,
  migrateDocumentEmail,
  migrateDocumentEvaluation,
  migrateDocumentPsychologist,
  migrateDocumentSessions,
  migrateDocumentTransactions,
  migrateDocumentUsers,
  renamePsyPlans,
  migrateAll,
  removeProfesion,
  removeRole,
  returnDocumentChat,
  returnDocumentEmail,
  returnDocumentEvaluation,
  returnDocumentPsychologist,
  returnDocumentSessions,
  returnDocumentTransactions,
  returnDocumentUsers,
  returnPsyPlans,
  stepBack,
  migrationGcpBucketToAws
}

export default Object.freeze(scriptsService)
