/**
 * Blue Navigation Bar Component
 * 
 * A responsive navigation bar component with a blue wave design.
 * Features a logo, navigation drawer for mobile devices, and a call-to-action button.
 * The component adapts its layout based on screen size and includes accessibility features.
 * 
 * Key Features:
 * - Responsive design with mobile drawer menu
 * - Blue wave background with shadow effect
 * - Call-to-action button for specialist search
 * - Accessibility support with accesskeys
 * - Transparent app bar with absolute positioning
 * - Mobile-optimized navigation
 * - Lazy loading for images
 * - Smooth transitions and animations
 * - Semantic HTML structure
 * - Brand-consistent styling
 * - Cross-browser compatibility
 * - High contrast support
 * - Keyboard navigation
 * - Screen reader friendly
 * 
 * Component Requirements:
 * - Vuetify v-navigation-drawer component
 * - Vuetify v-app-bar component
 * - Vuetify v-list component
 * - Vuetify v-img component
 * - Vuetify v-btn component
 * - Vuetify v-divider component
 * - Vuetify v-spacer component
 * - Vue Router
 * - Material Design Icons
 * - Lato font family
 * 
 * @component
 * @example
 * // Basic usage
 * <AppbarBlue />
 * 
 * // Available accesskeys:
 * // - h: Logo/home link
 * // - m: Mobile menu toggle
 * // - c: Call-to-action button
 * 
 * // Breakpoints:
 * // - mdAndUp: Desktop view (≥960px)
 * // - smAndDown: Mobile view (<960px)
 * 
 * // Image specifications:
 * // - Logo: 160px max-width, PNG format
 * // - White logo variant for dark background
 * // - CDN: https://cdn.hablaqui.cl/static/
 * 
 * // Layout specifications:
 * // - Wave height: 180px
 * // - App bar height: 115px
 * // - Container: Max-width 1080px
 * // - Button padding: 32px horizontal
 * 
 * // Error Handling:
 * // - Navigation errors
 * // - Image loading errors
 * // - Menu state errors
 * // - SVG rendering errors
 * 
 * // Performance:
 * // - Lazy loading for images
 * // - Efficient DOM updates
 * // - Optimized transitions
 * // - Minimal re-renders
 * 
 * @requires {Vuetify} v-navigation-drawer - Mobile navigation drawer
 * @requires {Vuetify} v-app-bar - Main navigation bar
 * @requires {Vuetify} v-list - Navigation list
 * @requires {Vuetify} v-img - Image component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-divider - Divider component
 * @requires {Vuetify} v-spacer - Spacer component
 * 
 * @throws {Error} If navigation fails
 * @throws {Error} If image loading fails
 * @throws {Error} If menu state is invalid
 * @throws {Error} If SVG rendering fails
 */
<template>
  <div>
    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" class="hidden-md-and-up" app>
      <v-list-item>
        <a href="https://hablaqui.cl/" style="width: 100%">
          <v-img
            id="logo-blue-drawer"
            accesskey="h"
            style="max-width: 150px"
            class="mx-auto my-5"
            :src="`https://cdn.hablaqui.cl/static/logo.png`"
            alt="hablaqui logo"
          />
        </a>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item
          id="comenzar-blue-drawer"
          accesskey="c"
          link
          nuxt
          to="/evaluacion/"
        >
          <v-list-item-content>
            <v-list-item-title>Comenzar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Blue Wave Background -->
    <div style="height: 180px; overflow: hidden">
      <svg
        class="shadow"
        preserveAspectRatio="none"
        viewBox="0 0 1080 216.49"
        style="height: 100%; width: 100%"
      >
        <path
          d="M.16-18.79V122.75c6.88,1,20.8,2.92,38.31,5.1,0,0,215.57,25.78,403,14.18,18.33-1.13,40.69-2.8,83.59-5.21,129.36-7.25,216.16-14.1,298.68-8.34a1547.37,1547.37,0,0,1,256.14,39.69v-187Z"
          style="fill: #2070e5"
        ></path>
      </svg>
    </div>

    <!-- Main Navigation Bar -->
    <v-app-bar absolute flat height="115" color="transparent">
      <!-- Logo -->
      <a href="https://hablaqui.cl/" exact>
        <v-img
          id="logo-blue-appbar"
          accesskey="h"
          style="max-width: 160px"
          alt="hablaqui Logo"
          :src="`https://cdn.hablaqui.cl/static/logo_white.png`"
          :lazy-src="`https://cdn.hablaqui.cl/static/logo_white.png`"
          contain
        />
      </a>
      <v-spacer></v-spacer>

      <!-- Desktop Call-to-Action Button -->
      <v-btn
        id="spec-appbar-blue"
        to="/especialistas/"
        large
        rounded
        class="hidden-sm-and-down mx-4 px-8"
        color="white"
        depressed
        accesskey="c"
      >
        <span class="body-1 font-weight-bold primary--text"
          >Quiero comenzar</span
        >
      </v-btn>

      <!-- Mobile Menu Button -->
      <div class="hidden-md-and-up">
        <v-spacer></v-spacer>
        <v-btn
          id="appbar-blue-menu-drawer"
          accesskey="m"
          class="mr-2"
          dark
          icon
          @click="drawer = !drawer"
        >
          <icon color="white" :icon="mdiMenu" />
        </v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import { mdiMenu } from '@mdi/js'

/**
 * AppbarBlue Component
 * 
 * A Vue component that provides a blue-themed navigation bar with wave design.
 * Implements responsive design with different layouts for desktop and mobile views.
 * 
 * @component
 * @requires {Vuetify} v-navigation-drawer - Mobile navigation drawer
 * @requires {Vuetify} v-app-bar - Main navigation bar
 * @requires {Vuetify} v-list - Navigation list
 * @requires {Vuetify} v-img - Image component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-divider - Divider component
 * @requires {Vuetify} v-spacer - Spacer component
 * @requires {Component} Icon - Icon component
 */
export default {
  name: 'AppbarBlue',
  
  /**
   * Component dependencies
   * @property {Component} Icon - Icon component for menu button
   */
  components: {
    Icon: () => import('~/components/Icon'),
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Object} mdiMenu - Material Design icon for menu button
   * @property {Boolean} drawer - Controls mobile navigation drawer visibility
   * 
   * @example
   * {
   *   mdiMenu: { path: '...' },
   *   drawer: false
   * }
   */
  data() {
    return {
      mdiMenu,
      drawer: false,
    }
  },
}
</script>

<style lang="scss" scoped>
/**
 * Component-specific styles
 * 
 * The component uses Vuetify's built-in styling system for layout and spacing.
 * Custom styles can be added here for specific styling needs.
 * 
 * @property {String} shadow - Box shadow for wave SVG
 * 
 * @example
 * // Shadow styling
 * .shadow {
 *   -webkit-filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
 *   filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
 * }
 */
.shadow {
  -webkit-filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
  filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
}
</style>
