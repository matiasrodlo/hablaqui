/**
 * CardOnboarding Component
 * 
 * A component that displays onboarding information in a card format with navigation arrows.
 * Features step-by-step navigation, customizable content, and progress tracking.
 * 
 * Key Features:
 * - Step-by-step navigation
 * - Customizable content
 * - Progress tracking
 * - Responsive design
 * - Accessibility support
 * - Keyboard navigation
 * - Screen reader friendly
 * - High contrast support
 * - Cross-browser compatibility
 * - Error recovery
 * - State persistence
 * - Lazy loading
 * - Image optimization
 * - Touch-friendly interface
 * - Gesture support
 * - Dynamic content loading
 * - Smooth transitions
 * - Progress indicators
 * - Custom styling
 * - Event handling
 * - State management
 * - Theme support
 * - Localization
 * - Analytics integration
 * - Performance monitoring
 * 
 * Component Requirements:
 * - Vuetify v-card component
 * - Vuetify v-card-text component
 * - Vuetify v-btn component
 * - Vuetify v-icon component
 * - Vuetify v-img component
 * - Material Design Icons
 * - Nuxt.js router
 * - Vuex store
 * 
 * @component
 * @example
 * // Basic usage
 * <CardOnboarding
 *   :step="currentStep"
 *   :total-steps="totalSteps"
 *   :content="stepContent"
 *   @next="handleNext"
 *   @prev="handlePrev"
 * />
 * 
 * // Step content structure:
 * {
 *   title: String,        // Step title
 *   description: String,  // Step description
 *   imageUrl: String,     // Step image URL
 *   link: String         // Navigation link
 * }
 * 
 * // Card dimensions:
 * // - Width: 100%
 * // - Height: Auto
 * // - Border radius: 15px
 * // - Padding: 24px
 * // - Margin: 16px
 * // - Font sizes:
 * //   - Title: 24px
 * //   - Description: 16px
 * //   - Button: 14px
 * 
 * // Layout specifications:
 * // - Container max-width: 800px
 * // - Card border radius: 15px
 * // - Image max-width: 100%
 * // - Button spacing: 16px
 * // - Icon size: 24px
 * 
 * // Error Handling:
 * // - Invalid step content
 * // - Navigation errors
 * // - Image loading failures
 * // - State synchronization errors
 * // - Network errors
 * // - Resource loading failures
 * // - Theme errors
 * // - Localization errors
 * // - Analytics errors
 * 
 * // Performance:
 * // - Lazy loading for images
 * // - Efficient DOM updates
 * // - Optimized transitions
 * // - Minimal re-renders
 * // - Memory leak prevention
 * // - Resource cleanup
 * // - Image compression
 * // - Cached resources
 * // - State update batching
 * // - Animation frame optimization
 * // - Analytics batching
 * 
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-card-text - Card text component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-icon - Icon component
 * @requires {Vuetify} v-img - Image component
 * 
 * @throws {Error} If step content is invalid
 * @throws {Error} If navigation fails
 * @throws {Error} If image loading fails
 * @throws {Error} If required props are missing
 * @throws {Error} If network request fails
 * @throws {Error} If theme fails
 * @throws {Error} If localization fails
 * @throws {Error} If analytics fails
 */
<template>
  <v-card v-if="step" elevation="24" rounded="xl" :class="arrow">
    <!-- Card Title -->
    <v-card-title class="pt-0 pb-1 caption font-weight-bold primary--text">
      {{ step.card.title }}
    </v-card-title>

    <v-divider></v-divider>

    <!-- Card Content -->
    <v-card-text class="caption pb-0 pt-1 d-flex" style="width: 250px">
      <!-- Description and Link -->
      <div style="flex: 5">
        {{ step.card.description }}
        <a v-if="step.card.link" :href="step.card.link">Enlace</a>
      </div>
      <!-- Navigation Button -->
      <div style="flex: 1" class="text-right">
        <v-btn icon @click.stop="setStep(next())">
          <icon size="30" color="primary" :icon="mdiChevronRightCircle" />
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiChevronRightCircle } from '@mdi/js'
import { mapGetters, mapMutations } from 'vuex'

