<template>
  <v-container style="height: 100vh; max-width: 1200px">
    <appbar class="hidden-sm-and-down" title="Tabla de pagos" />
    <v-row>
      <v-col cols="12">
        <div>
          <v-data-table
            :headers="headers"
            :items="specialist"
            sort-by="total"
            :sort-desc="true"
            class="elevation-1"
            v-model:page="page"
            hide-default-footer
            @page-count="pageCount = $event"
          >
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>Pagos pendientes</v-toolbar-title>
              </v-toolbar>
            </template>
            <template #item.action="{ item }">
              <v-btn
                :disabled="item.session.length === 0"
                small
                @click="setTransaction(item)"
              >
                Pagar
              </v-btn>
              <v-btn
                :disabled="item.session.length === 0"
                small
                @click="showSessionsToPay(item, 'Sesiones a pagar')"
              >
                Sesiones
              </v-btn>
              <v-btn small @click="showBankInfo(item)"> Datos bancarios </v-btn>
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount" />
          </div>
        </div>
      </v-col>
      <v-col cols="12">
        <div>
          <v-data-table
            :headers="headersTransactions"
            :items="filteredTransactions"
            sort-by="createdAt"
            :sort-desc="false"
            class="elevation-1 mb-5"
          >
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>Pagos realizados</v-toolbar-title>
                <v-spacer />
                <v-text-field
                  v-model="start"
                  type="datetime-local"
                  label="Desde"
                />
                <v-spacer />
                <v-text-field
                  v-model="end"
                  type="datetime-local"
                  label="Hasta"
                />
              </v-toolbar>
            </template>
            <template #item.action="{ item }">
              <v-btn small @click="showSessionsToPay(item, 'Sesiones pagadas')">
                Sesiones
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
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
          <span class="text-h5">{{ label }}</span>
        </v-card-title>
        <v-data-table :headers="headersSessions" :items="sessions" />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showBank"
      max-width="500"
      @click:outside="
        () => {
          showBank = false
        }
      "
    >
      <v-card max-width="500">
        <v-card-title>
          <span class="text-h5">Datos bancarios</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div>
                Banco:
                <span class="font-weight-black">
                  {{ paymentMethods.bank }}
                </span>
              </div>
            </v-col>
            <v-col cols="6">
              <div>
                Rut:
                <span class="font-weight-black">{{ paymentMethods.rut }}</span>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              Numero de cuenta:
              <span class="font-weight-black">{{
                paymentMethods.accountNumber
              }}</span>
            </v-col>
            <v-col cols="6">
              <div>
                Tipo de cuenta:
                <span class="font-weight-black">{{
                  paymentMethods.accountType
                }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
// import axios from 'axios'
import { mapMutations } from 'vuex'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import timezone from 'dayjs/plugin/timezone'
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn'
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

export default {
  name: 'Payment',
  components: {
    appbar: () => import('~/components/dashboard/AppbarProfile'),
  },
  layout: 'dashboard',
  middleware: ['auth'],
  data() {
    return {
      page: 1,
      pageCount: 0,
      specialist: [],
      transactions: [],
      start: '',
      end: '',
      label: 'Sesiones a pagar',
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Apellido', value: 'lastName' },
        { text: 'Nombre de usuario', value: 'username' },
        { text: 'Correo', value: 'email' },
        { text: 'Monto total', value: 'total' },
        { text: 'Acciones', value: 'action', sortable: false },
      ],
      headersSessions: [
        { text: 'Fecha', value: 'date' },
        { text: 'Consultante', value: 'name' },
        { text: 'Correo', value: 'email' },
        { text: 'N° de sesión', value: 'sessionNumber' },
        { text: 'Valor de la sesion', value: 'price' },
        { text: 'Cupón', value: 'coupon' },
      ],
      headersTransactions: [
        { text: 'Fecha', value: 'createdAt' },
        { text: 'Nombre', value: 'name' },
        { text: 'Apellido', value: 'lastName' },
        { text: 'Nombre de usuario', value: 'username' },
        { text: 'Correo', value: 'email' },
        { text: 'Monto total', value: 'total' },
        { text: 'Acciones', value: 'action', sortable: false },
      ],
      dialog: false,
      showBank: false,
      paymentMethods: {},
      sessions: [],
    }
  },
  computed: {
    filteredTransactions() {
      let transactions = []
      if (this.start === '' || this.end === '') transactions = this.transactions
      else {
        transactions = this.transactions.filter((t) =>
          dayjs(t.createdAt, 'DD/MM/YYYY HH:mm').isBetween(
            dayjs(this.start, 'yyyy-MM-DDTHH:mm'),
            dayjs(this.end, 'yyyy-MM-DDTHH:mm')
          )
        )
      }
      return transactions
    },
  },
  mounted() {
    this.initFetch()
  },
  methods: {
    async initFetch() {
      const { amounts } = await this.$axios.$get('/dashboard/pay-mount')
      this.specialist = amounts
      const { transactions } = await this.$axios.$get('/transaction/get/all')
      this.transactions = transactions
    },
    async setTransaction(item) {
      try {
        const { data } = await this.$axios('/transaction/generate', {
          method: 'POST',
          data: {
            total: item.total,
            session: item.session,
            idSpec: item._id,
          },
        })

        const index = this.specialist.indexOf(item)
        this.specialist[index].total = 0
        this.specialist[index].session = []
        this.snackBar({ content: data.message, color: 'success' })
      } catch (error) {
        this.snackBar({ content: evaluateErrorReturn(error), color: 'error' })
      }
    },
    showSessionsToPay(item, label) {
      this.label = label
      this.dialog = true
      this.sessions = item.session
    },
    showBankInfo(item) {
      this.paymentMethods = item.paymentMethod
      this.showBank = true
    },
    ...mapMutations({
      snackBar: 'Snackbar/showMessage',
    }),
  },
}
</script>

<style></style>
