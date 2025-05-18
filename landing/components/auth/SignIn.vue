/**
 * Sign In Form Component
 * 
 * A form component that handles user authentication.
 * Provides email and password fields with validation, password visibility toggle,
 * and password recovery option. Handles different user roles and redirects accordingly.
 * 
 * @component
 * @example
 * <SignIn 
 *   :isDialog="false"
 *   :setResetPassword="handlePasswordReset"
 * />
 */
<template>
  <v-form @submit.prevent="onSubmit">
    <v-row no-gutters>
      <!-- Email input field -->
      <v-col cols="12">
        <v-text-field
          v-model="form.email"
          class="mt-2"
          label="Correo electronico"
          type="email"
          :dense="isDialog"
          outlined
          :error-messages="emailErrors"
        ></v-text-field>
      </v-col>
      <!-- Password input field with visibility toggle -->
      <v-col cols="12">
        <v-text-field
          v-model="form.password"
          label="Contraseña"
          outlined
          :dense="isDialog"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? mdiEye : mdiEyeOff"
          :error-messages="passwordErrors"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-col>
      <!-- Password recovery button -->
      <v-col cols="12" class="text-left">
        <v-btn
          text
          color="primary"
          class="px-0 body-2 font-weigth-medium"
          @click="setResetPassword"
          >¿Olvidó la contraseña?</v-btn
        >
      </v-col>
    </v-row>
    <!-- Submit button -->
    <v-row>
      <v-col cols="12">
        <v-btn :loading="loading" type="submit" block rounded color="primary">
          Entrar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { mapMutations } from 'vuex'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn'

/**
 * Componente para iniciar sesión
 */
export default {
  name: 'SignIn',
  mixins: [validationMixin],

  /**
   * Component props
   * @property {Boolean} isDialog - Whether the component is rendered in a dialog
   * @property {Function} setResetPassword - Function to handle password reset navigation
   */
  props: {
    isDialog: {
      type: Boolean,
      default: false,
      description: 'Whether the component is rendered in a dialog'
    },
    setResetPassword: {
      type: Function,
      required: true,
      description: 'Function to handle password reset navigation'
    },
  },

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Object} mdiEye - Material Design icon for visible password
   * @property {Object} mdiEyeOff - Material Design icon for hidden password
   * @property {Boolean} showPassword - Controls password field visibility
   * @property {Object} form - Form data object
   * @property {Boolean} loading - Loading state for form submission
   */
  data() {
    return {
      mdiEye,
      mdiEyeOff,
      showPassword: false,
      form: null,
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
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.required &&
        errors.push('Se requiere correo electrónico')
      !this.$v.form.email.email &&
        errors.push('Escriba un correo electrónico valido')
      return errors
    },

    /**
     * Validates password input and returns error messages
     * @returns {Array} Array of error messages
     */
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.required && errors.push('Se requiere contraseña')
      return errors
    },
  },

  /**
   * Lifecycle hook that initializes form data
   */
  created() {
    this.defaultData()
  },

  methods: {
    /**
     * Handles form submission for user authentication
     * Manages login process and role-based redirects
     * @returns {Promise<void>}
     */
    async onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          this.loading = true
          const response = await this.$auth.loginWith('local', {
            data: this.form,
          })
          this.$auth.setUser(response.data.user)
          
          if (this.$auth.$state.loggedIn) {
            // Handle special evaluation redirect
            if (this.$route.query.from === 'spec')
              return this.$router.push({ name: 'evaluacion' })
            
            // Handle specialist role redirects
            if (response.data.user.role === 'specialist') {
              if (this.$auth.$state.user.specialist) {
                return this.$router.push({ name: 'dashboard-chat' })
              }
              return this.$router.push({ name: 'postulacion' })
            }
            
            // Handle superuser redirect
            if (response.data.user.role === 'superuser')
              return this.$router.push({ name: 'dashboard-panel' })
            
            // Handle regular user redirects
            if (response.data.user.role === 'user') {
              // Redirect to payment page if payment details are present
              if (
                this.$route.query.date &&
                this.$route.query.start &&
                this.$route.query.end
              ) {
                return this.$router.push(
                  `/especialistas/pagos/?username=${this.$route.query.specialist}&date=${this.$route.query.date}&start=${this.$route.query.start}&end=${this.$route.query.end}`
                )
              }
              // Redirect to chat if specialist is specified
              if (this.$route.query.specialist) {
                return this.$router.push(
                  `/${this.$route.query.specialist}/?chat=true`
                )
              }
              return this.$router.push({ name: 'dashboard-chat' })
            }
          }
        } catch (error) {
          if (error.response.status === 401) {
            alert('Correo o contraseña invalida')
          } else {
            this.snackBar({
              content: evaluateErrorReturn(error),
              color: 'error',
            })
          }
        } finally {
          this.loading = false
        }
      }
    },

    /**
     * Initializes form data with default values
     */
    defaultData() {
      this.form = { email: '', password: '' }
    },

    ...mapMutations({
      setResumeView: 'Specialist/setResumeView',
      snackBar: 'Snackbar/showMessage',
    }),
  },

  /**
   * Form validation rules
   */
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
}
</script>

<style scoped>
/* Component-specific styles */
</style>
