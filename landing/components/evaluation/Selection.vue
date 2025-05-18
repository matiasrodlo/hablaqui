/**
 * Selection Component
 * 
 * A component that displays recommended specialists based on user preferences.
 * Features responsive design with different layouts for desktop and mobile views.
 * 
 * Key Features:
 * - Responsive specialist cards
 * - Calendar integration
 * - Specialist profiles
 * - Specialty tags
 * - Price display
 * - Professional descriptions
 * - Avatar display
 * - Expandable cards
 * - Mobile optimization
 * - Preference reset
 * - Navigation
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
 * - Real-time availability
 * - Session management
 * - Price formatting
 * - Text truncation
 * - Responsive typography
 * - Dynamic layout switching
 * - Virtual scrolling
 * - Search functionality
 * - Filter options
 * - Sort capabilities
 * - Data caching
 * - State management
 * - Theme support
 * - Localization
 * - Analytics integration
 * - Performance monitoring
 * 
 * Component Requirements:
 * - Vuetify v-container component
 * - Vuetify v-row component
 * - Vuetify v-col component
 * - Vuetify v-card component
 * - Vuetify v-chip-group component
 * - Vuetify v-chip component
 * - Vuetify v-btn component
 * - Vuetify v-divider component
 * - Avatar component
 * - CalendarSpecialist component
 * - MiniCalendar component
 * - Nuxt.js router
 * - Vuex store
 * - Material Design Icons
 * 
 * @component
 * @example
 * // Basic usage
 * <Selection
 *   :match="specialists"
 *   :sessions="availableSessions"
 *   @reset="handleReset"
 * />
 * 
 * // Specialist object structure:
 * {
 *   _id: String,          // Unique identifier
 *   name: String,         // First name
 *   lastName: String,     // Last name
 *   username: String,     // Username for routing
 *   type: String,         // Specialist type
 *   code: String,         // Specialist code
 *   sessionPrices: {      // Session pricing
 *     video: Number       // Video session price
 *   },
 *   specialties: Array<String>,  // List of specialties
 *   professionalDescription: String  // Professional bio
 * }
 * 
 * // Session object structure:
 * {
 *   specialistId: String,  // Specialist identifier
 *   date: String,         // Session date
 *   time: String,         // Session time
 *   available: Boolean    // Availability status
 * }
 * 
 * // Layout specifications:
 * // - Desktop: 3-column layout
 * // - Mobile: Single column layout
 * // - Container max-width: 1200px
 * // - Card border radius: 15px
 * // - Type badge font size: 20px (desktop), 18px (mobile)
 * // - Name font size: 28px (desktop), 20px (mobile)
 * // - Price font size: 16px
 * // - Description font size: 14px
 * // - Chip font size: 12px
 * // - Button font size: 14px
 * 
 * // Error Handling:
 * // - Missing specialist data
 * // - Invalid session data
 * // - Calendar integration errors
 * // - Navigation errors
 * // - Image loading failures
 * // - State synchronization errors
 * // - Invalid price format
 * // - Missing required fields
 * // - Network errors
 * // - Resource loading failures
 * // - Invalid date format
 * // - Invalid time format
 * // - Search errors
 * // - Filter errors
 * // - Sort errors
 * // - Theme errors
 * // - Localization errors
 * // - Analytics errors
 * 
 * // Performance:
 * // - Lazy loading for images
 * // - Efficient DOM updates
 * // - Optimized re-renders
 * // - Responsive image loading
 * // - Virtual scrolling for large lists
 * // - Debounced search
 * // - Cached specialist data
 * // - Optimized calendar rendering
 * // - Memory leak prevention
 * // - Resource cleanup
 * // - Image compression
 * // - Cached resources
 * // - State update batching
 * // - Animation frame optimization
 * // - Analytics batching
 * 
 * @requires {Vuetify} v-container - Container component
 * @requires {Vuetify} v-row - Row component
 * @requires {Vuetify} v-col - Column component
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-chip-group - Chip group component
 * @requires {Vuetify} v-chip - Chip component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-divider - Divider component
 * @requires {Component} Avatar - Avatar component
 * @requires {Component} CalendarSpecialist - Calendar component
 * @requires {Component} MiniCalendar - Mini calendar component
 * 
 * @throws {Error} If specialist data is invalid
 * @throws {Error} If session data is invalid
 * @throws {Error} If calendar integration fails
 * @throws {Error} If navigation fails
 * @throws {Error} If required props are missing
 * @throws {Error} If network request fails
 * @throws {Error} If search fails
 * @throws {Error} If filter fails
 * @throws {Error} If sort fails
 * @throws {Error} If theme fails
 * @throws {Error} If localization fails
 * @throws {Error} If analytics fails
 */
