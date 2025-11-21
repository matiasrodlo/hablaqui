/**
 * Role-Based Access Control Configuration
 * 
 * This module defines the access control rules for different user roles in the Hablaquí system.
 * It uses the accesscontrol library to manage permissions for various resources.
 * 
 * Roles:
 * - person: Basic user role with limited access
 * - admin: Administrative role with full system access
 * 
 * Resources:
 * - profile: User profile information
 * - person: User account data
 * - lodging: Lodging information
 * - specialists: Specialist accounts and data
 * - appointments: Session appointments
 * - users: User management
 * 
 * @module config/roles
 * @requires accesscontrol - Role-based access control library
 */

import AccessControl from 'accesscontrol'
const accessControl = new AccessControl()

/**
 * Configure role-based access control rules
 * Defines permissions for different user roles
 * 
 * @returns {AccessControl} Configured access control instance
 */
const roles = () => {
  // Configure basic user role (person)
  accessControl
    .grant('person')
    // Profile permissions
    .readOwn('profile')
    .updateOwn('profile')
    // Person permissions
    .createOwn('person')
    .readOwn('person')
    .updateOwn('person')
    // Lodging permissions
    .readAny('lodging')

  // Configure admin role
  accessControl
    .grant('admin')
    .extend('person') // Inherit all person permissions
    // Specialist management permissions
    .readAny('specialists')
    .createAny('specialists')
    .deleteAny('specialists')
    .updateAny('specialists')
    // Appointment management permissions
    .readAny('appointments')
    .createAny('appointments')
    .deleteAny('appointments')
    .updateAny('appointments')
    // User management permissions
    .readAny('users')
    .createAny('users')
    .deleteAny('users')
    .updateAny('users')

  return accessControl
}

export default roles()
