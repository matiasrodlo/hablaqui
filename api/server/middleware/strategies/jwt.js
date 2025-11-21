/**
 * JWT Authentication Strategy
 * 
 * This module implements the JWT (JSON Web Token) authentication strategy using Passport.js.
 * It verifies JWT tokens from the Authorization header and authenticates users based on the token payload.
 * 
 * @module middleware/strategies/jwt
 */

import '../../config/config'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../../models/user'

/**
 * JWT Strategy Configuration Options
 * @type {Object}
 */
const options = {
  // Extract JWT from Authorization header with Bearer scheme
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  // Secret key for JWT verification
  secretOrKey: process.env.JWT_SECRET
}

/**
 * JWT Strategy Implementation
 * Verifies the JWT token and authenticates the user
 * 
 * @param {Object} jwt_payload - Decoded JWT payload
 * @param {string} jwt_payload.sub - User ID from the token
 * @param {Function} done - Passport callback function
 * 
 * @example
 * // Use in passport configuration
 * passport.use(jwtStrategy);
 * 
 * // Protect routes with JWT authentication
 * router.get('/protected', 
 *   passport.authenticate('jwt', { session: false }),
 *   protectedController.handleRequest
 * );
 */
const strategy = new JwtStrategy(options, function(jwt_payload, done) {
  User.findOne({ _id: jwt_payload.sub })
    .then(user => {
      if (user) {
        return done(null, user)
      } else {
        /* Este else lo podemos hacer funcionar si en un futuro implementamos estrategias de facebook, etc. */
        return done(null, false)
        // or you could create a new account
      }
    })
    .catch(err => done(err, false))
})

export default strategy