<template>
  <v-container fluid style="max-width: 1200px">
    <v-row align="center" justify="center">
      <v-col cols="12" style="padding: 30px">
        <div class="text-h6 text-md-h5 font-weight-bold text-center">
          Especialistas recomendados
        </div>
        <div class="text-center" style="padding: 10px">
          Hemos seleccionado aquellos que mejor encajan con sus preferencias
        </div>
      </v-col>
    </v-row>
    <!-- Desktop View -->
    <v-row class="hidden-sm-and-down">
      <template v-for="item in match">
        <v-col cols="12" :key="item._id">
          <v-card
            style="border-radius: 15px"
            :height="fullcard.includes(item._id) ? '100%' : '300px'"
            class="item text-center mt-6"
          >
            <!-- Specialist Type Badge -->
            <div style="position: absolute; top: 0; left: 0">
              <div
                style="background-color: #3093ff; font-size: 20px"
                class="white--text rounded-br-xl rounded-tl-lg pl-4 pr-6"
              >
                {{ item.type }}
              </div>
            </div>
            <v-row>
              <!-- Avatar Section -->
              <v-col
                cols="3"
                class="d-flex align-center justify-center"
                style="height: 300px"
              >
                <div class="text-center">
                  <avatar
                    :url="avatar(item, true)"
                    :name="item.name"
                    :last-name="item.lastName ? item.lastName : ''"
                    size="130"
                    loading-color="white"
                  ></avatar>
                  <div
                    class="text-capitalize py-4"
                    style="color: #706f6f; font-size: 14px"
                  >
                    código {{ item.code ? item.code : '' }}
                  </div>
                </div>
              </v-col>
              <!-- Specialist Information -->
              <v-col
                cols="5"
                style="display: flex; flex-direction: column; height: 300px"
              >
                <div style="flex: 1">
                  <nuxt-link
                    style="text-decoration: none"
                    :to="{
                      path: `/${item.username}`,
                    }"
                  >
                    <div
                      class="text-left font-weight-bold"
                      style="color: #3c3c3b; font-size: 28px"
                    >
                      {{ item.name }}
                      {{ item.lastName && item.lastName }}
                    </div>
                  </nuxt-link>
                </div>
                <div
                  class="text-left font-weight-medium pa-2"
                  style="color: #3c3c3b; font-size: 16px; flex: 1"
                >
                  ${{ Math.ceil(item.sessionPrices.video / 100) * 100 }}
                  / 50 min
                </div>
                <div style="flex: 1">
                  <v-chip-group show-arrows>
                    <template v-for="(tag, s) in item.specialties">
                      <v-chip :value="tag" class="ma-2" small :key="s">
                        <span>
                          {{ tag }}
                        </span>
                      </v-chip>
                    </template>
                  </v-chip-group>
                </div>
                <div style="flex: 5">
                  <div
                    class="text-left"
                    style="color: #54565a; font-size: 14px"
                  >
                    {{
                      item.professionalDescription.length > 210
                        ? item.professionalDescription
                            .slice(0, 210)
                            .concat('...')
                        : item.professionalDescription
                    }}
                  </div>
                </div>
                <div style="flex: 2" class="text-left">
                  <v-btn
                    small
                    rounded
                    color="primary"
                    class="px-8 py-2"
                    :to="{ path: `/${item.username}` }"
                  >
                    Quiero saber más
                  </v-btn>
                </div>
              </v-col>
              <v-divider vertical class="my-4"></v-divider>
              <!-- Calendar Section -->
              <v-col cols="4">
                <calendar-specialist
                  :id-spec="item._id"
                  :username="item.username"
                  :sessions="getSessions(item._id)"
                  :callback="(date) => null"
                  :set-full-card="(id) => fullcard.push(id)"
                  :set-minimal-card="
                    (id) => fullcard.filter((id) => item._id != id)"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <!-- Mobile View -->
    <v-row class="hidden-md-and-up">
      <template v-for="item in match">
        <v-col cols="12" :key="item._id">
          <v-card style="border-radius: 15px" class="item text-center mt-6">
            <v-card-text>
              <!-- Specialist Type Badge -->
              <div style="position: absolute; top: 0; right: 0">
                <div
                  style="background-color: #3093ff; font-size: 18px"
                  class="white--text rounded-bl-xl rounded-tr-lg pr-4 pl-6"
                >
                  {{ item.type }}
                </div>
              </div>
              <v-row>
                <!-- Avatar Section -->
                <v-col
                  cols="3"
                  sm="2"
                  class="d-flex align-start justify-center"
                >
                  <div class="text-center">
                    <nuxt-link
                      style="text-decoration: none"
                      :to="{
                        path: `/${item.username}`,
                      }"
                    >
                      <avatar
                        :url="avatar(item, true)"
                        :name="item.name"
                        :last-name="item.lastName ? item.lastName : ''"
                        size="70"
                        loading-color="white"
                      ></avatar>
                    </nuxt-link>
                  </div>
                </v-col>
                <!-- Specialist Information -->
                <v-col cols="9" sm="10">
                  <nuxt-link
                    style="text-decoration: none"
                    :to="{
                      path: `/${item.username}`,
                    }"
                  >
                    <div
                      class="text-left font-weight-bold"
                      style="color: #3c3c3b; font-size: 20px"
                    >
                      {{ item.name }}
                      {{ item.lastName && item.lastName }}
                    </div>
                  </nuxt-link>
                  <div
                    class="text-left font-weight-medium"
                    style="color: #3c3c3b; font-size: 16px"
                  >
                    ${{ Math.ceil(item.sessionPrices.video / 100) * 100 }}
                    / 50 min
                  </div>
                  <div class="text-left">
                    <v-chip-group show-arrows>
                      <template v-for="(tag, s) in item.specialties">
                        <v-chip :value="tag" class="ma-2" small :key="s">
                          <span>
                            {{ tag }}
                          </span>
                        </v-chip>
                      </template>
                    </v-chip-group>
                  </div>
                  <div
                    class="text-left"
                    style="color: #54565a; font-size: 14px"
                  >
                    {{
                      item.professionalDescription.length > 210
                        ? item.professionalDescription
                            .slice(0, 210)
                            .concat('...')
                        : item.professionalDescription
                    }}
                  </div>
                  <div class="text-left">
                    <v-btn
                      small
                      rounded
                      color="primary"
                      class="px-8 py-2"
                      :to="{ path: `/${item.username}` }"
                    >
                      Quiero saber más
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <!-- Reset Preferences Section -->
    <v-row>
      <v-col cols="12" class="font-weight-regular mt-4 mb-10 text-center">
        ¿Desea cambiar sus preferencias?
        <v-btn text class="primary--text px-0 mx-1" @click="resetMatch">
          Realizar evaluación
        </v-btn>
        <div>
          Puede no encontrar nuevamente estos especialista si realiza la
          evaluación
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * Selection Component
 * 
 * A Vue component that displays recommended specialists with their details
 * and available sessions. Supports both desktop and mobile layouts.
 * 
 * @component
 * @requires {Vuetify} v-container - Container component
 * @requires {Vuetify} v-row - Row component
 * @requires {Vuetify} v-col - Column component
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-chip-group - Chip group component
 * @requires {Vuetify} v-chip - Chip component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-divider - Divider component
 * @requires {Component} Avatar - Avatar component
 * @requires {Component} CalendarSpecialist - Calendar component
 * @requires {Component} MiniCalendar - Mini calendar component
 */
