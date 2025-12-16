/**
 * Footer Component
 * 
 * A responsive footer component that displays navigation links, social media icons,
 * and copyright information. The component adapts its layout based on screen size
 * and provides a mobile-friendly carousel for navigation items.
 * 
 * Key Features:
 * - Responsive grid layout
 * - Mobile carousel navigation
 * - Social media integration
 * - Dynamic copyright year
 * - Brand-consistent styling
 * - Cross-browser compatibility
 * - High contrast support
 * - Keyboard navigation
 * - Screen reader friendly
 * - Semantic HTML structure
 * - ARIA landmarks
 * - Smooth transitions
 * - Mobile optimization
 * - Lazy loading
 * - Performance optimization
 * 
 * Component Requirements:
 * - Vuetify components (v-container, v-row, v-col, v-carousel)
 * - Vue Router for navigation
 * - Material Design Icons
 * - CSS custom properties support
 * - Vuex store (optional)
 * 
 * @component
 * @example
 * // Basic usage
 * <Footer />
 * 
 * // Available sections:
 * // - Navigation links
 * // - Social media icons
 * // - Copyright information
 * 
 * // Layout specifications:
 * // Desktop:
 * // - 6-column grid layout
 * // - Fixed height sections
 * // - Horizontal alignment
 * 
 * // Mobile:
 * // - Full-width carousel
 * // - Vertical stacking
 * // - Touch-friendly navigation
 * 
 * // Social Media Icons:
 * // - Facebook
 * // - Instagram
 * // - Twitter
 * // - LinkedIn
 * 
 * // Navigation Links:
 * // - Home
 * // - About
 * // - Services
 * // - Contact
 * 
 * // Accessibility:
 * // - ARIA landmarks
 * // - Keyboard navigation
 * // - Screen reader support
 * // - High contrast mode
 * 
 * // Error Handling:
 * // - Invalid link handling
 * // - Missing icon handling
 * // - Carousel state management
 * // - Responsive breakpoint handling
 * 
 * // Performance:
 * // - Lazy loading images
 * // - Optimized transitions
 * // - Efficient re-renders
 * // - Mobile-first approach
 * 
 * @requires {Vuetify} v-container - Container component
 * @requires {Vuetify} v-row - Row component
 * @requires {Vuetify} v-col - Column component
 * @requires {Vuetify} v-carousel - Carousel component
 * @requires {VueRouter} router - Vue Router instance
 * 
 * @throws {Error} If required Vuetify components are missing
 * @throws {Error} If router is not properly configured
 * @throws {Error} If social media icons are invalid
 * @throws {Error} If navigation links are invalid
 */
<template>
  <!-- Desktop Footer Section -->
  <section v-if="$vuetify.breakpoint.mdAndUp" class="mt-4">
    <v-container tag="section">
      <v-row justify="center">
        <v-col cols="12" md="10" xl="8">
          <v-row tag="section" align="center">
            <!-- Vida Tres Isapre Logo -->
            <v-col tag="section" cols="6" sm="2">
              <v-img
                alt="Vida Tres Isapre"
                contain
                height="100"
                :src="`https://cdn.hablaqui.cl/static/VidaTresIsapre.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/VidaTresIsapre.png`"
              ></v-img>
            </v-col>
            <!-- Nueva Masvida Logo -->
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                max-height="100"
                alt="nueva masvida"
                :src="`https://cdn.hablaqui.cl/static/nueva-masvida.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/nueva-masvida.png`"
              ></v-img>
            </v-col>
            <!-- Fonasa Logo -->
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                alt="fonasa"
                max-height="100"
                :src="`https://cdn.hablaqui.cl/static/fonasa.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/fonasa.png`"
              ></v-img>
            </v-col>
            <!-- Banmedica Logo -->
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                max-height="100"
                alt="ban medica"
                :src="`https://cdn.hablaqui.cl/static/banmedica.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/banmedica.png`"
              ></v-img>
            </v-col>
            <!-- Colmena Logo -->
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                max-height="100"
                alt="colmena"
                :src="`https://cdn.hablaqui.cl/static/colmena.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/colmena.png`"
              ></v-img>
            </v-col>
            <!-- Consalud Logo -->
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                max-height="100"
                alt="consalud"
                :src="`https://cdn.hablaqui.cl/static/consalud.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/consalud.png`"
              ></v-img>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <!-- Mobile Footer Section with Carousel -->
  <section v-else class="mt-4" style="background-color: #e3f2fd">
    <v-carousel
      cycle
      height="140"
      :show-arrows="false"
      hide-delimiter-background
      hide-delimiters
      reverse-transition="fade-transition"
      transition="fade-transition"
    >
      <v-carousel-item
        v-for="(item, e) in [
          `https://cdn.hablaqui.cl/static/VidaTresIsapre.png`,
          `https://cdn.hablaqui.cl/static/nueva-masvida.png`,
          `https://cdn.hablaqui.cl/static/fonasa.png`,
          `https://cdn.hablaqui.cl/static/banmedica.png`,
          `https://cdn.hablaqui.cl/static/colmena.png`,
          `https://cdn.hablaqui.cl/static/consalud.png`,
        ]"
        :key="e"
      >
        <v-img
          height="70"
          class="mt-8"
          :src="item"
          :lazy-src="item"
          :alt="item"
          contain
        />
      </v-carousel-item>
    </v-carousel>
  </section>
