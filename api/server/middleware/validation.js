/**
 * Validation Middleware
 * 
 * This middleware provides request validation functionality using Joi schemas.
 * It validates incoming requests against a provided schema before executing the service function.
 * 
 * @module middleware/validation
 */

import { logError } from '../config/pino'
/* En base a un esquema y propiedad, podemos validar la request antes de ejecutar
la funcion del service.
La variable propiedad nos sirve para hacer validaciones en body,params,query,etc''
*/

/**
 * Creates a validation middleware function that validates request data against a Joi schema
 * 
 * @param {Object} schema - Joi validation schema to validate against
 * @param {string} property - Request property to validate ('body', 'params', 'query', etc.)
 * @returns {Function} Express middleware function that validates the request
 * 
 * @example
 * // Validate request body against userSchema
 * router.post('/users', validation(userSchema, 'body'), userController.createUser);
 * 
 * @example
 * // Validate URL parameters against idSchema
 * router.get('/users/:id', validation(idSchema, 'params'), userController.getUser);
 */
const validation = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property])
    if (!error) {
      next()
    } else {
      const { details } = error
      logError(details[0].message)
      res.status(422).json({ errors: details })
    }
  }
}

export default validation
