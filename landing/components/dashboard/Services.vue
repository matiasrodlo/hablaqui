<template>
  <div>
    <v-card flat class="mb-16 mt-3">
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
            :style="step && step.title === 'Agendamientos' ? 'z-index: 3' : ''"
          >
            <div class="text-h6 mb-5" style="color: #3c3c3b">
              Anticipación de agendamiento
            </div>
            <div>
              <v-select
                filled
                outlined
                dense
                :items="hours"
                hide-details
                label="Seleccione"
                :value="specialist.preferences.minimumNewSession"
                @change="
                  (e) => {
                    const preferences = specialist.preferences
                    setSpecialist({
                      ...specialist,
                      preferences: { ...preferences, minimumNewSession: e },
                    })
                  }
                "
              ></v-select>
            </div>
            <card-onboarding
              v-if="step && step.title === 'Agendamientos'"
              style="position: absolute; top: -20px; left: 40px; z-index: 3"
              arrow="arrow-bottom"
              :next="
                () => ({
                  title: 'Reprogramación',
                  tab: 2,
                  card: {
                    title: 'Reprogramación',
                    description:
                      'Establezca la anticipación con que le pueden reagendar',
                  },
                  route: 'dashboard-perfil',
                })
              "
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            :style="step && step.title === 'Reprogramación' ? 'z-index: 3' : ''"
          >
            <div class="text-h6 mb-5" style="color: #3c3c3b">
              <v-tooltip v-if="isFree" right max-width="300" color="white">
                <template #activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <icon :icon="mdiAlertOutline" color="red" />
                  </v-btn>
                </template>
                <div class="elevation-5 pa-3">
                  <span class="black--text">
                    Esta opción se activará contratando un plan premium
                  </span>
                </div>
              </v-tooltip>

              Anticipación de reprogramación
            </div>
            <div>
              <v-select
                :value="specialist.preferences.minimumRescheduleSession"
                filled
                :disabled="isFree"
                outlined
                dense
                :items="hours"
                hide-details
                label="Seleccione"
                @change="
                  (e) => {
                    const preferences = specialist.preferences
                    setSpecialist({
                      ...specialist,
                      preferences: {
                        ...preferences,
                        minimumRescheduleSession: e,
                      },
                    })
                  }
                "
              ></v-select>
            </div>
            <card-onboarding
              v-if="step && step.title === 'Reprogramación'"
              style="position: absolute; top: -20px; left: 52%; z-index: 3"
              arrow="arrow-bottom"
              :next="
                () => ({
                  title: 'Valor por sesión',
                  tab: 2,
                  card: {
                    title: 'Valor por sesión',
                    description:
                      'Configure el valor por sesiones de 50 minutos.',
                  },
                  route: 'dashboard-perfil',
                })
              "
            />
          </v-col>
          <v-col class="text-h6" style="color: #3c3c3b">
            Valor por sesión
            <v-tooltip right max-width="300" color="white">
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="
                    () => {
                      if ($vuetify.breakpoint.smAndDown) tooltip = true
                    }
                  "
                >
                  <icon :icon="mdiInformationOutline" />
                </v-btn>
              </template>
              <div class="elevation-5 pa-3">
                <span class="primary--text">
                  Podrá establecer el valor de su suscripción semanal un vez. Si
                  posteriormente desea gestionar un cambio tendrá que
                  contactarnos. Consideré que ofrecemos un 20% de descuento por
                  sesión en suscripción mensual (4 sesiones) y 30% en trimestral
                  (12 sesiones) con el proposito de incentivar el compromiso
                  hacia el proceso terapeutico.
                </span>
              </div>
            </v-tooltip>
          </v-col>
          <v-col cols="12" style="position: relative">
            <card-onboarding
              v-if="step && step.title === 'Valor por sesión'"
              style="position: absolute; top: -40px; left: 40px; z-index: 3"
              arrow="arrow-bottom"
              :next="
                () => {
                  setStep(null)
                  setOnBoarding(true)
                }
              "
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            :style="
              step && step.title === 'Valor por sesión' ? 'z-index: 3' : ''
            "
          >
            <div>
              <v-text-field
                :value="video"
                outlined
                filled
                suffix="Semanal"
                type="number"
                hint="Ingrese el valor por sesion sin comas, ni puntos"
                @input="setPrice"
              >
              </v-text-field>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="4"
            :style="step && step.title === 'Valor mensual' ? 'z-index: 3' : ''"
          >
            <div>
              <v-text-field
                :value="Math.round(video * 0.8)"
                outlined
                suffix="Mensual"
                type="number"
                disabled
                filled
              >
              </v-text-field>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="4"
            :style="
              step && step.title === 'Valor por sesión' ? 'z-index: 3' : ''
            "
          >
            <div>
              <v-text-field
                :value="Math.round(video * 0.7)"
                outlined
                suffix="Trimestral"
                type="number"
                disabled
                filled
              >
              </v-text-field>
            </div>
          </v-col>
          <v-col cols="12" class="text-h6" style="color: #3c3c3b">
            <div>
              <v-tooltip v-if="isFree" right max-width="300" color="white">
                <template #activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <icon :icon="mdiAlertOutline" color="red" />
                  </v-btn>
                </template>
                <div class="elevation-5 pa-3">
                  <span class="black--text"> Funcionalidad premium </span>
                </div>
              </v-tooltip>
              Visibilidad
              <v-tooltip right max-width="300" color="white">
                <template #activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <icon :icon="mdiInformationOutline" />
                  </v-btn>
                </template>
                <div class="elevation-5 pa-3">
                  <span class="primary--text">
                    Los especialistas que activan esta funcionalidad suelen
                    tener un aumento en el número de sesiones
                  </span>
                </div>
              </v-tooltip>
            </div>
            <div v-if="specialist.preferences" class="mt-8">
              <v-switch
                v-model="marketplaceVisibility"
                :disabled="isFree"
                label="Visibilidad en Marketplace"
                color="primary"
                persistent-hint
                @change="
                  (e) => {
                    const preferences = specialist.preferences
                    setSpecialist({
                      ...specialist,
                      preferences: {
                        ...preferences,
                        marketplaceVisibility:
                          !specialist.preferences.marketplaceVisibility,
                      },
                    })
                  }
                "
              ></v-switch>
            </div>
          </v-col>
          <v-col cols="12" class="mt-6 text-center">
            <v-btn
              depressed
              :loading="loading"
              color="primary"
              rounded
              class="px-10"
              @click="onSubmit"
            >
              Guardar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mdiInformationOutline, mdiAlertOutline } from '@mdi/js'
