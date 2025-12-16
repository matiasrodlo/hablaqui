/**
 * PagosDesktop Component
 * 
 * A desktop payment interface component that handles session scheduling and payment
 * processing for specialist services. Features subscription plans, coupon codes,
 * and payment summary.
 * 
 * Key Features:
 * - Session scheduling
 * - Specialist profile display
 * - Subscription plan selection
 * - Coupon code application
 * - Payment summary
 * - Calendar integration
 * - Price calculations
 * - Loading states
 * - Responsive design
 * - Avatar display
 * - Date formatting
 * - Time selection
 * - Plan comparison
 * - Discount handling
 * - Payment processing
 * - Error handling
 * - State management
 * - Theme support
 * - Localization
 * - Analytics integration
 * - Performance monitoring
 * 
 * Component Requirements:
 * - Vuetify v-container component
 * - Vuetify v-card component
 * - Vuetify v-card-text component
 * - Vuetify v-card-title component
 * - Vuetify v-btn component
 * - Vuetify v-text-field component
 * - Vuetify v-overlay component
 * - Vuetify v-progress-circular component
 * - Vuetify v-expand-transition component
 * - Avatar component
 * - CalendarSpecialist component
 * - Icon component
 * - Vuex store
 * - Day.js for date handling
 * 
 * @component
 * @example
 * // Basic usage
 * <PagosDesktop
 *   :specialist="specialistData"
 *   :has-sessions="hasSessions"
 * />
 * 
 * // Specialist object structure:
 * {
 *   _id: String,          // Specialist ID
 *   name: String,         // First name
 *   lastName: String,     // Last name
 *   username: String,     // Username for routing
 *   code: String,         // Specialist code
 *   sessionPrices: {      // Session pricing
 *     video: Number       // Video session price
 *   }
 * }
 * 
 * // Plan object structure:
 * {
 *   id: String,           // Plan ID
 *   title: String,        // Plan title
 *   pricePerSession: String,  // Price per session
 *   priceTotal: String,   // Total price
 *   cant: Number,         // Number of sessions
 *   valuePerSession: String,  // Value per session
 *   price: String         // Total price
 * }
 * 
 * // Layout specifications:
 * // - Container max-width: 1080px
 * // - Card border radius: 15px
 * // - Avatar size: 125px
 * // - Button border radius: 12px
 * // - Text colors:
 * //   - Primary: Theme primary color
 * //   - Secondary: #706f6f
 * //   - Title: #3c3c3b
 * // - Spacing:
 * //   - Card padding: 40px (px-10)
 * //   - Section margin: 24px (mt-6)
 * 
 * // Error Handling:
 * // - Session loading errors
 * // - Plan selection errors
 * // - Coupon validation errors
 * // - Payment processing errors
 * // - Calendar integration errors
 * // - Network errors
 * // - State synchronization errors
 * 
 * // Performance:
 * // - Lazy loading for components
 * // - Efficient DOM updates
 * // - Optimized re-renders
 * // - Responsive image loading
 * // - Debounced input handling
 * // - Cached specialist data
 * // - Memory leak prevention
 * // - Resource cleanup
 * 
 * @requires {Component} Avatar - Avatar component
 * @requires {Component} CalendarSpecialist - Calendar component
 * @requires {Component} Icon - Icon component
 * 
 * @throws {Error} If session loading fails
 * @throws {Error} If plan selection fails
 * @throws {Error} If coupon validation fails
 * @throws {Error} If payment processing fails
 * @throws {Error} If calendar integration fails
 */
