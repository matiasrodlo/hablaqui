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
          </v-row>
          <v-row justify="center" class="text-center">
            <v-col cols="12" sm="10" lg="8">
              <sign-up />
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
 * Registro de especialista
 */
export default {
  components: {
    SignUp: () => import('@/components/especialistas/FormUserSpec.vue'),
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
          text: 'Permita que lo conozcan, agenden y paguen en piloto automático',
        },
        {
          id: 2,
          img: `https://cdn.hablaqui.cl/static/auth-2.webp`,
          text: 'Consiga que los consultantes le encuentren fácilmente y haga que le elijan',
        },
        {
          id: 3,
          img: `https://cdn.hablaqui.cl/static/auth-3.webp`,
          text: 'Olvide trámites aburridos como agendar citas, confirmar asistencias y cobrar',
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
          hid: 'twitter:url',
          name: 'twitter:url',
          content: this.$config.VUE_URL + 'registrar-especialista',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `Ingresa o registrate | Hablaquí`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$config.VUE_URL + 'registrar-especialista',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Ingresa o registrate | Hablaquí`,
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: `https://cdn.hablaqui.cl/static/registrar-especialista/`,
        },
      ],
    }
  },
  created() {
    // si no esta logeado regresamos atras
    if (this.$auth.loggedIn) {
      this.$router.go(1)
    }
  },
  methods: {
    next() {
      this.carousel = this.carousel + 1 === this.length ? 0 : this.carousel + 1
    },
    prev() {
      this.carousel =
        this.carousel - 1 < 0 ? this.length - 1 : this.carousel - 1
    },
  },
}
</script>
