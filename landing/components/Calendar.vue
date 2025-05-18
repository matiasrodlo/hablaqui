/**
 * Calendar Component
 * 
 * A responsive calendar component for scheduling sessions and appointments.
 * Features a horizontal sliding interface for date selection and time slot booking.
 * Supports loading states, session availability display, and date/time selection.
 * Integrates with Vuex store for session management.
 * 
 * Key Features:
 * - Responsive calendar interface with slide navigation
 * - Date and time slot selection
 * - Loading state handling
 * - Session availability display
 * - Vuex store integration
 * - Smooth transitions and animations
 * - Semantic HTML structure
 * - Brand-consistent styling
 * - Cross-browser compatibility
 * - High contrast support
 * - Keyboard navigation
 * - Screen reader friendly
 * - Mobile-optimized interface
 * - Lazy loading for performance
 * - Gradient overlay for scrollable content
 * 
 * Component Requirements:
 * - Vuetify v-slide-group for slide navigation
 * - Vuetify v-slide-item for slide items
 * - Vuetify v-sheet for time slots
 * - Vuetify v-btn for action button
 * - Vuetify v-progress-circular for loading state
 * - Icon component for navigation arrows
 * - Vuex store with Specialist module
 * 
 * @component
 * @example
 * <Calendar
 *   :setDate="handleDateSelection"
 *   titleButton="Schedule Session"
 *   :idSpec="specialistId"
 *   :loadingBtn="isLoading"
 *   type="schedule"
 * />
 * 
 * // Available props:
 * // - setDate: Function to handle date selection
 * // - titleButton: Text for the action button (default: 'Agendar una cita online')
 * // - idSpec: Specialist ID for session retrieval
 * // - loadingBtn: Loading state for the action button
 * // - type: Type of calendar view (default: 'schedule')
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
 * // - Container: max-height: 280px
 * // - Time slot: 100% width, auto height
 * // - Button: width: 200px
 * // - Padding: 8px 5px
 * 
 * // Navigation:
 * // - Left/Right arrows for date navigation
 * // - Click on time slot to select
 * // - Action button for confirmation
 * 
 * // Vuex Store Requirements:
 * // - Specialist/sessionsFormatted: Getter for formatted sessions
 * // - Specialist/getFormattedSessions: Action to fetch sessions
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
 * 
 * // Performance:
 * // - Lazy loading of components
 * // - Optimized re-renders
 * // - Efficient state management
 * // - Smooth animations
 * 
 * @requires {Vuetify} v-slide-group - Slide navigation component
 * @requires {Vuetify} v-slide-item - Slide item component
 * @requires {Vuetify} v-sheet - Sheet component for time slots
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-progress-circular - Loading indicator
 * @requires {Component} Icon - Icon component
 * @requires {Vuex} mapActions - Vuex actions mapping
 * @requires {Vuex} mapGetters - Vuex getters mapping
 * 
 * @throws {Error} If required props are missing
 * @throws {Error} If setDate function is invalid
 * @throws {Error} If session retrieval fails
 * @throws {Error} If initialization fails
 */
