/**
 * Snackbar Utility Functions
 * 
 * This module provides utility functions for displaying snackbar notifications
 * in the Hablaquí landing page. It includes functions for showing success and error messages.
 * 
 * @module utils/snackbar
 */

import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn'

/**
 * Generates an error snackbar configuration object
 * 
 * @param {Error} e - Error object to be displayed
 * @returns {Object} Snackbar configuration object with error message and color
 * 
 * @example
 * // Generate error snackbar config
 * const errorConfig = generateSnackBarError(new Error('Something went wrong'));
 */
export const generateSnackBarError = (e) => ({
  content: evaluateErrorReturn(e),
  color: 'error',
})

/**
 * Displays an error message in the snackbar
 * 
 * @param {Error} e - Error object to be displayed
 * @returns {Function} Vuex commit function to show the error message
 * 
 * @example
 * // Show error snackbar
 * dispatch(snackBarError(new Error('Something went wrong')));
 */
export const snackBarError = (e) => (commit) => {
  commit('Snackbar/showMessage', generateSnackBarError(e), { root: true })
}

/**
 * Displays a success message in the snackbar
 * 
 * @param {string} message - Success message to be displayed
 * @returns {Function} Vuex commit function to show the success message
 * 
 * @example
 * // Show success snackbar
 * dispatch(snackBarSuccess('Operation completed successfully'));
 */
export const snackBarSuccess = (message) => (commit) => {
  commit(
    'Snackbar/showMessage',
    {
      content: message,
      color: 'success',
    },
    { root: true }
  )
}
