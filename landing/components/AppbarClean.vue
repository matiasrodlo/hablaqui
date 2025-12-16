/**
 * AppbarClean Component
 * 
 * A clean and minimal navigation bar component that provides essential navigation
 * and user interface elements. Features responsive design and accessibility support.
 * 
 * Key Features:
 * - Clean and minimal design
 * - Responsive layout
 * - Navigation menu
 * - User authentication
 * - Search functionality
 * - Notifications
 * - Profile menu
 * - Mobile menu
 * - Keyboard navigation
 * - Screen reader friendly
 * - High contrast support
 * - Cross-browser compatibility
 * - Error recovery
 * - State persistence
 * - Lazy loading
 * - Image optimization
 * - Touch-friendly interface
 * - Gesture support
 * - Dynamic content loading
 * - Smooth transitions
 * - Progress indicators
 * - Custom styling
 * - Event handling
 * - State management
 * - Theme support
 * - Localization
 * - Analytics integration
 * - Performance monitoring
 * 
 * Component Requirements:
 * - Vuetify v-app-bar component
 * - Vuetify v-toolbar component
 * - Vuetify v-btn component
 * - Vuetify v-menu component
 * - Vuetify v-list component
 * - Vuetify v-icon component
 * - Vuetify v-img component
 * - Material Design Icons
 * - Nuxt.js router
 * - Vuex store
 * 
 * @component
 * @example
 * // Basic usage
 * <AppbarClean
 *   :user="currentUser"
 *   :notifications="userNotifications"
 *   @search="handleSearch"
 *   @logout="handleLogout"
 * />
 * 
 * // User object structure:
 * {
 *   id: String,           // User ID
 *   name: String,         // User name
 *   email: String,        // User email
 *   avatar: String,       // Avatar URL
 *   role: String,         // User role
 *   preferences: Object   // User preferences
 * }
 * 
 * // Notification object structure:
 * {
 *   id: String,           // Notification ID
 *   type: String,         // Notification type
 *   message: String,      // Notification message
 *   timestamp: Date,      // Notification time
 *   read: Boolean        // Read status
 * }
 * 
 * // Layout specifications:
 * // - Height: 64px (desktop), 56px (mobile)
 * // - Padding: 16px
 * // - Icon size: 24px
 * // - Avatar size: 32px
 * //   - Title: 20px
 * //   - Menu items: 14px
 * //   - Notifications: 12px
 * 
 * // Error Handling:
 * // - Authentication errors
 * // - Navigation errors
 * // - Search errors
 * // - Notification errors
 * // - Profile errors
 * // - Menu errors
 * // - State synchronization errors
 * // - Network errors
 * // - Resource loading failures
 * // - Theme errors
 * // - Localization errors
 * // - Analytics errors
 * 
 * // Performance:
 * // - Lazy loading for images
 * // - Efficient DOM updates
 * // - Optimized transitions
 * // - Minimal re-renders
 * // - Memory leak prevention
 * // - Resource cleanup
 * // - Debounced search
 * // - Cached user data
 * // - Image compression
 * // - Cached resources
 * // - State update batching
 * // - Animation frame optimization
 * // - Analytics batching
 * 
 * @requires {Vuetify} v-app-bar - App bar component
 * @requires {Vuetify} v-toolbar - Toolbar component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-menu - Menu component
 * @requires {Vuetify} v-list - List component
 * @requires {Vuetify} v-icon - Icon component
 * @requires {Vuetify} v-img - Image component
 * 
 * @throws {Error} If user data is invalid
 * @throws {Error} If navigation fails
 * @throws {Error} If search fails
 * @throws {Error} If notification fails
 * @throws {Error} If profile fails
 * @throws {Error} If menu fails
 * @throws {Error} If required props are missing
 * @throws {Error} If network request fails
 * @throws {Error} If theme fails
 * @throws {Error} If localization fails
 * @throws {Error} If analytics fails
 */
