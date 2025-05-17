/**
 * Role Middleware
 * 
 * This middleware provides role-based access control functionality.
 * It checks if the authenticated user has the required role to access a route.
 * 
 * @module middleware/role
 */

/**
 * Creates a role-based access control middleware function
 * 
 * @param {string[]} property - Array of allowed roles for the route
 * @returns {Function} Express middleware function that checks user role
 * 
 * @example
 * // Only allow admin and superuser roles
 * router.get('/admin', role(['admin', 'superuser']), adminController.getDashboard);
 * 
 * @example
 * // Only allow specialist role
 * router.post('/sessions', role(['specialist']), sessionsController.createSession);
 */
const role = property => {
  return (req, res, next) => {
    if (!property.includes(req.user.role)) {
      res.status(403).json({ errors: 'You shall not pass.' })
    } else {
      next()
    }
  }
}

export default role
