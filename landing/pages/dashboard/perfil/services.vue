<template>
  <v-container style="height: 100vh">
    <appbar class="hidden-sm-and-down mb-16" title="Servicios" />
    <services :specialist="specialist" :set-specialist="setSpecialist" />
  </v-container>
</template>

<script>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/** * Servicios */

export default {
  name: 'DatosBancarios',
  components: {
    appbar: () => import('~/components/dashboard/AppbarProfile'),
    Services: () => import('~/components/dashboard/Services'),
  },
  layout: 'dashboard',
  middleware: ['auth'],
  /**
   * Obtiene datos iniciales
   */
  async asyncData({ $axios, $auth }) {
    if ($auth.$state.user.role === 'user') {
      if ($auth.$state.user.sessions.length) {
        // Obtenemos un array con todo los planes solamente
        const plans = $auth.$state.user.sessions.flatMap((item) =>
          item.plan.map((plan) => ({
            ...plan,
            specialist: item.specialist,
            user: item.user,
            // dias de diferencia entre el dia que expiró y hoy
            diff: dayjs.tz(dayjs(plan.expiration)).diff(dayjs.tz(), 'days'),
          }))
        )
        const min = Math.max(
          ...plans.map((el) => el.diff).filter((el) => el <= 0)
        )
        const max = Math.max(
          ...plans.map((el) => el.diff).filter((el) => el >= 0)
        )

        // retornamos el plan success y sin expirar
        let plan = plans.find(
          (item) =>
            item.payment === 'success' &&
            dayjs().isBefore(dayjs(item.expiration))
        )
        // retornamos el siguiente plan pendiente
        if (!plan) plan = plans.find((item) => item.diff === max)
        // retornamos el ultimo plan succes y que expiro
        if (!plan) plan = plans.find((item) => item.diff === min)

        if (plan.specialist) {
          const { specialist } = await $axios.$get(
            `/specialists/one/${plan.specialist}`
          )
          return { specialist }
        }
      }
      return { specialist: null }
    } else {
      let specialist
      if ($auth.$state.user.specialist) {
        const res = await $axios.$get(
          `/specialists/one/${$auth.$state.user.specialist}`
        )
        specialist = res.specialist
      } else {
        const res = await $axios.$get(`/recruitment/${$auth.user.email}`)
        specialist = res.recruited
      }
      if (!specialist.formation.length) {
        specialist.formation.push({
          formationType: '',
          description: '',
          start: '',
          end: '',
        })
      }
      if (!specialist.experience.length) {
        specialist.experience.push({ title: '', place: '', start: '', end: '' })
      }
      return { specialist }
    }
  },
  methods: {
    /**
     * Establece el valor en la variable especialista
     */
    setSpecialist(value) {
      this.specialist = value
    },
  },
}
</script>
