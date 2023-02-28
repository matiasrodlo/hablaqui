<template>
  <v-container style="height: 100vh; max-width: 1200px">
    <appbar class="hidden-sm-and-down" title="Sesiones" />
    <v-row>
      <v-col cols="12">
        <div>
          <v-card>
            <v-card-title>
              <v-row>
                <v-col>
                  <v-menu
                    ref="startMenu"
                    v-model="startMenu"
                    :close-on-content-click="false"
                    v-model:return-value="startDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="startDate"
                        label="Desde"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="startDate">
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="error"
                        @click="() => (startMenu = false)"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn text color="error" @click="() => (startDate = '')">
                        Borrar
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.startMenu.save(startDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col>
                  <v-menu
                    ref="endMenu"
                    v-model="endMenu"
                    :close-on-content-click="false"
                    v-model:return-value="endDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="endDate"
                        label="Hasta"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="endDate">
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="error"
                        @click="() => (endMenu = false)"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn text color="error" @click="() => (endDate = '')">
                        Borrar
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.endMenu.save(endDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col>
                  <v-select
                    v-model="statFilterText"
                    :item-value="status.value"
                    :item-text="status.text"
                    :items="status"
                    label="Realización"
                    clearable
                    @click:clear="statFilterText = ''"
                  >
                  </v-select>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="psyFilterText"
                    label="Filtro por Especialista"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="userFilterText"
                    label="Filtro por Usuario"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-select
                    v-model="payFilterText"
                    :item-value="payStatus.value"
                    :item-text="payStatus.text"
                    :items="payStatus"
                    label="Estado de Pago"
                    clearable
                  >
                  </v-select>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="sessionsHeaders"
                :items="filteredSessions"
                :items-per-page="5"
              >
              </v-data-table>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
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
  name: 'Sessions',
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
      // Menus de filtros
      dialog: false,
      endMenu: false,
      startMenu: false,
      // Filtros de la tabla de sesiones
      startDate: '',
      endDate: '',
      statFilterText: '',
      psyFilterText: '',
      userFilterText: '',
      payFilterText: '',
      // Headers de la tabla de sesiones
      sessionsHeaders: [
        { text: 'Consultante', value: 'user' },
        { text: 'Especialista', value: 'specialist' },
        { text: 'Fecha', value: 'date' },
        { text: 'Teléfono usuario', value: 'userPhone' },
        { text: 'Email Consultante', value: 'emailUser' },
        { text: 'Email Especialista', value: 'emailSpecialist' },
        { text: 'Estado de Realización', value: 'statusSession' },
        { text: 'Estado de Pago', value: 'paymentPlan' },
      ],
      // Sesiones
      sessions: [],
      // Estados de la sesión
      status: [
        { text: 'Pendiente', value: 'pending' },
        { text: 'Realizada', value: 'success' },
      ],
      // Estados de pago de la sesión
      payStatus: [
        { text: 'Pendiente', value: 'pending' },
        { text: 'Pagada', value: 'success' },
      ],
    }
  },
  computed: {
    filteredSessions() {
      // Método que filtra las sesiones según 5 condiciones, nombre de usuario, estatus de la sesión, nombre del psicólogo, fecha de la sesión y estado de pago
      return this.sessions.filter(
        (session) =>
          (this.userFilterText
            ? session.user
                .toLowerCase()
                .includes(this.userFilterText.toLowerCase())
            : true) &&
          (this.statFilterText
            ? session.statusSession.includes(this.statFilterText)
            : true) &&
          (this.psyFilterText
            ? session.specialist
                .toLowerCase()
                .includes(this.psyFilterText.toLowerCase())
            : true) &&
          (this.payFilterText
            ? session.paymentPlan.includes(this.payFilterText)
            : true) &&
          (this.startDate && this.endDate
            ? dayjs(dayjs(session.date, 'DD/MM/YYYY HH:mm')).isBetween(
                dayjs(this.startDate, 'YYYY-MM-DD'),
                dayjs(this.endDate, 'YYYY-MM-DD')
              )
            : true)
      )
    },
  },
  mounted() {
    this.initFetch()
  },
  methods: {
    async initFetch() {
      await this.getFormattedSessions()
    },
    ...mapMutations({
      snackBar: 'Snackbar/showMessage',
    }),
    async getFormattedSessions() {
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
