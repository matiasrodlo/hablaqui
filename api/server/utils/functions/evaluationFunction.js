/**
 * Evaluation Utility Functions
 * 
 * This module provides functions for managing therapy session evaluations,
 * including creating, retrieving, and analyzing evaluation data.
 * 
 * @module utils/functions/evaluationFunction
 */

import { logError } from '../../config/pino'
import { Evaluation } from '../../models/evaluation'
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
 * Creates a new session evaluation
 * 
 * @param {Object} evaluationData - Evaluation data
 * @param {string} evaluationData.sessionId - ID of the session being evaluated
 * @param {string} evaluationData.userId - ID of the user submitting the evaluation
 * @param {number} evaluationData.rating - Rating score (1-5)
 * @param {string} evaluationData.comment - Optional evaluation comment
 * @returns {Promise<Object>} Created evaluation object
 * 
 * @example
 * // Create a new evaluation
 * const evaluation = await createEvaluation({
 *   sessionId: 'session123',
 *   userId: 'user456',
 *   rating: 5,
 *   comment: 'Great session!'
 * });
 */
const createEvaluation = async (evaluationData) => {
  try {
    // Validate session exists
    const session = await Sessions.findById(evaluationData.sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    // Create evaluation
    const evaluation = new Evaluation({
      session: evaluationData.sessionId,
      user: evaluationData.userId,
      rating: evaluationData.rating,
      comment: evaluationData.comment
    })

    await evaluation.save()
    return evaluation
  } catch (error) {
    logError('Error creating evaluation:', error)
    throw error
  }
}

/**
 * Retrieves evaluations for a specialist
 * 
 * @param {string} specialistId - ID of the specialist
 * @param {Object} [query={}] - Query parameters for filtering and pagination
 * @param {number} [query.page=1] - Page number for pagination
 * @param {number} [query.limit=10] - Number of items per page
 * @returns {Promise<Object>} Object containing evaluations and pagination info
 * 
 * @example
 * // Get specialist evaluations
 * const evaluations = await getSpecialistEvaluations('specialist123', {
 *   page: 1,
 *   limit: 10
 * });
 */
const getSpecialistEvaluations = async (specialistId, query = {}) => {
  try {
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const skip = (page - 1) * limit

    // Get sessions for the specialist
    const sessions = await Sessions.find({ specialist: specialistId })
    const sessionIds = sessions.map(session => session._id)

    // Get total count for pagination
    const total = await Evaluation.countDocuments({ session: { $in: sessionIds } })

    // Retrieve evaluations with pagination
    const evaluations = await Evaluation.find({ session: { $in: sessionIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('session')
      .populate('user', 'name lastName')

    return {
      evaluations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    logError('Error getting specialist evaluations:', error)
    throw error
  }
}

/**
 * Calculates average rating for a specialist
 * 
 * @param {string} specialistId - ID of the specialist
 * @returns {Promise<Object>} Object containing rating statistics
 * 
 * @example
 * // Get specialist rating statistics
 * const stats = await getSpecialistRatingStats('specialist123');
 */
const getSpecialistRatingStats = async (specialistId) => {
  try {
    // Get sessions for the specialist
    const sessions = await Sessions.find({ specialist: specialistId })
    const sessionIds = sessions.map(session => session._id)

    // Calculate average rating
    const result = await Evaluation.aggregate([
      { $match: { session: { $in: sessionIds } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ])

    if (result.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      }
    }

    // Calculate rating distribution
    const distribution = result[0].ratingDistribution.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {})

    return {
      averageRating: result[0].averageRating,
      totalRatings: result[0].totalRatings,
      ratingDistribution: distribution
    }
  } catch (error) {
    logError('Error calculating specialist rating stats:', error)
    throw error
  }
}

module.exports = {
  createEvaluation,
  getSpecialistEvaluations,
  getSpecialistRatingStats
}
