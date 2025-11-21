// Scripts Controller
// This controller handles HTTP requests related to administrative scripts, such as changing roles, managing professions, and migrating data.

'use strict'

import scriptsService from '../services/scripts'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

/**
 * @description - This function is used to change the role of a user.
 * @param {object} req - The request object (Role change details)
 * @param {object} res - The response object (Response code and message)
 * @returns {object} - The response object
 */
const changeRole = async (req, res) => {
  try {
    const { data, code } = await scriptsService.changeRole()
    restResponse(data, code, res)
  } catch (e) {
    errorCallback(e, res, 'Error changing the role')
  }
}

/**
 * @description - This function is used to add a profession to a specialist.
 * @param {object} req - The request object (Profession details)
 * @param {object} res - The response object (Response code and message)
 * @returns {object} - The response object
 */
const addProfesion = async (req, res) => {
  try {
    const { data, code } = await scriptsService.addProfesion()
    restResponse(data, code, res)
  } catch (e) {
    errorCallback(e, res, 'Error adding the profession')
  }
}

/**
 * @description - This function is used to remove a profession from a specialist.
 * @param {object} req - The request object (Profession details)
 * @param {object} res - The response object (Response code and message)
 * @returns {object} - The response object
 */
const removeProfesion = async (req, res) => {
  try {
    const { data, code } = await scriptsService.removeProfesion()
    restResponse(data, code, res)
  } catch (e) {
    errorCallback(e, res, 'Error removing the profession')
  }
}

/**
 * @description - This function is used to remove a role from a user.
 * @param {object} req - The request object (Role details)
 * @param {object} res - The response object (Response code and message)
 * @returns {object} - The response object
 */
const removeRol = async (req, res) => {
  try {
    const { data, code } = await scriptsService.removeRole()
    restResponse(data, code, res)
  } catch (e) {
    errorCallback(e, res, 'Error removing the role')
  }
}

/**
 * @description - This function is used to migrate all data.
 * @param {object} req - The request object (Migration details)
 * @param {object} res - The response object (Response code and message)
 * @returns {object} - The response object
 */
const migrateAll = async (req, res) => {
  try {
    const { data, code } = await scriptsService.migrateAll()
    restResponse(data, code, res)
  } catch (e) {
    errorCallback(e, res, 'Error migrating data')
  }
}

/**
 * @description - This function is used to step back in the migration process.
 * @param {object} req - The request object (Step back details)
 * @param {object} res - The response object (Response code and message)
 * @returns {object} - The response object
 */
const stepBack = async (req, res) => {
  try {
    const { data, code } = await scriptsService.stepBack()
    restResponse(data, code, res)
  } catch (e) {
    errorCallback(e, res, 'Error stepping back in migration')
  }
}

/**
 * @description - This function is used to migrate data from GCP bucket to AWS.
 * @param {object} req - The request object (Migration details)
 * @param {object} res - The response object (Response code and message)
 * @returns {object} - The response object
 */
const migrationGcpBucketToAws = async (req, res) => {
  try {
    const { data, code } = await scriptsService.migrationGcpBucketToAws()
    restResponse(data, code, res)
  } catch (e) {
    errorCallback(e, res, 'Error migrating data from GCP to AWS')
  }
}

// Controller object containing script-related operations
const scriptsController = {
  changeRole,
  addProfesion,
  removeProfesion,
  removeRol,
  migrateAll,
  stepBack,
  migrationGcpBucketToAws,
}

export default Object.freeze(scriptsController)
