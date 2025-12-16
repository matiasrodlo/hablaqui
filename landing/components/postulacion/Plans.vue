/**
 * Plans Component
 * 
 * A component that displays subscription plan options for specialists.
 * Features basic and premium plan cards with feature lists and pricing.
 * Includes plan selection and subscription management functionality.
 * 
 * Key Features:
 * - Plan comparison display
 * - Feature lists for each plan
 * - Pricing information
 * - Plan selection controls
 * - Subscription period options
 * - Current plan indication
 * - Responsive design
 * - Interactive buttons
 * - Feature checkmarks
 * - Plan upgrade flow
 * - Account navigation
 * 
 * Component Requirements:
 * - Vuetify v-container component
 * - Vuetify v-row component
 * - Vuetify v-col component
 * - Vuetify v-card component
 * - Vuetify v-card-text component
 * - Vuetify v-list component
 * - Vuetify v-list-item component
 * - Vuetify v-btn component
 * - Vuetify v-radio-group component
 * - Vuetify v-radio component
 * - Vuetify v-divider component
 * - Icon component
 * - Vuex store
 * - Day.js for date handling
 * 
 * @component
 * @example
 * // Basic usage
 * <Plans
 *   :next="handleNext"
 *   :currentPlan="userPlan"
 * />
 * 
 * // Plan features:
 * // Basic Plan:
 * // - Professional profile
 * // - Video call room
 * // - Online payments
 * // - Appointment scheduling
 * // - Automatic reminders
 * // - Private messaging
 * // - Client management
 * 
 * // Premium Plan (additional features):
 * // - Accounting
 * // - Satisfaction surveys
 * // - Marketplace visibility
 * // - Therapeutic adherence
 * // - Digital marketing consulting
 * 
 * // Pricing:
 * // - Basic: $0
 * // - Premium: $69,000 (monthly)
 * // - Premium Annual: $55,900 (20% discount)
 * 
 * // Layout specifications:
 * // - Container max-width: 1200px
 * // - Card border radius: 12px
 * // - Feature icon size: 30px
 * // - Price font size: 84px (basic), 44px (premium)
 * 
 * // Error Handling:
 * // - Plan selection errors
 * // - Subscription errors
 * // - Navigation errors
 * // - Date handling errors
 * 
 * // Performance:
 * // - Efficient DOM updates
 * // - Optimized re-renders
 * // - Lazy loading for icons
 * // - Minimal state updates
 */