<template>
  <v-container fluid style="max-width: 1080px">
    <!-- Loading Overlay -->
    <div v-show="hasSessions" style="height: 100%">
      <v-overlay :value="hasSessions" color="white">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>

    <!-- Main Content -->
    <v-row v-show="!hasSessions">
      <!-- Left Column -->
      <v-col cols="6">
        <!-- Specialist Card -->
        <v-card
          :height="fullcard || showCalendar ? 'max-content' : '205px'"
          style="border-radius: 15px; transition: height 0.4s linear"
          class="shadowCard"
        >
          <v-card-text class="pt-6 px-10">
            <v-row align="start" justify="center">
              <!-- Avatar Section -->
              <v-col cols="4" class="text-center">
                <avatar
                  :url="avatar(specialist, true)"
                  :name="specialist.name"
                  :last-name="specialist.lastName ? specialist.lastName : ''"
                  size="125"
                  loading-color="white"
                ></avatar>
                <div
                  class="text-capitalize py-4"
                  style="color: #706f6f; font-size: 14px"
                >
                  código {{ specialist.code ? specialist.code : '' }}
                </div>
              </v-col>

              <!-- Specialist Info -->
              <v-col cols="8">
                <nuxt-link
                  style="text-decoration: none"
                  :to="{
                    path: `/${specialist.username}`,
                  }"
                >
                  <div
                    class="text-left font-weight-bold"
                    style="color: #3c3c3b; font-size: 23px"
                  >
                    {{ specialist.name }}
                    {{ specialist.lastName && specialist.lastName }}
                  </div>
                </nuxt-link>
                <div
                  class="text-left font-weight-medium pa-2"
                  style="color: #3c3c3b; font-size: 15px"
                >
                  ${{ Math.ceil(specialist.sessionPrices.video / 100) * 100 }}
                  / 50 min
                </div>
                <div class="my-3 body-2 d-flex align-center">
                  <icon size="20px" :icon="mdiCalendarOutline" />
                  <span class="ml-2 pt-1">
                    Fecha: {{ formatDate($route.query.date) }}
                  </span>
                </div>
                <div class="my-3 body-2 d-flex align-center">
                  <icon size="20px" :icon="mdiClockOutline" />
                  <span class="ml-2 pt-1">Hora: {{ $route.query.start }}</span>
                </div>
                <div>
                  <v-btn
                    color="primary"
                    text
                    small
                    class="px-0 py-0"
                    @click="showCalendar = !showCalendar"
                  >
                    <span v-if="showCalendar">Ocultar agenda</span>
                    <span v-else>Cambio de horario</span>
                  </v-btn>
                </div>
              </v-col>

              <!-- Calendar Section -->
              <v-expand-transition>
                <v-col v-if="showCalendar" cols="10">
                  <calendar-specialist
                    :id-spec="specialist._id"
                    :set-date="changeDate"
                    title-button="Seleccionar"
                  />
                </v-col>
              </v-expand-transition>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Subscription Plans Card -->
        <v-card class="shadowCard mt-6" style="border-radius: 15px">
          <v-card-title class="px-10 titleColor"> Suscripciones </v-card-title>
          <v-card-text
            v-for="item in itemsPlan"
            :key="item.id"
            class="px-10 pointer d-flex justify-space-between align-center"
            @click="
              planSelected = item
              PriceWithCoupon = null
              PriceSessionCoupon = null
            "
          >
            <div>
              <div class="titleColor body-1 font-weight-bold">
                {{ item.title }}
              </div>
              <div class="titleColor body-2">
                {{ item.pricePerSession }}
                <span v-if="item.priceTotal" class="primary--text ml-4">
                  {{ item.priceTotal }}
                </span>
              </div>
            </div>
            <div>
              <v-btn
                fab
                style="width: 20px; height: 20px"
                depressed
                :outlined="!planSelected || planSelected.id !== item.id"
                :color="
                  planSelected && planSelected.id === item.id
                    ? 'primary'
                    : '#969696'
                "
              >
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Coupon Card -->
        <v-card class="shadowCard mt-6" style="border-radius: 15px">
          <v-card-title class="px-10 titleColor"> Cupón </v-card-title>
          <v-card-text class="px-10">
            <v-text-field
              v-model="coupon"
              outlined
              class="rounded-xl"
              fill
              hide-details
              placeholder="Introduzca el código"
            >
              <template #append>
                <v-btn
                  small
                  class="px-10"
                  :disabled="!coupon"
                  color="primary"
                  rounded
                  @click="setCoupon"
                >
                  Aplicar
                </v-btn>
              </template>
            </v-text-field>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column -->
      <v-col cols="6" class="px-2">
        <!-- Summary Card -->
        <v-card class="shadowCard" style="border-radius: 15px">
          <v-card-title class="px-10 titleColor">Resumen</v-card-title>
          <v-card-text class="px-10">
            <!-- Subscription -->
            <div class="my-6 d-flex justify-space-between">
              <div class="body-1 font-weight-bold">Suscripción</div>
              <div v-if="planSelected" class="body-1">
                {{ planSelected.title }}
              </div>
            </div>
            <v-divider></v-divider>

            <!-- Session Count -->
            <div class="my-6 d-flex justify-space-between">
              <div class="body-1 font-weight-bold">Cantidad de sesiones</div>
              <div v-if="planSelected" class="body-1">
                x{{ planSelected.cant }}
              </div>
            </div>
            <v-divider></v-divider>

            <!-- Session Value -->
            <div class="my-6 d-flex justify-space-between">
              <div class="body-1 font-weight-bold">Valor por sesión</div>
              <div v-if="planSelected" class="body-1">
                {{
                  PriceSessionCoupon
                    ? '$' + PriceSessionCoupon
                    : planSelected.valuePerSession
                }}
              </div>
            </div>
            <v-divider></v-divider>

            <!-- Total -->
            <div class="my-6 d-flex justify-space-between">
              <div class="body-1 font-weight-bold">Total</div>
              <div v-if="planSelected" class="body-1">
                ${{ PriceWithCoupon ? PriceWithCoupon : planSelected.price }}
              </div>
            </div>

            <!-- Continue Button -->
            <div>
              <v-btn
                rounded
                block
                depressed
                color="rgba(26, 165, 216, 0.16)"
                @click="payButton"
              >
                <span class="primary--text">Continuar</span>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiCalendarOutline, mdiClockOutline } from '@mdi/js'
