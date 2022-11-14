import roles from "../../config/roles";
import { logError } from "../../config/pino";

/**
 * Role-based access control (RBAC)
 * @param {String} action
 * @param {String} resource
 * @returns {Object}
 */
const grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(403).json({
          data: { role: req.user.role, action, resource },
          error: "No tienes Permiso para realizar esta acción",
        });
      }
      next();
    } catch (error) {
      logError(error);
      next(error);
    }
  };
};

export default grantAccess;
