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
				<span class="pl-3 body-1 font-weight-bold secondary--text">Historial de pagos</span>
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
								isExpanded ? (expanded = []) : expand();
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
														selected = element;
														dialog = true;
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
							<div class="body-1 my-3 d-flex justify-space-between align-center">
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
										{{ formatDateMoment(lastTransaction.trasactionDate) }}
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
							Sesión:{{ item.sessionsNumber }}
						</div>
					</div>
					<div>
						<div class="text-right primary--text font-weight-bold">
							{{ item.finalAmount }}
						</div>
						<div class="font-weight-medium caption secondary--text text-right mt-1">
							{{ formatDate(item.datePayment) }}
						</div>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<div
						class="
							caption
							font-weight-medium
							secondary--text
							d-flex
							justify-space-between
						"
					>
						<span>Tipo de plan</span>
						<span>{{ item.plan }}</span>
					</div>
					<div
						class="
							caption
							font-weight-medium
							secondary--text
							d-flex
							justify-space-between
						"
					>
						<span>Monto</span>
						<span>{{ item.amount }}</span>
					</div>
					<div
						class="
							caption
							font-weight-medium
							secondary--text
							d-flex
							justify-space-between
						"
					>
						<span>% Hablaquí</span>
						<span>${{ item.percentage }}</span>
					</div>
					<div
						class="
							caption
							font-weight-medium
							secondary--text
							d-flex
							justify-space-between
						"
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
					<div class="primary--text" style="flex: 1">Detalles</div>
					<div style="flex: 0">
						<v-btn
							icon
							@click="
								() => {
									dialog = false;
									seledted = null;
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
						<div>N° de sesión:</div>
						<div>{{ selected.sessionsNumber }}</div>
					</div>
					<div class="d-flex my-2">
						<div style="flex: 1">Monto:</div>
						<div style="flex: 0">{{ selected.amount }}</div>
					</div>
					<div class="d-flex my-2">
						<div style="flex: 1">%Hablaqui:</div>
						<div style="flex: 0">{{ selected.hablaquiPercentage }}</div>
					</div>
					<div class="d-flex my-2">
						<div style="flex: 1">%Mercadopago:</div>
						<div style="flex: 0">{{ selected.mercadoPercentage }}</div>
					</div>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions v-if="selected" class="py-6">
					<span class="secondary--text">Total:</span>
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
										dialogPayment = false;
										step = 1;
									}
								"
							>
								<icon size="30" color="#b1b1b1" :icon="mdiClose" />
							</v-btn>
						</div>
					</v-card-title>
					<v-card-text class="pt-6">
						<div v-if="transactions" class="d-flex justify-space-between align-center">
							<div>Se acreditara el {{ dayWithdraw }}</div>
							<div class="title">${{ transactions.totalAvailable }}</div>
						</div>
					</v-card-text>
					<v-card-text class="py-0">
						<v-divider> </v-divider>
					</v-card-text>
					<v-card-text
						v-if="psychologist && psychologist.paymentMethod"
						class="pb-0 pt-2"
					>
						<div class="d-flex justify-space-between align-center">
							<div>
								<div class="title">
									{{ psychologist.paymentMethod.bank }}
								</div>
								<v-btn color="primary" text class="pa-0" to="perfil">
									Cambiar de cuenta
								</v-btn>
							</div>
							<div class="subtitle-2 text-right">
								<div>{{ psychologist.paymentMethod.name }}</div>
								<div>{{ psychologist.paymentMethod.accountNumber }}</div>
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
						Transferiremos los {{ transactions.totalAvailable }} dentro de 7 dias
						habiles
					</v-card-title>
					<v-card-text class="text-center">
						<div v-if="psychologist && psychologist.paymentMethod" class="body-1">
							El dinero estara disponible el {{ dayWithdraw }} en la cuenta
							{{ psychologist.paymentMethod.bank }}
						</div>
						<v-btn rounded color="primary" href="https://hablaqui.cl/" class="mt-4 px-6"
							>Ir a inicio</v-btn
						>
					</v-card-text>
				</template>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';
import { mdiMagnify, mdiClose } from '@mdi/js';
moment.tz.setDefault('America/Santiago');

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
		psychologist: {
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
			findByDate: moment().format('YYYY-MM'),
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
		};
	},
	computed: {
		/**
		 * Dia de la fecha de retiro
		 * @returns un string con la fecha en que puede retirar
		 */
		dayWithdraw() {
			const day = moment().add('7', 'days');
			return moment(day).format('DD/MM/YYYY');
		},
		/**
		 * Ultima transaccion realizada
		 * @returns la ultima transaccion
		 */
		lastTransaction() {
			if (!this.transactions || !this.transactions.transactions.length) return null;
			return this.transactions.transactions[this.transactions.transactions.length - 1];
		},
		/**
		 * Lista de pagos
		 * @returns arrays con los pagos
		 */
		payments: {
			get() {
				let result = this.items
					.filter(
						item =>
							moment(item.datePayment, 'DD/MM/YYYY').format('YYYY-MM') ===
							this.findByDate
					)
					.map((item, index) => ({ ...item, id: index }));
				if (this.search)
					result = this.items.filter(
						item =>
							// eslint-disable-next-line unicorn/prefer-includes
							item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
					);
				return result;
			},
			set(item) {
				return item;
			},
		},
		/**
		 * Formato a fecha
		 * @returns retorna la fecha formateada
		 */
		formatedFindByDate() {
			return moment(this.findByDate, 'YYYY-MM').format('MMMM, YYYY');
		},
	},
	created() {
		// establecemos moment a español
		moment.locale('es');
	},
	methods: {
		/**
		 * Formato a fecha
		 * @param {string} item fecha a formatear
		 * @returns retorna la fecha formateada
		 */
		formatDate(item) {
			return moment(item, 'DD/MM/YYYY').format('DD MMMM, YYYY');
		},
		/**
		 * Formato a fecha
		 * @param {string} item fecha a formatear
		 * @returns retorna la fecha formateada
		 */
		formatDateMoment(item) {
			return moment(item).format('DD MMMM, YYYY');
		},
		/**
		 * Hace la peticion de pago y refresca los datos luego
		 */
		async submitPayment() {
			this.loadingPayment = true;
			await this.paymentRequest();
			await this.fetchData();
			this.loadingPayment = false;
			this.step = 2;
		},
		...mapActions({
			paymentRequest: 'Psychologist/paymentRequest',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
