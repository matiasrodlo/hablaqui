/**
 * Get All Sessions Function
 * 
 * This module provides functionality to retrieve all sessions for a user or specialist.
 * It handles session retrieval with proper filtering and pagination.
 * 
 * @module utils/functions/getAllSessionsFunction
 */

import { logError } from '../../config/pino'
import { Sessions } from '../../models/sessions'
import { User } from '../../models/user'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Configure dayjs with required plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Retrieves all sessions for a user or specialist
 * 
 * @param {Object} user - User object containing role and ID
 * @param {Object} [query={}] - Query parameters for filtering and pagination
 * @param {number} [query.page=1] - Page number for pagination
 * @param {number} [query.limit=10] - Number of items per page
 * @param {string} [query.status] - Filter by session status
 * @param {string} [query.date] - Filter by session date
 * @returns {Promise<Object>} Object containing sessions and pagination info
 * 
 * @example
 * // Get all sessions for a user
 * const sessions = await getAllSessions(user, { page: 1, limit: 10 });
 * 
 * @example
 * // Get filtered sessions
 * const sessions = await getAllSessions(user, { 
 *   status: 'completed',
 *   date: '2024-03-20'
 * });
 */
const getAllSessions = async (user, query = {}) => {
  try {
    // Set default pagination values
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter based on user role
    let filter = {}
    if (user.role === 'user') {
      filter.user = user._id
    } else if (user.role === 'specialist') {
      filter.specialist = user.specialist
    }

    // Add additional filters if provided
    if (query.status) {
      filter.status = query.status
    }
    if (query.date) {
      filter.date = new Date(query.date)
    }

    // Get total count for pagination
    const total = await Sessions.countDocuments(filter)

    // Retrieve sessions with pagination
    const sessions = await Sessions.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name lastName email')
      .populate('specialist', 'name lastName email')

    return {
      sessions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    logError('Error in getAllSessions:', error)
    throw error
  }
}

/**
 * Retrieves session details including user and specialist information
 * 
 * @param {string} sessionId - ID of the session to retrieve
 * @returns {Promise<Object>} Session object with populated user and specialist data
 * 
 * @example
 * // Get session details
 * const session = await getSessionDetails('session123');
 */
const getSessionDetails = async (sessionId) => {
  try {
    const session = await Sessions.findById(sessionId)
      .populate('user', 'name lastName email')
      .populate('specialist', 'name lastName email')

    if (!session) {
      throw new Error('Session not found')
    }

    return session
  } catch (error) {
    logError('Error in getSessionDetails:', error)
    throw error
  }
}

module.exports = {
  getAllSessions,
  getSessionDetails
}
