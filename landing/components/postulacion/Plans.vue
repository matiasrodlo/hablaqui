<template>
  <v-container fluid style="max-width: 1200px">
    <v-row justify="center" class="pb-16">
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
          <!-- Muestra boton ir a mi cuenta en debajo de la tarjeta premiun -->
          <!-- <v-btn
						v-if="currentPlan.tier === 'premium'"
						class="box mt-4"
						color="primary"
						rounded
						block
						@click="goToStep"
					>
						Ir a mi cuenta
					</v-btn> -->
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
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/** * Planes */

export default {
  components: {
    Icon: () => import('~/components/Icon'),
  },
  props: {
    next: {
      type: Function,
      required: true,
    },
  },
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
     * retorna el plan actual
     */
    currentPlan() {
      if (this.$auth.$state.user.role !== 'specialist') return false
      if (!this.specialist && !this.recruited) return false
      if (
        this.specialist &&
        this.specialist.specPlans &&
        this.specialist.specPlans.length
      )
        return this.specialist.specPlans[this.specialist.specPlans.length - 1]
      if (
        this.recruited &&
        this.recruited.specPlans &&
        this.recruited.specPlans.length
      )
        return this.recruited.specPlans[this.recruited.specPlans.length - 1]
      else return false
    },
    /**
     * verdadero si tiene plan premiun
     */
    hasPremiunPlan() {
      if (!this.currentPlan) return false
      return (
        this.currentPlan &&
        this.currentPlan.tier === 'premium' &&
        dayjs(this.currentPlan.expirationDate).isAfter(dayjs())
      )
    },
  },
  async mounted() {
    // obtenemos el especialista
    if (this.$auth.$state.user.specialist) {
      const { specialist } = await this.$axios.$get(
        `/specialists/one/${this.$auth.$state.user.specialist}`
      )
      this.specialist = specialist
    } else {
      // obtenemos el postulado
      const { recruited } = await this.$axios.$get(
        `/recruitment/${this.$auth.user.email}`
      )
      this.recruitedId = recruited._id
      this.recruited = recruited
    }
  },
  methods: {
    /**
     * Establece la preferencias del plan pasado
     */
    async setPreferences(plan) {
      // las preferencias se modificaron para que sean siempre anuales con un precio mensual de $69.990
      const res = await this.setPaymentPreferences({
        plan,
        price: 69000 * 12,
        period: 'anual',
        description:
          plan === 'premium'
            ? 'Plan Premium de Hablaqui'
            : 'Plan Basico de Hablaqui',
        title: plan === 'premium' ? 'Plan Premium' : 'Plan Free',
        specialistId: this.$auth.$state.user.specialist,
        recruitedId: this.recruitedId,
      })
      // si el id de reclutado existe
      if (this.recruitedId) {
        if (plan === 'premium') window.location.href = res.preference.init_point
        else this.next()
      }
      // si es especialista
      if (this.$auth.$state.user.specialist) {
        if (plan === 'premium') window.location.href = res.preference.init_point
        else this.$router.push({ name: 'dashboard-perfil' })
      }
    },
    /**
     * cambia segun la ruta donde se encuentre
     */
    goToStep() {
      if (this.$route.name === 'postulacion') this.next()
      else this.$router.push({ name: 'dashboard-perfil' })
    },
    ...mapActions({
      setPaymentPreferences: 'Specialist/setPaymentPreferences',
    }),
  },
}
</script>

<style lang="scss" scoped>
.box {
  box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
  transition: transform 0.6s !important;
}
</style>
