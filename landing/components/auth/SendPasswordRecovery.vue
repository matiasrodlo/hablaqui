<template>
  <v-form @submit.prevent="onSubmit">
    <!-- correo electronico -->
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
    <!-- boton enviar -->
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
  props: {
    goBack: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      email: '',
      loading: false,
    }
  },
  computed: {
    /**
     * Verifica que el email sea valido
     * @returns array con los errores
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
     * Envia la peticion de cambio de contraseña
     */
    async onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          // activamos el loading
          this.loading = true
          // request a la api
          const { data } = await this.$axios.get(
            `/auth/send-password-recover/${this.email}`
          )
          // muestra mensaje satisfactorio
          this.snackBar({
            content: data.message,
            color: 'success',
          })
          // Ejecuta la funcion para regresar a la ruta anterior
          this.goBack()
        } catch (error) {
          // muestra mensaje de error
          this.snackBar({ content: evaluateErrorReturn(error), color: 'error' })
        } finally {
          // desactivamos el loading
          this.loading = false
        }
      }
    },
    ...mapMutations({
      snackBar: 'Snackbar/showMessage',
    }),
  },
  validations: {
    email: {
      required,
      email,
    },
  },
}
</script>

<style lang="scss" scoped></style>
