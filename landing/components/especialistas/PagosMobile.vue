/**
 * PagosMobile Component
 *
 * Displays and manages payment and subscription options for users on mobile devices.
 *
 * Key Features:
 * - Mobile-friendly payment interface
 * - Subscription plan selection
 * - Payment summary and confirmation
 * - Responsive design
 *
 * Requirements:
 * - Vuetify form and card components
 * - Vuex for state
 *
 * @component
 * @example
 * <PagosMobile />
 */
<template>
  <div>
    <div v-show="hasSessions" style="height: 100%">
      <v-overlay :value="hasSessions" color="white">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>
    <v-container v-show="!hasSessions" fluid style="max-width: 1200px">
      <v-card
        style="border-radius: 15px; transition: height 0.4s linear"
        class="shadowCard"
      >
        <v-card-text class="text-center">
          <avatar
            :url="avatar(specialist, true)"
            :name="specialist.name"
            :last-name="specialist.lastName ? specialist.lastName : ''"
            size="80"
            loading-color="white"
          ></avatar>
          <nuxt-link
            style="text-decoration: none"
            :to="{
              path: `/${specialist.username}`,
            }"
          >
            <div
              class="my-2 font-weight-bold"
              style="color: #3c3c3b; font-size: 19px"
            >
              {{ specialist.name }}
              {{ specialist.lastName && specialist.lastName }}
            </div>
            <div
              class="font-weight-medium pa-2"
              style="color: #3c3c3b; font-size: 14px"
            >
              ${{ Math.ceil(specialist.sessionPrices.video / 100) * 100 }}
              / 50 min
            </div>
          </nuxt-link>
          <div class="d-flex justify-center">
            <div class="mx-2 body-2 d-flex align-center">
              <icon size="20px" :icon="mdiCalendarOutline" />
              <span class="ml-3 pt-1"
                >Fecha: {{ formatDate($route.query.date) }}</span
              >
            </div>
            <div class="mx-2 body-2 d-flex align-center">
              <icon size="20px" :icon="mdiClockOutline" />
              <span class="ml-3 pt-1">Hora: {{ $route.query.start }}</span>
            </div>
          </div>
          <div class="mt-3">
            <v-btn
              color="primary"
              text
              small
              class="px-0 py-0"
              @click="showCalendar = !showCalendar"
            >
              <span v-if="showCalendar">Ocultar agenda</span>
              <span v-else>Cambiar reserva</span>
            </v-btn>
          </div>
        </v-card-text>
        <v-expand-transition>
          <v-col v-if="showCalendar" cols="12">
            <calendar-specialist
              :id-spec="specialist._id"
              :set-date="changeDate"
              title-button="Seleccionar"
            />
          </v-col>
        </v-expand-transition>
      </v-card>
      <v-card class="shadowCard mt-6" style="border-radius: 15px">
        <v-card-title class="titleColor"> Suscripciones </v-card-title>
        <v-card-text
          v-for="item in itemsPlan"
          :key="item.id"
          class="pointer d-flex justify-space-between align-center"
          @click="planSelected = item"
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
      <v-card class="shadowCard mt-6" style="border-radius: 15px">
        <v-card-title class="titleColor">Cupón</v-card-title>
        <v-card-text class="">
          <v-text-field
            v-model="coupon"
            outlined
            class="rounded-xl"
            fill
            dense
            hide-details
            placeholder="Introduzca el código"
          >
            <template #append>
              <v-btn
                small
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
      <v-card class="shadowCard mt-6" style="border-radius: 15px">
        <v-card-title class="titleColor"> Resumen </v-card-title>
        <v-card-text class="">
          <div class="my-6 d-flex justify-space-between">
            <div class="body-1 font-weight-bold">Suscripción</div>
            <div v-if="planSelected" class="body-1">
              {{ planSelected.title }}
            </div>
          </div>
          <v-divider></v-divider>
          <div class="my-6 d-flex justify-space-between">
            <div class="body-1 font-weight-bold">Cantidad de sesiones</div>
            <div v-if="planSelected" class="body-1">
              x{{ planSelected.cant }}
            </div>
          </div>
          <v-divider></v-divider>
          <div class="my-6 d-flex justify-space-between">
            <div class="body-1 font-weight-bold">Valor por sesión</div>
            <div v-if="planSelected" class="body-1">
              {{ planSelected.valuePerSession }}
            </div>
          </div>
          <v-divider></v-divider>
          <div class="my-6 d-flex justify-space-between">
            <div class="body-1 font-weight-bold">Total</div>
            <div v-if="planSelected" class="body-1">
              ${{ planSelected.price }}
            </div>
          </div>
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
          <div class="caption my-6 text-center">
            Pago seguro con encriptado SSL
          </div>
          <div class="d-flex justify-space-around">
            <v-img
              width="20"
              contain
              :src="`https://cdn.hablaqui.cl/static/Visa_Logo.png`"
            ></v-img>
            <v-img
              width="20"
              contain
              :src="`https://cdn.hablaqui.cl/static/logo-Mastercard.png`"
            ></v-img>
            <v-img
              width="20"
              contain
              :src="`https://cdn.hablaqui.cl/static/surface.png`"
            ></v-img>
            <v-img
              width="20"
              contain
              :src="`https://cdn.hablaqui.cl/static/american_express.png`"
            ></v-img>
            <v-img
              width="20"
              contain
              :src="`https://cdn.hablaqui.cl/static/logo_webpay.png`"
            ></v-img>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mdiCalendarOutline, mdiClockOutline } from '@mdi/js'
