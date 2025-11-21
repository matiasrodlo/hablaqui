/**
 * Role Middleware
 * 
 * This middleware provides role-based access control functionality.
 * It checks if the authenticated user has the required role to access a route.
 * 
 * @module middleware/role
 */

const { logError } = require('../config/pino');

/**
 * Role-based access control middleware
 * Checks if the authenticated user has the required role to access a route
 * 
 * @param {string[]} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Allow only therapists to access the route
 * router.post('/appointments', role(['therapist']), appointmentController.create);
 * 
 * @example
 * // Allow both users and therapists to access the route
 * router.get('/profile', role(['user', 'therapist']), profileController.get);
 */
const role = (roles) => {
  return (req, res, next) => {
    try {
      // Check if user exists in request (set by auth middleware)
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }

      // Check if user's role is in the allowed roles array
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      logError('Role middleware error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  };
};

export default role
