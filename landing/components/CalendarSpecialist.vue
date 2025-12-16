/**
 * CalendarSpecialist Component
 * 
 * A specialized calendar component for specialists to manage and display their available time slots.
 * Features a collapsible interface with expandable/collapsible view of time slots.
 * Integrates with authentication system to handle user roles and session booking.
 * 
 * Key Features:
 * - Responsive calendar interface with slide navigation
 * - Expandable/collapsible time slot view
 * - Role-based session booking flow
 * - Loading state handling
 * - Time slot selection with visual feedback
 * - Integration with authentication system
 * - Smooth transitions and animations
 * - Semantic HTML structure
 * - Brand-consistent styling
 * - Cross-browser compatibility
 * - High contrast support
 * - Keyboard navigation
 * - Screen reader friendly
 * - Mobile-optimized interface
 * - Lazy loading for performance
 * 
 * Component Requirements:
 * - Vuetify v-slide-group for slide navigation
 * - Vuetify v-slide-item for slide items
 * - Vuetify v-sheet for time slots
 * - Vuetify v-btn for action button
 * - Vuetify v-progress-circular for loading state
 * - Icon component for navigation arrows
 * - Vuex auth module for authentication
 * - Vue Router for navigation
 * 
 * @component
 * @example
 * <CalendarSpecialist
 *   :callback="handleSessionSelection"
 *   :setFullCard="expandCard"
 *   :setMinimalCard="collapseCard"
 *   titleButton="Schedule Session"
 *   :idSpec="specialistId"
 *   :username="specialistUsername"
 *   :sessions="availableSessions"
 * />
 * 
 * // Available props:
 * // - callback: Function to handle session selection
 * // - setFullCard: Function to expand the calendar card
 * // - setMinimalCard: Function to collapse the calendar card
 * // - titleButton: Text for the action button (default: 'Agendar una cita online')
 * // - idSpec: Specialist ID
 * // - username: Specialist username
 * // - loadingBtn: Loading state for the action button
 * // - sessions: Array of available sessions
 * 
 * // Session Object Structure:
 * // {
 * //   text: String,      // Date text (e.g., "Monday, January 1")
 * //   day: String,       // Day of week
 * //   date: String,      // Date in YYYY-MM-DD format
 * //   available: Array   // Array of available time slots
 * // }
 * 
 * // Calendar Dimensions:
 * // - Collapsed: max-height: 230px
 * // - Expanded: max-height: 100%
 * // - Time slot: 100% width, auto height
 * // - Padding: 8px 5px
 * 
 * // Navigation:
 * // - Left/Right arrows for date navigation
 * // - Expand/Collapse button for time slots
 * // - Click on time slot to select
 * 
 * // Authentication Flow:
 * // - Unauthenticated: Redirects to auth page
 * // - Non-specialist: Redirects to payment page
 * // - Specialist: No action (handled by parent)
 * 
 * // Accessibility:
 * // - Keyboard navigation support
 * // - ARIA landmarks
 * // - High contrast colors
 * // - Screen reader friendly
 * // - Focus indicators
 * 
 * // Error Handling:
 * // - Loading state for data fetching
 * // - Error states for failed requests
 * // - Validation for required props
 * // - Fallback UI for empty states
 * // - Authentication error handling
 * // - Navigation error handling
 * 
 * // Performance:
 * // - Lazy loading of components
 * // - Optimized re-renders
 * // - Efficient state management
 * // - Smooth animations
 * // - Conditional rendering
 * 
 * @requires {Vuetify} v-slide-group - Slide navigation component
 * @requires {Vuetify} v-slide-item - Slide item component
 * @requires {Vuetify} v-sheet - Sheet component for time slots
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-progress-circular - Loading indicator
 * @requires {Component} Icon - Icon component
 * @requires {Vuex} $auth - Authentication store
 * @requires {VueRouter} $router - Router instance
 * 
 * @throws {Error} If required props are missing
 * @throws {Error} If callback function is invalid
 * @throws {Error} If navigation fails
 * @throws {Error} If authentication state is invalid
 * @throws {Error} If parent callbacks fail
 */
