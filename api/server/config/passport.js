/**
 * Passport Authentication Configuration
 * 
 * This module configures Passport.js authentication strategies for the Hablaquí API.
 * It sets up local, JWT, and Google OAuth authentication methods.
 * 
 * Features:
 * - Local authentication with email/password
 * - JWT token-based authentication
 * - Google OAuth2 authentication
 * - Session management
 * - User serialization/deserialization
 * - Error handling
 * 
 * @module config/passport
 * @requires passport - Authentication middleware
 * @requires passport-local - Local authentication strategy
 * @requires passport-jwt - JWT authentication strategy
 * @requires passport-google-oauth20 - Google OAuth strategy
 * @requires ../models/user - User model
 * @requires bcrypt - Password hashing
 * @requires ../config/dotenv - Environment configuration
 */

'use strict'

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/user'
import bcrypt from 'bcrypt'
import { 
  jwt_secret, 
  google_client_id, 
  google_client_secret, 
  google_strategy_callback 
} from './dotenv'

/**
 * Configure Passport authentication strategies
 * 
 * @param {Object} passport - Passport instance
 * @returns {void}
 * 
 * @example
 * // Configure passport
 * const passport = require('passport');
 * passportConfig(passport);
 */
const passportConfig = passport => {
  /**
   * User serialization
   * Stores user ID in session
   */
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  /**
   * User deserialization
   * Retrieves user from database using ID
   */
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })

  /**
   * Local authentication strategy
   * Authenticates users with email and password
   */
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          // Find user by email
          const user = await User.findOne({ email })
          if (!user) {
            return done(null, false, { message: 'Invalid email or password' })
          }

          // Verify password
          const isMatch = await bcrypt.compare(password, user.password)
          if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' })
          }

          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  /**
   * JWT authentication strategy
   * Authenticates users using JWT tokens
   */
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id)
          if (!user) {
            return done(null, false)
          }
          return done(null, user)
        } catch (error) {
          return done(error, false)
        }
      }
    )
  )

  /**
   * Google OAuth2 strategy
   * Authenticates users using Google accounts
   */
  passport.use(
    new GoogleStrategy(
      {
        clientID: google_client_id,
        clientSecret: google_client_secret,
        callbackURL: google_strategy_callback,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({ googleId: profile.id })
          
          if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.name.givenName,
              lastName: profile.name.familyName,
              avatar: profile.photos[0].value
            })
          }

          return done(null, user)
        } catch (error) {
          return done(error, null)
        }
      }
    )
  )
}

export default passportConfig
