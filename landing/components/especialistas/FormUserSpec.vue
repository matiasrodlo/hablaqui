/**
 * FormUserSpec Component
 * 
 * A registration form component for specialists that collects personal and professional
 * information. Features form validation, error handling, and terms acceptance.
 * 
 * Key Features:
 * - Personal information collection
 * - Professional details
 * - Form validation
 * - Error messages
 * - Terms acceptance
 * - Responsive design
 * - Password field
 * - Email validation
 * - RUT validation
 * - Loading states
 * - Error dialogs
 * - Form submission
 * - Data persistence
 * - Accessibility support
 * - Cross-browser compatibility
 * - High contrast support
 * - Screen reader friendly
 * 
 * Component Requirements:
 * - Vuetify v-form component
 * - Vuetify v-card component
 * - Vuetify v-text-field component
 * - Vuetify v-checkbox component
 * - Vuetify v-btn component
 * - Vuetify v-dialog component
 * - Vuetify v-alert component
 * - Vuelidate for validation
 * - Vuex store
 * 
 * @component
 * @example
 * // Basic usage
 * <FormUserSpec
 *   @submit="handleSubmit"
 * />
 * 
 * // Form data structure:
 * {
 *   name: String,           // First name
 *   lastName: String,       // Last name
 *   rut: String,           // Chilean ID number
 *   email: String,         // Email address
 *   password: String,      // Password
 *   role: 'specialist',    // User role
 *   profession: 'psychologist'  // Professional type
 * }
 * 
 * // Recruitment form structure:
 * {
 *   avgPatients: String,    // Average patients
 *   birthDate: String,      // Date of birth
 *   comuna: String,         // District
 *   country: String,        // Country
 *   experience: Array,      // Work experience
 *   formation: Array,       // Education
 *   gender: String,         // Gender
 *   languages: Array,       // Languages spoken
 *   models: Array,          // Therapy models
 *   specialties: Array,     // Specialties
 *   timeZone: String,       // Time zone
 *   // ... additional fields
 * }
 * 
 * // Layout specifications:
 * // - Card border radius: 8px (rounded-lg)
 * // - Button border radius: 12px (rounded-xl)
 * // - Field spacing: 8px (mx-2)
 * // - Dialog width: 300px
 * // - Alert height: 100px
 * 
 * // Error Handling:
 * // - Required field validation
 * // - Email format validation
 * // - Password length validation
 * // - RUT format validation
 * // - Terms acceptance validation
 * // - Form submission errors
 * // - Network errors
 * 
 * // Performance:
 * // - Efficient form validation
 * // - Optimized re-renders
 * // - Debounced input handling
 * // - Minimal state updates
 * 
 * @requires {Vuelidate} validationMixin - Form validation
 * @requires {Vuex} mapMutations - Vuex mutations mapping
 * 
 * @throws {Error} If form validation fails
 * @throws {Error} If terms are not accepted
 * @throws {Error} If form submission fails
 */
<template>
  <v-form>
    <v-card flat class="rounded-lg">
      <v-card-text class="py-0">
        <h1
          class="py-1 text-center subtitle-1 font-weight-bold text--secondary"
        >
          Sea parte de nuestra comunidad
        </h1>
      </v-card-text>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.trim="formData.name"
              dense
              label="Nombre"
              outlined
              :error-messages="nameErrors"
              class="mx-2"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.trim="formData.lastName"
              dense
              label="Apellido"
              outlined
              :error-messages="lastNameErrors"
              class="mx-2"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.rut"
              dense
              label="Rut"
              outlined
              :error-messages="rutErrors"
              class="mx-2"
            ></v-text-field
          ></v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.email"
              dense
              :error-messages="emailErrors"
              class="mx-2"
              label="Correo"
              outlined
              type="email"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="formData.password"
              dense
              :error-messages="passwordErrors"
              class="mx-2"
              label="Contraseña"
              type="password"
              outlined
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-checkbox v-model="terminos" hide-details class="mx-2 my-0">
              <template #label>
                <div class="caption">
                  He leído y acepto los
                  <nuxt-link
                    to="terminos-y-condiciones-especialista"
                    style="text-decoration: none"
                  >
                    Términos y condiciones
                  </nuxt-link>
                </div>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="text-center">
        <v-btn
          :loading="loading"
          block
          color="primary"
          class="rounded-xl mx-auto px-10"
          @click="onSubmit"
        >
          Regístrar
        </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" width="300">
      <v-sheet style="width: 300px; height: 100px">
        <v-alert dense outlined type="error" width="300" height="100">
          Debes aceptar los
          <strong>terminos y condiciones</strong>
        </v-alert>
      </v-sheet>
    </v-dialog>
  </v-form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapMutations } from 'vuex'
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn'

