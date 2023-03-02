<template>
  <div style="background-color: #f0f8ff">
    <!-- appbar -->
    <div style="margin-bottom: 150px">
      <appbar />
    </div>
    <!-- desktop -->
    <profile-desktop
      :specialist="specialist"
      :set-specialist="setSpecialist"
      class="mt-10 hidden-sm-and-down"
    />
    <!-- mobile -->
    <profile-mobile
      :specialist="specialist"
      :set-specialist="setSpecialist"
      class="mt-10 hidden-md-and-up"
    />
    <!-- footer -->
    <div style="background-color: #0f3860" class="mt-16" align="center">
      <v-container class="white--text py-16" fluid style="max-width: 1080px">
        <v-row>
          <v-col>
            Los servicios son proporcionados de forma independiente por
            profesionales de la salud. Hablaquí no brinda ningún servicio de
            salud mental. Si está experimentando una crisis, comuníquese a los
            servicios de emergencia más cercanos.
          </v-col>
        </v-row>
      </v-container>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
/**
 * Pagina del perfil de especialista(mobile y desktop)
 */
export default {
  components: {
    Footer: () => import('~/components/Footer'),
    Appbar: () => import('~/components/AppbarWhite'),
    ProfileDesktop: () =>
      import(
        /* webpackChunkName: "EspecialistasDesktop" */ '~/components/especialistas/ProfileDesktop'
      ),
    ProfileMobile: () =>
      import(
        /* webpackChunkName: "EspecialistasMobile" */ '~/components/especialistas/ProfileMobile'
      ),
  },
  async asyncData({ $axios, params, error, payload }) {
    try {
      if (payload) return { specialist: payload, dataCurrent: false }
      else {
        const { specialist } = await $axios.$get(
          `/specialists/one/${params.slug}`
        )
        return { specialist, dataCurrent: true }
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  data() {
    return {
      loadingChat: false,
      loadingCalendar: false,
    }
  },
  head() {
    return {
      title: `${
        this.specialist
          ? 'Especialista ' +
            this.specialist.name +
            ' ' +
            this.specialist.lastName +
            ' $' +
            this.specialist.sessionPrices.video
          : ''
      }`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.specialist
            ? this.specialist.professionalDescription
            : '',
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: process.env.VUE_APP_LANDING + '/' + this.$route.params.slug,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `${
            this.specialist.name + this.specialist.lastName
          } | Hablaquí`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.specialist.professionalDescription,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.specialist.avatar,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: process.env.VUE_APP_LANDING + '/' + this.$route.params.slug,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${
            this.specialist.name + this.specialist.lastName
          } | Hablaquí`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.specialist.professionalDescription,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.specialist.avatar,
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: this.specialist.avatar,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.specialist.name,
        },
        {
          hid: 'robots',
          name: 'robots',
          content: 'index,follow',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: `https://hablaqui.cl/${this.specialist.username}/`,
        },
      ],
    }
  },
  async mounted() {
    // hack para obtener los datos actualizados del especialista siempre
    if (!this.dataCurrent) {
      const { specialist } = await this.$axios.$get(
        `/specialists/one/${this.$route.params.slug}`
      )
      this.specialist = specialist
    }
    this.loadingCalendar = true
    // obtiene las sesiones ya formateadas
    await this.getFormattedSessions({
      id: this.specialist._id,
      type: 'schedule',
    })
    this.loadingCalendar = false
    if (this.$route.query.chat) {
      this.loadingChat = true
      // envia intencion de chat al specialista
      await this.startConversation(this.specialist._id)
      this.loadingChat = false
      this.setFloatingChat(true)
      this.$router.replace({ query: null })
    }
  },
  methods: {
    /**
     * establece el especialista
     */
    setSpecialist(value) {
      this.specialist = value
    },
    ...mapActions({
      startConversation: 'Chat/startConversation',
      getFormattedSessions: 'Specialist/getFormattedSessions',
    }),
    ...mapMutations({
      setFloatingChat: 'Chat/setFloatingChat',
    }),
  },
}
</script>