<template>
  <v-container fluid style="max-width: 1200px">
    <v-row justify="center" class="pb-16">
      <!-- Basic Plan Card -->
      <v-col cols="12" md="6" lg="5">
        <v-card class="box rounded-xl">
          <v-card-text class="d-flex align-center">
            <div style="flex: 2">
              <div
                v-if="
                  (currentPlan && currentPlan.tier === 'free') || !currentPlan
                "
                class="text-left body-3 font-weight-bold d-block"
                style="color: #15314a"
              >
                Plan actual
              </div>
              <div v-else style="height: 22px"></div>
              <div
                class="primary--text text-left headline font-weight-bold d-block"
                style="color: #15314a"
              >
                Plan básico
              </div>
              <div class="text-left text--secondary d-block">
                Las principales herramientas para crecer como profesional
                independiente
              </div>
            </div>
            <div
              style="flex: 1; font-size: 84px; color: #15314a"
              class="font-weight-bold text-right"
            >
              $0
            </div>
          </v-card-text>
          <v-card-text>
            <v-divider></v-divider>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text>
            <v-list>
              <v-list-item v-for="item in itemsBasico" :key="item">
                <v-list-item-icon>
                  <v-btn
                    style="width: 30px; height: 30px"
                    fab
                    depressed
                    color="primary"
                  >
                    <icon color="white" :icon="mdiCheck" />
                  </v-btn>
                </v-list-item-icon>
                <v-list-item-content
                  class="text--secondary font-weight-bold body-2"
                >
                  {{ item }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <!-- Basic Plan Action Button -->
        <v-btn
          v-if="currentPlan && currentPlan.tier === 'free'"
          class="mt-4 box"
          color="white"
          rounded
          block
          @click="goToStep"
        >
          <span class="primary--text">Ir a mi cuenta</span>
        </v-btn>
        <v-btn
          v-else
          class="mt-4 box"
          color="white"
          rounded
          block
          @click="setPreferences('free')"
        >
          <span class="primary--text">Continuar con plan básico</span>
        </v-btn>
      </v-col>

      <!-- Premium Plan Card -->
      <v-col cols="12" md="6" lg="5">
        <v-card class="box rounded-xl">
          <v-card-text class="d-flex align-center">
            <div style="flex: 2">
              <div
                v-if="currentPlan && currentPlan.tier === 'premium'"
                class="primary--text text-left body-1 font-weight-bold d-block"
              >
                Tu plan actual
              </div>
              <div v-else style="height: 22px"></div>
              <div
                class="primary--text text-left headline font-weight-bold d-block"
              >
                Premium
              </div>
              <div class="text-left text--secondary d-block">
                Para profesionales que buscan mayor visibilidad, clientes y
                ganancias
              </div>
            </div>
            <div
              style="flex: 1; font-size: 44px; color: #15314a"
              class="font-weight-bold text-right"
            >
              $69.000
            </div>
          </v-card-text>
          <v-card-text>
            <v-divider></v-divider>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text>
            <v-list>
              <v-list-item v-for="item in itemsPremiun" :key="item">
                <v-list-item-icon>
                  <v-btn
                    style="width: 30px; height: 30px"
                    fab
                    depressed
                    color="primary"
                  >
                    <icon color="white" :icon="mdiCheck" />
                  </v-btn>
                </v-list-item-icon>
                <v-list-item-content
                  class="text--secondary font-weight-bold body-2"
                >
                  {{ item }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <!-- Subscription Period Selection -->
        <v-radio-group v-model="period" hide-details>
          <v-card class="box my-2 rounded-xl">
            <v-card-text class="py-1">
              <v-radio value="mensual">
                <template #label>
                  <div style="width: 100%" class="d-flex justify-space-between">
                    <div class="body-2 text--secondary">Mensual</div>
                    <div class="body-2 text--secondary">$69.000</div>
                  </div>
                </template>
              </v-radio>
            </v-card-text>
          </v-card>
          <v-card v-show="false" class="box my-2">
            <div
              class="primary caption text-center white--text"
              style="height: 20px"
            >
              Ahorra 20%
            </div>
            <v-card-text class="py-1">
              <v-radio value="anual">
                <template #label>
                  <div style="width: 100%" class="d-flex justify-space-between">
                    <div class="body-2 text--secondary">Anual</div>
                    <div class="body-2 text--secondary">$55.900</div>
                  </div>
                </template>
              </v-radio>
            </v-card-text>
          </v-card>
          <!-- Premium Plan Action Button -->
          <v-btn
            class="box mt-4"
            color="primary"
            rounded
            block
            @click="setPreferences('premium')"
          >
            Suscribirse al plan premium
          </v-btn>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiCheck } from '@mdi/js'
import { mapActions } from 'vuex'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Configure dayjs with timezone support
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Plans Component
 * 
 * A Vue component that displays and manages subscription plans for specialists.
 * Handles plan selection, subscription periods, and plan upgrades.
 * 
 * @component
 * @requires {Vuetify} v-container - Container component
 * @requires {Vuetify} v-row - Row component
 * @requires {Vuetify} v-col - Column component
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-card-text - Card text component
 * @requires {Vuetify} v-list - List component
 * @requires {Vuetify} v-list-item - List item component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-radio-group - Radio group component
 * @requires {Vuetify} v-radio - Radio component
 * @requires {Vuetify} v-divider - Divider component
 * @requires {Component} Icon - Icon component
 * @requires {Vuex} mapActions - Vuex actions mapping
 * @requires {Dayjs} dayjs - Date handling library
 */
export default {
  name: 'Plans',

  /**
   * Component dependencies
   */
  components: {
    Icon: () => import('~/components/Icon'),
  },

  /**
   * Component properties
   * @property {Function} next - Callback function for next step
   */
  props: {
    next: {
      type: Function,
      required: true,
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Object} recruited - Recruited specialist data
   * @property {Object} specialist - Current specialist data
   * @property {String} recruitedId - Recruited specialist ID
   * @property {Object} mdiCheck - Material Design icon for checkmark
   * @property {String} period - Selected subscription period
   * @property {Array} itemsPremiun - Premium plan features
   * @property {Array} itemsBasico - Basic plan features
   * 
   * @example
   * {
   *   recruited: null,
   *   specialist: null,
   *   recruitedId: '',
   *   mdiCheck: { path: '...' },
   *   period: 'mensual',
   *   itemsPremiun: [
   *     'Perfil profesional',
   *     'Sala de videollamada',
   *     // ...
   *   ],
   *   itemsBasico: [
   *     'Perfil profesional',
   *     'Sala de videollamada',
   *     // ...
   *   ]
   * }
   */
  data() {
    return {
      recruited: null,
      specialist: null,
      recruitedId: '',
      mdiCheck,
      period: 'mensual',
      itemsPremiun: [
        'Perfil profesional',
        'Sala de videollamada',
        'Pagos en línea',
        'Agendamiento de citas',
        'Recordatorios automáticos',
        'Mensajería privada',
        'Gestión de clientes',
        'Contabilidad',
        'Encuestas de satisfacción',
        'Visibilidad en marketplace',
        'Adherencia terapéutica',
        'Asesorías en marketing digital',
      ],
      itemsBasico: [
        'Perfil profesional',
        'Sala de videollamada',
        'Pagos en línea',
        'Agendamiento de citas',
        'Recordatorios automáticos',
        'Mensajería privada',
        'Gestión de clientes',
      ],
    }
  },

  computed: {
    /**
     * Gets the current plan information
     * @returns {Object} Current plan data
     */
    currentPlan() {
      return this.$auth.$state.user?.plan
    },
  },

  methods: {
    /**
     * Vuex actions mapped to component
     * @returns {Object} Mapped actions
     * @property {Function} setPlan - Action to update plan
     * @property {Function} setRecruited - Action to update recruited specialist
     */
    ...mapActions({
      setPlan: 'Specialist/setPlan',
      setRecruited: 'Specialist/setRecruited',
    }),

    /**
     * Sets plan preferences and proceeds to next step
     * @param {String} tier - Plan tier ('free' or 'premium')
     */
    async setPreferences(tier) {
      try {
        await this.setPlan({
          tier,
          period: this.period,
          startDate: dayjs().tz('America/Santiago').format(),
        })
        this.next()
      } catch (error) {
        console.error('Error setting preferences:', error)
      }
    },

    /**
     * Navigates to account step
     */
    goToStep() {
      this.next()
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
.box {
  box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