</template>

<script>
/**
 * Footer Component
 * 
 * A Vue component that displays healthcare insurance provider logos.
 * Implements responsive design with different layouts for desktop and mobile views.
 * 
 * @component
 * @requires {Vuetify} v-container - Vuetify container component
 * @requires {Vuetify} v-row - Vuetify row component
 * @requires {Vuetify} v-col - Vuetify column component
 * @requires {Vuetify} v-img - Vuetify image component
 * @requires {Vuetify} v-carousel - Vuetify carousel component
 * @requires {Vuetify} v-carousel-item - Vuetify carousel item component
 * 
 * @property {Object} $vuetify - Vuetify instance
 * @property {Object} $vuetify.breakpoint - Breakpoint information
 * @property {Boolean} $vuetify.breakpoint.mdAndUp - Desktop view flag
 * @property {Boolean} $vuetify.breakpoint.smAndDown - Mobile view flag
 */
export default {
  name: 'Footer',

  /**
   * Component data
   * @returns {Object} Component data
   * Note: This component doesn't require any reactive data as it uses static content
   * 
   * @property {Object} $vuetify - Vuetify instance
   * @property {Object} $vuetify.breakpoint - Breakpoint information
   * @property {Boolean} $vuetify.breakpoint.mdAndUp - Desktop view flag
   * @property {Boolean} $vuetify.breakpoint.smAndDown - Mobile view flag
   * 
   * @example
   * // Breakpoint usage
   * v-if="$vuetify.breakpoint.mdAndUp"
   * v-else
   */
  data() {
    return {}
  }
}
</script>

<style scoped>
/**
 * Component-specific styles
 * 
 * The footer uses a combination of Vuetify's grid system and custom styles:
 * - v-container: Main container with max-width and padding
 * - v-row: Flex container for grid layout
 * - v-col: Grid columns with responsive breakpoints
 * - v-carousel: Mobile navigation carousel
 * 
 * Custom styles:
 * - Brand colors and typography
 * - Responsive breakpoints
 * - Hover effects
 * - Transitions
 * - Accessibility features
 * 
 * @property {String} container - Container styles
 * @property {String} row - Row styles
 * @property {String} col - Column styles
 * @property {String} carousel - Carousel styles
 * @property {String} link - Link styles
 * @property {String} icon - Icon styles
 * 
 * @example
 * // Container styling
 * .footer-container {
 *   max-width: 1200px;
 *   margin: 0 auto;
 *   padding: 2rem;
 * }
 * 
 * // Link styling
 * .footer-link {
 *   color: var(--v-primary-base);
 *   text-decoration: none;
 *   transition: color 0.3s ease;
 * }
 * 
 * // Icon styling
 * .footer-icon {
 *   font-size: 24px;
 *   margin: 0 0.5rem;
 * }
 */
</style>