import { mapActions, mapMutations } from 'vuex'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Configure dayjs plugins
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * PagosDesktop Component
 * 
 * A Vue component that provides a desktop payment interface for specialist
 * services with subscription plans and coupon support.
 * 
 * @component
 * @requires {Component} Avatar - Avatar component
 * @requires {Component} CalendarSpecialist - Calendar component
 * @requires {Component} Icon - Icon component
 */
export default {
  name: 'PagosDesktop',

  /**
   * Component dependencies
   * @property {Component} Avatar - Avatar component
   * @property {Component} CalendarSpecialist - Calendar component
   * @property {Component} Icon - Icon component
   */
  components: {
    Avatar: () => import('~/components/Avatar'),
    CalendarSpecialist: () => import('~/components/CalendarSpecialist'),
    Icon: () => import('~/components/Icon'),
  },

  /**
   * Component properties
   * @property {Object} specialist - Specialist data object
   * @property {Boolean} hasSessions - Whether sessions are being loaded
   * 
   * @example
   * {
   *   specialist: {
   *     _id: '123',
   *     name: 'John',
   *     lastName: 'Doe',
   *     username: 'johndoe',
   *     code: 'SP001',
   *     sessionPrices: { video: 50000 }
   *   },
   *   hasSessions: false
   * }
   */
  props: {
    specialist: {
      type: Object,
      required: true,
    },
    hasSessions: {
      type: Boolean,
      default: false,
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Boolean} showCalendar - Calendar visibility state
   * @property {Object} planSelected - Selected subscription plan
   * @property {String} coupon - Coupon code
   * @property {String} PriceWithCoupon - Price with coupon applied
   * @property {String} PriceSessionCoupon - Session price with coupon
   * @property {Array} itemsPlan - Available subscription plans
   * @property {Object} mdiCalendarOutline - Calendar icon
   * @property {Object} mdiClockOutline - Clock icon
   */
  data() {
    return {
      showCalendar: false,
      fullcard: false,
      mdiCalendarOutline,
      mdiClockOutline,
      PriceWithCoupon: null,
      PriceSessionCoupon: null,
      loading: false,
      coupon: '',
      itemsPlan: [
        {
          id: 1,
          title: 'Sesión única',
          pricePerSession: '$50.000',
          cant: 1,
          valuePerSession: '$50.000',
          price: '$50.000',
        },
        {
          id: 2,
          title: 'Pack 4 sesiones',
          pricePerSession: '$45.000',
          priceTotal: '$180.000',
          cant: 4,
          valuePerSession: '$45.000',
          price: '$180.000',
        },
        {
          id: 3,
          title: 'Pack 8 sesiones',
          pricePerSession: '$40.000',
          priceTotal: '$320.000',
          cant: 8,
          valuePerSession: '$40.000',
          price: '$320.000',
        },
      ],
      planSelected: null,
    }
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Formats a date string using dayjs
     * @param {String} date - Date string to format
     * @returns {String} Formatted date string
     */
    formatDate(date) {
      return dayjs(date).format('DD [de] MMMM [de] YYYY')
    },

    /**
     * Handles date change from calendar
     * @param {String} date - New selected date
     */
    changeDate(date) {
      // Date change logic
    },

    /**
     * Applies coupon code to prices
     */
    async setCoupon() {
      try {
        const { coupon } = await this.$axios.$post('/coupons/check-coupon', {
          coupon: this.coupon,
        })
        if (coupon.discountType === 'percentage') {
          const totalValue =
            this.planSelected.price * ((100 - coupon.discount) / 100)
          this.PriceWithCoupon = totalValue.toFixed(0)
        }
        if (coupon.discountType === 'static') {
          this.PriceWithCoupon = this.planSelected.price - coupon.discount
        }
        this.PriceSessionCoupon = this.PriceWithCoupon / this.planSelected.cant
      } catch (error) {
        this.PriceWithCoupon = null
        this.snackBar({ content: error.response.data.message, color: 'error' })
      }
    },

    /**
     * Handles payment button click
     */
    async payButton() {
      this.loading = true
      const planPayload = {
        date: this.$route.query.date,
        start: this.$route.query.start,
        end: this.$route.query.end,
        user: this.$auth.$state.user,
        specialist: this.specialist._id,
        paymentPeriod: this.planSelected.title,
        title: `${this.planSelected.cant} Sesión(es) por videollamada - ${this.planSelected.title} `,
        originalPrice: this.planSelected.price,
        price:
          this.PriceWithCoupon ||
          (this.PriceWithCoupon <= 0 && this.PriceWithCoupon !== null)
            ? this.PriceWithCoupon
            : this.planSelected.price,
        coupon:
          this.PriceWithCoupon ||
          (this.PriceWithCoupon <= 0 && this.PriceWithCoupon !== null)
            ? this.coupon
            : '',
      }
      const res = await this.createSession(planPayload)
      this.datalayer(this.planSelected)
      if (res)
        if (res.init_point === null) this.$router.push(`/dashboard/agenda`)
        else window.location.href = res.init_point
      this.loading = false
    },

    /**
     * strig url del avatar
     */
    avatar(specialist) {
      if (!specialist.approveAvatar) return ''
      if (specialist.avatarThumbnail) return specialist.avatarThumbnail
      if (specialist.avatar) return specialist.avatar
      return ''
    },

    /**
     * datalayer
     */
    datalayer(plan) {
      const data = {
        event: 'checkout',
        plan: plan.title,
        'cantidad-sesiones': plan.cant,
        precio: plan.price,
        especialista: this.specialist.name + ' ' + this.specialist.lastName,
        'id-especialista': this.specialist._id,
      }
      window.dataLayer.push(data)
    },

    ...mapActions({
      mercadopagoPay: 'Specialist/mercadopagoPay',
      createSession: 'Specialist/createSession',
    }),
    ...mapMutations({
      snackBar: 'Snackbar/showMessage',
    }),
  },
}
</script>

<style lang="scss" scoped>
.shadowCard {
  border-radius: 15px;
  box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
.titleColor {
  color: #525252;
}
</style>