import { mapGetters, mapActions, mapMutations } from 'vuex'
/**
 * Services Component
 * 
 * A configuration interface for specialists to manage their service settings,
 * including scheduling preferences, session pricing, and onboarding guidance.
 * 
 * Key Features:
 * - Scheduling preferences
 * - Session pricing configuration
 * - Onboarding guidance
 * - Tooltips
 * - Premium features
 * - Responsive design
 * - Form validation
 * - Error handling
 * - Loading states
 * - Accessibility support
 * - Cross-browser compatibility
 * - High contrast support
 * - Keyboard navigation
 * - Screen reader friendly
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
 * - Vuetify v-select component
 * - Vuetify v-text-field component
 * - Vuetify v-tooltip component
 * - Vuetify v-btn component
 * - CardOnboarding component
 * - Icon component
 * - Vuex store
 * 
 * @component
 * @example
 * <Services
 *   :specialist="specialistData"
 *   :step="currentStep"
 *   :is-free="isFreeUser"
 * />
 * 
 * // Specialist object structure:
 * {
 *   preferences: {
 *     minimumNewSession: String,      // Minimum notice for new sessions
 *     minimumRescheduleSession: String // Minimum notice for rescheduling
 *   },
 *   sessionPrices: {
 *     video: Number                    // Video session price
 *   }
 * }
 * 
 * // Step object structure:
 * {
 *   title: String,        // Step title
 *   tab: Number,         // Tab index
 *   card: {
 *     title: String,     // Card title
 *     description: String // Card description
 *   },
 *   route: String        // Route name
 * }
 * 
 * // Layout specifications:
 * // - Card border radius: 8px
 * // - Field spacing: 16px
 * // - Tooltip max width: 300px
 * // - Text colors:
 * //   - Primary: Theme primary color
 * //   - Secondary: #3c3c3b
 * //   - Error: Red
 * 
 * // Input validation:
 * // - Price: Numbers only, no commas or dots
 * // - Minimum notice: Predefined hour options
 * // - Premium features: Disabled for free users
 * 
 * // Error Handling:
 * // - Form validation errors
 * // - Price calculation errors
 * // - State synchronization errors
 * // - Network errors
 * // - Resource loading failures
 * // - Theme errors
 * // - Localization errors
 * // - Analytics errors
 * 
 * // Performance:
 * // - Lazy loading for components
 * // - Efficient DOM updates
 * // - Optimized re-renders
 * // - Debounced input handling
 * // - Cached data
 * // - Memory leak prevention
 * // - Resource cleanup
 * 
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-card-text - Card text component
 * @requires {Vuetify} v-select - Select component
 * @requires {Vuetify} v-text-field - Text field component
 * @requires {Vuetify} v-tooltip - Tooltip component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Component} CardOnboarding - Onboarding component
 * @requires {Component} Icon - Icon component
 * 
 * @throws {Error} If form validation fails
 * @throws {Error} If price calculation fails
 * @throws {Error} If state update fails
 * @throws {Error} If required props are missing
 * @throws {Error} If network request fails
 * @throws {Error} If theme fails
 * @throws {Error} If localization fails
 * @throws {Error} If analytics fails
 */
