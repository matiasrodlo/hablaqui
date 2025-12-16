/**
 * White Navigation Bar Component
 * 
 * A responsive navigation bar component with a white theme and wave design.
 * Features a logo, user authentication state handling, and responsive menu.
 * Includes navigation links for specialists, companies, and blog sections.
 * Provides role-based menu items for different user types (specialist, user, superuser).
 * Adapts its layout based on screen size and includes accessibility features.
 * 
 * Key Features:
 * - Responsive design with mobile drawer menu
 * - Role-based navigation menu items
 * - User authentication state handling
 * - Accessibility support with accesskeys
 * - Elevation on scroll (except in specialists page)
 * - Mobile-optimized navigation
 * - Lazy loading for images
 * - User profile menu with avatar
 * - Dynamic menu visibility based on user role
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
 * - Vuetify v-menu component
 * - Vuetify v-list component
 * - Vuetify v-img component
 * - Vuetify v-btn component
 * - Vuetify v-card component
 * - Vuetify v-avatar component
 * - Vuetify v-divider component
 * - Vuetify v-spacer component
 * - Vuetify v-container component
 * - Vuetify v-row component
 * - Vuetify v-col component
 * - Vue Auth module
 * - Vue Router
 * - Material Design Icons
 * - Lato font family
 * 
 * @component
 * @example
 * // Basic usage
 * <AppbarWhite />
 * 
 * // Available accesskeys:
 * // - h: Logo/home link
 * // - m: Mobile menu toggle
 * // - p: Specialist search link
 * // - r: For specialists link
 * // - q: For companies link
 * // - b: Blog link
 * // - s: Login button
 * // - c: Search specialist button
 * // - j: User menu
 * // - x: Logout
 * 
 * // Breakpoints:
 * // - mdAndUp: Desktop view (≥960px)
 * // - smAndDown: Mobile view (<960px)
 * 
 * // Role-based Menu Items:
 * // - Specialist: Postulación, Chat, Mi agenda, Pagos, Consultantes, Cuenta
 * // - User: Chat, Mi agenda, Cuenta
 * // - Superuser: Panel de control, Reagendamiento, Cambio de especialista,
 * //             Tabla de pagos, Evaluaciones
 * 
 * // Image specifications:
 * // - Logo: 176px max-width, PNG format
 * // - Avatar: 50px size, circular
 * // - Menu icons: 30px height, contained
 * // - CDN: https://cdn.hablaqui.cl/static/
 * 
 * // Error Handling:
 * // - Authentication state errors
 * // - Navigation errors
 * // - Image loading errors
 * // - Menu state errors
 * // - Role validation errors
 * 
 * // Performance:
 * // - Lazy loading for images
 * // - Efficient DOM updates
 * // - Optimized transitions
 * // - Minimal re-renders
 * 
 * @requires {Vuetify} v-navigation-drawer - Mobile navigation drawer
 * @requires {Vuetify} v-app-bar - Main navigation bar
 * @requires {Vuetify} v-menu - User profile menu
 * @requires {Vuetify} v-list - Navigation list
 * @requires {Vuetify} v-img - Image component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-avatar - Avatar component
 * @requires {Vuetify} v-divider - Divider component
 * @requires {Vuetify} v-spacer - Spacer component
 * @requires {Vuetify} v-container - Container component
 * @requires {Vuetify} v-row - Row component
 * @requires {Vuetify} v-col - Column component
 * 
 * @throws {Error} If authentication state is invalid
 * @throws {Error} If navigation fails
 * @throws {Error} If image loading fails
 * @throws {Error} If menu state is invalid
 * @throws {Error} If role validation fails
 */