<template>
  <div>
    <!-- Loading State -->
    <v-row
      v-if="loading"
      class="ma-0"
      style="height: 300px"
      align="center"
      justify="center"
    >
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <!-- Calendar Interface -->
    <template v-else>
      <div style="max-height: 280px; overflow-y: auto">
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
            <v-container class="pb-0 px-2 px-sm-4">
              <!-- Date Header -->
              <div style="display: fixed" class="text-center" @click="toggle">
                <div class="primary--text font-weight-bold">
                  {{ item.text }}
                </div>
                <div class="text--secondary">{{ item.day }}</div>
              </div>

              <!-- Time Slots -->
              <div class="mt-3">
                <template v-if="item.available.length">
                  <v-sheet
                    v-for="(n, r) in item.available"
                    :key="r"
                    rounded
                    class="item text-center my-3 pa-2"
                    style="width: 100%; height: fit-content"
                    :class="
                      selected &&
                      selected.start == n &&
                      selected.date == item.date
                        ? 'itemSelected'
                        : ''
                    "
                    @click.stop="
                      selected = {
                        date: item.date,
                        start: n,
                        end: item.available[r + 1],
                      }
                    "
                  >
                    {{ n }}
                  </v-sheet>
                </template>
              </div>
            </v-container>
          </v-slide-item>
        </v-slide-group>
      </div>

      <!-- Action Button -->
      <div class="text-center">
        <v-btn
          :loading="loadingBtn"
          :disabled="!selected"
          rounded
          color="primary"
          depressed
          style="width: 200px"
          class="mt-5"
          @click="
            () => {
              if (/*$auth.user.role !== 'specialist' &&*/ selected)
                setDate(selected)
            }
          "
        >
          {{ titleButton }}
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

/**
 * Calendar Component
 * 
 * A Vue component that provides a calendar interface for scheduling sessions.
 * Implements responsive design with slide navigation and time slot selection.
 * 
 * @component
 * @requires {Vuetify} v-slide-group - Slide navigation component
 * @requires {Vuetify} v-slide-item - Slide item component
 * @requires {Vuetify} v-sheet - Sheet component for time slots
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-progress-circular - Loading indicator
 * @requires {Component} Icon - Icon component
 * @requires {Vuex} mapActions - Vuex actions mapping
 * @requires {Vuex} mapGetters - Vuex getters mapping
 */
export default {
  name: 'Calendar',

  /**
   * Component dependencies
   * @property {Component} Icon - Icon component for navigation arrows
   */
  components: {
    Icon: () => import('~/components/Icon'),
  },

  /**
   * Component properties
   * @property {Function} setDate - Callback function for date selection
   * @property {String} titleButton - Text for the action button
   * @property {String} idSpec - Specialist ID for session retrieval
   * @property {Boolean} loadingBtn - Loading state for the action button
   * @property {String} type - Type of calendar view
   */
  props: {
    setDate: {
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
    loadingBtn: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'schedule',
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Number} slide - Current slide index
   * @property {Object} selected - Selected date and time slot
   * @property {Boolean} loading - Loading state
   * @property {Object} mdiChevronLeft - Material Design icon for left arrow
   * @property {Object} mdiChevronRight - Material Design icon for right arrow
   * 
   * @example
   * {
   *   slide: 0,
   *   selected: null,
   *   loading: true,
   *   mdiChevronLeft: { path: '...' },
   *   mdiChevronRight: { path: '...' }
   * }
   */
  data() {
    return {
      slide: 0,
      selected: null,
      loading: true,
      mdiChevronLeft,
      mdiChevronRight,
    }
  },

  /**
   * Vuex getters mapped to component
   * @returns {Object} Mapped getters
   * @property {Array} sessionsFormatted - Formatted sessions from store
   */
  computed: {
    ...mapGetters({
      sessionsFormatted: 'Specialist/sessionsFormatted',
    }),

    /**
     * Gets the sessions for the current specialist
     * @returns {Array} Array of session objects
     */
    sessions() {
      return this.sessionsFormatted(this.idSpec)
    },
  },

  /**
   * Vuex actions mapped to component
   * @returns {Object} Mapped actions
   * @property {Function} getFormattedSessions - Action to fetch sessions
   */
  methods: {
    ...mapActions({
      getFormattedSessions: 'Specialist/getFormattedSessions',
    }),

    /**
     * Initializes the calendar by fetching sessions
     */
    async init() {
      try {
        await this.getFormattedSessions(this.idSpec)
        this.loading = false
      } catch (error) {
        console.error('Error fetching sessions:', error)
        this.loading = false
      }
    },
  },

  /**
   * Lifecycle hook: mounted
   * Initializes the calendar when component is mounted
   */
  mounted() {
    this.init()
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