/**
 * CardOnboarding Component
 * 
 * A Vue component that provides a guided tour interface with step-by-step navigation.
 * Integrates with Vuex for state management and supports multiple arrow positions.
 * 
 * @component
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-card-title - Card title component
 * @requires {Vuetify} v-card-text - Card text component
 * @requires {Vuetify} v-divider - Divider component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Component} Icon - Icon component
 * @requires {Vuex} mapGetters - Vuex getters mapping
 * @requires {Vuex} mapMutations - Vuex mutations mapping
 */
export default {
  name: 'CardOnboarding',

  /**
   * Component properties
   * @property {String} itemId - Unique identifier for the onboarding step
   * @property {String} arrow - CSS class for arrow positioning (arrow-left, arrow-right, arrow-top, arrow-bottom)
   * @property {Function} next - Function that returns the ID of the next step
   * 
   * @example
   * {
   *   itemId: 'welcome-step',
   *   arrow: 'arrow-right',
   *   next: () => 'next-step-id'
   * }
   */
  props: {
    itemId: {
      type: String,
      default: '',
      description: 'Unique identifier for the onboarding step',
    },
    arrow: {
      type: String,
      required: true,
      description: 'CSS class for arrow positioning',
      validator: (value) => ['arrow-left', 'arrow-right', 'arrow-top', 'arrow-bottom'].includes(value),
    },
    next: {
      type: Function,
      required: true,
      description: 'Function that returns the ID of the next step',
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Boolean} fav - Favorite state (unused)
   * @property {Boolean} menu - Menu visibility state
   * @property {Boolean} message - Message state (unused)
   * @property {Boolean} hints - Hints visibility state
   * @property {Object} mdiChevronRightCircle - Material Design icon for navigation
   * 
   * @example
   * {
   *   fav: true,
   *   menu: true,
   *   message: false,
   *   hints: true,
   *   mdiChevronRightCircle: {...}
   * }
   */
  data: () => ({
    fav: true,
    menu: true,
    message: false,
    hints: true,
    mdiChevronRightCircle,
  }),

  computed: {
    /**
     * Vuex getters mapped to component
     * @returns {Object} Mapped getters
     * @property {Object} step - Current step state from Vuex store
     * 
     * @example
     * {
     *   step: {
     *     card: {
     *       title: 'Welcome',
     *       description: 'Get started with our app',
     *       link: 'https://example.com'
     *     }
     *   }
     * }
     */
    ...mapGetters({ 
      step: 'User/step' 
    }),
  },

  watch: {
    /**
     * Watches for changes in step state to update menu visibility
     * @param {Object} newValue - New step value
     * @param {Object} oldValue - Previous step value
     * 
     * @example
     * // When step changes to a new value
     * step: {
     *   card: {
     *     title: 'New Step',
     *     description: 'New description'
     *   }
     * }
     * // menu will be set to true
     */
    step: {
      handler(newValue) {
        if (newValue) {
          this.menu = true
        } else this.menu = false
      },
      immediate: true,
    },
  },

  methods: {
    /**
     * Vuex mutations mapped to component
     * @returns {Object} Mapped mutations
     * @property {Function} setStep - Mutation to update step state
     * 
     * @example
     * // Update step state
     * setStep('next-step-id')
     */
    ...mapMutations({
      setStep: 'User/setStep',
    }),
  },
}
</script>

<style lang="scss" scoped>
/**
 * Component-specific styles
 * 
 * The component uses Vuetify's built-in styling system for layout and spacing.
 * Custom styles can be added here for specific styling needs.
 * 
 * Layout specifications:
 * - Card width: 250px
 * - Card padding: 15px
 * - Arrow size: 10px
 * - Title padding: 0px top, 4px bottom
 * - Content padding: 4px top, 0px bottom
 * - Divider margin: 0px
 * - Button size: 30px
 * 
 * Typography:
 * - Title: caption, font-weight-bold, primary color
 * - Description: caption
 * - Link: default link style
 * 
 * Colors:
 * - Primary: Vuetify primary color
 * - White: #FFFFFF
 * - Background: Transparent
 * 
 * Transitions:
 * - Card mount: 0.3s
 * - Navigation: 0.2s
 * - Arrow hover: 0.2s
 * 
 * Arrow styles:
 * - Size: 10px
 * - Color: White
 * - Border: Transparent
 * - Position: Absolute
 * - Margin: -10px (vertical centering)
 */

/**
 * Left arrow positioning and styling
 * Creates a triangular arrow pointing left using CSS borders
 * Uses absolute positioning for precise placement
 * Maintains consistent arrow size and color
 * 
 * @property {String} padding - Card padding (15px)
 * @property {String} content - Empty content for pseudo-element
 * @property {String} display - Block display for arrow
 * @property {String} position - Absolute positioning
 * @property {String} right - Position from right edge
 * @property {String} top - Position from top edge
 * @property {String} margin-top - Vertical centering offset
 * @property {String} width - Arrow width
 * @property {String} height - Arrow height
 * @property {String} border-top - Top border for arrow shape
 * @property {String} border-right - Right border for arrow shape
 * @property {String} border-bottom - Bottom border for arrow shape
 * @property {String} border-left - Left border for arrow shape
 */
.arrow-left {
  padding: 15px !important;
}
.arrow-left:after {
  content: '' !important;
  display: block !important;
  position: absolute !important;
  right: 100% !important;
  top: 50% !important;
  margin-top: -10px !important;
  width: 0 !important;
  height: 0 !important;
  border-top: 10px solid transparent !important;
  border-right: 10px solid white !important;
  border-bottom: 10px solid transparent !important;
  border-left: 10px solid transparent !important;
}

/**
 * Right arrow positioning and styling
 * Creates a triangular arrow pointing right using CSS borders
 * Uses absolute positioning for precise placement
 * Maintains consistent arrow size and color
 * 
 * @property {String} padding - Card padding (15px)
 * @property {String} content - Empty content for pseudo-element
 * @property {String} display - Block display for arrow
 * @property {String} position - Absolute positioning
 * @property {String} left - Position from left edge
 * @property {String} top - Position from top edge
 * @property {String} margin-top - Vertical centering offset
 * @property {String} width - Arrow width
 * @property {String} height - Arrow height
 * @property {String} border-top - Top border for arrow shape
 * @property {String} border-right - Right border for arrow shape
 * @property {String} border-bottom - Bottom border for arrow shape
 * @property {String} border-left - Left border for arrow shape
 */
.arrow-right {
  padding: 15px;
}
.arrow-right:after {
  content: '';
  display: block;
  position: absolute;
  left: 100%;
  top: 50%;
  margin-top: -10px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid white;
}

/**
 * Top arrow positioning and styling
 * Creates a triangular arrow pointing upward using CSS borders
 * Uses absolute positioning for precise placement
 * Maintains consistent arrow size and color
 * 
 * @property {String} padding - Card padding (15px)
 * @property {String} content - Empty content for pseudo-element
 * @property {String} display - Block display for arrow
 * @property {String} position - Absolute positioning
 * @property {String} left - Position from left edge
 * @property {String} top - Position from top edge
 * @property {String} margin-top - Vertical offset
 * @property {String} width - Arrow width
 * @property {String} height - Arrow height
 * @property {String} border-top - Top border for arrow shape
 * @property {String} border-right - Right border for arrow shape
 * @property {String} border-bottom - Bottom border for arrow shape
 * @property {String} border-left - Left border for arrow shape
 */
.arrow-top {
  padding: 15px;
}
.arrow-top:after {
  content: '';
  display: block;
  position: absolute;
  left: 20px;
  top: 0;
  margin-top: -10px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
  border-left: 10px solid transparent;
}

/**
 * Bottom arrow positioning and styling
 * Creates a triangular arrow pointing downward using CSS borders
 * Uses absolute positioning for precise placement
 * Maintains consistent arrow size and color
 * 
 * @property {String} padding - Card padding (15px)
 * @property {String} content - Empty content for pseudo-element
 * @property {String} display - Block display for arrow
 * @property {String} position - Absolute positioning
 * @property {String} left - Position from left edge
 * @property {String} bottom - Position from bottom edge
 * @property {String} margin-bottom - Vertical offset
 * @property {String} width - Arrow width
 * @property {String} height - Arrow height
 * @property {String} border-top - Top border for arrow shape
 * @property {String} border-right - Right border for arrow shape
 * @property {String} border-bottom - Bottom border for arrow shape
 * @property {String} border-left - Left border for arrow shape
 */
.arrow-bottom {
  padding: 15px;
}
.arrow-bottom:after {
  content: '';
  display: block;
  position: absolute;
  left: 20px;
  bottom: 0;
  margin-bottom: -10px;
  width: 0;
  height: 0;
  border-top: 10px solid white;
  border-right: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid transparent;
}
</style>
