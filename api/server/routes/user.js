/**
 * User Router
 * 
 * This module defines the routes for user management in the Hablaquí API.
 * It handles user registration, profile management, authentication, and status updates.
 * 
 * @module routes/user
 */

'use strict'

import { Router } from 'express'
import passport from 'passport'
import userController from '../controllers/users'
import userSchema from '../schemas/user'
import validation from '../middleware/validation'
import multer from '../middleware/multer'
import storageAvatar from '../middleware/avatar/storage'

// Initialize Express router
const userRouter = Router()

/**
 * Register User by Specialist
 * Allows a specialist to register a new client
 * 
 * @route POST /api/v1/user/register
 * @param {Object} req.body - User information
 * @param {string} req.body.name - Client's name (required)
 * @param {string} req.body.email - Client's email (required)
 * @param {string} req.body.rut - Client's RUT
 * @param {string} req.body.phone - Client's phone number
 * @returns {Object} Newly created user object
 * @throws {401} If not authenticated as specialist
 * @throws {400} If validation fails
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
 * Get User Profile
 * Retrieves the profile information of the authenticated user
 * 
 * @route GET /api/v1/user/profile
 * @param {Object} req.user - Authenticated user object
 * @returns {Object} User profile information
 * @throws {401} If not authenticated
 */
userRouter.get(
  '/user/profile',
  [passport.authenticate('jwt', { session: true })],
  userController.getUser
)

/**
 * Update User's Specialist
 * Updates the specialist assigned to a user from the intranet
 * 
 * @route PUT /api/v1/dashboard/update/specialist
 * @param {Object} req.body - Update information
 * @param {string} req.body.newSpecialist - ID of the new specialist (required)
 * @param {string} req.body.oldSpecialist - ID of the previous specialist (required)
 * @param {string} req.body.user - ID of the user to update (required)
 * @returns {Object} Updated user object
 * @throws {401} If not authenticated
 * @throws {404} If specialist or user not found
 */
userRouter.put('/dashboard/update/specialist', userController.updateSpecialist)

/**
 * Update User Profile
 * Updates the profile information of the authenticated user
 * 
 * @route PUT /api/v1/user/update/profile
 * @param {Object} req.body.profile - Updated profile information
 * @returns {Object} Updated user object
 * @throws {401} If not authenticated
 * @throws {400} If validation fails
 */
userRouter.put(
  '/user/update/profile',
  [
    passport.authenticate('jwt', { session: true }),
    validation(userSchema.updateProfile, 'body'),
  ],
  userController.updateProfile
)

/**
 * Update User by ID
 * Updates a specific user's profile information
 * 
 * @route PUT /api/v1/user/update-one/:id
 * @param {string} req.params.id - ID of the user to update
 * @param {Object} req.body.profile - Updated profile information
 * @returns {Object} Updated user object
 * @throws {401} If not authenticated
 * @throws {404} If user not found
 */
userRouter.put(
  '/user/update-one/:id',
  [passport.authenticate('jwt', { session: true })],
  userController.updateOne
)

/**
 * Reset Password via Email
 * Allows a user to reset their password through email verification
 * 
 * @route PATCH /api/v1/user/reset-password
 * @param {string} req.body.password - New password
 * @returns {Object} Success message
 * @throws {401} If not authenticated
 * @throws {400} If password is invalid
 */
userRouter.patch(
  '/user/reset-password',
  [passport.authenticate('jwt', { session: true })],
  userController.passwordRecovery
)

/**
 * Update Password
 * Allows a user to change their password from their profile
 * 
 * @route PATCH /api/v1/user/update/password
 * @param {Object} req.body - Password information
 * @param {string} req.body.oldPassword - Current password
 * @param {string} req.body.newPassword - New password
 * @returns {Object} Success message
 * @throws {401} If not authenticated
 * @throws {400} If validation fails
 * @throws {403} If current password is incorrect
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
 * Upload Profile Picture
 * Updates or uploads a user's profile picture
 * 
 * @route PUT /api/v1/user/upload/avatar
 * @param {Object} req.body - User information
 * @param {string} req.body._id - User ID
 * @param {string} req.body.role - User role
 * @param {string} req.body.name - User's first name
 * @param {string} req.body.lastName - User's last name
 * @param {string} req.body.idSpecialist - Specialist ID (if applicable)
 * @param {Object} req.file - Profile picture file
 * @returns {Object} Updated user profile
 * @throws {401} If not authenticated
 * @throws {400} If file upload fails
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
 * Set User Online
 * Updates the user's status to online
 * 
 * @route POST /api/v1/user/set-status/online
 * @returns {Object} Updated user object
 * @throws {401} If not authenticated
 */
userRouter.post(
  '/user/set-status/online',
  [passport.authenticate('jwt', { session: true })],
  userController.setUserOnline
)

/**
 * Set User Offline
 * Updates the user's status to offline
 * 
 * @route POST /api/v1/user/set-status/offline
 * @returns {Object} Updated user object
 * @throws {401} If not authenticated
 */
userRouter.post(
  '/user/set-status/offline',
  [passport.authenticate('jwt', { session: true })],
  userController.setUserOffline
)

/**
 * Change Specialist
 * Allows a user to change their assigned specialist before plan expiration
 * 
 * @route POST /api/v1/user/change/specialist/:sessionId
 * @param {string} req.params.sessionId - ID of the active session plan
 * @returns {Object} Updated session information
 * @throws {401} If not authenticated
 * @throws {404} If session not found
 */
userRouter.post(
  '/user/change/specialist/:sessionId',
  [passport.authenticate('jwt', { session: true })],
  userController.changeSpecialist
)

export default userRouter
