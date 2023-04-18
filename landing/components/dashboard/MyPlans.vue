<template>
  <div>
    <template v-if="plans.length">
      <v-slide-group
        v-if="$vuetify.breakpoint.mdAndUp"
        v-model="slider"
        class="pa-4"
        center-active
        show-arrows
      >
        <v-slide-item v-for="(item, n) in plans" :key="n" v-slot="{ toggle }">
          <v-card class="ma-4" height="220" width="400" @click="toggle">
            <v-card-title
              class="d-flex justify-space-between body-1 font-weight-medium"
            >
              <div>
                <div>
                  {{ item.title }}
                </div>
                <div v-if="itemSuccess(item)" class="caption">
                  <template v-if="item.payment === 'success'">
                    <span class="success--text">Tu plan actual</span>
                  </template>
                  <template v-if="item.payment === 'pending'">
                    <span class="warning--text">Pendiente</span>
                  </template>
                  <template v-if="item.payment === 'failed'">
                    <span class="error--text">Expirado</span>
                  </template>
                </div>
                <div v-else class="caption">
                  <span class="error--text">Finalizó</span>
                </div>
              </div>
              <div
                style="width: 20px; height: 20px"
                :class="status(item)"
              ></div>
            </v-card-title>
            <v-card-text>
              <div>
                <span class="headline font-weight-bold">{{
                  item.totalPrice
                }}</span>
                <span>/ {{ item.period }}</span>
              </div>
              {{ setDescrition(item.title) }}
            </v-card-text>
            <v-card-text>
              {{ setSubtitle(item.title) }}
            </v-card-text>
          </v-card>
        </v-slide-item>
      </v-slide-group>
      <template v-else>
        <v-card
          v-for="(item, n) in plans"
          :key="n"
          class="my-4"
          height="220"
          width="100%"
        >
          <v-card-title
            class="d-flex justify-space-between body-1 font-weight-medium"
          >
            <div>
              <div>
                {{ item.title }}
              </div>
              <div v-if="itemSuccess(item)" class="caption">
                <template v-if="item.payment === 'success'">
                  <span class="success--text">Tu plan actual</span>
                </template>
                <template v-if="item.payment === 'pending'">
                  <span class="warning--text">Pendiente</span>
                </template>
                <template v-if="item.payment === 'failed'">
                  <span class="error--text">Expirado</span>
                </template>
              </div>
              <div v-else class="caption">
                <span class="error--text">Finalizó</span>
              </div>
            </div>
            <div style="width: 20px; height: 20px" :class="status(item)"></div>
          </v-card-title>
          <v-card-text>
            <div>
              <span class="headline font-weight-bold">{{
                item.totalPrice
              }}</span>
              <span>/ {{ item.period }}</span>
            </div>
            {{ setDescrition(item.title) }}
          </v-card-text>
          <v-card-text>
            {{ setSubtitle(item.title) }}
          </v-card-text>
        </v-card>
      </template>
    </template>
    <template v-else>
      <v-card>
        <v-card-text class="text-center">
          <div class="body-1 my-5 mx-auto" style="max-width: 280px">
            Bienestar en cualquier momento
          </div>
          <v-btn rounded color="primary" to="/evaluacion/">Comenzar</v-btn>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/** * mis planes */

export default {
  data() {
    return {
      slider: null,
    }
  },
  computed: {
    // Filtramos que sea de usuarios con pagos success y no hayan expirado
    plans() {
      if (!this.$auth.$state.user) return []
      // Obtenemos un array con todo los planes solamente
      return this.$auth.$state.user.sessions.flatMap((item) =>
        item.plan.map((plan) => ({
          ...plan,
          specialist: item.specialist,
          user: item.user,
          // dias de diferencia entre el dia que expiró y hoy
          diff: dayjs.tz(dayjs(plan.expiration)).diff(dayjs.tz(), 'days'),
        }))
      )
    },
  },
  methods: {
    status(item) {
      /**
       * retornaun string con las clases css segun el estado del pagos
       */
      if (this.itemSuccess(item)) {
        if (item.payment === 'success') return 'success rounded-xl'
        if (item.payment === 'pending') return 'warning rounded-xl'
        if (item.payment === 'failed') return 'error rounded-xl'
      }
      return 'grey rounded-xl'
    },
    /**
     * establecemos la descripcion segun el titulo
     */
    setDescrition(title) {
      if (title === 'Sesiones por videollamada')
        return 'Habla con un especialista por videollamada en cualquier momento, en cualquier lugar.'
      if (title === 'Mensajería y videollamada')
        return 'Chatea y habla por videollamada con un especialista. Respuestas vía texto garantizadas 5 días a la semana.'
      if (title === 'Acompañamiento vía mensajería')
        return 'Chatea con un especialista. Respuestas vía texto garantizadas 5 días a la semana.'
    },
    /**
     * establecemos el subtitulo segun el titulo
     */
    setSubtitle(title) {
      if (title === 'Sesiones por videollamada')
        return 'Sesiones por videollamada (50 min)'
      if (title === 'Mensajería y videollamada')
        return 'Mensajería + Videollamada (30min)'
      if (title === 'Acompañamiento vía mensajería')
        return 'Terapia vía mensajes de texto'
    },
    /**
     * formatea la fecha con moment
     */
    setDate(date) {
      return dayjs.tz(dayjs(date)).format('l')
    },
    /**
     * los items success
     */
    itemSuccess(item) {
      return (
        (item.payment === 'success' ||
          item.payment === 'pending' ||
          item.payment === 'failed') &&
        dayjs().isBefore(dayjs(item.expiration))
      )
    },
  },
}
</script>
