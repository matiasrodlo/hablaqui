<template>
  <div>
    <Ubicacion :location="comuna" />
  </div>
</template>

<script>
export default {
  name: 'UbicacionSlug',
  components: {
    Ubicacion: () => import('~/components/especialistas/Ubicacion'),
  },
  async asyncData({ params, store, $config, error, payload }) {
    try {
      await store.dispatch('Specialist/getSpecialists')
      if (payload) return { comuna: payload }
      else {
        const response = await fetch(`${this.$config.API_ABSOLUTE}/comunas.json`, {
          method: 'get',
        })
        const comunas = await response.json()
        const item = comunas.find((el) => el.comuna.slug === params.slug)
        return { comuna: item.comuna }
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  head() {
    return {
      title: `Especialistas en ${this.$route.params.slug} | Desde $15.500`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Nuestros especialistas en ${this.$route.params.slug}`,
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: this.$config.VUE_URL + this.$route.params.slug,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `Nuestros especialistas en ${this.$route.params.slug}`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$config.VUE_URL + this.$route.params.slug,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Nuestros especialistas en ${this.$route.params.slug}`,
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
          href: `https://cdn.hablaqui.cl/static/especialistas/${this.$route.params.slug}/`,
        },
      ],
    }
  },
}
</script>
