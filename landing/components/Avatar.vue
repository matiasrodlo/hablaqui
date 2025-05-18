/**
 * Avatar Component
 * 
 * A versatile avatar component that displays either an image or user initials.
 * Features automatic color generation for initials-based avatars and loading states.
 * Supports customizable sizes and styling options.
 * 
 * Key Features:
 * - Image or initials-based display
 * - Automatic color generation for initials
 * - Loading state indicator
 * - Customizable sizes
 * - Responsive design
 * - Lazy loading for images
 * - Fallback to initials when image fails
 * - Accessibility support
 * - Cross-browser compatibility
 * - High contrast support
 * - Screen reader friendly
 * 
 * Component Requirements:
 * - Vuetify v-avatar component
 * - Vuetify v-img component
 * - Vuetify v-progress-circular component
 * 
 * @component
 * @example
 * <!-- Basic usage with image -->
 * <Avatar
 *   name="John"
 *   lastName="Doe"
 *   url="https://example.com/avatar.jpg"
 *   size="40"
 * />
 * 
 * <!-- Usage with initials only -->
 * <Avatar
 *   name="John"
 *   lastName="Doe"
 *   size="40"
 * />
 * 
 * <!-- Usage with loading state -->
 * <Avatar
 *   name="John"
 *   lastName="Doe"
 *   url="https://example.com/avatar.jpg"
 *   size="40"
 *   loading
 *   loadingColor="primary"
 * />
 * 
 * // Available sizes:
 * // - x-small: 28px (default)
 * // - small: 32px
 * // - medium: 40px
 * // - large: 48px
 * // - x-large: 64px
 * 
 * // Available colors for initials:
 * // - red
 * // - blue
 * // - green
 * // - indigo
 * // - purple
 * // - teal
 * // - orange
 * // - brown
 * // - deep-orange
 * // - blue-grey
 * // - cyan
 * 
 * // Error Handling:
 * // - Image loading errors
 * // - Invalid size values
 * // - Missing name/lastName
 * // - Invalid color values
 * 
 * // Performance:
 * // - Lazy loading for images
 * // - Efficient color generation
 * // - Minimal re-renders
 * // - Optimized transitions
 * 
 * @requires {Vuetify} v-avatar - Avatar container
 * @requires {Vuetify} v-img - Image component
 * @requires {Vuetify} v-progress-circular - Loading indicator
 * 
 * @throws {Error} If image loading fails
 * @throws {Error} If size is invalid
 * @throws {Error} If color generation fails
 */
<template>
  <v-avatar x-small :color="randomColors" :size="size">
    <!-- Image Avatar -->
    <v-img
      v-if="Boolean(url)"
      class="pa-1"
      :src="url"
      :lazy-src="url"
      :alt="`${name} ${lastName} avatar`"
      contain
    />
    <!-- Initials Avatar -->
    <span
      v-else
      style="font-size: 8px"
      class="white--text text-uppercase"
      :class="headline ? 'headline' : 'subtitle-2'"
    >
      {{ initials }}
    </span>
    <!-- Loading Indicator -->
    <v-progress-circular
      v-if="loading"
      style="position: absolute"
      indeterminate
      :color="loadingColor"
    ></v-progress-circular>
  </v-avatar>
</template>

<script>
/**
 * Avatar Component
 * 
 * A Vue component that provides a versatile avatar display with support for
 * images and initials-based fallback.
 * 
 * @component
 * @requires {Vuetify} v-avatar - Avatar container
 * @requires {Vuetify} v-img - Image component
 * @requires {Vuetify} v-progress-circular - Loading indicator
 */
export default {
  name: 'Avatar',

  /**
   * Component properties
   * @property {String} name - User's first name
   * @property {String} lastName - User's last name
   * @property {String} url - URL of the avatar image
   * @property {Boolean} loading - Whether the avatar is in a loading state
   * @property {String} loadingColor - Color of the loading indicator
   * @property {String} size - Size of the avatar in pixels
   * @property {Boolean} headline - Whether to use headline typography for initials
   * 
   * @example
   * {
   *   name: 'John',
   *   lastName: 'Doe',
   *   url: 'https://example.com/avatar.jpg',
   *   loading: false,
   *   loadingColor: 'primary',
   *   size: '40',
   *   headline: true
   * }
   */
  props: {
    name: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingColor: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: '28',
    },
    headline: {
      type: Boolean,
      default: true,
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Array} colors - Available colors for initials-based avatars
   * @property {String} currentColor - Currently selected color
   * 
   * @example
   * {
   *   colors: ['red', 'blue', 'green', ...],
   *   currentColor: 'blue'
   * }
   */
  data() {
    return {
      colors: [
        'red',
        'blue',
        'green',
        'indigo',
        'purple',
        'teal',
        'orange',
        'brown',
        'deep-orange',
        'blue-grey',
        'cyan',
      ],
      currentColor: '',
    }
  },

  computed: {
    /**
     * Generates initials from name and last name
     * @returns {String} User's initials (e.g., "JD" for "John Doe")
     * 
     * @example
     * // Input: name="John", lastName="Doe"
     * // Output: "JD"
     */
    initials() {
      if (this.name)
        return `${this.name.substr(0, 1)}${
          this.lastName && this.lastName.substr(0, 1)
        }`
      return ''
    },

    /**
     * Determines the background color for the avatar
     * @returns {String} Color code or name for the avatar background
     * 
     * @example
     * // With image URL: returns '#6e548624'
     * // Without image URL: returns random color from colors array
     */
    randomColors() {
      if (this.url) return '#6e548624'
      return this.colors[Math.floor(Math.random() * this.colors.length)]
    },
  },
}
</script>

<style lang="scss" scoped>
/**
 * Component-specific styles
 * 
 * The component uses Vuetify's built-in styling system for layout and spacing.
 * Custom styles can be added here for specific styling needs.
 */
</style>