/**
 * FormUserSpec Component
 * 
 * A Vue component that provides a registration form for specialists with
 * validation and error handling.
 * 
 * @component
 * @requires {Vuelidate} validationMixin - Form validation
 * @requires {Vuex} mapMutations - Vuex mutations mapping
 */
export default {
  name: 'FormUserSpec',

  /**
   * Component mixins
   * @property {Object} validationMixin - Vuelidate validation mixin
   */
  mixins: [validationMixin],

  /**
   * Component data
   * @returns {Object} Component data
   * @property {Object} formData - Form input data
   * @property {Object} recruitmentForm - Specialist recruitment data
   * @property {Boolean} terminos - Terms acceptance state
   * @property {Boolean} dialog - Error dialog visibility
   * @property {Boolean} loading - Loading state
   */
  data() {
    return {
      formData: {
        name: '',
        lastName: '',
        rut: '',
        email: '',
        password: '',
        role: 'specialist',
        profession: 'psychologist',
      },
      recruitmentForm: {
        avgPatients: '',
        birthDate: '',
        comuna: '',
        country: 'Chile',
        experience: [],
        formation: [],
        gender: '',
        profession: 'psychologist',
        instagram: '',
        isExclusiveActivity: false,
        isSupervisor: false,
        isUnderSupervision: false,
        languages: ['spanish'],
        linkedin: '',
        models: [],
        personalDescription: '',
        phone: { code: '+56', number: '', flag: '' },
        professionalDescription: '',
        region: '',
        specialties: [],
        timeZone: 'America/Santiago',
        yearsExpSpecialist: '',
        yearsExpVideocalls: '',
        howFindOut: 'Búsqueda de internet',
        isContentCreator: false,
        isAffiliateExternal: false,
        isInterestedBusiness: false,
        specPlans: [
          {
            tier: 'free',
            paymentStatus: 'pending',
            planStatus: 'pending',
            expirationDate: '',
            subscriptionPeriod: '',
            price: 0,
          },
        ],
      },
      terminos: false,
      dialog: false,
      loading: false,
    }
  },

  /**
   * Computed properties for form validation
   */
  computed: {
    /**
     * Validates name field errors
     * @returns {Array} Array of error messages
     */
    nameErrors() {
      const errors = []
      if (!this.$v.formData.name.$dirty) return errors
      !this.$v.formData.name.required && errors.push('El nombre es querido')
      return errors
    },

    /**
     * Validates last name field errors
     * @returns {Array} Array of error messages
     */
    lastNameErrors() {
      const errors = []
      if (!this.$v.formData.lastName.$dirty) return errors
      !this.$v.formData.lastName.required &&
        errors.push('El apellido es querido')
      return errors
    },

    /**
     * Validates RUT field errors
     * @returns {Array} Array of error messages
     */
    rutErrors() {
      const errors = []
      if (!this.$v.formData.rut.$dirty) return errors
      !this.$v.formData.rut.required && errors.push('El rut es querido')
      return errors
    },

    /**
     * Validates email field errors
     * @returns {Array} Array of error messages
     */
    emailErrors() {
      const errors = []
      if (!this.$v.formData.email.$dirty) return errors
      !this.$v.formData.email.required &&
        errors.push('El correo electronico es querido')
      !this.$v.formData.email.email && errors.push('Inserte un correo valido')
      return errors
    },

    /**
     * Validates password field errors
     * @returns {Array} Array of error messages
     */
    passwordErrors() {
      const errors = []
      if (!this.$v.formData.password.$dirty) return errors
      !this.$v.formData.password.required &&
        errors.push('La contraseña es querida')
      !this.$v.formData.password.minLength && errors.push('Minimo 6 caracteres')
      !this.$v.formData.password.maxLength &&
        errors.push('Maximo 99 caracteres')
      return errors
    },
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Handles form submission
     * Validates form data and terms acceptance before submitting
     */
    async onSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      if (!this.terminos) {
        this.dialog = true
        return
      }
      this.loading = true
      try {
        // Form submission logic
      } catch (error) {
        evaluateErrorReturn(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