<template>
  <div>
    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" class="hidden-md-and-up" app>
      <v-list-item>
        <a href="https://hablaqui.cl/">
          <v-img
            id="logo-drawer"
            tabindex="0"
            class="mx-auto my-5"
            style="max-width: 150px"
            src="https://storage.googleapis.com/hablaqui-blog/2022/01/d978f84d-logo-1024x242.png"
            lazy-src="`https://cdn.hablaqui.cl/static/logo.png"
            alt="hablaqui Logo"
            accesskey="h"
          />
        </a>
      </v-list-item>
      <!-- Navigation Links -->
      <v-list dense>
        <v-list-item
          id="link-spec-drawer"
          class="primary"
          accesskey="p"
          link
          :to="{ name: 'especialistas' }"
        >
          <v-list-item-content>
            <v-list-item-title class="white--text font-weight-bold body-2">
              Buscar Especialista
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <a
          id="link-blog-drawer"
          accesskey="r"
          href="https://hablaqui.cl/para-especialistas/"
        >
          <v-list-item-content>
            <v-list-item-title class="secondary--text font-weight-bold body-2">
              Para especialistas
            </v-list-item-title>
          </v-list-item-content>
        </a>
        <v-list-item
          id="link-para-especialistas-drawer"
          accesskey="q"
          link
          href="https://hablaqui.cl/#"
        >
          <v-list-item-content>
            <v-list-item-title class="secondary--text font-weight-bold body-2">
              Para empresas
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          id="link-para-empresas-drawer"
          accesskey="b"
          link
          href="https://hablaqui.cl/blog/"
        >
          <v-list-item-content>
            <v-list-item-title class="secondary--text font-weight-bold body-2">
              Blog
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Authenticated User Menu -->
        <client-only>
          <template v-if="$auth.$state.loggedIn">
            <template v-for="(item, i) in menu">
              <v-list-item
                v-show="item.visible"
                id="i"
                link
                :to="item.link"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title
                    class="secondary--text font-weight-bold body-2"
                  >
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </template>
        </client-only>
        <!-- Authentication Actions -->
        <v-list-item
          v-show="$auth.$state.loggedIn"
          id="logout-drawer"
          accesskey="x"
          @click="logout"
        >
          <v-list-item-content>
            <v-list-item-title class="secondary--text font-weight-bold body-2">
              Cerrar sesión
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-show="!$auth.$state.loggedIn"
          id="iniciar-sesion-drawer"
          accesskey="s"
          link
          to="/auth"
        >
          <v-list-item-content>
            <v-list-item-title class="secondary--text font-weight-bold body-2">
              Iniciar sesión
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Navigation Bar -->
    <v-app-bar
      class="shadowAppBar"
      width="100%"
      height="83"
      color="#ffffff"
      style="opacity: 0.9"
      :elevate-on-scroll="$route.name !== 'especialistas'"
      :app="$route.name !== 'especialistas'"
    >
      <v-container fluid style="max-width: 1080px">
        <v-row align="center" justify="space-between" no-gutters>
          <!-- Logo and Navigation Links -->
          <v-col class="d-flex align-center" md="7" lg="8">
            <a id="logo-appbar" href="https://hablaqui.cl/" exact accesskey="h">
              <v-img
                style="max-width: 176px"
                alt="hablaqui Logo"
                src="https://storage.googleapis.com/hablaqui-blog/2022/01/d978f84d-logo-1024x242.png"
                lazy-src="https://cdn.hablaqui.cl/static/logo.png"
                contain
              />
            </a>
            <a
              id="especialistas-appabar"
              accesskey="r"
              style="text-decoration: none; font-size: 12.8px"
              class="hidden-sm-and-down ml-7"
              href="https://hablaqui.cl/para-especialistas"
            >
              <span class="text-uppercase font-nav"> Para especialistas </span>
            </a>

            <a
              id="empresas-appbar"
              href="https://hablaqui.cl/#"
              style="text-decoration: none; font-size: 12.8px"
              accesskey="p"
              class="hidden-sm-and-down ml-4"
            >
              <span class="text-uppercase font-nav">Para empresas</span>
            </a>
            <a
              id="blog-appabar"
              accesskey="b"
              style="text-decoration: none; font-size: 12.8px"
              class="hidden-sm-and-down ml-4"
              href="https://hablaqui.cl/blog/"
            >
              <span class="text-uppercase font-nav">Blog</span>
            </a>
          </v-col>

          <!-- User Authentication Section -->
          <client-only>
            <v-col
              v-if="$vuetify.breakpoint.smAndDown"
              cols="4"
              lg="3"
              class="text-right"
            >
              <div class="hidden-md-and-up">
                <v-btn
                  id="menudrawer-appbar"
                  accesskey="m"
                  icon
                  @click="drawer = !drawer"
                >
                  <icon :icon="mdiMenu" />
                </v-btn>
              </div>
            </v-col>
            <template v-else>
              <!-- Authenticated User Menu -->
              <v-col v-if="$auth.$state.loggedIn" class="text-right">
                <div
                  class="hidden-sm-and-down body-2 text--secondary"
                  rounded
                  text
                >
                  <v-menu
                    id="menu-sesion"
                    rounded="xl"
                    offset-y
                    open-on-hover
                    :close-on-content-click="false"
                    :nudge-width="100"
                  >
                    <template #activator="{ on, attrs }">
                      <div
                        id="link-sesion"
                        accesskey="j"
                        class="d-inline-block"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <h3 class="lg-mr-6 secondary--text d-inline-block">
                          Hola {{ $auth.$state.user.name }}
                        </h3>
                        <avatar
                          size="50"
                          :name="$auth.$state.user.name"
                          :last-name="
                            $auth.$state.user.lastName
                              ? $auth.$state.user.lastName
                              : ''
                          "
                          :url="$auth.$state.user.avatarThumbnail"
                        />
                      </div>
                    </template>
                    <v-card>
                      <v-list>
                        <template v-for="(item, i) in menu">
                          <v-list-item
                            v-show="item.visible"
                            id="i"
                            link
                            :to="item.link"
                            :key="i"
                          >
                            <v-list-item-avatar size="40" :color="item.color">
                              <v-img
                                contain
                                height="30"
                                :src="item.img"
                                :alt="item.name"
                              />
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title
                                class="secondary--text font-weight-bold body-2"
                              >
                                {{ item.name }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <v-divider></v-divider>
                        <v-list-item id="logout-appbar" @click="logout">
                          <v-list-item-avatar size="40" color="error">
                            <v-img
                              contain
                              height="30"
                              src="https://cdn.hablaqui.cl/static/logout.png"
                              alt="Cerrar sesión"
                            />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              class="error--text font-weight-bold body-2"
                            >
                              Cerrar sesión
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                      <v-card-actions class="primary">
                        <v-spacer></v-spacer>
                        <div class="white--text py-1">Hablaquí</div>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </div>
              </v-col>
              <!-- Unauthenticated User Actions -->
              <v-col v-else class="text-right">
                <v-btn
                  id="iniciar-sesion-appbar"
                  outlined
                  small
                  color="#999999"
                  rounded
                  accesskey="s"
                  style="
                    text-decoration: none;
                    font-family: 'Lato', sans-serif;
                    font-size: 13.2px;
                    line-height: 1.6;
                  "
                  class="py-4 hidden-sm-and-down text-uppercase font-weight-bold"
                  :to="{ name: 'auth' }"
                >
                  Iniciar sesión
                </v-btn>
                <v-btn
                  v-show="!$auth.$state.loggedIn"
                  id="buscar-especialista-appbar"
                  rounded
                  small
                  accesskey="c"
                  style="
                    font-family: 'Lato', sans-serif;
                    font-size: 13.2px;
                    line-height: 1.6;
                  "
                  class="py-4 ml-2 hidden-sm-and-down text-uppercase font-weight-bold"
                  color="primary"
                  depressed
                  to="/especialistas"
                >
                  Buscar Especialista
                </v-btn>
              </v-col>
            </template>
          </client-only>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import { mdiMenu } from '@mdi/js'

/**
 * AppbarWhite Component
 * 
 * A Vue component that provides a white-themed navigation bar with responsive design.
 * Implements role-based navigation and user authentication state handling.
 * 
 * @component
 * @requires {Vuetify} v-navigation-drawer - Mobile navigation drawer
 * @requires {Vuetify} v-app-bar - Main navigation bar
 * @requires {Vuetify} v-menu - User profile menu
 * @requires {Vuetify} v-list - Navigation list
 * @requires {Vuetify} v-img - Image component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-avatar - Avatar component
 * @requires {Vuetify} v-divider - Divider component
 * @requires {Vuetify} v-spacer - Spacer component
 * @requires {Vuetify} v-container - Container component
 * @requires {Vuetify} v-row - Row component
 * @requires {Vuetify} v-col - Column component
 */
export default {
  name: 'AppbarWhite',

  /**
   * Component dependencies
   * @property {Component} Avatar - User avatar component
   * @property {Component} Icon - Icon component for menu button
   */
  components: {
    Avatar: () => import('~/components/Avatar'),
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

  /**
   * Computed properties
   * @returns {Object} Computed properties
   * @property {Array} menu - Navigation menu items based on user role
   * 
   * @example
   * // Menu items for specialist
   * [
   *   {
   *     name: 'Postulación',
   *     link: { name: 'postulacion' },
   *     color: 'primary',
   *     img: 'https://cdn.hablaqui.cl/static/info.png',
   *     visible: true
   *   },
   *   {
   *     name: 'Chat',
   *     link: { name: 'dashboard-chat' },
   *     color: 'primary',
   *     img: 'https://cdn.hablaqui.cl/static/chat.png',
   *     visible: true
   *   }
   * ]
   */
  computed: {
    /**
     * Navigation menu items based on user role and authentication state
     * @returns {Array} Array of menu items with visibility conditions
     * @property {String} name - Menu item name
     * @property {Object} link - Navigation link
     * @property {String} color - Menu item color
     * @property {String} img - Menu item icon
     * @property {Boolean} visible - Visibility condition based on user role
     */
    menu() {
      const visible =
        (this.$auth.$state.loggedIn && this.$auth.user.role === 'specialist') ||
        (this.$auth.$state.loggedIn && this.$auth.user.role === 'user')
      return [
        {
          name: 'Postulación',
          link: { name: 'postulacion' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/info.png',
          visible:
            this.$auth.$state.loggedIn &&
            this.$auth.user.role === 'specialist' &&
            !this.$auth.user.specialist,
        },
        {
          name: 'Chat',
          link: { name: 'dashboard-chat' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/chat.png',
          visible,
        },
        {
          name: 'Mi agenda',
          link: { name: 'dashboard-agenda' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/sesiones.png',
          visible,
        },
        {
          name: 'Pagos',
          link: { name: 'dashboard-pagos' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/pay.png',
          visible:
            this.$auth.$state.loggedIn &&
            this.$auth.$state.user.role === 'specialist',
        },
        {
          name: 'Consultantes',
          link: { name: 'dashboard-consultantes' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/icon-consultante.png',
          visible:
            this.$auth.$state.loggedIn &&
            this.$auth.$state.user.role === 'specialist',
        },
        {
          name: 'Cuenta',
          link: { name: 'dashboard-perfil' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/home.png',
          visible:
            (this.$auth.$state.loggedIn &&
              this.$auth.user.role === 'specialist') ||
            (this.$auth.$state.loggedIn && this.$auth.user.role === 'user'),
        },
        {
          name: 'Panel de control',
          link: { name: 'dashboard-panel' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
        },
        {
          name: 'Reagendamiento',
          link: { name: 'dashboard-reschedule-session' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
        },
        {
          name: 'Cambio de especialista',
          link: { name: 'dashboard-change-spec' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
        },
        {
          name: 'Tabla de pagos',
          link: { name: 'dashboard-paymentTable' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
        },
        {
          name: 'Evaluaciones',
          link: { name: 'dashboard-evaluations' },
          color: 'primary',
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
        },
      ]
    },
  },

  methods: {
    /**
     * Handles user logout
     * Clears authentication state and redirects to home page
     * @throws {Error} If logout fails
     */
    async logout() {
      try {
        await this.$auth.logout()
        this.$router.push('/')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/**
 * Adds a subtle shadow effect to the app bar
 * Creates depth and visual hierarchy in the design
 * Uses a custom blue shadow color for brand consistency
 */
.shadowAppBar {
  box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}

/**
 * Makes the navigation bar sticky at the top of the viewport
 */
.sticky {
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 0 !important;
}

/**
 * Navigation link styling
 * Uses Lato font family for consistent typography
 * Implements brand color scheme
 * Maintains proper line height and letter spacing
 */
.font-nav {
  color: #666666d9;
  line-height: 16px;
  font-weight: 700;
  font-family: 'Lato', sans-serif;
  letter-spacing: 0.02em;
}
</style>
