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
const AWS = require('aws-sdk')
const { Storage } = require('@google-cloud/storage')

const changeRole = async () => {
  // Se buca a todos los usuarios con el rol de especialista
  const user = await userModel.find({ role: 'psychologist' })
  if (!user) return conflictResponse('No se encontro ningun usuario')
  // Se cambia el rol de especialista a especialista
  await userModel.updateMany({ role: 'psychologist' }, { role: 'specialist' })
  return okResponse('Rol cambiado', { user })
}

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

const removeRole = async () => {
  // Se buca a todos los usuarios con el rol de especialista
  const user = await userModel.find({ role: 'specialist' })
  if (!user) return conflictResponse('No se encontro ningun usuario')
  // Se cambia el rol de especialista a especialista
  await userModel.updateMany({ role: 'specialist' }, { role: 'psychologist' })
  return okResponse('Rol cambiado', { user })
}

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

const migrationGcpBucketToAws = async () => {
  const storage = new Storage()
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  })
  const bucketName = 'hablaqui-content'

  // Obtén una lista de todos los archivos en el bucket de Cloud Storage
  const [files] = await storage.bucket(bucketName).getFiles()

  // Copia cada archivo del bucket de Cloud Storage al bucket de S3
  await Promise.all(
    files.map(async (file) => {
      const [destinationFile] = await file.copy(s3, {
        destinationBucketName: 'hablaqui-content',
        destination: file.name,
      })
      console.log(
        `Archivo ${file.name} copiado a S3 como ${destinationFile.name}.`
      )
    })
  )
}

const scriptsService = {
  changeRole,
  addProfesion,
  removeProfesion,
  removeRole,
  migrateAll,
  stepBack,
}

export default Object.freeze(scriptsService)