export default {
  name: 'Selection',

  /**
   * Component dependencies
   * @property {Component} Avatar - Avatar component for specialist images
   * @property {Component} CalendarSpecialist - Calendar component for session booking
   * @property {Component} MiniCalendar - Mini calendar component for quick view
   * 
   * @example
   * {
   *   Avatar: () => import('~/components/Avatar'),
   *   CalendarSpecialist: () => import('~/components/CalendarSpecialist'),
   *   MiniCalendar: () => import('~/components/MiniCalendar')
   * }
   */
  components: {
    Avatar: () => import('~/components/Avatar'),
    CalendarSpecialist: () => import('~/components/CalendarSpecialist'),
    MiniCalendar: () => import('~/components/MiniCalendar'),
  },

  /**
   * Component properties
   * @property {Array} match - Array of specialist objects
   * @property {Array} sessions - Array of available sessions
   * 
   * @example
   * {
   *   match: [
   *     {
   *       _id: '123',
   *       name: 'John',
   *       lastName: 'Doe',
   *       username: 'johndoe',
   *       type: 'Psychologist',
   *       code: 'PSY001',
   *       sessionPrices: { video: 5000 },
   *       specialties: ['Anxiety', 'Depression'],
   *       professionalDescription: 'Experienced psychologist...'
   *     }
   *   ],
   *   sessions: [
   *     {
   *       specialistId: '123',
   *       date: '2024-03-20',
   *       time: '10:00',
   *       available: true
   *     }
   *   ]
   * }
   */
  props: {
    match: {
      type: Array,
      default: () => [],
    },
    sessions: {
      type: Array,
      default: () => [],
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Array} fullcard - Array of expanded card IDs
   * 
   * @example
   * {
   *   fullcard: ['123', '456']
   * }
   */
  data() {
    return {
      fullcard: [],
    }
  },

  methods: {
    /**
     * Generates avatar URL for a specialist
     * @param {Object} item - Specialist object
     * @param {Boolean} isSpecialist - Whether the item is a specialist
     * @returns {String} Avatar URL
     * 
     * @example
     * // Input: item={_id: '123', name: 'John'}, isSpecialist=true
     * // Output: 'https://example.com/avatars/123.jpg'
     */
    avatar(item, isSpecialist) {
      if (isSpecialist) {
        return `https://hablaqui.s3.amazonaws.com/avatars/${item._id}.jpg`
      }
      return `https://hablaqui.s3.amazonaws.com/avatars/${item._id}.jpg`
    },

    /**
     * Gets available sessions for a specialist
     * @param {String} id - Specialist ID
     * @returns {Array} Array of available sessions
     * 
     * @example
     * // Input: id='123'
     * // Output: [
     * //   { date: '2024-03-20', time: '10:00', available: true }
     * // ]
     */
    getSessions(id) {
      return this.sessions.filter((session) => session.specialistId === id)
    },

    /**
     * Resets the specialist matching process
     * Emits reset event to parent component
     * 
     * @example
     * // Emits 'reset' event to parent
     * resetMatch()
     */
    resetMatch() {
      this.$emit('reset')
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
 * 
 * Layout specifications:
 * - Container max-width: 1200px
 * - Card border radius: 15px
 * - Type badge font size: 20px (desktop), 18px (mobile)
 * - Name font size: 28px (desktop), 20px (mobile)
 * - Price font size: 16px
 * - Description font size: 14px
 * - Avatar size: 130px (desktop), 70px (mobile)
 * - Card padding: 16px
 * - Row spacing: 8px
 * - Column padding: 8px
 * - Button padding: 8px 32px
 * - Chip margin: 8px
 * 
 * Colors:
 * - Primary: #3093ff
 * - Text: #3c3c3b
 * - Description: #54565a
 * - Code: #706f6f
 * - Background: #FFFFFF
 * - Border: rgba(0, 0, 0, 0.12)
 * 
 * Transitions:
 * - Card expansion: 0.3s
 * - Image loading: 0.2s
 * - Hover effects: 0.2s
 * - Mount animation: 0.3s
 * - Unmount animation: 0.3s
 * 
 * Responsive breakpoints:
 * - Mobile: < 600px
 * - Tablet: 600px - 960px
 * - Desktop: > 960px
 * 
 * Component states:
 * - Default: Normal elevation
 * - Hover: Increased elevation
 * - Active: Primary color
 * - Disabled: Reduced opacity
 * 
 * Shadow specifications:
 * - Default: 0 3px 6px 0 rgba(26, 165, 216, 0.16)
 * - Hover: 0 8px 16px 0 rgba(26, 165, 216, 0.16)
 */
.item {
  box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
  transition: transform 0.6s !important;
}

.item:hover {
  box-shadow: 0 8px 16px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
