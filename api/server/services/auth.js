/**
 * Authentication Service
 * 
 * This module handles all authentication-related functionality for the Hablaquí system.
 * It provides user registration, login, logout, password management, and session handling.
 * 
 * Features:
 * - User registration with email verification
 * - Login/logout with JWT authentication
 * - Password recovery and reset
 * - Session management
 * - User verification status handling
 * - Analytics tracking for user actions
 * - Google OAuth integration
 * - Email notification system
 * 
 * @module services/auth
 * @requires ../config/config - Environment configuration
 * @requires bcryptjs - Password hashing
 * @requires ../models/user - User model
 * @requires ../models/sessions - Session model
 * @requires jsonwebtoken - JWT handling
 * @requires ../config/pino - Logging
 * @requires ../utils/logger/infoMessages - Logging utilities
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../utils/functions/mails/accountsShares - Email service
 * @requires analytics-node - Analytics tracking
 */

'use strict'

import '../config/config.js' // confing.js establece las variables de entorno para el trabajo local
import bcrypt from 'bcryptjs' //  bcryptjs es función de hashing de contraseñas
import User from '../models/user' // user.js contiene la definición del modelo de usuario para mongodb
import Sessions from '../models/sessions' // sessions.js contiene la definición del modelo de sesión para mongodb
import { sign } from 'jsonwebtoken' // el nombre lo dice todo
import { logError, logInfo } from '../config/pino' // pino.js es un logger para nodejs
import { actionInfo } from '../utils/logger/infoMessages' // recibe información sobre la acción que el usuario realiza
import { conflictResponse, okResponse } from '../utils/responses/functions' // funciones para generar respuestas http
import mailServiceAccount from '../utils/functions/mails/accountsShares'
import Analytics from 'analytics-node'

const analytics = new Analytics(process.env.SEGMENT_API_KEY)

/**
 * Generates a JWT token for user authentication
 * 
 * This function:
 * 1. Creates payload with username and user ID
 * 2. Signs token with JWT secret
 * 3. Sets expiration time from environment variable
 * 
 * @param {Object} user - User object containing name and _id
 * @returns {string} JWT token
 */
const generateJwt = user => {
  const payload = {
    username: user.name,
    sub: user._id,
  }

  return sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  })
}

/**
 * Handles user login and generates authentication token
 * Tracks login event in analytics if enabled
 * 
 * This function:
 * 1. Tracks login event in analytics (if enabled)
 * 2. Generates JWT token
 * 3. Formats user data for response
 * 4. Returns token and user data
 * 
 * @async
 * @param {Object} user - User object attempting to login
 * @returns {Promise<Object>} Response with token and user data
 */