import { mapActions, mapMutations } from 'vuex'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/** * Vista de pagos mobile */

export default {
  components: {
    Avatar: () => import('@/components/Avatar'),
    Icon: () => import('~/components/Icon'),
    CalendarSpecialist: () => import('~/components/Calendar'),
  },
  props: {
    specialist: {
      type: Object,
      default: null,
    },
    hasSessions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showCalendar: false,
      fullcard: false,
      mdiClockOutline,
      mdiCalendarOutline,
      PriceWithCoupon: null,
      loading: false,
      coupon: '',
      itemsPlan: [
        {
          id: 1,
          title: 'Pago semanal',
          pricePerSession: '$50.000 / por sesión',
          valuePerSession: '$50.000',
          priceTotal: '',
          cant: 1,
          price: 50000,
        },
        {
          id: 2,
          title: 'Pago mensual',
          pricePerSession: '$45.000 / por sesión',
          valuePerSession: '$45.000',
          priceTotal: '($180000)',
          cant: 4,
          price: 180000,
        },
        {
          id: 3,
          title: 'Pago trimestral',
          pricePerSession: '$40.000 / por sesión',
          valuePerSession: '$40.000',
          priceTotal: '($480000)',
          cant: 12,
          price: 480000,
        },
      ],
      planSelected: null,
    }
  },
  mounted() {
    this.setPrices()
    /**
     * plan seleccionado
     */
    this.planSelected = this.itemsPlan[1]
  },
  methods: {
    /**
     * establece los cupones de descuento
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
      } catch (error) {
        this.PriceWithCoupon = null
        this.snackBar({ content: error.response.data.message, color: 'error' })
      }
    },
    /**
     * establece los precios
     */
    setPrices() {
      this.itemsPlan = this.itemsPlan.map((item) => {
        let priceWithDiscount = ''
        let pricePerSession = ''
        let price = ''

        if (item.id === 1) {
          priceWithDiscount = 0
          pricePerSession =
            Math.ceil(this.specialist.sessionPrices.video / 100) * 100
          price = Math.ceil(this.specialist.sessionPrices.video / 100) * 100
        }
        if (item.id === 2) {
          priceWithDiscount =
            this.specialist.sessionPrices.video * 4 -
            this.specialist.sessionPrices.video * 4 * 0.1
          pricePerSession = priceWithDiscount / 4
          pricePerSession = Math.ceil(pricePerSession / 100) * 100
          price = pricePerSession * 4
        }
        if (item.id === 3) {
          priceWithDiscount =
            this.specialist.sessionPrices.video * 12 -
            this.specialist.sessionPrices.video * 12 * 0.2
          pricePerSession = priceWithDiscount / 12
          pricePerSession = Math.ceil(pricePerSession / 100) * 100
          price = pricePerSession * 12
        }

        return {
          ...item,
          pricePerSession: `$${pricePerSession} / por sesión`,
          valuePerSession: `$${pricePerSession}`,
          priceTotal: `($${price})`,
          price,
        }
      })
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
     * Pagar el plan
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
    /**
     * cambio de fecha
     */
    changeDate(item) {
      this.$router.push(
        `/especialistas/pagos/?username=${this.specialist.username}&date=${item.date}&start=${item.start}&end=${item.end}`
      )
      this.showCalendar = !this.showCalendar
    },
    /**
     * formatea una fecha dada
     */
    formatDate(date) {
      return dayjs(date, 'MM/DD/YYYY').format('DD/MM/YYYY')
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
