/**
 * Hablaquí API Server Entry Point
 * 
 * This file serves as the main entry point for the Hablaquí API server.
 * It configures the ESM (ECMAScript Modules) loader to enable ES6 module syntax
 * and exports the main server application from server/index.js.
 * 
 * @module server
 */

// Configure ESM loader to enable ES6 module syntax
// Options can be set via:
// 1. Parameter in require('esm')(module, options)
// 2. Environment variable ESM_OPTIONS
// 3. .esmrc file in the project root
// eslint-disable-next-line no-global-assign
require = require('esm')(module /*, options */)

// Export the main server application
module.exports = require('./server/index.js')