const login = async user => {
  // Hace el trackeo de la acción de login con segment
  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    analytics.track({
      userId: user._id.toString(),
      event: 'login',
      properties: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  }
  // Email verification check disabled (commented by JESUS marzo/24/2022)
  // Note: The user object should contain an isVerified element indicating if the account is verified
  // if (user.role === 'user' && !user.isVerified)
  //   return conflictResponse('Verifica tu correo');
  return okResponse(`Bienvenido ${user.name}`, {
    token: generateJwt(user),
    user: await generateUser(user),
  })
}

/**
 * Handles user logout
 * Tracks logout event in analytics if enabled
 * 
 * This function:
 * 1. Tracks logout event in analytics (if enabled)
 * 2. Returns success response
 * 
 * @async
 * @param {Object} user - User object attempting to logout
 * @returns {Promise<Object>} Success response
 */
const logout = async user => {
  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    analytics.track({
      userId: user._id.toString(),
      event: 'logout',
      properties: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  }
  return okResponse('Sesión cerrada exitosamente')
}

/**
 * Retrieves user sessions based on role
 * 
 * This function:
 * 1. Checks user role (user or specialist)
 * 2. Queries sessions based on role
 * 3. Returns session list or null
 * 
 * @async
 * @param {Object} user - User object
 * @returns {Promise<Array|null>} Array of sessions or null
 */
const getSessions = async user => {
  if (user.role === 'user') {
    return await Sessions.find({ user: user._id })
  }

  if (user.role === 'specialist') {
    return await Sessions.find({ specialist: user.specialist })
  }

  return null
}

/**
 * Generates a standardized user object for responses
 * 
 * This function:
 * 1. Formats user data for API responses
 * 2. Includes user sessions
 * 3. Handles sensitive data
 * 4. Returns formatted user object
 * 
 * @async
 * @param {Object} user - User object from database
 * @returns {Promise<Object>} Formatted user object
 */
const generateUser = async user => {
  return {
    _id: user._id,
    avatar: user.avatar,
    avatarThumbnail: user.avatarThumbnail,
    birthDate: user.birthDate,
    direction: user.direction,
    email: user.email,
    finishedSessions: user.finishedSessions,
    google: user.google,
    gender: user.gender,
    googleId: user.googleId,
    hasPaid: user.hasPaid,
    inviteCode: user.inviteCode,
    lastName: user.lastName,
    name: user.name,
    onboarding: user.onboarding,
    phone: user.phone,
    plan: user.plan,
    specialist: user.specialist,
    role: user.role,
    rut: user.rut,
    sessions: await getSessions(user),
    state: user.state,
    timeZone: user.timeZone,
    isVerified: user.isVerified,
  }
}

/**
 * Handles new user registration
 * Creates user account and sends verification email
 * Tracks registration in analytics if enabled
 * 
 * This function:
 * 1. Validates email and RUT uniqueness
 * 2. Hashes password
 * 3. Creates user account
 * 4. Generates verification token
 * 5. Sends verification email
 * 6. Tracks registration in analytics
 * 7. Sends welcome email
 * 
 * @async
 * @param {Object} payload - Registration data
 * @returns {Promise<Object>} Response with user data and token
 * @throws {Error} If email or RUT already exists
 */
const register = async payload => {
  if (await User.exists({ email: payload.email })) {
    return conflictResponse('Correo electronico en uso')
  }
  if (payload.role === 'specialist') {
    if (await User.exists({ rut: payload.rut })) {
      return conflictResponse('Rut en uso')
    }
  }
  const newUser = {
    ...payload,
    isInvited: false,
    email: payload.email.toLowerCase(),
    password: bcrypt.hashSync(payload.password, 10),
  }
  const user = await User.create(newUser)
  const token = generateJwt(user)
  const verifyurl = `${process.env.VUE_APP_LANDING}verificacion-email?id=${user._id}&token=${token}`

  if (process.env.NODE_ENV === 'development') {
    logInfo(actionInfo(payload.email, `url: ${verifyurl}`))
  }

  // Segment identification
  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    analytics.identify({
      userId: user._id.toString(),
      traits: {
        name: user.name,
        email: user.email,
        type: user.role,
      },
    })
    analytics.track({
      userId: user._id.toString(),
      event: 'organic-user-signup',
      properties: {
        name: user.name,
        email: user.email,
        type: user.role,
      },
    })
  }

  // Se envia el correo de bienvenida
  logInfo(actionInfo(user.email, 'Sé registro exitosamente'))
  if (user.role === 'user') {
    // si el rol del usuario es user
    await mailServiceAccount.sendWelcomeNewUser(user) // envía el correo de bienvenida al usuario
  }
  return okResponse(`Bienvenido ${user.name}`, {
    user: await generateUser(user),
    token: generateJwt(user),
  })
}

/**
 * Generates a JWT token for password recovery
 * Uses a different expiration time than regular authentication
 * 
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generatePasswordRecoverJwt = user => {
  const payload = {
    username: user.name,
    sub: user._id,
  }

  return sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.PASSWORD_RECOVERY_JWT_EXPIRATION,
  })
}

/**
 * Retrieves a user by email address
 * 
 * @async
 * @param {string} email - User's email address
 * @returns {Promise<Object|null>} User object or null
 */
const getUserByEmail = async email => {
  return await User.findOne({ email })
}

/**
 * Initiates password recovery process
 * Sends recovery email with reset token
 * 
 * @async
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response indicating email sent
 */
const sendPasswordRecover = async email => {
  // Busca el usuario por email y verifica si existe, genera un token y lo envia por correo
  const user = await getUserByEmail(email)
  if (!user) {
    return conflictResponse('Este usuario no existe')
  }
  const token = generatePasswordRecoverJwt(user)

  const recoveryUrl = `${process.env.VUE_APP_LANDING}password-reset?token=${token}`

  mailServiceAccount.sendPasswordRecovery(user, recoveryUrl) // envía el correo de recuperación de contraseña

  // Correo para recuperar contraseña
  if (process.env.NODE_ENV === 'development') {
    logInfo(actionInfo(email, `url: ${recoveryUrl}`))
  } else logInfo(actionInfo(email, 'solicito una recuperación de contraseña'))

  return okResponse('Sé le ha enviado un correo electronico')
}

/**
 * Changes user password
 * 
 * This function:
 * 1. Validates current password
 * 2. Hashes new password
 * 3. Updates user record
 * 4. Returns success response
 * 
 * @async
 * @param {Object} user - User object
 * @param {string} newPassword - New password
 * @param {Object} res - Response object
 * @returns {Promise<Object>} Success response
 */
const changeUserPassword = async (user, newPassword, res) => {
  // Cambia la contraseña del usuario
  try {
    await User.findByIdAndUpdate(user._id, {
      password: bcrypt.hashSync(newPassword, 10),
    })
    logInfo(actionInfo(user.email, 'cambio su contraseña'))
    res.sendStatus(200)
  } catch (e) {
    /* We handle the possible not found User error */
    logError(e)
    res.sendStatus(404)
  }
}

/**
 * Updates user's email verification status
 * Sends welcome email if user is verified
 * 
 * @async
 * @param {string} id - User ID
 * @returns {Promise<Object>} Response indicating verification status
 */
const changeVerifiedStatus = async id => {
  // Busca el usuario, verifica que exista, cambia el estado de verificación y lo guarda
  const user = await User.findById(id)

  if (!user) return conflictResponse('Este usuario no existe')

  user.isVerified = true // cambia el estado de verificación del usuario a true
  await user.save() // guarda el usuario
  if (user.role === 'user') await mailServiceAccount.sendWelcomeNewUser(user) // envía el correo de bienvenida al usuario

  return okResponse('Cuenta verificada')
}

/*
const googleAuthCallback = (req, res) => {
	// googleAuthCallback es una función que maneja la respuesta de google
	const frontendUrL = process.env.FRONTEND_URL; // la url del frontend
	const jwt = generateJwt(req.user); // el token de autenticación
	//Esta es la unica manera segura de enviarle el jwt al front
	//La otra forma era enviar un html con js incluido, pero el jwt se quedaba asignado en la ruta de la api.
	res.redirect(frontendUrL + '/?token=' + jwt); // redirecciona a la url del frontend con el token de autenticación
};
*/

/**
 * Authentication service object containing all auth-related business logic
 * @type {Object}
 */
const authService = {
  login,
  logout,
  generateJwt,
  generateUser,
  register,
  sendPasswordRecover,
  changeUserPassword,
  getSessions,
  changeVerifiedStatus,
}

export default Object.freeze(authService)
