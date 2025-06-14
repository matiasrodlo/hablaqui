/**
 * Users Service
 * 
 * This module provides user management services for the Hablaquí API.
 * It handles user profile management, authentication, and related operations.
 * 
 * @module services/users
 */

'use strict' // Sirve para que el código sea mas estricto y evitar errores

import User from '../models/user'
import Specialist from '../models/specialist'
import Recruitment from '../models/recruitment'
import { logInfo } from '../config/winston'
import bcrypt from 'bcryptjs'
import servicesAuth from './auth'
import { actionInfo } from '../utils/logger/infoMessages'
import { conflictResponse, okResponse } from '../utils/responses/functions'
import s3 from '../config/bucket'
import mailServiceAccount from '../utils/functions/mails/accountsShares'
import Sessions from '../models/sessions'
import Coupon from '../models/coupons'
import dayjs from 'dayjs'
import crypto from 'crypto'
import { room } from '../config/dotenv'
import Auth from './auth'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Analytics from 'analytics-node'
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

const analytics = new Analytics(process.env.SEGMENT_API_KEY)

/**
 * User service object containing methods for user management
 * @type {Object}
 */
const usersService = {
  /**
   * Retrieves a user's profile by ID
   * @param {string} id - The user's ID
   * @returns {Promise<Object>} Response object containing user profile or error
   */
  async getProfile(id) {
    // Se busca al usuario con su id, se comprueba que exista y se retorna el objeto del usuario
    const user = await User.findById(id)
    if (!user) {
      return conflictResponse('perfil no encontrado')
    }
    return okResponse('perfil obtenido', {
      user: await servicesAuth.generateUser(user),
    })
  },
  /**
   * Changes a user's password
   * @param {Object} user - The user object
   * @param {string} newPassword - The new password
   * @returns {Promise<Object>} Response object indicating success or failure
   */
  async changeActualPassword(user, newPassword) {
    // Se encripta la contraseña, se edita la contraseña del usuario y se guarda en la base de datos
    user.password = bcrypt.hashSync(newPassword, 10)
    await user.save()
    logInfo(actionInfo(user.email, 'actualizo su contraseña'))
    return okResponse('Actualizó su contraseña')
  },
  /**
   * Updates a user's password after verifying the old password
   * @param {Object} user - The user object
   * @param {string} oldPassword - The current password
   * @param {string} newPassword - The new password
   * @returns {Promise<Object>} Response object indicating success or failure
   */
  async updatePassword(user, oldPassword, newPassword) {
    // Busca al usuario por su id, se comprueba que la contraseñas sean distintas (actual y nueva)
    const foundUser = await User.findById(user._id)
    const samePassword = oldPassword === newPassword
    if (samePassword) {
      return conflictResponse('no puede ser la misma contraseña')
    }
    // Se comprueba que el usuario haya introducido correctamente su contraseña actual
    const isEqual = bcrypt.compareSync(oldPassword, foundUser.password)
    if (!isEqual) {
      return conflictResponse('la contraseña anterior no es correcta')
    } else return await this.changeActualPassword(foundUser, newPassword)
  },
  /**
   * Handles password recovery process
   * @param {Object} user - The user object
   * @param {string} newPassword - The new password
   * @returns {Promise<Object>} Response object indicating success or failure
   */
  async passwordRecovery(user, newPassword) {
    // Se busca al usuario por su id, luego comparar la contraseña actual con la nueva bajo la lógica
    // de que no deben ser iguales, luego se cambia la contraseña actual por la nueva
    const foundUser = await User.findById(user._id)
    const isEqual = bcrypt.compareSync(newPassword, foundUser.password)
    if (isEqual) {
      return conflictResponse('no puede ser la misma contraseña')
    } else return await this.changeActualPassword(foundUser, newPassword)
  },
  /**
   * Updates a user's profile information
   * @param {string} id - The user's ID
   * @param {Object} profile - The updated profile data
   * @returns {Promise<Object>} Response object containing updated user profile
   */
  async updateProfile(id, profile) {
    // Busca el usuario por su id y se actualiza su perfil con los datos modificados en profile
    const updated = await User.findByIdAndUpdate(id, profile, {
      new: true,
      runValidators: true,
      context: 'query',
    })

    return okResponse('Actualizado exitosamente', {
      user: await servicesAuth.generateUser(updated),
    })
  },

  /**
   * Updates a user's subscription plan
   * @param {Object} user - The user object
   * @param {Object} newPlan - The new plan details
   * @returns {Promise<Object>} Response object containing updated profile
   */
  async updatePlan(user, newPlan) {
    // Busca el usuario por su id y actualiza el plan con el nuevo plan newPlan
    let updated = null
    updated = await User.findByIdAndUpdate(
      user._id,
      { myPlan: newPlan },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    )

    logInfo(actionInfo(user.email, 'actualizo su plan'))
    return okResponse('plan actualizado', { profile: updated })
  },
  /**
   * Updates a user's assigned specialist and transfers remaining sessions
   * @param {Object} user - The user object
   * @param {string} newSpecialist - ID of the new specialist
   * @param {string} oldSpecialist - ID of the current specialist
   * @returns {Promise<Object>} Response object indicating success or failure
   */
  async updateSpecialist(user, newSpecialist, oldSpecialist) {
    // Se realiza una busqueda del plan del consultante
    const oldSession = await Sessions.findOne({
      specialist: oldSpecialist,
      user,
    })

    // Se verifica que la sesión exista
    if (!oldSession) {
      return conflictResponse('No se encontró la sesión')
    }
    if (oldSession.plan.length === 0) {
      return conflictResponse('No se encontró el plan')
    }
    const ultimoPlan = oldSession.plan[oldSession.plan.length - 1]
    if (Date.now() > Date.parse(ultimoPlan.expiration)) {
      return conflictResponse('El plan ha expirado')
    }

    // Se cuenta la cantidad de sesiones agendadas que aún no han sido realizadas
    const sessionesPendientes = ultimoPlan.session.filter(
      (session) => session.status === 'pending' // || session.status === 'upnext'
    ).length
    const sessionesRealizadas = ultimoPlan.session.filter(
      (session) =>
        Date.parse(session.date) < Date.now() && session.status === 'success'
    ).length

    // Se crea un nuevo plan para el consultante con el nuevo especialista
    const newPlan = {
      title: ultimoPlan.title,
      period: ultimoPlan.period,
      totalPrice: ultimoPlan.totalPrice,
      sessionPrice: ultimoPlan.sessionPrice,
      payment: ultimoPlan.payment,
      datePayment: ultimoPlan.datePayment,
      expiration: ultimoPlan.expiration,
      usedCoupon: ultimoPlan.usedCoupon,
      totalSessions: (
        Number(ultimoPlan.totalSessions) - sessionesRealizadas
      ).toString(),
      remainingSessions: (
        Number(ultimoPlan.remainingSessions) + sessionesPendientes
      ).toString(),
      tokenToPay: ultimoPlan.tokenToPay,
      session: [],
    }

    // Se busca si el usuario tiene una sesión con el nuevo especialista, si no la tiene se crea una
    let newSession = await Sessions.findOne({
      specialist: newSpecialist,
      user,
    })
    if (newSession === null) {
      newSession = await Sessions.create({
        specialist: newSpecialist,
        user,
        plan: [newPlan],
        roomsUrl: oldSession.roomsUrl,
      })
    } else {
      newSession.plan.push(newPlan)
      await newSession.save()
    }

    // Se cambia el plan de expiración del plan antiguo
    ultimoPlan.expiration = dayjs.tz(dayjs().subtract(1, 'days')).format()

    // Se filtran las sesiones que no a la fecha no se han realizado
    ultimoPlan.session = ultimoPlan.session.filter(
      (session) =>
        Date.parse(session.date) < Date.now() && session.status === 'success'
    )

    ultimoPlan.remainingSessions = 0

    await oldSession.save()
    return okResponse('plan actualizado', { profile: user })
  },
  /**
   * Uploads or updates a user's profile picture
   * @param {Object} params - Parameters object containing:
   * @param {Object} params.userLogged - The logged-in user
   * @param {string} params.avatar - URL of the full-size avatar
   * @param {string} params.avatarThumbnail - URL of the avatar thumbnail
   * @param {string} params.role - User's role
   * @param {string} params.idSpecialist - ID of the specialist (if applicable)
   * @param {string} params._id - User's ID
   * @param {string} params.oldAvatar - URL of the previous avatar
   * @param {string} params.oldAvatarThumbnail - URL of the previous thumbnail
   * @returns {Promise<Object>} Response object containing updated user profile
   */
  async uploadAvatar({
    userLogged,
    avatar,
    avatarThumbnail,
    role,
    idSpecialist,
    _id,
    oldAvatar,
    oldAvatarThumbnail,
  }) {
    let specialist
    let userRole = role
    let userID = _id

    // Se comprueba que exista una imagen de avatar y una imagen de avatarThumbnail
    if (!avatar && !avatarThumbnail) {
      return conflictResponse('Ha ocurrido un error inesperado')
    }

    // En caso de que el usuario sea super usuario se busca al especialista por su id para
    // encontrar al usuario, y se obtiene el id y su rol del usuario.
    if (userLogged.role === 'superuser') {
      const spec = await Specialist.findById(idSpecialist)
      const userSelected = await User.findOne({
        email: spec.email,
        role: 'specialist',
      })
      userRole = userSelected.role
      userID = userSelected._id
    }

    // Hace la distinción de casos por que los spec tienen el modelo de usuario y especialista
    if (userRole === 'specialist') {
      const userData = await User.findById(userID)
      await mailServiceAccount.sendUploadPicture(userData)
      // En caso de los spec, en el campo de spec, se les asigna el ID del documento de especialista
      if (userData.specialist) {
        // La imagen queda a probación al subirla
        specialist = await Specialist.findByIdAndUpdate(
          idSpecialist,
          {
            avatar,
            avatarThumbnail,
            approveAvatar: false,
          },
          { new: true }
        )
      } else {
        // Si por alguna razón no esta asignado el spec, se busca su documento de recruitment y actualiza la imagen
        specialist = await Recruitment.findByIdAndUpdate(
          userID,
          {
            avatar,
            avatarThumbnail,
            approveAvatar: false,
          },
          { new: true }
        )
      }
    }

    // Se actualiza la foto en el documento de usuario, se elimina las fotos antiguas, y se retorna el objeto actualizado
    const profile = await User.findByIdAndUpdate(
      userID,
      {
        avatar,
        avatarThumbnail,
      },
      {
        new: true,
      }
    )
    await this.deleteFile(oldAvatar, oldAvatarThumbnail).catch(console.error)
    logInfo(`${userLogged.email} actualizo su avatar`)

    return okResponse('Avatar actualizado', {
      user: profile,
      specialist,
    })
  },

  /**
   * Deletes avatar files from storage
   * @param {string} oldAvatar - URL of the avatar to delete
   * @param {string} oldAvatarThumbnail - URL of the thumbnail to delete
   * @returns {Promise<void>}
   */
  async deleteFile(oldAvatar, oldAvatarThumbnail) {
    // Se verifican que las imagenes existan y se eliminan, de lo contrario se retorna un error
    if (oldAvatar) {
      await s3.deleteFile(oldAvatar.split('https://cdn.hablaqui.cl/').join(''))
    }
    if (oldAvatarThumbnail) {
      await s3.deleteFile(
        oldAvatarThumbnail.split('https://cdn.hablaqui.cl/').join('')
      )
    }
  },

  /**
   * Sets a user's status to online
   * @param {Object} user - The user object
   * @returns {Promise<Object>} Response object indicating success
   */
  async setUserOnline(user) {
    // setUserOnline establece el estado de un usuario como en línea
    // const data = {
    // 	...user,
    // 	status: true,
    // };
    // pusher.trigger('user-status', 'online', data, pusherCallback);
    return okResponse('Usuario conectado', user)
  },

  /**
   * Sets a user's status to offline
   * @param {Object} user - The user object
   * @returns {Promise<Object>} Response object indicating success
   */
  async setUserOffline(user) {
    // setUserOffline establece el estado de un usuario como desconectado
    // const data = {
    // 	...user,
    // 	status: false,
    // };
    // pusher.trigger('user-status', 'offline', data, pusherCallback);
    return okResponse('Usuario desconectado', user)
  },

  /**
   * Registers a new user
   * @param {Object} user - The user object
   * @param {Object} body - Registration data
   * @returns {Promise<Object>} Response object containing new user profile
   */
  async registerUser(user, body) {
    if (user.role !== 'specialist') {
      return conflictResponse('Usuario activo no es especialista')
    }
    if (await User.exists({ email: body.email })) {
      return conflictResponse('Correo electronico en uso')
    }

    // Se crea una contraseña aleatoria y se crea un objeto de usuario con los datos
    // enviados por el body
    const pass =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    const newUser = {
      // specialist: user._id,
      isInvited: true,
      name: body.name,
      lastName: body.lastName,
      email: body.email,
      password: bcrypt.hashSync(pass, 10),
      role: 'user',
      rut: body.rut,
      phone: body.phone,
      invitedBy: user.specialist,
    }
    // Se crea el usuario, se guarda en la base de datos, se genera un token con el que se
    // genera un link de verificación y se envia un correo con el link
    const createdUser = await User.create(newUser)
    const token = Auth.generateJwt(createdUser)
    const verifyurl = `${process.env.VUE_APP_LANDING}verificacion-email?id=${createdUser._id}&token=${token}`
    await mailServiceAccount.sendVerifyEmail(createdUser, verifyurl)

    // Se hace el trakeo en segment
    if (
      process.env.API_URL.includes('hablaqui.cl') ||
      process.env.DEBUG_ANALYTICS === 'true'
    ) {
      analytics.identify({
        userId: createdUser._id.toString(),
        traits: {
          name: user.name,
          email: user.email,
          type: user.role,
          referencerId: user._id,
          referencerName: `${user.name} ${user.lastName}`,
        },
      })
      analytics.track({
        userId: createdUser._id.toString(),
        event: 'referral-user-signup',
        properties: {
          name: user.name,
          email: user.email,
          type: user.role,
          referencerId: user.specialist.toString(),
          referencerName: `${user.name} ${user.lastName}`,
        },
      })
    }
    const roomId = crypto
      .createHash('sha256')
      .update(`${createdUser._id}${user._id}`)
      .digest('hex')

    const newPlan = {
      title: 'Plan inicial',
      period: 'Plan inicial',
      totalPrice: 0,
      sessionPrice: 0,
      payment: 'success',
      expiration: dayjs.tz(dayjs('12/12/2000', 'MM/DD/YYYY HH:mm')).format(),
      invitedBySpecialist: true,
      usedCoupon: '',
      totalSessions: 0,
      remainingSessions: 0,
      session: [],
    }

    if (user.role === 'specialist' && createdUser.role === 'user') {
      await Sessions.create({
        plan: [newPlan],
        user: createdUser._id,
        specialist: user.specialist,
        roomsUrl: `${room}room/${roomId}`,
      })
    }

    if (process.env.NODE_ENV === 'development') {
      logInfo(
        actionInfo(user.email, `Usuario registrado ${newUser.email} ${pass}`)
      )
    }

    await mailServiceAccount.sendGuestNewUser(user, newUser, pass)

    return okResponse('Nuevo usuario creado', {
      user: await servicesAuth.generateUser(createdUser),
    })
  },
  /**
   * Changes a user's assigned specialist
   * @param {string} sessionsId - ID of the sessions to transfer
   * @returns {Promise<Object>} Response object indicating success or failure
   */
  async changeSpecialist(sessionsId) {
    // Se busca el plan con el Id del documento de sesiones
    const foundPlan = await Sessions.findById(sessionsId).populate(
      'specialist user'
    )
    if (!foundPlan) return conflictResponse('No hay planes')

    // Se filtran los planes vigentes y que hayan sido pagados
    const planData = foundPlan.plan.filter(
      (plan) =>
        plan.payment === 'success' && dayjs().isBefore(dayjs(plan.expiration))
    )
    if (!planData) return conflictResponse('No hay planes para cancelar')

    // Se comienza a recorrer los planes y se obtienen algunos datos que
    // son almacenados en el array de sessionsData
    const sessionsData = []
    planData.forEach((plan) => {
      const sessions = {
        plan: plan._id,
        remainingSessions: plan.remainingSessions,
        price: plan.sessionPrice,
        session: plan.session.filter((session) => session.status !== 'success'),
      }
      sessionsData.push(sessions)
    })

    // Se comienza a obtener las sessiones que se van a cancelar, se obtienen las sessiones
    // pendientes y se logra obtener un descuento que se usará en el cupón
    let discount = 0
    const sessionsToDelete = []
    sessionsData.forEach((data) => {
      const remaining = data.session.length + data.remainingSessions
      discount += remaining * data.price
      sessionsToDelete.push(data.session)
    })

    planData.forEach(async (plan) => {
      // Se busca en la base de datos y modifica el plan
      await Sessions.updateOne(
        {
          _id: sessionsId,
          'plan._id': plan._id,
        },
        {
          $set: {
            'plan.$.payment': 'failed',
            'plan.$.remainingSessions': 0,
          },
        }
      )

      // Se eliminan las sessiones
      plan.session.forEach(async (session) => {
        await Sessions.updateOne(
          {
            _id: sessionsId,
            'plan._id': plan._id,
            'plan.session._id': session._id,
          },
          {
            $pull: {
              'plan.$.session': { _id: session._id },
            },
          }
        )
      })
    })

    const now = new Date()
    const expiration = now
    expiration.setDate(expiration.getDate() + 3)

    // Se crea el cupón y se envía un correo al usuario notificando el cambio
    const newCoupon = {
      code: foundPlan.user.name + now.getTime(),
      discount,
      discountType: 'static',
      restrictions: {
        user: foundPlan.user._id,
      },
      expiration: expiration.toISOString(),
    }
    await mailServiceAccount.sendChangeSpeccologistToUser(
      foundPlan.user,
      foundPlan.specialist,
      newCoupon
    )
    await Coupon.create(newCoupon)
    return okResponse('Cupón hecho')
  },
}

export default usersService
