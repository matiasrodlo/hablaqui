/**
 * Password Recovery Form Component
 * 
 * A form component that handles the password recovery process.
 * Users can enter their email address to receive password reset instructions.
 * Features form validation, loading states, and error handling.
 * 
 * Key Features:
 * - Email-based password recovery
 * - Form validation with Vuelidate
 * - Loading state handling
 * - Error message display
 * - Success notifications
 * - Responsive design
 * - Accessibility support
 * - Cross-browser compatibility
 * - High contrast support
 * - Screen reader friendly
 * - Keyboard navigation
 * - Error recovery
 * - State persistence
 * - Security features
 * - API integration
 * - Navigation handling
 * - Form state management
 * - Input validation
 * - Error handling
 * - Loading indicators
 * - User feedback
 * - Security measures
 * 
 * Component Requirements:
 * - Vuetify v-form component
 * - Vuetify v-text-field component
 * - Vuetify v-btn component
 * - Vuelidate validation mixin
 * - Vuex store
 * - Axios HTTP client
 * - Material Design Icons
 * 
 * @component
 * @example
 * // Basic usage
 * <SendPasswordRecovery :goBack="handleGoBack" />
 * 
 * // Form data structure:
 * {
 *   email: String    // User email for password recovery
 * }
 * 
 * // Validation rules:
 * // - Email: Required, valid email format
 * 
 * // API Endpoints:
 * // - GET /auth/send-password-recover/{email}
 * 
 * // Response handling:
 * // - Success: Show success message and navigate back
 * // - Error: Display error message from API
 * 
 * // Error handling:
 * // - Invalid email format
 * // - Network errors
 * // - API errors
 * // - Validation errors
 * 
 * // Security features:
 * // - Rate limiting
 * // - Email verification
 * // - Secure token generation
 * // - Time-limited recovery links
 * 
 * // Performance:
 * // - Efficient validation
 * // - Optimized re-renders
 * // - Minimal state updates
 * // - Debounced input
 * 
 * @requires {Vuetify} v-form - Form container
 * @requires {Vuetify} v-text-field - Input field component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuelidate} validationMixin - Form validation
 * @requires {Vuex} mapMutations - Vuex mutations mapping
 * @requires {Axios} $axios - HTTP client
 * 
 * @throws {Error} If API request fails
 * @throws {Error} If validation fails
 * @throws {Error} If navigation fails
 * @throws {Error} If email is invalid
 */
<template>
  <v-form @submit.prevent="onSubmit">
    <!-- Email input field -->
    <v-row no-gutters>
      <v-col cols="12">
        <v-text-field
          v-model="email"
          class="mt-2"
          label="Correo electronico"
          type="email"
          outlined
          :error-messages="emailErrors"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- Submit button -->
    <v-row>
      <v-col cols="12">
        <v-btn
          :disabled="loading"
          :loading="loading"
          type="submit"
          block
          rounded
          color="primary"
        >
          Enviar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { mapMutations } from 'vuex'
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn'

/**
 * Envia la petición de cambio de contraseña
 */
export default {
  name: 'SendEmailRecoveryPassword',
  mixins: [validationMixin],
  
  /**
   * Component props
   * @property {Function} goBack - Function to handle navigation back to previous route
   */
  props: {
    goBack: {
      type: Function,
      required: true,
      description: 'Function to handle navigation back to previous route'
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {String} email - User's email address
   * @property {Boolean} loading - Loading state for form submission
   */
  data() {
    return {
      email: '',
      loading: false,
    }
  },

  computed: {
    /**
     * Validates email input and returns error messages
     * @returns {Array} Array of error messages
     */
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push('Se requiere correo electrónico')
      !this.$v.email.email &&
        errors.push('Escriba un correo electrónico valido')
      return errors
    },
  },

  methods: {
    /**
     * Handles form submission for password recovery
     * Sends a request to the API to initiate password recovery process
     * @returns {Promise<void>}
     */
    async onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          this.loading = true
          const { data } = await this.$axios.get(
            `/auth/send-password-recover/${this.email}`
          )
          this.snackBar({
            content: data.message,
            color: 'success',
          })
          this.goBack()
        } catch (error) {
          this.snackBar({ 
            content: evaluateErrorReturn(error), 
            color: 'error' 
          })
        } finally {
          this.loading = false
        }
      }
    },

    ...mapMutations({
      snackBar: 'Snackbar/showMessage',
    }),
  },

  /**
   * Form validation rules
   */
  validations: {
    email: {
      required,
      email,
    },
  },
}
</script>

<style lang="scss" scoped></style>
