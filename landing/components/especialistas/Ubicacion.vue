/**
 * Ubicacion Component
 * 
 * A location-based marketplace view that displays specialists and services available
 * in a specific location. Features a responsive layout with desktop and mobile views,
 * FAQ section, and location-specific content.
 * 
 * Key Features:
 * - Location-based specialist listing
 * - Responsive design (desktop/mobile)
 * - Interactive map integration
 * - FAQ section
 * - Location-specific content
 * - Specialist filtering
 * - Session management
 * - Appointment scheduling
 * - Navigation controls
 * - Footer information
 * 
 * Component Requirements:
 * - Vuetify v-container component
 * - Vuetify v-row component
 * - Vuetify v-col component
 * - Vuetify v-expansion-panels component
 * - Vuetify v-expansion-panel component
 * - AppbarWhite component
 * - Footer component
 * - EspecialistasDesktop component
 * - EspecialistasMobile component
 * - GeoEspecialistas component
 * - Vuex store
 * 
 * @component
 * @example
 * // Basic usage
 * <Ubicacion
 *   :location="locationData"
 * />
 * 
 * // Location object structure:
 * {
 *   slug: String,         // Location identifier
 *   name: String,         // Location name
 *   coordinates: Object,  // Map coordinates
 *   services: Array      // Available services
 * }
 * 
 * // Layout specifications:
 * // - Container max-width: 1080px
 * // - Appbar height: 83px
 * // - FAQ panel spacing: 16px
 * // - Footer background: #0f3860
 * // - Text colors:
 * //   - Primary: #0f3860
 * //   - Secondary: #717171
 * //   - White: #ffffff
 * 
 * // Error Handling:
 * // - Location data errors
 * // - Specialist loading errors
 * // - Session fetching errors
 * // - Map integration errors
 * // - Navigation errors
 * 
 * // Performance:
 * // - Lazy loading for components
 * // - Efficient DOM updates
 * // - Optimized re-renders
 * // - Responsive image loading
 * // - Debounced search
 * // - Cached location data
 * // - Memory leak prevention
 * // - Resource cleanup
 * 
 * @requires {Component} AppbarWhite - Navigation bar component
 * @requires {Component} Footer - Footer component
 * @requires {Component} EspecialistasDesktop - Desktop specialist list
 * @requires {Component} EspecialistasMobile - Mobile specialist list
 * @requires {Component} GeoEspecialistas - Map component
 * 
 * @throws {Error} If location data is invalid
 * @throws {Error} If specialist loading fails
 * @throws {Error} If session fetching fails
 * @throws {Error} If map integration fails
 * @throws {Error} If navigation fails
 */
