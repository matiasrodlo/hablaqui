/**
 * AppbarProfile Component
 *
 * A top navigation bar for the dashboard/profile area, providing navigation, support links, and logout functionality.
 *
 * Key Features:
 * - Back navigation button
 * - Support and FAQ links
 * - Premium plan link (for specialists)
 * - Logout button
 * - Responsive design
 *
 * Requirements:
 * - Vuetify v-app-bar, v-btn, v-img
 * - Vuex for state
 *
 * @component
 * @example
 * <AppbarProfile title="Perfil" />
 */
<template>
  <v-app-bar style="border-radius: 50px" color="white" light height="110" flat>
    <v-btn v-if="goBack" icon @click="() => $router.go(-1)">
      <icon size="30" color="primary" :icon="mdiChevronLeft" />
    </v-btn>
    <h1 class="primary--text">{{ title }}</h1>
    <v-spacer></v-spacer>
    <div
      v-if="$auth.$state.user.role === 'user'"
      class="mx-5 body-1 primary--text"
    >
      <a
        style="text-decoration: none"
        href="https://api.whatsapp.com/message/RZPJ4H5ZTDNWB1"
        target="_blank"
      >
        <div class="d-flex align-center">
          <v-img
            src="https://cdn.hablaqui.cl/static/demo.png"
            contain
            height="30"
            width="30"
            class="mx-2"
          ></v-img>
          Atención al cliente
        </div>
      </a>
    </div>
    <div v-if="$auth.user.role === 'user'" class="mx-5 body-1 primary--text">
      <a
        style="text-decoration: none"
        href="https://hablaqui.cl/preguntas-frecuentes/"
        target="_blank"
      >
        <div class="d-flex align-center">
          <v-img
            src="https://cdn.hablaqui.cl/static/demo.png"
            contain
            height="30"
            width="30"
            class="mx-2"
          ></v-img>
          Preguntas frecuentes
        </div>
      </a>
    </div>
    <div
      v-if="$auth.$state.user.role === 'specialist'"
      class="mx-5 body-1 primary--text"
    >
      <a
        style="text-decoration: none"
        href="https://api.whatsapp.com/message/RZPJ4H5ZTDNWB1"
        target="_blank"
      >
        <div class="d-flex align-center">
          <v-img
            src="https://cdn.hablaqui.cl/static/demo.png"
            contain
            height="30"
            width="30"
            class="mx-2"
          ></v-img>
          Atención al cliente
        </div>
      </a>
    </div>
    <div
      v-if="$auth.user.role === 'specialist'"
      class="mx-5 body-1 primary--text"
    >
      <a
        style="text-decoration: none"
        href="https://hablaqui.cl/para-especialistas/preguntas-frecuentes/"
        target="_blank"
      >
        <div class="d-flex align-center">
          <v-img
            src="https://cdn.hablaqui.cl/static/demo.png"
            contain
            height="30"
            width="30"
            class="mx-2"
          ></v-img>
          Preguntas frecuentes
        </div>
      </a>
    </div>
    <div
      v-if="$auth.$state.user.role == 'specialist'"
      class="mx-5 body-1 primary--text"
    >
      <nuxt-link style="text-decoration: none" to="/dashboard/planes">
        <div class="d-flex align-center">
          <v-img
            src="https://cdn.hablaqui.cl/static/diamond.png"
            contain
            height="30"
            width="30"
            class="mx-2"
          ></v-img>
          Premium
        </div>
      </nuxt-link>
    </div>
    <v-btn
      v-if="
        $auth.user.role === 'specialist' &&
        $vuetify.breakpoint.mdAndUp &&
        specialist
      "
      class="mx-2"
      small
      elevation="1"
      fab
      color="white"
      @click="() => setOnBoarding()"
    >
      <v-img
        src="https://cdn.hablaqui.cl/static/flag.png"
        contain
        height="25"
        width="25"
        class="mx-2"
      ></v-img>
    </v-btn>
    <v-btn class="ml-2" small elevation="1" fab color="white" @click="logout">
      <icon :icon="mdiLogout" />
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mdiLogout, mdiChevronLeft, mdiFlag } from '@mdi/js'
import { mapMutations, mapGetters } from 'vuex'

/**
 * El appbar del dashboard
 */
export default {
  components: {
    Icon: () => import('~/components/Icon'),
  },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      mdiChevronLeft,
      mdiLogout,
      mdiFlag,
    }
  },
  computed: {
    /**
     * regresa atras segun el nombre de la ruta
     */
    goBack() {
      return (
        this.$route.name === 'dashboard-perfil-configuracion-personal' ||
        this.$route.name === 'dashboard-perfil-datos-bancarios' ||
        this.$route.name === 'dashboard-perfil-experiencia-formacion' ||
        this.$route.name === 'dashboard-perfil-informacion-general' ||
        this.$route.name === 'dashboard-perfil-horario' ||
        this.$route.name === 'dashboard-perfil-services' ||
        this.$route.name === 'dashboard-consultantes-consultante-seleccionado'
      )
    },
    ...mapGetters({
      specialist: 'Specialist/specialist',
    }),
  },
  methods: {
    /**
     * Salir y regresar a la autenticacion
     */
    async logout() {
      await this.$auth.logout()
      this.$router.push('/auth')
    },
    ...mapMutations({ setOnBoarding: 'User/setOnBoarding' }),
  },
}
</script>
