<template>
  <v-container style="height: 100vh; max-width: 1200px">
    <appbar class="hidden-sm-and-down" title="Reagendamiento" />
    <v-row style="height: calc(100vh - 110px); overflow-y: auto">
      <v-col class="text--secondary" cols="6">
        <v-list>
          <v-subheader>Especialistas</v-subheader>
          <v-list-item
            v-for="item in specialists"
            :key="item._id"
            :disabled="false"
            @click="
              () => {
                getClients(item._id)
              }
            "
          >
            {{ item.name }} {{ item.lastName }}
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="text--secondary" cols="6">
        <v-list>
          <v-subheader>Consultantes</v-subheader>
          <v-list-item
            v-for="client in clients"
            :key="client._id"
            :disabled="!clients"
            @click="
              () => {
                getSession(client)
              }
            "
          >
            {{ client.name }} {{ client.lastName }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" fullscreen>
      <v-card max-width="1200px">
        <v-toolbar flat color="primary" class="white--text">
          <v-spacer></v-spacer>
          <v-btn
            text
            color="white"
            @click="
              dialog = false
              selectedSession = null
            "
            >Cerrar</v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-3">
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="sessions"
                @click:row="clickSession"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-row class="ma-4">
          <v-col cols="2">
            <v-subheader>Fecha de sesión: </v-subheader>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="sessionDate"
              type="datetime-local"
              label="Fecha de sesión"
            />
            <v-btn :disabled="!selectedSession" @click="clicked">
              Guardar
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// import axios from 'axios'
import { mapMutations } from 'vuex'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/** * pagina de reagendar sesion */

export default {
  name: 'Panel',
  components: {
    appbar: () => import('~/components/dashboard/AppbarProfile'),
  },
  layout: 'dashboard',
  middleware: ['auth'],
  data() {
    return {
      specialists: [],
      clients: [],
      selectedClient: {},
      loading: true,
      dialog: false,
      sessions: [],
      selectedSession: null,
      sessionDate: '',
      selectedPlan: null,
      headers: [
        {
          text: 'Fecha de sesión',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Fecha de pago', value: 'paymentDate' },
        { text: 'Estatus', value: 'status' },
      ],
    }
  },
  mounted() {
    this.initFetch()
  },
  methods: {
    /**
     * Obtiene los datos iniciales
     */
    async initFetch() {
      await this.getSpecialist()
      this.loading = false
    },
    /**
     * mapea y ordena los especialistas
     */
    async getSpecialist() {
      const { specialists } = await this.$axios.$get('/specialists/all')
      this.specialists = specialists.sort((a, b) => {
        const fa = a.name.toLowerCase()
        const fb = b.name.toLowerCase()

        if (fa < fb) {
          return -1
        }
        if (fa > fb) {
          return 1
        }
        return 0
      })
      this.specialists = this.specialists.map((specialist) => {
        const spec = specialist
        if (!specialist.experience.length)
          spec.experience.push({ title: '', place: '', start: '', end: '' })
        if (!specialist.formation.length)
          spec.formation.push({
            formationType: '',
            description: '',
            start: '',
            end: '',
          })
        if (isEmpty(specialist.paymentMethod))
          specialist.paymentMethod = {
            bank: '',
            accountType: '',
            accountNumber: '',
            rut: '',
            name: '',
            email: '',
          }
        return spec
      })
    },
    /**
     * Obtiene los clientes
     */
    async getClients(id) {
      const { users } = await this.$axios.$get(`/specialist/clients/${id}`)
      this.clients = users.filter((user) => !!user.plan)
    },
    /**
     * Obtiene la sesiones del cliente pasado
     */
    getSession(client) {
      this.dialog = true
      this.selectedClient = client
      const plan = client.plan
      this.selectedPlan = plan
      this.sessions = plan ? plan.session : []
    },
    /**
     * Selecciona un fila en la tabla sesiones
     */
    clickSession(value) {
      this.selectedSession = value
      this.sessionDate = dayjs
        .tz(dayjs(value.date, 'MM/DD/YYYY HH:mm'))
        .format('YYYY-MM-DDTHH:mm')
    },
    /**
     * Envia la Reagenda del evento
     */
    async clicked() {
      const res = await this.$axios.$post('/dashboard/session/reschedule', {
        sessionsId: this.selectedClient.sessionsId,
        planId: this.selectedPlan._id,
        sessionId: this.selectedSession._id,
        newDate: this.sessionDate,
      })
      if (res === 409)
        this.snackBar({
          content: res.message,
          color: 'error',
        })
      else {
        this.sessionDate = ''
        this.snackBar({
          content: res.message,
          color: 'success',
        })
      }
    },
    ...mapMutations({
      snackBar: 'Snackbar/showMessage',
    }),
  },
}
</script>

<style></style>