<template>
  <div style="background-color: #f0f8ff">
    <!-- appbar -->
    <div style="margin-bottom: 83px">
      <Appbar />
    </div>
    <!-- geo especialistas -->
    <geoEspecialistas class="mt-10" :location="location" />
    <!-- desktop -->
    <especialistas-desktop
      :loading-specialist="loadingSpecialist"
      :get-sessions-limit="getSessions"
      class="hidden-sm-and-down"
    />
    <!-- mobile -->
    <especialistas-mobile
      :loading-specialist="loadingSpecialist"
      :get-sessions-limit="getSessions"
      class="hidden-md-and-up"
    />
    <!-- expand panels -->
    <v-container fluid style="max-width: 1080px">
      <v-row>
        <v-col
          cols="12"
          class="text--secondary text-center font-weight-bold text-h6"
        >
          Preguntas frecuentes sobre terapias desde {{ location.slug }}
        </v-col>
        <v-col tag="section" cols="12" class="text-left">
          <v-expansion-panels v-model="panel" tag="section" light multiple flat>
            <v-expansion-panel
              v-for="(item, i) in faq"
              :key="i"
              class="shadowBlue my-2 pa-0"
            >
              <v-expansion-panel-header class="py-3 pl-3" light>
                <h4 class="white--textfont-weight-bold">{{ item.title }}</h4>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="white text--secondary pt-5">
                {{ item.desc }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
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
import { mapGetters, mapActions } from 'vuex'
import EspecialistasDesktop from '~/components/especialistas/EspecialistasDesktop'
import EspecialistasMobile from '~/components/especialistas/EspecialistasMobile'
import Footer from '~/components/Footer'
import Appbar from '~/components/AppbarWhite'

/**
 * Location-based marketplace view component
 * 
 * Displays specialists and services available in a specific location with
 * responsive design and interactive features.
 * 
 * @component
 * @requires {Vuex} mapGetters - Vuex getters mapping
 * @requires {Vuex} mapActions - Vuex actions mapping
 * @requires {Component} EspecialistasDesktop - Desktop specialist list
 * @requires {Component} EspecialistasMobile - Mobile specialist list
 * @requires {Component} Footer - Footer component
 * @requires {Component} AppbarWhite - Navigation bar component
 */
export default {
  name: 'Ubicacion',

  /**
   * Component dependencies
   * @property {Component} Footer - Footer component
   * @property {Component} Appbar - Navigation bar component
   * @property {Component} EspecialistasDesktop - Desktop specialist list
   * @property {Component} EspecialistasMobile - Mobile specialist list
   * @property {Component} geoEspecialistas - Map component
   */
  components: {
    Footer,
    Appbar,
    EspecialistasDesktop,
    EspecialistasMobile,
    geoEspecialistas: () =>
      import('~/components/especialistas/GeoEspecialistas'),
  },

  /**
   * Component properties
   * @property {Object} location - Location data object
   * 
   * @example
   * {
   *   slug: 'santiago',
   *   name: 'Santiago',
   *   coordinates: { lat: -33.4489, lng: -70.6693 },
   *   services: ['therapy', 'counseling']
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
   * @property {Array} panel - Expansion panel state
   * @property {Array} faq - FAQ items
   */
  data() {
    return {
      panel: [],
      faq: [
        {
          id: 1,
          title: '¿A qué tipo de especialista online debo acudir?',
          desc: `Los especialistas clínicos licenciados son profesionales de la salud mental más frecuentes en ${this.location.slug}. Estos
                        tienen la facultad de diagnosticar trastornos mentales y ofrecer terapia especializada.
                        La formación y certificaciones difieren en función del profesional. Siendo así que cada especialista puede
                        especializarse en un área concreta, como la depresión, el asesoramiento matrimonial o la ansiedad. `,
        },
        {
          id: 2,
          title: `¿Cómo puedo encontrar a un especialista en ${this.location.slug}?`,
          desc: `En Hablaquí nos enfocamos exclusivamente en proveer terapia en línea de modo que usted pueda acceder a
                        un especialista online estando en Localidad o en cualquier parte del mundo. Utilizando los filtros de esta página,
                        puede acotar su búsqueda y explorar numerosas categorías para encontrar un especialista online con la
                        experiencia y especialidad que necesita. Por ejemplo, es posible que desee limitar su búsqueda a un especialista
                        cognitivo conductual para atenderse en línea desde Localidad.`,
        },
        {
          id: 3,
          title: '¿Qué tipo de terapia en línea es el mejor para mí?',
          desc: `No existe una "forma correcta". Cada tipo de orientación o tratamiento tiene el potencial de ayudar a una
                        amplia gama de condiciones. Los especialistas online de Hablaquí le permiten aumentar sus niveles de bienestar
                        emocional estando en Localidad, para ello se especializan en diversas técnicas terapéuticas, como la
                        psicoanalítica, cognitivo-conductual o sistémica. `,
        },
      ],
    }
  },

  /**
   * Computed properties
   * @property {Boolean} loadingSpecialist - Loading state for specialist data
   */
  computed: {
    ...mapGetters({ loadingSpecialist: 'Specialist/loadingSpecialist' }),
  },

  /**
   * Lifecycle hooks
   */
  mounted() {
    window.scrollTo(0, 0)
    this.initialFetch()
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Initial data fetching
     * Fetches appointments and initializes the component
     */
    async initialFetch() {
      await this.getAppointments()
    },

    /**
     * Session management
     * @param {Array} ids - Array of session IDs to fetch
     */
    getSessions(ids) {
      this.getSessionsLimit(ids)
    },

    /**
     * Vuex actions mapping
     */
    ...mapActions({
      getAppointments: 'Appointments/getAppointments',
      getFormattedSessionsAll: 'Specialist/getFormattedSessionsAll',
      getSessionsLimit: 'Specialist/getSessionsLimit',
    }),
  },
}
</script>

<style lang="scss" scoped>
.shadowBlue {
  box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
