/**
 * Local Authentication Strategy
 * 
 * This module implements the local authentication strategy using Passport.js.
 * It handles email/password authentication by verifying credentials against the database.
 * 
 * @module middleware/strategies/local
 */

import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import User from '../../models/user'

/**
 * Local Strategy Configuration
 * Configures the strategy to use email as username and disables session support
 * 
 * @type {Object}
 */
const strategyConfig = {
  usernameField: 'email',
  passwordField: 'password',
  session: false,
}

/**
 * Local Strategy Implementation
 * Authenticates users using email and password
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {Function} done - Passport callback function
 * 
 * @example
 * // Use in passport configuration
 * passport.use(localStrategy);
 * 
 * // Authenticate user login
 * router.post('/login',
 *   passport.authenticate('local', { session: false }),
 *   authController.handleLogin
 * );
 * 
 * @returns {Promise<void>} Resolves with authenticated user or false
 */
const strategy = new LocalStrategy(strategyConfig, function(
  email,
  password,
  done
) {
  User.findOne({ email: email.toLowerCase() })
    .then(data => {
      if (!data || !bcrypt.compareSync(password, data.password)) {
        return done(null, false)
      }
      return done(null, data)
    })
    .catch(err => done(err))
})

export default strategy
