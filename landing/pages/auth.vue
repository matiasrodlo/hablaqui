<template>
  <div style="position: relative">
    <v-img
      class="hidden-sm-and-down"
      :src="`https://cdn.hablaqui.cl/static/login.png`"
      :lazy-src="`https://cdn.hablaqui.cl/static/login.png`"
      style="height: 100vh"
    ></v-img>
    <v-container
      :class="$vuetify.breakpoint.mdAndUp ? '' : 'white--text'"
      fluid
      style="position: absolute; top: 0; height: 100vh"
    >
      <v-row
        justify="center"
        align="center"
        style="height: 100vh; overflow-y: auto"
      >
        <v-col cols="12" md="6">
          <v-row justify="center">
            <v-col cols="6" sm="5" md="4" lg="3">
              <a href="https://hablaqui.cl/" class="tex-center">
                <v-img
                  class="mx-auto"
                  style="max-width: 200px"
                  :src="`https://cdn.hablaqui.cl/static/logo.png`"
                  :lazy-src="`https://cdn.hablaqui.cl/static/logo.png`"
                />
              </a>
            </v-col>
            <v-col
              cols="12"
              class="py-1 text-center text-h6 text-lg-h4 font-weight-bold text--secondary"
            >
            </v-col>
            <v-col
              cols="12"
              sm="9"
              lg="6"
              class="py-1 text-center subtitle-1 font-weight-bold text--secondary"
            >
              <span v-show="step === 1"
                >Continúe con su viaje al bienestar</span
              >
              <span v-show="step === 2">Inicie su viaje al bienestar</span>
              <span v-show="step === 3">Recuperar contraseña</span>
            </v-col>
          </v-row>
          <v-row justify="center" class="text-center">
            <v-col cols="12" sm="10" lg="8">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <sign-in :set-reset-password="() => (step = 3)" />
                </v-window-item>
                <v-window-item :value="2">
                  <sign-up />
                </v-window-item>
                <v-window-item :value="3">
                  <Send-password-recovery :go-back="() => (step = 1)" />
                </v-window-item>
              </v-window>
              <div
                class="mt-4 mb-2 subtitle-1 font-weight-bold secondary--text"
              >
                <small v-if="step == 1"> ¿No tiene cuenta? </small>
                <small v-else>¿Ya tiene cuenta?</small>
              </div>
              <v-btn
                v-show="step == 2 || step === 3"
                outlined
                block
                rounded
                color="primary"
                @click="setStep"
              >
                Ingresar
              </v-btn>
              <v-btn
                v-show="step == 1"
                outlined
                block
                rounded
                color="primary"
                @click="setStep"
              >
                Crea una cuenta
              </v-btn>
              <div class="mt-16"></div>
              <div class="font-weight-bold caption secondary--text">
                2022 Hablaqui
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="hidden-sm-and-down" md="6">
          <v-carousel
            v-model="carousel"
            hide-delimiter-background
            hide-delimiters
            cycle
            interval="3000"
            :show-arrows="false"
            height="600"
          >
            <v-carousel-item
              v-for="n in length"
              :key="`card-${n.id}`"
              class="align-items-center"
              style="position: relative"
            >
              <div class="text-center mt-10">
                <v-img
                  style="z-index: 1; position: absolute; top: 30px; right: 30%"
                  width="80"
                  :src="`https://cdn.hablaqui.cl/static/plus-login.png`"
                ></v-img>
                <v-img
                  style="position: absolute; bottom: 30%; right: 17%"
                  width="220"
                  :src="`https://cdn.hablaqui.cl/static/circle-login.png`"
                >
                </v-img>
                <v-list-item-avatar size="400" class="ml-4">
                  <v-img
                    height="400"
                    width="400"
                    :src="n.img"
                    :lazy-src="n.img"
                  >
                    <template #placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="white"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-list-item-avatar>
                <div
                  style="max-width: 500px"
                  class="text-h6 mx-auto white--text py-5 px-10"
                >
                  {{ n.text }}
                </div>
              </div>
            </v-carousel-item>
          </v-carousel>
          <v-item-group v-model="carousel" class="text-center" mandatory>
            <v-item
              v-for="n in length"
              :key="`btn-${n.id}`"
              v-slot="{ active, toggle }"
            >
              <v-btn icon color="#BDBDBD" @click="toggle">
                <icon :color="active ? 'info' : ''" :icon="mdiRecord" />
              </v-btn>
            </v-item>
          </v-item-group>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mdiRecord } from '@mdi/js'
/**
 * Pagina de autenticación
 */
export default {
  components: {
    SignIn: () => import('~/components/auth/SignIn'),
    SignUp: () => import('~/components/auth/SignUp'),
    SendPasswordRecovery: () =>
      import('~/components/auth/SendPasswordRecovery'),
    Icon: () => import('~/components/Icon'),
  },
  layout: 'simple',
  data() {
    return {
      mdiRecord,
      length: [
        {
          id: 1,
          img: `https://cdn.hablaqui.cl/static/auth.webp`,
          text: 'Elimine los tiempos de desplazamiento y agendamiento',
        },
        {
          id: 2,
          img: `https://cdn.hablaqui.cl/static/auth-2.webp`,
          text: 'Altos niveles de seguridad para resguardar su información',
        },
        {
          id: 3,
          img: `https://cdn.hablaqui.cl/static/auth-3.webp`,
          text: 'Ahorre dinero mientras recibe una atención de alta calidad',
        },
      ],
      carousel: 0,
      menu: false,
      step: 1,
      fromRoute: '',
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: process.env.VUE_APP_LANDING + '/auth',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `Ingresa o registrate | Hablaquí`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: process.env.VUE_APP_LANDING + '/auth',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Ingresa o registrate | Hablaquí`,
        },
      ],
      link: [
        { rel: 'canonical', href: `https://cdn.hablaqui.cl/static/auth/` },
      ],
    }
  },
  created() {
    // si esta logeado redirige atras
    if (this.$auth.loggedIn) {
      this.$router.go(1)
    }
    // los step sigifican que es login o registro
    if (this.$route.params.q) this.step = 2
    if (this.$route.query.register) this.step = 2
  },
  methods: {
    /**
     * Establecels step login, register
     */
    setStep() {
      if (this.step === 1) this.step = 2
      else this.step = 1
    },
    /**
     * carouel img next
     */
    next() {
      this.carousel = this.carousel + 1 === this.length ? 0 : this.carousel + 1
    },
    /**
     * carouel img prev
     */
    prev() {
      this.carousel =
        this.carousel - 1 < 0 ? this.length - 1 : this.carousel - 1
    },
  },
}
</script>
