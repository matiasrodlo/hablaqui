<template>
  <div style="background-color: #f0f8ff">
    <!-- appbar -->
    <div style="margin-bottom: 140px">
      <Appbar />
    </div>
    <!-- desktop -->
    <template v-if="!loadingSpecialist">
      <pagos-desktop
        :specialist="specialist"
        :has-sessions="hasSessions"
        class="mt-10 hidden-sm-and-down"
      />
      <!-- mobile -->
      <pagos-mobile
        :specialist="specialist"
        :has-sessions="hasSessions"
        class="mt-10 hidden-md-and-up"
      />
    </template>
    <!-- footer -->
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/** * Pagina principal de pagos */

export default {
  components: {
    Appbar: () => import('~/components/AppbarWhite'),
    PagosDesktop: () =>
      import(
        /* webpackChunkName: "EspecialistasDesktop" */ '~/components/especialistas/PagosDesktop'
      ),
    PagosMobile: () =>
      import(
        /* webpackChunkName: "EspecialistasMobile" */ '~/components/especialistas/PagosMobile'
      ),
  },
  async asyncData({ query, $axios, error }) {
    try {
      const { specialist } = await $axios.$get(
        `/specialists/one/${query.username}`
      )
      return { specialist }
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  data() {
    return {
      loadingSpecialist: false,
      loadingSession: false,
      hasSessions: false,
      specialist: null,
      plan: null,
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: this.$config.VUE_URL + 'especialistas',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$config.VUE_URL + 'especialistas',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: this.$config.VUE_URL + 'especialistas/',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      plans: 'User/plan',
    }),
  },
  jsonld() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      leaglName: 'Hablaquí',
      url: 'http://app.hablaqui.cl/especialistas',
      email: 'soporte@hablaqui.cl',
      slogan: 'Especialista y terapia online de calidad sin salir de casa',
      logo: 'https://app.hablaqui.cl/logo_tiny.png',
    }
  },
  created() {
    // si tiene sessiones bolean
    this.hasSessions =
      this.plan &&
      this.plan.payment === 'success' &&
      dayjs().isBefore(dayjs(this.plan.expiration)) &&
      this.plan.specialist === this.specialist._id &&
      this.plan.remainingSessions > 0
  },
  async mounted() {
    this.plan =
      this.plans && this.plans.sortedPlans.length > 0
        ? this.plans.sortedPlans[0]
        : null
    window.scrollTo(0, 0)
    // si tiene sesiones
    if (this.hasSessions) {
      await this.newSession()
    }
  },
  methods: {
    /**
     * Agrega uana nueva sesion y obtiene refetch del user
     */
    async newSession() {
      this.loadingSession = true
      const payload = {
        date: `${this.$route.query.date} ${this.$route.query.start}`,
        sessionNumber: this.plan.session.length + 1,
        remainingSessions: (this.plan.remainingSessions -= 1),
      }
      await this.addSession({
        id: this.plan.idSessions,
        idPlan: this.plan._id,
        payload,
      })
      await this.$auth.fetchUser()
      this.loadingSession = false
      this.$router.push({ name: 'dashboard-agenda' })
    },
    ...mapActions({
      addSession: 'Specialist/addSession',
    }),
  },
}
</script>
