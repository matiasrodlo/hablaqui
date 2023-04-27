<template>
  <div style="background-color: #f0f8ff">
    <!-- appbar -->
    <div style="margin-bottom: 83px">
      <Appbar />
    </div>
    <!-- routing for child -->
    <v-container class="mt-10" fluid style="max-width: 1080px">
      <v-row>
        <v-col cols="12">
          <h1
            class="text-left font-weight-bold text-h6 text-md-h4 text--secondary"
          >
            Comunas
          </h1>
          <h2 class="text-h6 font-weight-medium text--secondary">
            Especialistas en Chile por comunas
          </h2>
        </v-col>
      </v-row>
      <template v-if="glossary.length">
        <template v-for="(item, k) in glossary">
          <v-card
            v-if="item && item.comuna.length"
            :key="k"
            outlined
            class="rounded-xl my-4"
          >
            <v-card-title class="text-uppercase">{{ item.key }}</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="primary--text body-1 font-weight-medium">
              <v-row class="hidden-md-and-up">
                <v-col>
                  <div v-for="(el, e) in item.comuna" :key="e">
                    <nuxt-link
                      :to="`/especialistas/${el.comuna.slug}`"
                      style="text-decoration: none"
                    >
                      Especialistas en {{ el.comuna.name }}</nuxt-link
                    >
                  </div>
                </v-col>
              </v-row>
              <v-row class="hidden-sm-and-down">
                <template v-if="item.comuna.length > 1">
                  <v-col>
                    <div
                      v-for="(el, i) in item.comuna.slice(
                        0,
                        item.comuna.length / 2
                      )"
                      :key="i"
                    >
                      <nuxt-link
                        :to="`/especialistas/${el.comuna.slug}`"
                        style="text-decoration: none"
                      >
                        Especialistas en {{ el.comuna.name }}</nuxt-link
                      >
                    </div>
                  </v-col>
                  <v-col>
                    <div
                      v-for="(el, j) in item.comuna.splice(
                        item.comuna.length / 2,
                        item.comuna.length
                      )"
                      :key="j"
                    >
                      <nuxt-link
                        :to="`/especialistas/${el.comuna.slug}`"
                        style="text-decoration: none"
                      >
                        Especialistas en {{ el.comuna.name }}</nuxt-link
                      >
                    </div>
                  </v-col>
                </template>
                <template v-else>
                  <v-col>
                    <div v-for="(el, e) in item.comuna" :key="e">
                      <nuxt-link
                        :to="`/especialistas/${el.comuna.slug}`"
                        style="text-decoration: none"
                      >
                        Especialistas en {{ el.comuna.name }}</nuxt-link
                      >
                    </div>
                  </v-col>
                </template>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
        <v-row>
          <v-col>
            <v-breadcrumbs
              :items="[
                {
                  text: 'Página de inicio',
                  disabled: false,
                  href: '/',
                },
                {
                  text: 'Especialistas',
                  disabled: false,
                  href: '/especialistas',
                },
                {
                  text: 'Ubicación',
                  disabled: true,
                  href: '/especialistas/ubicacion',
                },
              ]"
            >
              <template #item="{ item }">
                <v-breadcrumbs-item
                  :to="item.href"
                  exact
                  exact-path
                  nuxt
                  link
                  replace
                  :disabled="item.disabled"
                >
                  <span class="body-1 font-weight-medium">{{ item.text }}</span>
                </v-breadcrumbs-item>
              </template>
            </v-breadcrumbs>
          </v-col>
        </v-row>
      </template>
      <div v-else style="height: 400px">
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            width="6"
            size="50"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-row>
      </div>
    </v-container>
    <!-- footer -->
    <div style="background-color: #0f3860" class="mt-16">
      <v-container class="white--text py-16" fluid style="max-width: 1080px">
        <v-row>
          <v-col>
            Importante: Los servicios disponibles a través de Hablaquí son
            proporcionados de forma independiente por profesionales en salud
            mental certificados. Hablaquí no proporciona ningún servicio de
            salud mental u otros de atención médica. Los profesionales en salud
            mental no pre-escriben medicamentos a través de Hablaquí. Si estás
            experimentando una crisis o emergencia, por favor comunícate a los
            servicios de emergencia más cercanos a tu localidad.
          </v-col>
        </v-row>
      </v-container>
    </div>
    <Footer />
  </div>
</template>

<script>
export default {
  components: {
    Footer: () => import('~/components/Footer'),
    Appbar: () => import('~/components/AppbarWhite'),
  },
  data() {
    return {
      comunas: [],
      alphabet: [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
      ],
    }
  },
  head() {
    return {
      title: `Ubicaciones de nuestros especialistas | Hablaquí`,
      meta: [
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `Ubicaciones de nuestros especialistas | Hablaquí`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content:
            'Encuentra tu especialista ideal en la ubicación más cercana a ti.',
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: this.$config.VUE_URL + 'especialistas/ubicaciones',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Ubicaciones de nuestros especialistas | Hablaquí`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Encuentra tu especialista ideal en la ubicación más cercana a ti.',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$config.VUE_URL + 'especialistas/ubicaciones',
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
          href: `https://cdn.hablaqui.cl/static/especialistas/ubicaciones`,
        },
      ],
    }
  },
  computed: {
    glossary() {
      if (this.comunas.length)
        return this.alphabet.map((key) => {
          return {
            key,
            comuna: this.comunas.filter(
              (item) => item.comuna.slug.slice(0, 1) === key
            ),
          }
        })
      else return []
    },
  },
  async mounted() {
    const response = await fetch(`${this.$config.VUE_URL}comunas.json`, {
      method: 'get',
    })
    this.comunas = await response.json()
  },
}
</script>
