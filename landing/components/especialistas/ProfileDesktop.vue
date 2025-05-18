/**
 * ProfileDesktop Component
 *
 * Displays a desktop-optimized profile view for specialists, including bio, experience, and contact options.
 *
 * Key Features:
 * - Desktop-friendly profile layout
 * - Specialist bio and experience
 * - Contact and booking options
 * - Responsive design
 *
 * Requirements:
 * - Vuetify card and list components
 * - Vuex for state
 *
 * @component
 * @example
 * <ProfileDesktop :specialist="specialist" />
 */
<template>
  <v-container fluid style="max-width: 1080px">
    <v-row>
      <!-- Main Profile Section -->
      <v-col cols="8">
        <!-- Profile Card -->
        <v-card style="border-radius: 15px" class="shadowCard">
          <v-row align="center" justify="center">
            <!-- Avatar and Code -->
            <v-col cols="4" class="text-center">
              <div class="text-center">
                <avatar
                  :url="avatar(specialist, true)"
                  :name="specialist.name"
                  :last-name="specialist.lastName ? specialist.lastName : ''"
                  size="160"
                  loading-color="white"
                ></avatar>
                <div
                  class="text-capitalize py-4"
                  style="color: #706f6f; font-size: 14px"
                >
                  Código {{ specialist.code ? specialist.code : '' }}
                </div>
              </div>
            </v-col>

            <!-- Profile Information -->
            <v-col cols="8">
              <!-- Name and Title -->
              <div>
                <h1
                  v-if="specialist.gender == 'male'"
                  class="text-left font-weight-bold"
                  style="color: #3c3c3b; font-size: 28px"
                >
                  Especialista {{ specialist.name }}
                  {{ specialist.lastName && specialist.lastName }}
                </h1>
                <h1
                  v-else
                  class="text-left font-weight-bold"
                  style="color: #3c3c3b; font-size: 28px"
                >
                  Especialista {{ specialist.name }}
                  {{ specialist.lastName && specialist.lastName }}
                </h1>
              </div>

              <!-- Session Price -->
              <div
                class="text-left font-weight-medium pa-2"
                style="color: #3c3c3b; font-size: 16px; flex: 1"
              >
                ${{ Math.ceil(specialist.sessionPrices.video / 100) * 100 }}
                / 50 min
              </div>

              <!-- Specialties Tags -->
              <div>
                <v-chip-group show-arrows>
                  <template v-for="(tag, s) in specialist.specialties">
                    <v-chip class="ma-2" small :key="s">
                      {{ tag }}
                    </v-chip>
                  </template>
                </v-chip-group>
              </div>

              <!-- Professional Description -->
              <div class="pr-4">
                <div class="text-left" style="color: #54565a; font-size: 14px">
                  {{ specialist.professionalDescription }}
                </div>
              </div>

              <!-- Chat Button -->
              <div class="my-4 text-left">
                <v-btn
                  v-if="
                    !$auth.$state.loggedIn || $auth.$state.user.role === 'user'
                  "
                  small
                  rounded
                  color="#56b5fc"
                  dark
                  class="px-8 py-2"
                  @click="goChat"
                >
                  Enviar mensajes
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Detailed Information Card -->
        <v-card class="shadowCard mt-10 pb-10" style="border-radius: 15px">
          <!-- Specialties Section -->
          <v-card-text>
            <div class="text-left subtitle-1 primary--text">Especialidades</div>
            <div
              v-if="specialist.specialties && specialist.specialties.length"
              class="body-1 text-left mt-3"
            >
              <ul>
                <li
                  v-for="(item, i) in specialist.specialties"
                  :key="i"
                  class="my-1"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
            <div v-else class="body-1 text-left text-capitalize">Vacío</div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <!-- Experience Section -->
          <v-card-text>
            <div class="mb-4 text-left subtitle-1 primary--text">
              Experiencia
            </div>
            <h2 class="body-1 text-left">
              <ul v-if="specialist.experience && specialist.experience.length">
                <li
                  v-for="(experience, i) in specialist.experience"
                  :key="i"
                  class="my-1"
                >
                  {{ experience.title }} - {{ experience.place }}
                  <span v-if="experience.start && experience.end"
                    >({{ experience.start }}, {{ experience.end }})</span
                  >
                </li>
              </ul>
            </h2>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <!-- Models Section -->
          <v-card-text>
            <div class="mb-4 text-left subtitle-1 primary--text">Modelos</div>
            <div class="body-1 text-left">
              <ul v-if="specialist.models && specialist.models.length">
                <li
                  v-for="(model, i) in specialist.models"
                  :key="i"
                  class="my-1"
                >
                  {{ model }}
                </li>
              </ul>
              <div v-else>Vacío</div>
            </div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <!-- Formation Section -->
          <v-card-text>
            <div class="mb-4 text-left subtitle-1 primary--text">Formación</div>
            <div class="body-1 text-left">
              <ul v-if="specialist.formation && specialist.formation.length">
                <li
                  v-for="(formation, i) in specialist.formation.filter(
                    (el) => el !== null
                  )"
                  :key="i"
                  class="my-1"
                >
                  {{ formation.formationType }}, {{ formation.description }},
                  {{ formation.intitucion }}
                  <span v-if="formation.start && formation.end">
                    ({{ formation.start }}, {{ formation.end }})
                  </span>
                </li>
              </ul>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Personal Description Section -->
          <v-card-text>
            <div class="mb-4 text-left subtitle-1 primary--text">
              Descripción
            </div>
            <div class="body-1 text-left">
              {{
                specialist.personalDescription
                  ? specialist.personalDescription
                  : 'Sin descripcion'
              }}
            </div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <!-- Rescheduling Policy Section -->
          <v-card-text>
            <div class="mb-4 text-left subtitle-1 primary--text">
              Reprogramación
            </div>
            <div class="body-1 text-left">
              Puede reprogramar hasta
              <strong>
                {{ specialist.preferences.minimumRescheduleSession }} hora(s)
              </strong>
              antes sin costo adicional.
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Calendar Section -->
      <v-col cols="4" style="position: relative" class="pt-0">
        <v-sheet
          class="sticky shadowCard pb-2"
          style="border-radius: 15px"
          :height="fullcard ? 'max-content' : '290px'"
        >
          <calendar-specialist
            :id-spec="specialist._id"
            :username="specialist.username"
            :sessions="sessions"
            :callback="(date) => null"
            :set-full-card="(id) => (fullcard = true)"
            :set-minimal-card="(id) => (fullcard = false)"
          />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'ProfileDesktop',

  /**
   * Component dependencies
   */
  components: {
    Avatar: () => import('@/components/Avatar'),
    CalendarSpecialist: () => import('~/components/CalendarSpecialist'),
  },

  /**
   * Component properties
   * @property {Object} specialist - Specialist profile data
   * @property {Function} setSpecialist - Callback function to update specialist data
   */
  props: {
    specialist: {
      type: Object,
      required: true,
    },
    setSpecialist: {
      type: Function,
      required: true,
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Boolean} loadingChat - Loading state for chat functionality
   * @property {Object|null} channel - Chat channel reference
   * @property {Boolean} fullcard - Calendar card expansion state
   * @property {Boolean} loadingCalendar - Loading state for calendar data
   */
  data() {
    return {
      loadingChat: false,
      channel: null,
      fullcard: false,
      loadingCalendar: false,
    }
  },

  computed: {
    /**
     * Vuex getters mapped to component
     * @returns {Object} Mapped getters
     */
    ...mapGetters({
      sessions: 'Specialist/sessionsFormatted',
    }),
  },

  created() {
    // Disable floating chat when entering the route
    this.setFloatingChat(false)
  },

  methods: {
    /**
     * Navigates to chat interface with the specialist
     */
    goChat() {
      this.loadingChat = true
      this.$router.push(`/chat/${this.specialist.username}`)
    },

    /**
     * Vuex actions and mutations mapped to component
     * @returns {Object} Mapped actions and mutations
     */
    ...mapActions({
      getSpecialist: 'Specialist/getSpecialist',
    }),
    ...mapMutations({
      setFloatingChat: 'Chat/setFloatingChat',
    }),
  },
}
</script>

<style lang="scss" scoped>
/**
 * Card shadow styling
 */
.shadowCard {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
}

/**
 * Sticky positioning for calendar section
 */
.sticky {
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 0 !important;
}
</style>
