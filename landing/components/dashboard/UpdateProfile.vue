<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="formUser.name"
        filled
        outlined
        readonly
        disabled
        dense
        hide-details
        label="Nombre"
        :error-messages="nameErrors"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="formUser.email"
        filled
        hide-details
        outlined
        dense
        label="Correo electronico"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="formUser.lastName"
        filled
        disabled
        outlined
        dense
        hide-details
        label="Apellido"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="formUser.rut"
        disabled
        filled
        outlined
        hide-details
        dense
        label="RUT"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="formUser.phone"
        filled
        outlined
        hide-details
        dense
        label="Número de teléfono"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-menu
        ref="menu"
        v-model="bmenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="formUser.birthDate"
            label="Fecha de nacimiento"
            readonly
            filled
            disabled
            outlined
            hide-details
            dense
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="formUser.birthDate"
          locale="es"
          v-model:active-picker="activePicker"
          :max="
            new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .substr(0, 10)
          "
          min="1950-01-01"
          @change="save"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col v-if="$auth.$state.user.role === 'specialist'" cols="12" md="6">
      <v-row>
        <v-col>
          <v-select
            v-model="region"
            :items="regiones"
            filled
            outlined
            hide-details
            dense
            label="Región"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            v-model="comuna"
            :disabled="!region"
            :items="comunas"
            filled
            outlined
            hide-details
            dense
            label="Comuna"
          ></v-select>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="formUser.direction"
        filled
        outlined
        hide-details
        dense
        label="Dirección"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-select
        v-model="formUser.gender"
        :items="[
          { text: 'Hombre', value: 'male' },
          { text: 'Mujer', value: 'female' },
          { text: 'Transgénero', value: 'transgender' },
        ]"
        filled
        disabled
        outlined
        hide-details
        dense
        label="Género"
      ></v-select>
    </v-col>
    <v-col cols="12" md="6">
      <v-combobox
        v-model="formUser.timeZone"
        dense
        filled
        hide-details
        label="Zona horaria"
        :items="timezone"
        outlined
        v-model:search-input="zone"
      >
        <template #no-data>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                No se encontraron resultados que coincidan con "<strong>
                  {{ zone }}
                </strong>
                " .
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
    </v-col>
    <v-col cols="12" class="text-center">
      <v-btn
        :loading="loadingUser"
        color="primary"
        depressed
        :disabled="hasChanges"
        class="px-16"
        style="border-radius: 10px"
        @click="updateProfile"
      >
        Guardar
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { cloneDeep } from 'lodash'
import { validationMixin } from 'vuelidate'
import { mdiInformationOutline } from '@mdi/js'
/**
 * componente de actualizar perfil
 */
export default {
  mixins: [validationMixin],
  props: {
    specialist: {
      type: Object,
      default: null,
    },
    setSpecialist: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      mdiInformationOutline,
      activePicker: null,
      date: null,
      bmenu: false,
      zone: '',
      formUser: {
        name: '',
        lastName: '',
        phone: '',
        email: '',
        timeZone: '',
        address: '',
        birthDate: '',
        direction: '',
        gender: '',
      },
      region: '',
      comuna: '',
      timezone: [],
      loadingUser: false,
      regiones: [],
      comunas: [],
      comunasRegiones: [],
    }
  },
  computed: {
    /**
     * verifica que el nombre sea valido
     */
    nameErrors() {
      const errors = []
      if (!this.$v.formUser.name.$dirty) return errors
      !this.$v.formUser.name.required && errors.push('El nombre es querido')
      !this.$v.formUser.name.maxLength && errors.push('Maximo 90 caracteres')
      !this.$v.formUser.name.minLength && errors.push('Minimo 3 caracteres')
      return errors
    },
    /**
     * Verdadero si tiene cambios por guardar
     */
    hasChanges() {
      return (
        JSON.stringify({
          name: this.formUser.name,
          lastName: this.formUser.lastName,
          phone: this.formUser.phone,
          email: this.formUser.email,
          direction: this.formUser.direction,
          timeZone: this.formUser.timeZone,
          gender: this.formUser.gender,
          birthDate: this.formUser.birthDate,
          region: this.region,
          comuna: this.comuna,
        }) ===
        JSON.stringify({
          name: this.$auth.$state.user.name,
          lastName: this.$auth.$state.user.lastName,
          phone: this.$auth.$state.user.phone,
          email: this.$auth.$state.user.email,
          direction: this.$auth.$state.user.direction,
          timeZone: this.$auth.$state.user.timeZone,
          gender: this.$auth.$state.user.gender,
          birthDate: this.$auth.$state.user.birthDate,
          region: this.specialist ? this.specialist.region : '',
          comuna: this.specialist ? this.specialist.comuna : '',
        })
      )
    },
  },
  watch: {
    /**
     * listener menu de fecha de nacimiento
     */
    bmenu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    /**
     * listener se activa si cambia la region para establecer las comunas segun eso
     */
    region(newVal) {
      if (newVal) {
        this.comunas = this.comunasRegiones.find(
          (item) => item.region === this.region
        ).comunas
      }
    },
  },
  async mounted() {
    // copia profunda del user
    this.formUser = {
      ...cloneDeep(this.$auth.$state.user),
    }
    // obtenemos la zona
    const { data } = await axios.get(
      `${this.$config.LANDING_URL}/timezone.json`
    )
    // obtenemos las comunas y regiones de chile
    const response = await axios.get(
      `${this.$config.LANDING_URL}/comunas-regiones.json`
    )
    this.comunasRegiones = response.data
    this.regiones = response.data.map((i) => i.region)
    this.timezone = data
    if (this.specialist && this.$auth.$state.user.role === 'specialist') {
      this.comuna = this.specialist.comuna
      this.region = this.specialist.region
    }
  },
  methods: {
    /**
     * Envia la actualizacion del perfil
     */
    async updateProfile() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loadingUser = true
        const user = await this.updateUser(this.formUser)
        if (this.$auth.$state.user.role === 'specialist') {
          const specialist = await this.updateSpecialist({
            ...this.specialist,
            name: this.formUser.name,
            lastName: this.formUser.lastName,
            birthDate: this.formUser.birthDate,
            gender: this.formUser.gender,
            comuna: this.comuna,
            region: this.region,
          })
          this.username = specialist.username
          this.comuna = specialist.comuna
          this.region = specialist.region
          this.setSpecialist(specialist)
        }
        this.$auth.setUser(user)
        this.$v.$reset()
        this.loadingUser = false
      }
    },
    /**
     * utilizado por e picker de fecha
     */
    save(date) {
      this.$refs.menu.save(date)
    },
    ...mapActions({
      updateSpecialist: 'Specialist/updateSpecialist',
      updateUser: 'User/updateUser',
    }),
  },
  validations: {
    formUser: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(99),
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
