/**
 * Evaluation Management Utilities
 * 
 * This module provides utility functions for managing specialist evaluations,
 * including retrieving evaluations and calculating average scores.
 * 
 * @module utils/functions/evaluationFunction
 */

import Evaluation from '../../models/evaluation'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Configure dayjs with required plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Retrieves and formats all evaluations for a specialist
 * 
 * @param {string} spec - Specialist ID
 * @returns {Promise<Array>} Array of formatted evaluation objects
 * 
 * @example
 * // Get all evaluations for a specialist
 * const evaluations = await getAllEvaluationsFunction('specialist123');
 * 
 * @returns {Promise<Array<{
 *   _id: string,
 *   evaluationsId: string,
 *   comment: string,
 *   approved: boolean,
 *   global: number,
 *   puntuality: number,
 *   attention: number,
 *   internet: number,
 *   name: string,
 *   userId: string,
 *   moderatingDate: string,
 *   createdAt: string
 * }>>}
 */
export const getAllEvaluationsFunction = async spec => {
  let evaluations = await Evaluation.find({ specialist: spec }).populate('user')

  evaluations = evaluations.flatMap(item => {
    return item.evaluations.map(evaluation => {
      return {
        _id: evaluation._id,
        evaluationsId: item._id,
        comment: evaluation.comment,
        approved: evaluation.approved,
        global: evaluation.global,
        puntuality: evaluation.puntuality,
        attention: evaluation.attention,
        internet: evaluation.internet,
        name: item.user.name,
        userId: item.user._id,
        moderatingDate: evaluation.moderatingDate,
        createdAt: dayjs.tz(dayjs(evaluation.createdAt)).format(),
      }
    })
  })

  return evaluations
}

/**
 * Calculates average scores from an array of evaluations
 * 
 * @param {Array<{
 *   global: number,
 *   puntuality: number,
 *   attention: number,
 *   internet: number
 * }>} evaluations - Array of evaluation objects
 * @returns {Object} Object containing average scores for each category
 * 
 * @example
 * // Calculate average scores
 * const scores = getScores(evaluations);
 * // Returns: { global: 4.5, internet: 4.8, puntuality: 4.2, attention: 4.7 }
 * 
 * @returns {{
 *   global: number,
 *   internet: number,
 *   puntuality: number,
 *   attention: number
 * }}
 */
export const getScores = evaluations => {
  const global =
    evaluations.reduce(
      (sum, value) =>
        typeof value.global === 'number' ? sum + value.global : sum,
      0
    ) / evaluations.length
  const puntuality =
    evaluations.reduce(
      (sum, value) =>
        typeof value.puntuality === 'number' ? sum + value.puntuality : sum,
      0
    ) / evaluations.length
  const attention =
    evaluations.reduce(
      (sum, value) =>
        typeof value.attention === 'number' ? sum + value.attention : sum,
      0
    ) / evaluations.length
  const internet =
    evaluations.reduce(
      (sum, value) =>
        typeof value.internet === 'number' ? sum + value.internet : sum,
      0
    ) / evaluations.length
  return { global, internet, puntuality, attention }
}
