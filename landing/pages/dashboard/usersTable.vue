<!--Tabla de Usuarios registrados en la plataforma-->
<template>
  <v-container style="height: 100vh; max-width: 1200px">
    <appbar class="hidden-sm-and-down" title="Usuarios" />
    <v-row>
      <v-col cols="12">
        <div>
          <v-card>
            <v-card-title>
              <v-row>
                <v-col>
                  <!--Filtro por nombre-->
                  <v-text-field
                    v-model="nameFilterText"
                    label="Nombre"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <!--Filtro por apellido-->
                  <v-text-field
                    v-model="lastNameFilterText"
                    label="Apellido"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <!--Filtro por correo-->
                  <v-text-field
                    v-model="mailFilterText"
                    label="Correo"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <!--Filtro por teléfono-->
                  <v-text-field
                    v-model="phoneFilterText"
                    label="Teléfono"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <!--Filtro por ID-->
                  <v-text-field
                    v-model="idFilterText"
                    label="ID"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <!--Filtro por rut-->
                  <v-text-field
                    v-model="rutFilterText"
                    label="Rut"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <!--Tabla de usuarios-->
              <v-data-table
                :headers="usersHeaders"
                :items="filteredUsers"
                :items-per-page="5"
              >
                <!--Botón para ver las sesiones de un usuario-->
                <template #item.action="{ item }">
                  <v-btn small @click="showUserSessions(item)">
                    Sesiones
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <!--Dialogo para ver las sesiones de un usuario-->
    <v-dialog
      v-model="dialog"
      @click:outside="
        () => {
          dialog = false
        }
      "
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Sesiones del usuario</span>
        </v-card-title>
        <!--Tabla de sesiones de un usuario-->
        <v-data-table :headers="headersUserSessions" :items="userSessions" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('America/Santiago')

export default {
  // Nombre de la página
  name: 'UsersTable',
  components: {
    appbar: () => import('~/components/dashboard/AppbarProfile'),
  },
  layout: 'dashboard',
  middleware: ['auth'],
  data() {
    return {
      page: 1,
      pageCount: 0,
      psychologist: [],
      users: [],
      // Dialogo para ver las sesiones de un usuario
      dialog: false,
      // Filtros de la tabla de usuarios
      nameFilterText: '',
      lastNameFilterText: '',
      mailFilterText: '',
      phoneFilterText: '',
      idFilterText: '',
      rutFilterText: '',
      // Tabla de sesiones de un usuario
      userSessions: [],
      // Headers de la tabla de usuarios
      usersHeaders: [
        { text: 'Nombre', value: 'name' },
        { text: 'Apellido', value: 'lastName' },
        { text: 'Correo', value: 'email' },
        { text: 'Teléfono', value: 'phone' },
        { text: 'ID', value: '_id' },
        { text: 'Rut', value: 'rut' },
        { text: 'Acciones', value: 'action', sortable: false },
      ],
      // Headers de la tabla de sesiones de un usuario
      headersUserSessions: [
        { text: 'Fecha', value: 'date' },
        { text: 'Consultante', value: 'name' },
        { text: 'Correo', value: 'email' },
        { text: 'N° de sesión', value: 'sessionNumber' },
        { text: 'Estado de realización', value: 'status' },
        { text: 'Estado de Pago', value: 'paidToSpecialist' },
      ],
      // Sesiones de un usuario
      sessions: [],
    }
  },
  computed: {
    // Cargar usuarios por los filtros de la tabla
    filteredUsers() {
      return this.users.filter(
        (user) =>
          (this.nameFilterText === ''
            ? true
            : user.name === undefined
            ? false
            : user.name
                .toLowerCase()
                .includes(this.nameFilterText.toLowerCase())) &&
          (this.lastNameFilterText === ''
            ? true
            : user.lastName === undefined
            ? false
            : user.lastName
                .toLowerCase()
                .includes(this.lastNameFilterText.toLowerCase())) &&
          (this.mailFilterText === ''
            ? true
            : user.email === undefined
            ? false
            : user.email
                .toLowerCase()
                .includes(this.mailFilterText.toLowerCase())) &&
          (this.phoneFilterText === ''
            ? true
            : user.phone === undefined
            ? false
            : user.phone
                .toLowerCase()
                .includes(this.phoneFilterText.toLowerCase())) &&
          user._id.includes(this.idFilterText.toLowerCase()) &&
          (this.rutFilterText === ''
            ? true
            : user.rut === undefined
            ? false
            : user.rut.includes(this.rutFilterText.toLowerCase()))
      )
    },
  },
  mounted() {
    this.initFetch()
  },
  methods: {
    async initFetch() {
      await this.getFormattedSessions()
      const { amounts } = await this.$axios.$get('/dashboard/pay-mount')
      this.psychologist = amounts
      const { transactions } = await this.$axios.$get('/transaction/get/all')
      this.transactions = transactions
      const usersObjects = await this.getUsers()
      this.users = usersObjects.users
    },
    async getUsers() {
      // Obtener usuarios
      try {
        const { data } = await this.$axios('/dashboard/get-users', {
          method: 'GET',
        })
        return data
      } catch (e) {
        this.snackBar({
          content: e,
          color: 'error',
        })
      }
    },
    showUserSessions(item) {
      // Mostrar sesiones de un usuario
      this.userSessions = item.sessions
      this.userSessions.forEach((session) => {
        session.name = item.name
        session.email = item.email
      })
      this.dialog = true
    },
    ...mapMutations({
      snackBar: 'Snackbar/showMessage',
    }),
    async getFormattedSessions() {
      // Obtener sesiones formateadas
      try {
        const { data } = await this.$axios(
          '/sessions/get-all-sessions-formatted',
          {
            method: 'GET',
          }
        )
        const { formattedSessions } = data
        this.sessions = formattedSessions
        return formattedSessions
      } catch (e) {
        this.snackBar({
          content: e,
          color: 'error',
        })
      }
    },
  },
}
</script>
<style></style>
