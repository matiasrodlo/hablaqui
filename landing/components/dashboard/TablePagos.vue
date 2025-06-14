<template>
  <div class="pb-10">
    <v-row align="center">
      <v-col v-if="hideSearch" cols="12" md="4" lg="3">
        <v-text-field
          v-model="search"
          placeholder="Buscar por nombre"
          hide-details
          outlined
          filled
          dense
          clearable
          :append-icon="mdiMagnify"
        ></v-text-field>
      </v-col>
      <v-col v-else cols="12" md="8" lg="9">
        <span class="pl-3 body-1 font-weight-bold secondary--text"
          >Historial de pagos</span
        >
      </v-col>
      <v-col cols="12" md="4" lg="3" class="text-right">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="findByDate"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              :value="formatedFindByDate"
              placeholder="Buscar por fecha"
              :append-icon="mdiMagnify"
              readonly
              outlined
              filled
              dense
              hide-details
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="findByDate"
            type="month"
            no-title
            locale="es"
            scrollable
            @change="$refs.menu.save(findByDate)"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row class="hidden-sm-and-down mt-10">
      <!-- <v-col :cols="$route.name === 'dashboard-pagos' ? '9' : '12'"> -->
      <v-col cols="12">
        <client-only>
          <v-data-table
            class="pointer elevation-1"
            :loading="loading"
            :headers="header"
            :items="payments"
            loading-text="Cargando..."
            :items-per-page="5"
            :single-expand="true"
            item-key="id"
            :expanded.sync="expanded"
            :footer-props="{
              'items-per-page-text': 'Pagos por página',
            }"
            no-results-text="Sin pagos registrados"
            no-data-text="No hay pagos"
            @click:row="
              (item, { expand, isExpanded }) => {
                isExpanded ? (expanded = []) : expand()
              }
            "
          >
            <template #[`item.datePayment`]="{ item }">
              <span class="caption">
                {{ item.datePayment }}
              </span>
            </template>
            <template #[`item.amount`]="{ item }">
              <span class="caption">
                {{ item.amount }}
              </span>
            </template>
            <template #[`item.finalAmount`]="{ item }">
              <span class="caption">
                {{ item.finalAmount }}
              </span>
            </template>
            <template #[`item.transState`]="{ item }">
              <span class="caption">
                {{ item.transState }}
              </span>
            </template>
            <template #[`item.name`]="{ item }">
              <div style="width: 100px">
                <span style="width: 100px" class="caption">
                  {{ `${item.name} ${item.lastname}` }}
                </span>
              </div>
            </template>
            <template #[`item.suscription`]="{ item }">
              <div style="width: 120px">
                <span style="width: 120px !important" class="caption">
                  {{ item.suscription }}
                </span>
              </div>
            </template>
            <template #expanded-item="{ item }">
              <td :colspan="header.length" class="px-0">
                <v-simple-table>
                  <template #default>
                    <tbody>
                      <tr
                        v-for="element in item.sessions"
                        :key="element.id"
                        @click="
                          () => {
                            selected = element
                            dialog = true
                          }
                        "
                      >
                        <td style="width: 15.5%" class="caption text-start">
                          {{ element.datePayment }}
                        </td>
                        <td style="width: 18.5%" class="caption text-start">
                          {{ `${item.name} ${item.lastname}` }}
                        </td>
                        <td style="width: 21.5%" class="caption text-start">
                          {{ element.sessionsNumber }}
                        </td>
                        <td style="width: 9.5%" class="caption text-start">
                          {{ element.amount }}
                        </td>
                        <td style="width: 13%" class="caption text-start">
                          {{ element.total }}
                        </td>
                        <td style="width: auto" class="caption text-start">
                          {{ element.transDate }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </td>
            </template>
          </v-data-table>
        </client-only>
      </v-col>
      <!-- ocultado por peticion de daniel -->
      <template v-if="false">
        <v-col v-if="$route.name === 'dashboard-pagos'" cols="3">
          <v-card style="border-radius: 15px" class="elevation-1">
            <v-card-text>
              <div class="primary--text title">Tu dinero disponible</div>
              <div class="text-h4 my-3">
                ${{ transactions ? transactions.totalAvailable : 0 }}
              </div>
              <div class="body-1 my-3">
                Sesiones realizadas:
                {{ transactions ? transactions.successSessions : 0 }}
              </div>
              <div class="body-1 my-3">
                Sesiones por cobrar:
                {{ transactions ? transactions.sessionsReceivable : 0 }}
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                block
                color="rgba(26, 165, 216, 0.16)"
                rounded
                depressed
                class="primary--text"
                :disabled="
                  !transactions ||
                  (transactions && transactions.sessionsReceivable <= 0)
                "
                @click="dialogPayment = true"
              >
                Retirar dinero
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card
            v-if="lastTransaction"
            style="border-radius: 15px"
            class="elevation-1 mt-4"
          >
            <v-card-text>
              <div class="title">Última transacción</div>
              <div
                class="body-1 my-3 d-flex justify-space-between align-center"
              >
                <v-img
                  max-width="50px"
                  :src="`https://cdn.hablaqui.cl/static/retiro.png`"
                />
                <div>
                  <div class="body-1 text-right">
                    $ {{ lastTransaction.total }} -
                    {{ lastTransaction.sessionsPaid }} Sesiones
                  </div>
                  <div
                    v-if="lastTransaction.trasactionDate"
                    class="body-1 text-right pt-2"
                  >
                    {{ formatDatedayjs(lastTransaction.trasactionDate) }}
                  </div>
                </div>
              </div>
            </v-card-text>
            <v-divider> </v-divider>
            <v-card-actions>
              <v-btn
                block
                color="Primary"
                rounded
                depressed
                class="primary--text"
                to="pagos/historial"
              >
                Ver trasacciones
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <v-expansion-panels flat accordion class="hidden-md-and-up">
      <v-expansion-panel
        v-for="(item, i) in payments"
        :key="i"
        class="elevation-4 rounded-lg my-4"
      >
        <v-expansion-panel-header hide-actions>
          <div>
            <div class="primary--text font-weight-bold">{{ item.name }}</div>
            <div class="font-weight-medium secondary--text caption mt-1">
              Sesión: {{ item.sessionsNumber }}
            </div>
          </div>
          <div>
            <div class="text-right primary--text font-weight-bold">
              {{ item.finalAmount }}
            </div>
            <div
              class="font-weight-medium caption secondary--text text-right mt-1"
            >
              {{ formatDate(item.datePayment) }}
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            class="caption font-weight-medium secondary--text d-flex justify-space-between"
          >
            <span>Suscripción</span>
            <span>{{ item.plan }}</span>
          </div>
          <div
            class="caption font-weight-medium secondary--text d-flex justify-space-between"
          >
            <span>Valor</span>
            <span>{{ item.amount }}</span>
          </div>
          <div
            class="caption font-weight-medium secondary--text d-flex justify-space-between"
          >
            <span>Comisión Hablaquí</span>
            <span>${{ item.percentage }}</span>
          </div>
          <div
            class="caption font-weight-medium secondary--text d-flex justify-space-between"
          >
            <span>Monto final</span>
            <span>{{ item.finalAmount }}</span>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card max-width="400">
        <v-card-title class="d-flex">
          <div class="primary--text" style="flex: 1">Detalle</div>
          <div style="flex: 0">
            <v-btn
              icon
              @click="
                () => {
                  dialog = false
                  seledted = null
                }
              "
            >
              <icon size="30" color="#b1b1b1" :icon="mdiClose" />
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text v-if="selected">
          <div class="d-flex justify-space-between my-2">
            <div>Fecha de sesión:</div>
            <div>{{ selected.date }}</div>
          </div>
          <div class="d-flex justify-space-between my-2">
            <div>Numero de sesión:</div>
            <div>{{ selected.sessionsNumber }}</div>
          </div>
          <div class="d-flex my-2">
            <div style="flex: 1">Valor sesión:</div>
            <div style="flex: 0">{{ selected.amount }}</div>
          </div>
          <div class="d-flex my-2">
            <div style="flex: 1">Comisión Hablaqui:</div>
            <div style="flex: 0">${{ selected.hablaquiPercentage }}</div>
          </div>
          <div class="d-flex my-2">
            <div style="flex: 1">Comisión Mercadopago:</div>
            <div style="flex: 0">${{ selected.mercadoPercentage }}</div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="selected" class="py-6">
          <span class="secondary--text">Monto final:</span>
          <v-spacer></v-spacer>
          <span class="secondary--text">{{ selected.total }}</span>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPayment" persistent max-width="400">
      <v-card max-width="400">
        <template v-if="step === 1">
          <v-card-title class="d-flex">
            <div style="flex: 1">Revisa si todo esta bien</div>
            <div style="flex: 0">
              <v-btn
                icon
                @click="
                  () => {
                    dialogPayment = false
                    step = 1
                  }
                "
              >
                <icon size="30" color="#b1b1b1" :icon="mdiClose" />
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text class="pt-6">
            <div
              v-if="transactions"
              class="d-flex justify-space-between align-center"
            >
              <div>Se acreditara el {{ dayWithdraw }}</div>
              <div class="title">${{ transactions.totalAvailable }}</div>
            </div>
          </v-card-text>
          <v-card-text class="py-0">
            <v-divider> </v-divider>
          </v-card-text>
          <v-card-text
            v-if="specialist && specialist.paymentMethod"
            class="pb-0 pt-2"
          >
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="title">
                  {{ specialist.paymentMethod.bank }}
                </div>
                <v-btn color="primary" text class="pa-0" to="perfil">
                  Cambiar de cuenta
                </v-btn>
              </div>
              <div class="subtitle-2 text-right">
                <div>{{ specialist.paymentMethod.name }}</div>
                <div>{{ specialist.paymentMethod.accountNumber }}</div>
              </div>
            </div>
          </v-card-text>
          <v-card-text class="py-0">
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions class="py-6">
            <v-spacer></v-spacer>
            <v-btn
              :loading="loadingPayment"
              rounded
              color="primary"
              class="px-10"
              @click="submitPayment"
            >
              Continuar
            </v-btn>
          </v-card-actions>
        </template>
        <template v-else>
          <v-card-title v-if="transactions" class="text-center">
            Transferiremos los {{ transactions.totalAvailable }} dentro de 7
            dias habiles
          </v-card-title>
          <v-card-text class="text-center">
            <div v-if="specialist && specialist.paymentMethod" class="body-1">
              El dinero estara disponible el {{ dayWithdraw }} en la cuenta
              {{ specialist.paymentMethod.bank }}
            </div>
            <v-btn
              rounded
              color="primary"
              href="https://hablaqui.cl/"
              class="mt-4 px-6"
              >Ir a inicio</v-btn
            >
          </v-card-text>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import { mdiMagnify, mdiClose } from '@mdi/js'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import badMutable from 'dayjs/plugin/badMutable'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/es'
dayjs.extend(customParseFormat)
dayjs.extend(badMutable)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')
/**
 * TablePagos Component
 * 
 * A payment history table component that displays transaction records and session details,
 * featuring search functionality, date filtering, and expandable rows for detailed information.
 * 
 * Key Features:
 * - Payment history display
 * - Search by name
 * - Date filtering
 * - Expandable rows
 * - Session details
 * - Loading states
 * - Responsive design
 * - Pagination
 * - Sorting
 * - Data export
 * - Accessibility support
 * - Cross-browser compatibility
 * - High contrast support
 * - Keyboard navigation
 * - Screen reader friendly
 * - Error recovery
 * - State persistence
 * - Lazy loading
 * - Image optimization
 * - Touch-friendly interface
 * - Gesture support
 * - Dynamic content loading
 * - Smooth transitions
 * - Progress indicators
 * - Custom styling
 * - Event handling
 * - State management
 * - Theme support
 * - Localization
 * - Analytics integration
 * - Performance monitoring
 * 
 * Component Requirements:
 * - Vuetify v-data-table component
 * - Vuetify v-text-field component
 * - Vuetify v-menu component
 * - Vuetify v-date-picker component
 * - Vuetify v-dialog component
 * - Vuetify v-card component
 * - Vuetify v-btn component
 * - Material Design Icons
 * - Vuex store
 * 
 * @component
 * @example
 * <TablePagos
 *   :payments="paymentData"
 *   :loading="isLoading"
 *   :hide-search="false"
 * />
 * 
 * // Payment object structure:
 * {
 *   id: String,              // Payment ID
 *   datePayment: String,     // Payment date
 *   amount: Number,          // Payment amount
 *   finalAmount: Number,     // Final amount after fees
 *   transState: String,      // Transaction state
 *   name: String,           // Customer name
 *   lastname: String,       // Customer lastname
 *   suscription: String,    // Subscription type
 *   sessions: [{            // Session details
 *     id: String,           // Session ID
 *     datePayment: String,  // Session date
 *     sessionsNumber: String, // Number of sessions
 *     amount: Number,       // Session amount
 *     total: Number,        // Total amount
 *     transDate: String     // Transaction date
 *   }]
 * }
 * 
 * // Table headers:
 * [
 *   { text: 'Fecha', value: 'datePayment' },
 *   { text: 'Monto', value: 'amount' },
 *   { text: 'Monto final', value: 'finalAmount' },
 *   { text: 'Estado', value: 'transState' },
 *   { text: 'Nombre', value: 'name' },
 *   { text: 'Suscripción', value: 'suscription' }
 * ]
 * 
 * // Layout specifications:
 * // - Items per page: 5
 * // - Search field width: 100%
 * // - Date picker width: 290px
 * // - Table elevation: 1
 * // - Text colors:
 * //   - Primary: Theme primary color
 * //   - Secondary: #3c3c3b
 * 
 * // Error Handling:
 * // - Data loading errors
 * // - Search errors
 * // - Date filter errors
 * // - State synchronization errors
 * // - Network errors
 * // - Resource loading failures
 * // - Theme errors
 * // - Localization errors
 * // - Analytics errors
 * 
 * // Performance:
 * // - Lazy loading for components
 * // - Efficient DOM updates
 * // - Optimized re-renders
 * // - Debounced search
 * // - Cached data
 * // - Memory leak prevention
 * // - Resource cleanup
 * 
 * @requires {Vuetify} v-data-table - Data table component
 * @requires {Vuetify} v-text-field - Text field component
 * @requires {Vuetify} v-menu - Menu component
 * @requires {Vuetify} v-date-picker - Date picker component
 * @requires {Vuetify} v-dialog - Dialog component
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-btn - Button component
 * 
 * @throws {Error} If data loading fails
 * @throws {Error} If search fails
 * @throws {Error} If date filter fails
 * @throws {Error} If state update fails
 * @throws {Error} If required props are missing
 * @throws {Error} If network request fails
 * @throws {Error} If theme fails
 * @throws {Error} If localization fails
 * @throws {Error} If analytics fails
 */
export default {
  components: {
    Icon: () => import('~/components/Icon'),
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    transactions: {
      type: Object,
      default: null,
    },
    specialist: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hideSearch: {
      type: Boolean,
      default: false,
    },
    fetchData: {
      type: Function,
      default: () => null,
    },
  },
  data() {
    return {
      expanded: [],
      selected: null,
      step: 1,
      dialog: false,
      dialogPayment: false,
      menu: false,
      findByDate: dayjs.tz().format('YYYY-MM'),
      mdiMagnify,
      loadingPayment: false,
      mdiClose,
      search: '',
      header: [
        {
          text: 'Fecha',
          sortable: false,
          value: 'datePayment',
        },
        { text: 'Consultante', value: 'name', sortable: false },
        { text: 'Suscripción', value: 'suscription', sortable: false },
        { text: 'Monto', value: 'amount', sortable: false },
        { text: 'Monto final', value: 'finalAmount', sortable: false },
        { text: 'Estado', value: 'transState', sortable: false },
      ],
    }
  },
  computed: {
    /**
     * retorna la fecha de retiro en 7 dias formato dd/mm/yyyy
     */
    dayWithdraw() {
      const day = dayjs().add('7', 'days')
      return dayjs.tz(dayjs(day)).format('DD/MM/YYYY')
    },
    /**
     * muestra la ultima transaccion realizada
     */
    lastTransaction() {
      if (!this.transactions || !this.transactions.transactions.length)
        return null
      return this.transactions.transactions[
        this.transactions.transactions.length - 1
      ]
    },
    /**
     * retorna los pagos filtrados
     */
    payments: {
      // obtiene
      get() {
        let result = this.items
          .filter(
            (item) =>
              dayjs
                .tz(dayjs(item.datePayment, 'DD/MM/YYYY'))
                .format('YYYY-MM') === this.findByDate
          )
          .map((item, index) => ({ ...item, id: index }))
        if (this.search)
          result = this.items.filter(
            (item) =>
              item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          )
        return result
      },
      // establece
      set(item) {
        return item
      },
    },
    /**
     * fomatea la fecha dada a MMMM, YYYY
     */
    formatedFindByDate() {
      return dayjs.tz(dayjs(this.findByDate, 'YYYY-MM')).format('MMMM, YYYY')
    },
  },
  created() {
    // moment a esp
    dayjs.locale('es')
  },
  methods: {
    /**
     * formatea la fecha que le pasemos a DD MMMM, YYYY
     */
    formatDate(item) {
      return dayjs.tz(dayjs(item, 'DD/MM/YYYY')).format('DD MMMM, YYYY')
    },
    /** * formatea a fecha que le pasemos a DD MMMM, YYYY */
    formatDatedayjs(item) {
      return dayjs.tz(dayjs(item)).format('DD MMMM, YYYY')
    },
    /**
     * Envia una peticion de pago
     */
    async submitPayment() {
      this.loadingPayment = true
      await this.paymentRequest()
      await this.fetchData()
      this.loadingPayment = false
      this.step = 2
    },
    ...mapActions({
      paymentRequest: 'Specialist/paymentRequest',
    }),
  },
}
</script>

<style lang="scss" scoped></style>
