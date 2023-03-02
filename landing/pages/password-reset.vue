<template>
  <div style="position: relative">
    <v-img
      class="hidden-sm-and-down"
      :src="`https://cdn.hablaqui.cl/static/login.png`"
      :lazy-src="`https://cdn.hablaqui.cl/static/login.png`"
      style="height: 100vh"
    ></v-img>
    <v-container
      :class="$vuetify.breakpoint.mdAndUp ? '' : 'white--text'"
      fluid
      style="position: absolute; top: 0; height: 100vh"
    >
      <v-row
        justify="center"
        align="center"
        style="height: 100vh; overflow-y: auto"
      >
        <v-col cols="12" md="6">
          <v-row justify="center">
            <v-col cols="6" sm="5" md="4" lg="3">
              <a href="https://hablaqui.cl/" class="tex-center">
                <v-img
                  class="mx-auto"
                  style="max-width: 200px"
                  :src="`https://cdn.hablaqui.cl/static/logo.png`"
                  :lazy-src="`https://cdn.hablaqui.cl/static/logo.png`"
                />
              </a>
            </v-col>
            <v-col
              cols="12"
              class="py-1 text-center text-h6 text-lg-h4 font-weight-bold text--secondary"
            >
              <span>Ingresa tu nueva contraseña</span>
            </v-col>
          </v-row>
          <v-row justify="center" class="text-center">
            <v-col cols="12" sm="10" lg="8">
              <v-form @submit.prevent="onSubmit">
                <v-text-field
                  v-model.trim="$v.formData.newPassword.$model"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  :prepend-icon="mdiLock"
                  :append-icon="showPassword ? mdiEye : mdiEyeOff"
                  :error-messages="passwordErrors"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
                <v-text-field
                  v-model.trim="$v.formData.repeatedPassword.$model"
                  :type="showRepeatPassword ? 'text' : 'password'"
                  outlined
                  :prepend-icon="mdiLock"
                  label="Repita la contraseña"
                  :append-icon="showRepeatPassword ? mdiEye : mdiEyeOff"
                  :error-messages="repetPasswordErrors"
                  @click:append="showRepeatPassword = !showRepeatPassword"
                ></v-text-field>
                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  type="submit"
                  block
                  rounded
                  color="primary"
                >
                  Enviar
                </v-btn>
              </v-form>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="hidden-sm-and-down" md="6">
          <v-carousel
            v-model="carousel"
            hide-delimiter-background
            hide-delimiters
            cycle
            interval="3000"
            :show-arrows="false"
            height="600"
          >
            <v-carousel-item
              v-for="n in length"
              :key="`card-${n.id}`"
              class="align-items-center"
              style="position: relative"
            >
              <div class="text-center mt-10">
                <v-img
                  style="z-index: 1; position: absolute; top: 30px; right: 30%"
                  width="80"
                  :src="`https://cdn.hablaqui.cl/static/plus-login.png`"
                ></v-img>
                <v-img
                  style="position: absolute; bottom: 30%; right: 17%"
                  width="220"
                  :src="`https://cdn.hablaqui.cl/static/circle-login.png`"
                >
                </v-img>
                <v-list-item-avatar size="400" class="ml-4">
                  <v-img
                    height="400"
                    width="400"
                    :src="n.img"
                    :lazy-src="n.img"
                  >
                    <template #placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="white"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-list-item-avatar>
                <div
                  style="max-width: 500px"
                  class="text-h6 mx-auto white--text py-5 px-10"
                >
                  {{ n.text }}
                </div>
              </div>
            </v-carousel-item>
          </v-carousel>
          <v-item-group v-model="carousel" class="text-center" mandatory>
            <v-item
              v-for="n in length"
              :key="`btn-${n.id}`"
              v-slot="{ active, toggle }"
            >
              <v-btn icon color="#BDBDBD" @click="toggle">
                <icon :color="active ? 'info' : ''" :icon="mdiRecord" />
              </v-btn>
            </v-item>
          </v-item-group>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" max-width="500" persistent>
        <v-card>
          <v-card-title class="text-h5">
            <span>Su contraseña ha sido restablecida</span>
          </v-card-title>
          <v-card-text>
            <span class="mr-2">Redirigiendo al login... </span>
            <v-progress-circular
              size="18"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mdiRecord, mdiEye, mdiEyeOff, mdiLock } from '@mdi/js'
