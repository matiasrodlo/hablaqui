/**
 * MiniCalendar Component
 *
 * A compact calendar component for selecting dates, used in scheduling and availability features.
 *
 * Key Features:
 * - Date selection
 * - Compact, mobile-friendly design
 * - Customizable appearance
 * - Responsive layout
 *
 * Requirements:
 * - Vuetify calendar or date-picker components
 *
 * @component
 * @example
 * <MiniCalendar />
 */
<template>
  <div class="my-3">
    <!-- Next Date Header -->
    <div class="d-flex mb-2">
      <icon size="24px" color="#3c3c3b" :icon="mdiCalendarOutline" />
      <span class="pt-1 ml-2 body-2 font-weight-medium" style="color: #3c3c3b">
        Próxima fecha:
        <span v-if="sessionsAvailable" class="text-capitalize">
          {{ formatDate(sessionsAvailable.date) }}
        </span>
      </span>
    </div>

    <!-- Available Time Slots -->
    <div v-if="sessionsAvailable" class="d-flex">
      <!-- Time Slot Buttons -->
      <template v-for="(n, r) in sessionsAvailable.available">
        <span
          v-if="r < 3"
          :key="r"
          rounded
          class="item text-center my-3 pa-1 mr-4"
          style="width: 60px; height: fit-content; border-radius: 4px"
          :class="
            selected && selected.start == n && selected.date == item.date
              ? 'itemSelected'
              : ''
          "
          @click.stop="goPlans(sessionsAvailable, n, r)"
        >
          {{ n }}
        </span>
      </template>

      <!-- View More Button -->
      <span
        rounded
        class="text-center my-3 pa-1 primary--text font-weight-medium caption"
        style="
          width: 100px;
          border-radius: 4px;
          height: fit-content;
          background-color: rgba(26, 165, 216, 0.16);
        "
        @click="dialog = true"
      >
        Ver más
        <icon size="16px" :icon="mdiChevronRight" />
      </span>

      <!-- Full Calendar Dialog -->
      <v-dialog
        v-model="dialog"
        fullscreen
        transition="dialog-bottom-transition"
      >
        <v-card
          style="height: fit-content; display: flex; flex-direction: column"
        >
          <!-- Dialog Header -->
          <v-card-title
            style="flex: 0"
            class="titleColor d-flex justify-space-between"
          >
            <div>Calendario</div>
            <v-btn icon @click="dialog = false">
              <icon size="30px" color="#717171" :icon="mdiCloseCircle" />
            </v-btn>
          </v-card-title>

          <!-- Calendar Content -->
          <v-card-text style="flex: 1" class="pa-0">
            <calendar
              :id-spec="idSpec"
              :username="username"
              :sessions="sessions"
              :callback="(date) => null"
              :set-full-card="(id) => fullcard.push(id)"
              :set-minimal-card="(id) => fullcard.filter((id) => idSpec !== id)"
            />
          </v-card-text>

          <!-- Dialog Actions -->
          <v-card-actions style="flex: 0">
            <v-btn
              color="primary"
              block
              rounded
              @click="
                () => {
                  if ($route.name === 'especialistas')
                    $router.push(`/${username}`)
                  else dialog = false
                }
              "
            >
              Mostrar perfil
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Schedule Button (Slug Route) -->
    <div v-if="$route.name === 'slug'">
      <v-btn
        block
        small
        rounded
        color="#2680eb"
        dark
        class="my-6 px-8 py-2"
        @click="dialog = true"
      >
        Agendar cita online
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mdiCalendarOutline, mdiChevronRight, mdiCloseCircle } from '@mdi/js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Configure dayjs plugins
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

export default {
  name: 'MiniCalendar',

  /**
   * Component dependencies
   */
  components: {
    Icon: () => import('~/components/Icon'),
    Calendar: () => import('~/components/CalendarSpecialist'),
  },

  /**
   * Component properties
   * @property {string} idSpec - Specialist's unique identifier
   * @property {string} username - Specialist's username
   * @property {Array} sessions - Array of available sessions
   */
  props: {
    idSpec: { type: String, default: '' },
    username: { type: String, default: '' },
    sessions: { type: Array, default: () => [] },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Array} fullcard - Array of expanded calendar IDs
   * @property {Object} mdiCalendarOutline - Calendar icon
   * @property {Object} mdiChevronRight - Chevron right icon
   * @property {Object} mdiCloseCircle - Close circle icon
   * @property {Object|null} selected - Currently selected time slot
   * @property {Boolean} dialog - Dialog visibility state
   */
  data() {
    return {
      fullcard: [],
      mdiCalendarOutline,
      mdiChevronRight,
      mdiCloseCircle,
      selected: null,
      dialog: false,
    }
  },

  computed: {
    /**
     * Gets the next available session with more than 2 time slots
     * @returns {Object|null} Next available session or null
     */
    sessionsAvailable() {
      const sessions = [...this.sessions]
      const items = sessions.filter((item) => item.available.length > 2)
      return items[0]
    },
  },

  methods: {
    /**
     * Formats a date string to a localized format
     * @param {string} item - Date string in MM/DD/YYYY format
     * @returns {string} Formatted date string
     */
    formatDate(item) {
      return dayjs.tz(dayjs(item, 'MM/DD/YYYY')).format('dddd DD MMMM YYYY')
    },

    /**
     * Handles navigation to plans/payment page
     * Redirects to auth page if not logged in
     * @param {Object} item - Session data
     * @param {string} hour - Selected hour
     * @param {number} index - Selected time slot index
     */
    goPlans(item, hour, index) {
      if (!this.$auth.$state.loggedIn) {
        this.$router.push({
          path: `/auth/?specialist=${this.username}&date=${
            item.date
          }&start=${hour}&end=${item.available[index + 1]}`,
        })
      } else {
        this.$router.push(
          `/especialistas/pagos/?username=${this.username}&date=${
            item.date
          }&start=${hour}&end=${item.available[index + 1]}`
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/**
 * Selected time slot styling
 */
.itemSelected {
  border: 1px solid #0085ff;
  box-shadow: rgb(0 133 255) 0px 0px 3px inset;
}

/**
 * Time slot button styling
 */
.item {
  white-space: nowrap;
  transition: transform 0.3s ease 0s, border 0.2s ease 0s,
    box-shadow 0.2s ease 0s;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  line-height: 16px;
  color: #565656;
  padding: 8px 5px;
  border: 1px solid #0085ff80;
  box-sizing: border-box;
  border-radius: 2px;
}
</style>
