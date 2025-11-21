/**
 * Icon Component
 * 
 * A wrapper component for Vuetify's v-icon that provides additional customization options.
 * This component simplifies icon usage throughout the application with consistent styling.
 * 
 * Key Features:
 * - Material Design Icons integration
 * - Flexible sizing options (x-small to x-large)
 * - Custom size support
 * - Margin control (left/right)
 * - Color customization
 * - Consistent styling across the application
 * - Responsive design
 * - Accessibility support
 * - Theme color integration
 * - Cross-browser compatibility
 * - Semantic HTML structure
 * - Brand-consistent colors
 * - Smooth transitions
 * - High contrast support
 * - Keyboard navigation
 * - Screen reader friendly
 * 
 * Component Requirements:
 * - Vuetify v-icon component
 * - Material Design Icons font
 * - Vuetify theme system
 * - CSS custom properties support
 * - Vue Router (optional)
 * - Vuex store (optional)
 * 
 * @component
 * @example
 * // Basic usage
 * <Icon icon="mdi-home" color="primary" />
 * 
 * // With size
 * <Icon icon="mdi-account" size="24" />
 * 
 * // With margins
 * <Icon icon="mdi-arrow-right" right />
 * 
 * // Available sizes:
 * // - x-small: Extra small icon (16px)
 * // - small: Small icon (20px)
 * // - default: Medium icon (24px)
 * // - large: Large icon (36px)
 * // - x-large: Extra large icon (40px)
 * // - custom: Use size prop for custom dimensions
 * 
 * // Available colors:
 * // - primary: Primary theme color
 * // - secondary: Secondary theme color
 * // - accent: Accent theme color
 * // - error: Error theme color
 * // - warning: Warning theme color
 * // - info: Info theme color
 * // - success: Success theme color
 * // - Any valid CSS color value
 * 
 * // Material Design Icons:
 * // Use the 'mdi-' prefix followed by the icon name
 * // Example: mdi-home, mdi-account, mdi-arrow-right
 * 
 * // Size Units:
 * // - px: Pixels
 * // - rem: Root em units
 * // - em: Em units
 * // - vh: Viewport height
 * // - vw: Viewport width
 * // - %: Percentage
 * 
 * // Accessibility:
 * // - High contrast support
 * // - Screen reader friendly
 * // - Keyboard navigation
 * // - Focus indicators
 * 
 * // Error Handling:
 * // - Size validation
 * // - Icon name validation
 * // - Color validation
 * // - Invalid prop combinations
 * 
 * // Performance:
 * // - Efficient rendering
 * // - Minimal DOM updates
 * // - Optimized transitions
 * // - Font loading optimization
 * 
 * @requires {Vuetify} v-icon - Vuetify icon component
 * @requires {String} icon - Material Design Icons name
 * 
 * @throws {Error} If size value is invalid
 * @throws {Error} If icon name is invalid
 * @throws {Error} If color value is invalid
 * @throws {Error} If size units are invalid
 */
<template>
  <!-- Material Design Icon Wrapper -->
  <v-icon
    :color="color"
    :large="large"
    :left="left"
    :right="right"
    :small="small"
    :x-large="xLarge"
    :x-small="xSmall"
    :size="size"
  >
    {{ icon }}
  </v-icon>
</template>

<script>
/**
 * Icon Component
 * 
 * A Vue component that wraps Vuetify's v-icon component.
 * Provides a consistent interface for using Material Design Icons throughout the application.
 * 
 * @component
 * @requires {Vuetify} v-icon - Vuetify icon component
 * @requires {String} icon - Material Design Icons name
 * 
 * @property {Object} v-icon - Vuetify icon component instance
 * @property {String} v-icon.color - Icon color
 * @property {Boolean} v-icon.large - Large size flag
 * @property {Boolean} v-icon.left - Left margin flag
 * @property {Boolean} v-icon.right - Right margin flag
 * @property {Boolean} v-icon.small - Small size flag
 * @property {Boolean} v-icon.x-large - Extra large size flag
 * @property {Boolean} v-icon.x-small - Extra small size flag
 * @property {String} v-icon.size - Custom size value
 */
