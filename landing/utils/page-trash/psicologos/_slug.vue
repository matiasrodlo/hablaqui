/**
 * Location-based Specialist Page Component
 * 
 * This component displays specialists based on their location (comuna).
 * It fetches location data and renders the Ubicacion component with the appropriate data.
 * 
 * @module utils/page-trash/psicologos/_slug
 */

<template>
  <div>
    <Ubicacion :location="comuna" />
  </div>
</template>

<script>
/**
 * Location-based Specialist Page Component
 * 
 * @component UbicacionSlug
 * @description Displays specialists for a specific location (comuna)
 * 
 * @property {Object} comuna - Location data for the current page
 * 
 * @example
 * // Access via URL: /psicologos/[comuna-slug]
 * // Example: /psicologos/santiago
 */
export default {
  name: 'UbicacionSlug',
  components: {
    Ubicacion: () => import('~/components/especialistas/Ubicacion'),
  },
  /**
   * Fetches location data and specialist information
   * 
   * @param {Object} context - Nuxt context object
   * @param {Object} context.params - Route parameters
   * @param {Object} context.store - Vuex store
   * @param {Object} context.$config - Nuxt config
   * @param {Function} context.error - Error handler
   * @param {Object} context.payload - Server-side payload
   * @returns {Promise<Object>} Component data
   */
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
  /**
   * Generates meta information for SEO
   * 
   * @returns {Object} Meta information for the page
   */
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
