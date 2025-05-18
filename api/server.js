/**
 * Hablaquí API Server Entry Point
 * 
 * This file serves as the main entry point for the Hablaquí API server.
 * It configures the ESM (ECMAScript Modules) loader to enable ES6 module syntax
 * and exports the main server application from server/index.js.
 * 
 * Key Features:
 * - ESM configuration for ES6 module support
 * - Environment-based configuration options
 * - Modular server architecture
 * - Cross-platform compatibility
 * - Development and production mode support
 * 
 * Configuration Options:
 * The ESM loader can be configured through:
 * 1. Direct parameter in require('esm')(module, options)
 * 2. Environment variable ESM_OPTIONS
 * 3. .esmrc file in the project root
 * 
 * @module server
 * @requires esm - ECMAScript Modules loader
 * @requires ./server/index.js - Main server application
 * 
 * @example
 * // Start the server
 * const server = require('./server.js')
 * server.listen(3000, () => {
 *   console.log('Server running on port 3000')
 * })
 * 
 * @throws {Error} If ESM module fails to load
 * @throws {Error} If server/index.js is not found
 * 
 * @see {@link https://github.com/standard-things/esm|ESM Documentation}
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