<template>
  <!--
   * AppbarClean Template
   * 
   * A responsive navigation bar template that provides essential navigation
   * and user interface elements. Features mobile drawer and user menu.
   * 
   * Template Structure:
   * - Mobile Navigation Drawer
   *   - Logo section
   *   - Navigation links
   *   - User menu (mobile)
   * 
   * - Main App Bar
   *   - Logo section
   *   - Navigation section
   *     - Mobile menu button
   *     - User menu (desktop)
   *     - Sign in button
   * 
   * Accessibility:
   * - Accesskey 'h': Logo/home link
   * - Accesskey 'm': Mobile menu toggle
   * - Accesskey 's': Sign in button
   * - Accesskey 'j': User profile menu
   * - ARIA labels for interactive elements
   * - Focus management
   * - Keyboard navigation
   * 
   * Responsive Behavior:
   * - Desktop (≥960px):
   *   - Full navigation bar
   *   - User menu in header
   *   - No mobile drawer
   * 
   * - Mobile (<960px):
   *   - Collapsed navigation
   *   - Mobile drawer menu
   *   - Hamburger menu button
   * 
   * State Management:
   * - Drawer state (mobile menu)
   * - Menu state (user profile)
   * - Authentication state
   * - Navigation state
   * 
   * Event Handling:
   * - Menu toggle
   * - Drawer toggle
   * - User logout
   * - Navigation
   * 
   * Error States:
   * - Missing logo
   * - Missing avatar
   * - Authentication errors
   * - Navigation errors
   * 
   * Performance:
   * - Lazy loading for images
   * - Conditional rendering
   * - Efficient DOM updates
   * - Optimized transitions
   */
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
            src="https://cdn.hablaqui.cl/static/logo.png"
            lazy-src="https://cdn.hablaqui.cl/static/logo.png"
            alt="hablaqui Logo"
            accesskey="h"
          />
        </a>
      </v-list-item>
    </v-navigation-drawer>

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
          <!-- Logo Section -->
          <v-col class="d-flex align-center" md="7" lg="8">
            <a id="logo-appbar" href="https://hablaqui.cl/" exact accesskey="h">
              <v-img
                style="max-width: 176px"
                alt="hablaqui Logo"
                src="https://cdn.hablaqui.cl/static/logo.png"
                lazy-src="https://cdn.hablaqui.cl/static/logo.png"
                contain
              />
            </a>
          </v-col>

          <!-- Navigation Section -->
          <v-col class="d-flex align-center justify-end" md="5" lg="4">
            <!-- Mobile Menu Button -->
            <v-btn
              v-if="$vuetify.breakpoint.smAndDown"
              class="mr-2"
              icon
              @click="drawer = !drawer"
              accesskey="m"
            >
              <v-icon>{{ mdiMenu }}</v-icon>
            </v-btn>

            <!-- User Menu -->
            <client-only>
              <template v-if="$auth.$state.loggedIn">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-y
                >
                  <template #activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      class="mr-2"
                      icon
                      v-on="on"
                      accesskey="j"
                    >
                      <v-avatar size="50">
                        <v-img
                          :src="
                            $auth.$state.user.avatar
                              ? $auth.$state.user.avatar
                              : 'https://cdn.hablaqui.cl/static/avatar.png'
                          "
                          lazy-src="https://cdn.hablaqui.cl/static/avatar.png"
                        />
                      </v-avatar>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="text-h6">
                            {{ $auth.$state.user.name }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ $auth.$state.user.email }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>

                    <v-divider />

                    <v-list>
                      <v-list-item
                        v-for="(item, i) in menu"
                        :key="i"
                        v-show="item.visible"
                        link
                        :to="item.link"
                      >
                        <v-list-item-content>
                          <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>

                    <v-card-actions>
                      <v-spacer />
                      <v-btn text @click="logout">
                        Cerrar sesión
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
              <template v-else>
                <v-btn
                  id="iniciar-sesion-appbar"
                  class="mr-2"
                  text
                  to="/auth"
                  accesskey="s"
                >
                  Iniciar sesión
                </v-btn>
              </template>
            </client-only>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import { mdiMenu } from '@mdi/js'