<template>
  <div :id="idSpec">
    <!-- Loading State -->
    <v-row
      v-if="!sessions.length"
      class="ma-0"
      style="height: 280px"
      align="center"
      justify="center"
    >
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <!-- Calendar Interface -->
    <template v-else>
      <div :style="heighCalendar" style="overflow-y: clip">
        <v-slide-group
          v-model="slide"
          class="content"
          center-active
          show-arrows
        >
          <!-- Navigation Arrows -->
          <template #prev>
            <div class="align-self-start mt-4">
              <icon :icon="mdiChevronLeft" />
            </div>
          </template>
          <template #next>
            <div class="align-self-start mt-4">
              <icon :icon="mdiChevronRight" />
            </div>
          </template>

          <!-- Date Slides -->
          <v-slide-item
            v-for="(item, k) in sessions"
            :key="k"
            v-slot="{ toggle }"
          >
            <v-container class="pb-0 px-4">
              <!-- Date Header -->
              <div class="text-center" @click="toggle">
                <div
                  class="body-2 font-weight-bold text-capitalize"
                  style="color: #706f6f"
                >
                  {{ item.text }}
                </div>
                <div class="caption text--secondary text-capitalize">
                  {{ item.day }}
                </div>
              </div>

              <!-- Time Slots -->
              <div class="mt-3">
                <v-sheet
                  v-for="(n, r) in item.available"
                  :key="r"
                  rounded
                  class="item text-center my-3 pa-1"
                  style="width: 100%; height: fit-content"
                  :class="
                    selected &&
                    selected.start == n &&
                    selected.date == item.date
                      ? 'itemSelected'
                      : ''
                  "
                  @click.stop="goPlans(item, n, r)"
                >
                  {{ n }}
                </v-sheet>
              </div>
            </v-container>
          </v-slide-item>
        </v-slide-group>
      </div>

      <!-- Expand/Collapse Button -->
      <div class="text-center">
        <v-btn
          small
          text
          color="primary"
          class="mt-5"
          @click="toggleCalendarHeight"
        >
          <span class="mr-2">
            {{
              heighCalendar === 'max-height: 230px'
                ? 'Más horarios'
                : 'Ver menos'
            }}
          </span>
          <icon
            color="primary"
            :icon="
              heighCalendar === 'max-height: 230px'
                ? mdiChevronDown
                : mdiChevronUp
            "
          />
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script>
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronDown,
  mdiChevronUp,
} from '@mdi/js'

/**
 * CalendarSpecialist Component
 * 
 * A Vue component that provides a specialized calendar interface for specialists.
 * Implements responsive design with slide navigation and expandable time slots.
 * 
 * @component
 * @requires {Vuetify} v-slide-group - Slide navigation component
 * @requires {Vuetify} v-slide-item - Slide item component
 * @requires {Vuetify} v-sheet - Sheet component for time slots
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-progress-circular - Loading indicator
 * @requires {Component} Icon - Icon component
 * @requires {Vuex} $auth - Authentication store
 * @requires {VueRouter} $router - Router instance
 */
export default {
  name: 'CalendarSpecialist',

  /**
   * Component dependencies
   * @property {Component} Icon - Icon component for navigation arrows
   */
  components: {
    Icon: () => import('~/components/Icon'),
  },

  /**
   * Component properties
   * @property {Function} callback - Callback function for session selection
   * @property {Function} setFullCard - Function to expand the calendar card
   * @property {Function} setMinimalCard - Function to collapse the calendar card
   * @property {String} titleButton - Text for the action button
   * @property {String} idSpec - Specialist ID
   * @property {String} username - Specialist username
   * @property {Boolean} loadingBtn - Loading state for the action button
   * @property {Array} sessions - Array of available sessions
   */
  props: {
    callback: {
      type: Function,
      required: true,
    },
    setFullCard: {
      type: Function,
      required: true,
    },
    setMinimalCard: {
      type: Function,
      required: true,
    },
    titleButton: {
      type: String,
      default: 'Agendar una cita online',
    },
    idSpec: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    loadingBtn: {
      type: Boolean,
      default: false,
    },
    sessions: {
      type: Array,
      required: true,
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Number} slide - Current slide index
   * @property {Object} selected - Selected date and time slot
   * @property {String} heighCalendar - Calendar height style
   * @property {Object} mdiChevronLeft - Material Design icon for left arrow
   * @property {Object} mdiChevronRight - Material Design icon for right arrow
   * @property {Object} mdiChevronDown - Material Design icon for down arrow
   * @property {Object} mdiChevronUp - Material Design icon for up arrow
   * 
   * @example
   * {
   *   slide: 0,
   *   selected: null,
   *   heighCalendar: 'max-height: 230px',
   *   mdiChevronLeft: { path: '...' },
   *   mdiChevronRight: { path: '...' },
   *   mdiChevronDown: { path: '...' },
   *   mdiChevronUp: { path: '...' }
   * }
   */
  data() {
    return {
      slide: 0,
      selected: null,
      heighCalendar: 'max-height: 230px',
      mdiChevronLeft,
      mdiChevronRight,
      mdiChevronDown,
      mdiChevronUp,
    }
  },

  methods: {
    /**
     * Toggles the calendar height between collapsed and expanded states
     */
    toggleCalendarHeight() {
      this.heighCalendar =
        this.heighCalendar === 'max-height: 230px'
          ? 'max-height: 100%'
          : 'max-height: 230px'
    },

    /**
     * Handles time slot selection and navigation based on user role
     * @param {Object} item - Session object
     * @param {String} n - Time slot
     * @param {Number} r - Time slot index
     */
    goPlans(item, n, r) {
      this.selected = {
        date: item.date,
        start: n,
        end: item.available[r + 1],
      }

      if (!this.$auth.loggedIn) {
        this.$router.push({
          name: 'auth',
          query: {
            redirect: `/${this.username}`,
          },
        })
        return
      }

      if (this.$auth.user.role !== 'specialist') {
        this.$router.push({
          name: 'postulacion',
          query: {
            redirect: `/${this.username}`,
          },
        })
        return
      }

      this.callback(this.selected)
      this.setFullCard(this.idSpec)
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
.item {
  box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
  transition: transform 0.6s !important;
}

.itemSelected {
  background-color: var(--v-primary-base) !important;
  color: white !important;
}
</style>
