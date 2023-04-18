'use strict'

import { Router } from 'express'
import passport from 'passport'
import userController from '../controllers/users'
import userSchema from '../schemas/user'
import validation from '../middleware/validation'
import multer from '../middleware/multer'
import storageAvatar from '../middleware/avatar/storage'

const userRouter = Router()

/**
 * @description Registro de consultante hecho por el especialista
 * @method POST
 * @route /api/v1/user/register
 * @param {String} body.name - Nombre del consultante (requerido)
 * @param {String} body.email - Email del consultante (requerido)
 * @param {String} body.rut - Rut del consultante
 * @param {String} body.phone - Número de telefono del consultante
 * @return Objeto con el usuario
 * @access authenticated (specialist)
 */
userRouter.post(
  '/user/register',
  [
    passport.authenticate('jwt', { session: true }),
    validation(userSchema.newUserBySpec, 'body'),
  ],
  userController.registerUser
)

/**
 * @description Devuelve los datos del usuario logeado
 * @method GET
 * @route /api/v1/user/profile
 * @return Objeto con el usuario
 * @access authenticated (user)
 */
userRouter.get(
  '/user/profile',
  [passport.authenticate('jwt', { session: true })],
  userController.getUser
)

/**
 * @description Actualiza el especialista del usuario desde la intranet
 * @method PUT
 * @route /api/v1/dashboard/update/specialist
 * @param {String} body.newSpecialist - Id del especialista nuevo (requerido)
 * @param {String} body.oldSpecialist - Id del especialista anterior (requerido)
 * @param {String} body.user - Id del usuario al que se le va a cambiar el especialista (requerido)
 * @return Objeto usuario con nueva información
 * @access authenticated (user)
 */

userRouter.put('/dashboard/update/specialist', userController.updateSpecialist)

/**
 * @description Actualiza la información de un usuario logeado
 * @method PUT
 * @route /api/v1/user/update/profile
 * @param {Object} body.profile - Objeto con la información actualizada del perfil del usuario
 * @return Objeto usuario con nueva información
 * @access authenticated (user)
 */
userRouter.put(
  '/user/update/profile',
  [
    passport.authenticate('jwt', { session: true }),
    /* grantAccess('updateOwn', 'profile'), */
    validation(userSchema.updateProfile, 'body'),
  ],
  userController.updateProfile
)

/**
 * @description Actualiza la información de un usuario a través de us Id
 * @method PUT
 * @route /api/v1/user/update-one/:id
 * @param {String} params.id - ID del usuario al que se le actualizará su perfil
 * @param {Object} body.profile - Objeto con la información actulizada del perfil del usuario
 * @return Objeto usuario con nueva información
 * @access authenticated
 */
userRouter.put(
  '/user/update-one/:id',
  [passport.authenticate('jwt', { session: true })],
  userController.updateOne
)

/**
 * @description Permite cambiar la contraseña de la cuenta de un usuario logeado desde un correo
 * @method PATCH
 * @route /api/v1/user/reset-password
 * @param {String} body.password - Contraseña nueva
 * @access authenticated (user)
 */
userRouter.patch(
  '/user/reset-password',
  [passport.authenticate('jwt', { session: true })],
  userController.passwordRecovery
)

/**
 * @description Permite cambiar la contraseña de la cuenta de un usuario logeado desde su perfil
 * @method PATCH
 * @route /api/v1/user/update/password
 * @param {String} body.oldPassword - Contraseña antigua
 * @param {String} body.newPassword - Contraseña nueva
 * @access authenticated (user)
 */
userRouter.patch(
  '/user/update/password',
  [
    passport.authenticate('jwt', { session: true }),
    validation(userSchema.updatePassword, 'body'),
  ],
  userController.updatePassword
)

/**
 * @description Actualiza/sube foto de perfil del usuario especialista principalmente
 * @method PUT
 * @route /api/v1/user/upload/avatar
 * @param {String} body._id - id de del usuario a actualizar avatar
 * @param {String} body.role - role del usuario a actualizar avatar
 * @param {String} body.name - nombre del usuario a actualizar avatar
 * @param {String} body.lastName - apellido del usuario a actualizar avatar
 * @param {String} body.idSpecialist - Para actualizar elavatar del especialista
 * @param {Object} file - Contiene los avatar o fotos de perfil del usuario
 * @return Objeto con el perfil del usuario y sus características de especialista
 * @access authenticated
 */
userRouter.put(
  '/user/upload/avatar',
  [
    passport.authenticate('jwt', { session: true }),
    multer.single('avatar'),
    storageAvatar,
  ],
  userController.uploadAvatar
)

/**
 * @description Pone al usuario loggeado como "en linea"
 * @method POST
 * @route /api/v1/user/set-status/online
 * @return El objeto del usuario actualizado
 * @access authenticated
 */
userRouter.post(
  '/user/set-status/online',
  [passport.authenticate('jwt', { session: true })],
  userController.setUserOnline
)

/**
 * @description Pone al usuario loggeado como "desconectado"
 * @method POST
 * @route /api/v1/user/set-status/offline
 * @return El objeto del usuario actualizado
 * @access authenticated
 */
userRouter.post(
  '/user/set-status/offline',
  [passport.authenticate('jwt', { session: true })],
  userController.setUserOffline
)

/**
 * @description Permite la desvinculación de un especialista antes de terminar el plan
 * @method POST
 * @route /api/v1/user/change/specialist/:sessionId
 * @param {String} params.sessionId - Id del objeto de la sesión con el plan activo
 * @access authenticated ()
 */
userRouter.post(
  '/user/change/specialist/:sessionId',
  [passport.authenticate('jwt', { session: true })],
  userController.changeSpecialist
)

export default userRouter
