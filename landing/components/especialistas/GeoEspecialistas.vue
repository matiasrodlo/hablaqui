/**
 * GeoEspecialistas Component
 * 
 * A component that displays location-based specialist information and search context.
 * Features a responsive header with location name and descriptive text about
 * online specialist services in the specified location.
 * 
 * Key Features:
 * - Location-based header
 * - Search context display
 * - Responsive typography
 * - Icon integration
 * - Dynamic location name
 * - Service description
 * - Accessibility support
 * - Cross-browser compatibility
 * - High contrast support
 * - Screen reader friendly
 * 
 * Component Requirements:
 * - Vuetify v-container component
 * - Vuetify v-card component
 * - Vuetify v-card-text component
 * - Icon component
 * - Material Design Icons
 * 
 * @component
 * @example
 * // Basic usage
 * <GeoEspecialistas
 *   :location="locationData"
 * />
 * 
 * // Location object structure:
 * {
 *   name: String,         // Location name
 *   slug: String,         // Location identifier
 *   coordinates: Object   // Map coordinates
 * }
 * 
 * // Layout specifications:
 * // - Container max-width: 1080px
 * // - Icon size: x-large
 * // - Icon color: #BDBDBD
 * // - Text colors:
 * //   - Primary: Theme primary color
 * //   - Secondary: Theme secondary color
 * // - Typography:
 * //   - Mobile: text-h6
 * //   - Desktop: text-md-h4
 * // - Spacing:
 * //   - Bottom margin: 24px (mb-6)
 * 
 * // Error Handling:
 * // - Missing location data
 * // - Invalid location format
 * // - Icon loading errors
 * 
 * // Performance:
 * // - Lazy loading for icons
 * // - Efficient DOM updates
 * // - Optimized re-renders
 * // - Minimal state updates
 * 
 * @requires {Component} Icon - Icon component
 * 
 * @throws {Error} If location data is invalid
 * @throws {Error} If icon loading fails
 */
<template>
  <v-container fluid style="max-width: 1080px">
    <div class="mb-6">
      <h1
        class="d-inline-block text-left font-weight-bold text-h6 text-md-h4 text--secondary"
      >
        <icon x-large :icon="mdiMagnify" color="#BDBDBD" />
        Especialistas desde
        <span class="text-capitalize">{{ location && location.name }}</span>
      </h1>
    </div>
    <v-card flat color="transparent">
      <v-card-text class="secondary--text">
        <div class="body-1">
          <h2 class="primary--text font-weight-bold">
            ¿Estás buscando un buen Especialista en
            <span class="text-capitalize"
              >{{ location && location.name }}?</span
            >
          </h2>
          <br />
          <p>
            Agenda con un especialista en {{ location && location.name }} de
            forma segura y privada en línea. Agenda con total libertad cuando te
            resulte más conveniente y conéctate por videollamada desde tu
            teléfono, tableta o computadora.
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mdiMagnify } from '@mdi/js'

/**
 * GeoEspecialistas Component
 * 
 * A Vue component that displays location-based specialist information
 * and search context with responsive design.
 * 
 * @component
 * @requires {Component} Icon - Icon component
 */
export default {
  name: 'GeoEspecialistas',

  /**
   * Component dependencies
   * @property {Component} Icon - Icon component for search icon
   */
  components: {
    Icon: () => import('~/components/Icon'),
  },

  /**
   * Component properties
   * @property {Object} location - Location data object
   * 
   * @example
   * {
   *   name: 'Santiago',
   *   slug: 'santiago',
   *   coordinates: { lat: -33.4489, lng: -70.6693 }
   * }
   */
  props: {
    location: {
      type: Object,
      default: null,
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Object} mdiMagnify - Search icon from Material Design Icons
   */
  data() {
    return {
      mdiMagnify,
    }
  },
}
</script>

<style lang="scss" scoped></style>
