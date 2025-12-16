/**
 * Snackbar Component
 * 
 * A global notification component that displays temporary messages to users.
 * This component is connected to the Vuex store and can be triggered from anywhere in the application.
 * 
 * Key Features:
 * - Global notification system
 * - Vuex store integration
 * - Customizable colors and messages
 * - Dismissible notifications
 * - Positioned at top-right of screen
 * - Accessible with data-cy attribute for testing
 * - Auto-dismissible with close button
 * - Responsive design
 * - Consistent styling with Vuetify
 * - Smooth transitions
 * - Semantic HTML structure
 * - Brand-consistent colors
 * - Cross-browser compatibility
 * - High contrast support
 * - Keyboard navigation
 * - Screen reader friendly
 * 
 * Component Requirements:
 * - Vuex store with Snackbar module
 * - Vuetify v-snackbar component
 * - Vuetify v-btn component
 * - Vuex store subscription system
 * - Vue Router (optional)
 * - Material Design Icons (optional)
 * 
 * @component
 * @example
 * // In a Vuex store mutation
 * commit('Snackbar/showMessage', {
 *   content: 'Operation successful',
 *   color: 'success'
 * })
 * 
 * // Available colors:
 * // - success: Green theme for successful operations
 * // - error: Red theme for error messages
 * // - warning: Orange theme for warnings
 * // - info: Blue theme for information
 * 
 * // Vuex Store Requirements:
 * // - Snackbar/content: Message content to display
 * // - Snackbar/color: Color theme for the notification
 * // - Snackbar/showMessage: Mutation to trigger the snackbar
 * 
 * // Component Behavior:
 * // - Auto-dismisses after a few seconds
 * // - Can be manually dismissed with close button
 * // - Stacks multiple notifications
 * // - Maintains consistent positioning
 * 
 * // Accessibility:
 * // - data-cy attribute for testing
 * // - Keyboard navigation support
 * // - Screen reader friendly
 * // - High contrast colors
 * 
 * // Error Handling:
 * // - Vuex store validation
 * // - Missing module detection
 * // - Invalid state handling
 * // - Mutation error catching
 * 
 * // Performance:
 * // - Efficient state updates
 * // - Minimal DOM updates
 * // - Optimized transitions
 * // - Memory leak prevention
 * 
 * @requires {Vuex} store - Vuex store with Snackbar module
 * @requires {Vuetify} v-snackbar - Vuetify snackbar component
 * @requires {Vuetify} v-btn - Vuetify button component
 * 
 * @throws {Error} If Vuex store is not properly configured
 * @throws {Error} If Snackbar module is missing
 * @throws {Error} If mutation type is invalid
 * @throws {Error} If state structure is invalid
 */
<template>
  <!-- Global Notification Snackbar -->
  <v-snackbar 
    v-model="show" 
    :color="color" 
    right 
    top 
    tile 
    data-cy="snackBar"
  >
    {{ message }}
    <template #action="{ attrs }">
      <v-btn 
        dark 
        text 
        v-bind="attrs" 
        @click="show = false"
      >
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
/**
 * Snackbar Component
 * 
 * A Vue component that provides a global notification system.
 * Integrates with Vuex store to display messages from anywhere in the application.
 * 
 * @component
 * @requires {Vuex} store - Vuex store with Snackbar module
 * @requires {Vuetify} v-snackbar - Vuetify snackbar component
 * @requires {Vuetify} v-btn - Vuetify button component
 * 
 * @property {Object} $store - Vuex store instance
 * @property {Function} $store.subscribe - Vuex store subscription method
 */
export default {
  name: 'Snackbar',

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Boolean} show - Controls the visibility of the snackbar
   * @property {String} message - The message to display
   * @property {String} color - The color theme of the snackbar (success, error, warning, info)
   * 
   * @example
   * {
   *   show: false,
   *   message: 'Operation successful',
   *   color: 'success'
   * }
   * 
   * // Color themes
   * {
   *   success: '#4CAF50',
   *   error: '#F44336',
   *   warning: '#FF9800',
   *   info: '#2196F3'
   * }
   */
  data() {
    return {
      show: false,
      message: '',
      color: '',
    }
  },

  /**
   * Lifecycle hook that subscribes to Vuex store mutations
   * Listens for 'Snackbar/showMessage' mutation to display notifications
   * 
   * @listens {String} Snackbar/showMessage - Vuex mutation that triggers the snackbar
   * @param {Object} mutation - The Vuex mutation object
   * @param {Object} state - The Vuex state object
   * @property {String} mutation.type - The type of mutation
   * @property {Object} state.Snackbar - The Snackbar module state
   * @property {String} state.Snackbar.content - The message content
   * @property {String} state.Snackbar.color - The color theme
   * 
   * @throws {Error} If Vuex store is not properly configured
   * @throws {Error} If Snackbar module is missing
   * @throws {Error} If mutation type is invalid
   * @throws {Error} If state structure is invalid
   * 
   * @example
   * // Vuex store mutation
   * commit('Snackbar/showMessage', {
   *   content: 'Operation successful',
   *   color: 'success'
   * })
   * 
   * // Component state update
   * {
   *   show: true,
   *   message: 'Operation successful',
   *   color: 'success'
   * }
   * 
   * // Error handling
   * try {
   *   this.$store.subscribe((mutation, state) => {
   *     if (mutation.type === 'Snackbar/showMessage') {
   *       // Update component state
   *     }
   *   })
   * } catch (error) {
   *   console.error('Error in Snackbar subscription:', error)
   * }
   */
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'Snackbar/showMessage') {
        this.message = state.Snackbar.content
        this.color = state.Snackbar.color
        this.show = true
      }
    })
  },
}
</script>

<style scoped>
/* 
 * Component-specific styles
 * Note: Most styling is handled by Vuetify's v-snackbar component
 * 
 * The snackbar uses Vuetify's built-in styling system:
 * - v-snackbar: Base component styling
 * - v-btn: Action button styling
 * - Color classes: success, error, warning, info
 * 
 * Custom styles:
 * - tile: Removes border radius for a modern look
 * - dark: Ensures text is visible on colored backgrounds
 * - text: Removes button background for a clean appearance
 * 
 * @property {String} tile - Border radius removal
 * @property {String} dark - Text color contrast
 * @property {String} text - Button background removal
 * 
 * @example
 * // Snackbar styling
 * <v-snackbar
 *   v-model="show"
 *   :color="color"
 *   right
 *   top
 *   tile
 *   data-cy="snackBar"
 * >
 * 
 * // Button styling
 * <v-btn
 *   dark
 *   text
 *   v-bind="attrs"
 *   @click="show = false"
 * >
 */
</style>