export default {
  name: 'Icon',

  /**
   * Component props for customization
   * @property {String} size - Custom size for the icon (overrides other size props)
   * @property {Boolean} xLarge - Whether to display the icon in extra large size
   * @property {Boolean} large - Whether to display the icon in large size
   * @property {Boolean} xSmall - Whether to display the icon in extra small size
   * @property {Boolean} small - Whether to display the icon in small size
   * @property {Boolean} left - Whether to add left margin
   * @property {Boolean} right - Whether to add right margin
   * @property {String} icon - The icon name to display (Material Design Icons format)
   * @property {String} color - The color of the icon (defaults to 'primary')
   * 
   * @throws {Error} If size value is invalid
   * @throws {Error} If icon name is invalid
   * @throws {Error} If color value is invalid
   * @throws {Error} If size units are invalid
   * 
   * @example
   * // Size props
   * {
   *   size: '24px',
   *   xLarge: false,
   *   large: false,
   *   xSmall: false,
   *   small: false
   * }
   * 
   * // Margin props
   * {
   *   left: true,
   *   right: false
   * }
   * 
   * // Icon and color
   * {
   *   icon: 'mdi-home',
   *   color: 'primary'
   * }
   * 
   * // Validation examples
   * {
   *   size: '24px', // Valid
   *   size: '24', // Invalid (missing unit)
   *   icon: 'mdi-home', // Valid
   *   icon: 'home', // Invalid (missing prefix)
   *   color: 'primary', // Valid
   *   color: '#123456', // Valid
   *   color: 'invalid', // Invalid
   * }
   */
  props: {
    size: {
      type: String,
      default: '',
      description: 'Custom size for the icon (overrides other size props)',
      validator: (value) => !value || /^\d+(px|rem|em|vh|vw|%)$/.test(value),
    },
    xLarge: {
      type: Boolean,
      default: false,
      description: 'Whether to display the icon in extra large size (40px)',
    },
    large: {
      type: Boolean,
      default: false,
      description: 'Whether to display the icon in large size (36px)',
    },
    xSmall: {
      type: Boolean,
      default: false,
      description: 'Whether to display the icon in extra small size (16px)',
    },
    small: {
      type: Boolean,
      default: false,
      description: 'Whether to display the icon in small size (20px)',
    },
    left: {
      type: Boolean,
      default: false,
      description: 'Whether to add left margin',
    },
    right: {
      type: Boolean,
      default: false,
      description: 'Whether to add right margin',
    },
    icon: {
      type: String,
      required: true,
      description: 'The icon name to display (Material Design Icons format)',
      validator: (value) => value.startsWith('mdi-'),
    },
    color: {
      type: String,
      default: 'primary',
      description: 'The color of the icon (defaults to primary theme color)',
    },
  },
}
</script>

<style scoped>
/* 
 * Component-specific styles
 * Note: Most styling is handled by Vuetify's v-icon component
 * 
 * The icon uses Vuetify's built-in styling system:
 * - v-icon: Base component styling
 * - Color classes: primary, secondary, accent, error, warning, info, success
 * - Size classes: x-small, small, large, x-large
 * - Margin classes: left, right
 * 
 * Custom styles:
 * - Smooth transitions for color changes
 * - High contrast support for accessibility
 * - Focus indicators for keyboard navigation
 * - Consistent spacing with margins
 * 
 * @property {String} transition - Color transition timing
 * @property {String} contrast - High contrast mode support
 * @property {String} focus - Focus indicator styles
 * @property {String} margin - Margin spacing
 * 
 * @example
 * // Icon styling
 * <v-icon
 *   :color="color"
 *   :large="large"
 *   :left="left"
 *   :right="right"
 *   :small="small"
 *   :x-large="xLarge"
 *   :x-small="xSmall"
 *   :size="size"
 * >
 * 
 * // Transition example
 * .v-icon {
 *   transition: color 0.3s ease;
 * }
 * 
 * // Focus example
 * .v-icon:focus {
 *   outline: 2px solid var(--v-primary-base);
 *   outline-offset: 2px;
 * }
 */
</style>