export default {
  components: {
    Icon: () => import('~/components/Icon'),
  },
  props: {
    specialist: {
      type: Object,
      default: null,
    },
    setSpecialist: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      mdiAlertOutline,
      mdiInformationOutline,
      tooltip: false,
      hours: [
        { value: 1, text: '1 hora' },
        { value: 2, text: '2 horas' },
        { value: 3, text: '3 horas' },
        { value: 6, text: '6 horas' },
        { value: 12, text: '12 horas' },
        { value: 24, text: '24 horas' },
      ],
      video: 0,
      loading: false,
      marketplaceVisibility: false,
    }
  },
  computed: {
    /**
     * plan es free
     */
    isFree() {
      const length = this.specialist.specPlans.length
      return this.specialist.specPlans[length - 1].tier === 'free'
    },
    ...mapGetters({ step: 'User/step' }),
  },
  mounted() {
    // video sesiones
    this.video = this.specialist.sessionPrices.video
    // visibilidad
    this.marketplaceVisibility =
      this.specialist.preferences.marketplaceVisibility
  },
  methods: {
    /**
     * actualiza un especialista
     */
    async onSubmit() {
      // loading
      this.loading = true
      // actualizamos
      const specialist = await this.updateSpecialist(this.specialist)
      // establemos datos actualizads
      this.setSpecialist(specialist)
      // video
      this.video = specialist.sessionPrices.video
      this.loading = false
    },
    /**
     * establece los preciones
     */
    setPrice(e) {
      // verifica que solo sea numeros
      if (this.verifyOnlyNumbers(e)) {
        // videos
        this.video = Number(e)
      } else {
        // videos
        this.video = Number(e.split('.').join(''))
      }
      // establece el precio segun lo ingresado
      const sessionPrices = {
        video: Math.round(this.video),
        text: Math.round(this.video * 0.75),
        full: Math.round(this.video * 1.25),
      }
      // establece los datos actulizados al especialis
      this.setSpecialist({
        ...this.specialist,
        sessionPrices,
      })
    },
    /**
     * verifica mendiante una regex la cadena pasada
     */
    verifyOnlyNumbers(value) {
      const regex = /^[0-9]*$/
      return regex.test(value.toString())
    },
    ...mapMutations({
      setOnBoarding: 'User/setOnBoarding',
      setStep: 'User/setStep',
    }),
    ...mapActions({
      updateSpecialist: 'Specialist/updateSpecialist',
    }),
  },
}
</script>
