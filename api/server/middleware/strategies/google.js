/**
 * Google OAuth2 Authentication Strategy
 * 
 * This module implements the Google OAuth2 authentication strategy using Passport.js.
 * It handles user authentication through Google accounts, creating or updating user records
 * based on Google profile information.
 * 
 * @module middleware/strategies/google
 */

import { logError } from '../../config/pino'
import User from '../../models/user'
import googlePassport from 'passport-google-oauth'
const GoogleStrategy = googlePassport.OAuth2Strategy

/**
 * Google Strategy Implementation
 * Handles Google OAuth2 authentication and user management
 * 
 * @param {string} accessToken - Google OAuth2 access token
 * @param {string} refreshToken - Google OAuth2 refresh token
 * @param {Object} profile - Google user profile
 * @param {Function} done - Passport callback function
 * 
 * @example
 * // Use in passport configuration
 * passport.use(googleStrategy);
 * 
 * // Authenticate with Google
 * router.get('/auth/google',
 *   passport.authenticate('google', { 
 *     scope: ['profile', 'email']
 *   })
 * );
 * 
 * // Google callback route
 * router.get('/auth/google/callback',
 *   passport.authenticate('google', { 
 *     failureRedirect: '/login' 
 *   }),
 *   authController.handleGoogleCallback
 * );
 */

const strategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_STRATEGY_CALLBACK,
  },
  async function(accessToken, refreshToken, profile, done) {
    /**
     * Handles strategy errors by logging and returning false
     * @param {Error} err - Error object
     * @param {Function} done - Passport callback
     */
    const onStrategyError = (err, done) => {
      logError(err)
      return done(null, false)
    }

    const googleEmail = profile.emails[0].value

    /**
     * Creates a new user from Google profile data
     * @param {Object} profile - Google user profile
     * @returns {Promise<User>} New user document
     */
    const createOneUser = async profile => {
      const newUser = new User({
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        email: googleEmail,
        img: profile.photos[0].value,
        analyst: false,
        googleId: profile.id,
      })
      return await newUser.save()
    }

    /**
     * Updates existing user with Google profile data
     * @param {User} user - Existing user document
     * @param {Object} profile - Google user profile
     * @returns {Promise<User>} Updated user document
     */
    const updateOneUser = async (user, profile) => {
      user.img = profile.photos[0].value
      user.googleId = profile.id
      return await user.save()
    }

    /**
     * Finds user by Google email
     * @param {string} email - User's Google email
     * @returns {Promise<User>} User document if found
     */
    const findOneWIthGoogleEmail = async email => {
      return User.findOne({ email })
    }

    /**
     * Finds user by Google ID
     * @param {string} googleId - User's Google ID
     * @returns {Promise<User>} User document if found
     */
    const findOneWithGoogleId = async googleId => {
      return User.findOne({ googleId })
    }

    // Check if user exists with Google email
    const userFromEmail = await findOneWIthGoogleEmail(googleEmail).catch(err =>
      onStrategyError(err, done)
    )
    if (userFromEmail) {
      try {
        const updatedUser = await updateOneUser(userFromEmail, profile)
        return done(null, updatedUser)
      } catch (e) {
        logError(e)
        return done(null, false)
      }
    } else {
      try {
        // Check if user exists with Google ID
        const userFromId = await findOneWithGoogleId(profile.id)
        if (userFromId) {
          const updatedUser = await updateOneUser(userFromId, profile)
          return done(null, updatedUser)
        } else {
          // Create new user if not found
          const newUser = await createOneUser(profile)
          return done(null, newUser)
        }
      } catch (e) {
        return onStrategyError(e, done)
      }
    }
  }
)

export default strategy