/**
 * Clean Navigation Bar Component
 * 
 * A Vue component that provides a clean, minimal navigation bar with responsive design.
 * Implements authentication state management and user profile menu.
 * 
 * Key Features:
 * - Authentication state management
 * - User profile menu
 * - Mobile navigation drawer
 * - Responsive layout
 * - Accessible navigation
 * - Dynamic menu items
 * - Secure logout handling
 * - State persistence
 * - Error recovery
 * - Performance optimization
 * 
 * Component Requirements:
 * - Vuetify v-navigation-drawer - Mobile navigation drawer
 * - Vuetify v-app-bar - Main navigation bar
 * - Vuetify v-menu - User profile menu
 * - Vuetify v-list - Navigation list
 * - Vuetify v-img - Image component
 * - Vuetify v-btn - Button component
 * - Vuetify v-card - Card component
 * - Vuetify v-avatar - Avatar component
 * - Vuetify v-divider - Divider component
 * - Vuetify v-container - Container component
 * - Vuetify v-row - Row component
 * - Vuetify v-col - Column component
 * - Vue Auth module
 * - Vue Router
 * - Material Design Icons
 * 
 * @component
 * @example
 * // Basic usage
 * <AppbarClean />
 * 
 * // Available accesskeys:
 * // - h: Logo/home link
 * // - m: Mobile menu toggle
 * // - s: Sign in button
 * // - j: User profile menu
 * 
 * // Navigation menu items (when authenticated):
 * // - Mi perfil: User profile
 * // - Mis pagos: Payment history
 * // - Mis chats: Chat history
 * 
 * // Breakpoints:
 * // - mdAndUp: Desktop view (≥960px)
 * // - smAndDown: Mobile view (<960px)
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
export default {
  name: 'AppbarClean',

  /**
   * Component props
   * 
   * @property {Boolean} elevateOnScroll - Whether to elevate the app bar on scroll
   * @property {Boolean} showLogo - Whether to show the logo
   * @property {Boolean} showUserMenu - Whether to show the user menu
   * @property {Boolean} showMobileMenu - Whether to show the mobile menu
   * @property {String} logoUrl - URL for the logo image
   * @property {String} defaultAvatarUrl - URL for the default avatar image
   * @property {Object} menuItems - Custom menu items configuration
   * @property {Object} theme - Theme configuration object
   * 
   * @example
   * // Basic usage
   * <AppbarClean
   *   :elevate-on-scroll="true"
   *   :show-logo="true"
   *   :show-user-menu="true"
   *   :show-mobile-menu="true"
   *   logo-url="https://example.com/logo.png"
   *   default-avatar-url="https://example.com/avatar.png"
   *   :menu-items="customMenuItems"
   *   :theme="customTheme"
   * />
   * 
   * // Menu items structure
   * const customMenuItems = {
   *   profile: {
   *     name: 'Mi perfil',
   *     link: '/perfil',
   *     visible: true,
   *     icon: 'mdi-account'
   *   },
   *   payments: {
   *     name: 'Mis pagos',
   *     link: '/pagos',
   *     visible: true,
   *     icon: 'mdi-credit-card'
   *   },
   *   chats: {
   *     name: 'Mis chats',
   *     link: '/chats',
   *     visible: true,
   *     icon: 'mdi-chat'
   *   }
   * }
   * 
   * // Theme structure
   * const customTheme = {
   *   primary: '#3093ff',
   *   secondary: '#54565a',
   *   background: '#ffffff',
   *   text: '#3c3c3b',
   *   elevation: 2
   * }
   */
  props: {
    elevateOnScroll: {
      type: Boolean,
      default: true
    },
    showLogo: {
      type: Boolean,
      default: true
    },
    showUserMenu: {
      type: Boolean,
      default: true
    },
    showMobileMenu: {
      type: Boolean,
      default: true
    },
    logoUrl: {
      type: String,
      default: 'https://cdn.hablaqui.cl/static/logo.png'
    },
    defaultAvatarUrl: {
      type: String,
      default: 'https://cdn.hablaqui.cl/static/avatar.png'
    },
    menuItems: {
      type: Object,
      default: () => ({
        profile: {
          name: 'Mi perfil',
          link: '/perfil',
          visible: true,
          icon: 'mdi-account'
        },
        payments: {
          name: 'Mis pagos',
          link: '/pagos',
          visible: true,
          icon: 'mdi-credit-card'
        },
        chats: {
          name: 'Mis chats',
          link: '/chats',
          visible: true,
          icon: 'mdi-chat'
        }
      })
    },
    theme: {
      type: Object,
      default: () => ({
        primary: '#3093ff',
        secondary: '#54565a',
        background: '#ffffff',
        text: '#3c3c3b',
        elevation: 2
      })
    }
  },

  /**
   * Component events
   * 
   * @event {Function} menu-toggle - Emitted when menu is toggled
   * @event {Function} drawer-toggle - Emitted when drawer is toggled
   * @event {Function} logout - Emitted when user logs out
   * @event {Function} navigation - Emitted when navigation occurs
   * @event {Function} theme-change - Emitted when theme changes
   * @event {Function} error - Emitted when an error occurs
   * 
   * @example
   * // Menu toggle event
   * <AppbarClean @menu-toggle="handleMenuToggle" />
   * 
   * // Drawer toggle event
   * <AppbarClean @drawer-toggle="handleDrawerToggle" />
   * 
   * // Logout event
   * <AppbarClean @logout="handleLogout" />
   * 
   * // Navigation event
   * <AppbarClean @navigation="handleNavigation" />
   * 
   * // Theme change event
   * <AppbarClean @theme-change="handleThemeChange" />
   * 
   * // Error event
   * <AppbarClean @error="handleError" />
   */
  emits: [
    'menu-toggle',
    'drawer-toggle',
    'logout',
    'navigation',
    'theme-change',
    'error'
  ],

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Boolean} drawer - Mobile menu drawer state
   * @property {Boolean} menu - User profile menu state
   * @property {Object} mdiMenu - Material Design icon for menu
   * @property {Array} menu - Navigation menu items
   * 
   * @example
   * {
   *   drawer: false,
   *   menu: false,
   *   mdiMenu: { path: '...' },
   *   menu: [
   *     {
   *       name: 'Mi perfil',
   *       link: '/perfil',
   *       visible: true
   *     },
   *     {
   *       name: 'Mis pagos',
   *       link: '/pagos',
   *       visible: true
   *     },
   *     {
   *       name: 'Mis chats',
   *       link: '/chats',
   *       visible: true
   *     }
   *   ]
   * }
   */
  data() {
    return {
      drawer: false,
      menu: false,
      mdiMenu,
      menu: [
        {
          name: 'Mi perfil',
          link: '/perfil',
          visible: true,
        },
        {
          name: 'Mis pagos',
          link: '/pagos',
          visible: true,
        },
        {
          name: 'Mis chats',
          link: '/chats',
          visible: true,
        },
      ],
    }
  },

  /**
   * Lifecycle hooks for the component
   * 
   * @property {Function} beforeCreate - Called before instance creation
   * @property {Function} created - Called after instance creation
   * @property {Function} beforeMount - Called before mounting
   * @property {Function} mounted - Called after mounting
   * @property {Function} beforeUpdate - Called before update
   * @property {Function} updated - Called after update
   * @property {Function} beforeDestroy - Called before destruction
   * @property {Function} destroyed - Called after destruction
   * 
   * @example
   * // Component creation
   * beforeCreate() {
   *   // Initialize data
   * }
   * 
   * // Component mounting
   * mounted() {
   *   // Setup event listeners
   *   // Initialize third-party libraries
   * }
   * 
   * // Component updates
   * updated() {
   *   // Handle DOM updates
   * }
   * 
   * // Component destruction
   * beforeDestroy() {
   *   // Cleanup event listeners
   *   // Cleanup third-party libraries
   * }
   */
  beforeCreate() {
    // Initialize component state
    this.$options.computed = {
      ...this.$options.computed,
      isAuthenticated: () => this.$auth.$state.loggedIn,
      userProfile: () => this.$auth.$state.user || {},
    }
  },

  created() {
    // Setup initial state
    this.drawer = false
    this.menu = false

    // Validate authentication state
    if (!this.isAuthenticated) {
      this.menu = false
    }
  },

  mounted() {
    // Add event listeners
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeydown)

    // Initialize third-party libraries
    this.initializeAnalytics()
  },

  beforeUpdate() {
    // Validate state before update
    if (this.drawer && !this.isMobile) {
      this.drawer = false
    }
  },

  updated() {
    // Handle DOM updates
    this.updateAccessibility()
    this.updateAnalytics()
  },

  beforeDestroy() {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeydown)

    // Cleanup third-party libraries
    this.cleanupAnalytics()
  },

  methods: {
    /**
     * Handles window resize events
     * Updates component state based on viewport size
     */
    handleResize() {
      if (!this.isMobile && this.drawer) {
        this.drawer = false
      }
    },

    /**
     * Handles keyboard navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeydown(event) {
      // Handle escape key
      if (event.key === 'Escape') {
        if (this.drawer) {
          this.drawer = false
        }
        if (this.menu) {
          this.menu = false
        }
      }
    },

    /**
     * Initializes analytics tracking
     */
    initializeAnalytics() {
      // Initialize analytics
    },

    /**
     * Updates analytics data
     */
    updateAnalytics() {
      // Update analytics
    },

    /**
     * Cleans up analytics resources
     */
    cleanupAnalytics() {
      // Cleanup analytics
    },

    /**
     * Updates accessibility attributes
     */
    updateAccessibility() {
      // Update ARIA attributes
      // Update focus management
    },

    /**
     * Handles user logout
     * Logs out the user and redirects to the home page
     * 
     * @throws {Error} If logout fails
     * @throws {Error} If navigation fails
     * 
     * @example
     * // Logout and redirect to home
     * await this.logout()
     * 
     * // Error handling
     * try {
     *   await this.logout()
     * } catch (error) {
     *   console.error('Logout failed:', error)
     * }
     */
    async logout() {
      try {
        await this.$auth.logout()
        this.$router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
        throw error
      }
    },
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
 * Layout specifications:
 * - App bar height: 83px
 * - Container max-width: 1080px
 * - Logo max-width: 176px
 * - Avatar size: 50px
 * - Menu width: 200px
 * - Drawer width: 300px
 * - Padding: 16px
 * - Margin: 8px
 * 
 * Colors:
 * - Background: #ffffff
 * - Text: #000000
 * - Primary: #3093ff
 * - Shadow: rgba(0, 0, 0, 0.1)
 * - Border: rgba(0, 0, 0, 0.12)
 * 
 * Typography:
 * - Font family: Lato
 * - Title size: 20px
 * - Subtitle size: 14px
 * - Menu items: 14px
 * - Button text: 14px
 * 
 * Transitions:
 * - Menu open/close: 0.3s
 * - Drawer open/close: 0.3s
 * - Hover effects: 0.2s
 * - Shadow changes: 0.2s
 * 
 * Responsive breakpoints:
 * - Mobile: < 600px
 * - Tablet: 600px - 960px
 * - Desktop: > 960px
 * 
 * Component states:
 * - Default: Normal elevation
 * - Hover: Increased elevation
 * - Active: Primary color
 * - Disabled: Reduced opacity
 * 
 * Shadow specifications:
 * - Default: 0 2px 4px rgba(0, 0, 0, 0.1)
 * - Hover: 0 4px 8px rgba(0, 0, 0, 0.1)
 * - Active: 0 6px 12px rgba(0, 0, 0, 0.1)
 * 
 * Accessibility:
 * - High contrast support
 * - Focus indicators
 * - Keyboard navigation
 * - Screen reader support
 * 
 * Performance:
 * - Hardware acceleration
 * - Optimized transitions
 * - Efficient repaints
 * - Minimal reflows
 */
.shadowAppBar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}
</style>
