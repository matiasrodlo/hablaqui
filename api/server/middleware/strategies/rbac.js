/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * This module implements role-based access control using the roles configuration.
 * It provides middleware to check if a user has permission to perform specific actions
 * on resources based on their role.
 * 
 * @module middleware/strategies/rbac
 */

import roles from '../../config/roles'
import { logError } from '../../config/pino'

/**
 * Creates middleware to check user permissions for a specific action and resource
 * 
 * @param {string} action - The action to check permission for (e.g., 'create', 'read', 'update', 'delete')
 * @param {string} resource - The resource to check permission for (e.g., 'user', 'session', 'specialist')
 * 
 * @example
 * // Protect a route that requires 'create' permission on 'session' resource
 * router.post('/sessions',
 *   grantAccess('create', 'session'),
 *   sessionController.createSession
 * );
 * 
 * // Protect a route that requires 'read' permission on 'user' resource
 * router.get('/users/:id',
 *   grantAccess('read', 'user'),
 *   userController.getUser
 * );
 * 
 * @returns {Function} Express middleware function that checks permissions
 */
const grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource)
      if (!permission.granted) {
        return res.status(403).json({
          data: { role: req.user.role, action, resource },
          error: 'No tienes Permiso para realizar esta acción',
        })
      }
      next()
    } catch (error) {
      logError(error)
      next(error)
    }
  }
}

export default grantAccess