import { validationMixin } from 'vuelidate'
import { mapMutations } from 'vuex'
import {
  required,
  minLength,
  maxLength,
  sameAs,
} from 'vuelidate/lib/validators'
import axios from 'axios'
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn'
/**
 * pagina reseteo de contraseña
 */
export default {
  name: 'PasswordRecovery',
  mixins: [validationMixin],
  layout: 'simple',
  data() {
    return {
      dialog: false,
      mdiLock,
      mdiEyeOff,
      mdiEye,
      loading: false,
      formData: {
        newPassword: '',
        repeatedPassword: '',
      },
      token: '',
      showPassword: false,
      showRepeatPassword: false,
      mdiRecord,
      length: [
        {
          id: 1,
          img: `https://cdn.hablaqui.cl/static/auth.webp`,
          text: 'Habla con tu especialista por videollamada, estés donde estés y sin tener que desplazarte',
        },
        {
          id: 2,
          img: `https://cdn.hablaqui.cl/static/auth-2.webp`,
          text: 'Disfruta de las sesiones con tu especialista de manera segura y privada',
        },
        {
          id: 3,
          img: `https://cdn.hablaqui.cl/static/auth-3.webp`,
          text: ' Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios',
        },
        {
          id: 4,
          img: `https://cdn.hablaqui.cl/static/auth-4.webp`,
          text: 'Precios más asequibles, sin tener que renunciar a la calidad de una terapia presencial',
        },
      ],
      carousel: 0,
    }
  },
  computed: {
    /**
     * validacion de errores en el pass
     */
    passwordErrors() {
      const errors = []
      if (!this.$v.formData.newPassword.$dirty) return errors
      !this.$v.formData.newPassword.required && errors.push('Campo querido')
      !this.$v.formData.newPassword.maxLength &&
        errors.push('Maximo 100 caracteres')
      !this.$v.formData.newPassword.minLength &&
        errors.push('Minimo 5 caracteres')
      return errors
    },
    /**
     * validacion de errores en el pass
     */
    repetPasswordErrors() {
      const errors = []
      if (!this.$v.formData.repeatedPassword.$dirty) return errors
      !this.$v.formData.repeatedPassword.required &&
        errors.push('Campo querido')
      !this.$v.formData.repeatedPassword.sameAsPassword &&
        errors.push('Las contraseñas no son iguales')
      return errors
    },
  },
  created() {
    if (this.$route.query.token) {
      this.token = this.$route.query.token
      this.deleteQueryFromRoute()
    } else {
      this.$router.push({ name: 'auth' })
    }
  },
  methods: {
    /**
     * Envia el cambio de contraseña
     */
    async onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          this.loading = true
          await axios(`${this.$config.API_URL}/user/reset-password`, {
            method: 'patch',
            data: { password: this.formData.newPassword },
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          })
          this.loading = false
          this.logout()
        } catch (error) {
          this.snackBar({ content: evaluateErrorReturn(error), color: 'error' })
        } finally {
          this.loading = !this.loading
        }
      }
    },
    /**
     * remueve la query de la ruta
     */
    deleteQueryFromRoute() {
      this.$router.replace({ query: null })
    },
    /**
     * Cerrar sesion
     */
    async logout() {
      await this.$auth.logout()
      this.dialog = true
      setTimeout(() => {
        this.dialog = false
        this.$router.push('/auth')
      }, 3000)
    },
    ...mapMutations({
      snackBar: 'Snackbar/showMessage',
    }),
  },
  /**
   * Validaciones
   */
  validations: {
    formData: {
      newPassword: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(100),
      },
      repeatedPassword: {
        required,
        sameAsPassword: sameAs('newPassword'),
      },
    },
  },
}
</script>
