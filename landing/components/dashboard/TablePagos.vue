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
			<v-col cols="9">
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
					<template #expanded-item="{ item }">
						<td :colspan="header.length" class="px-0">
							<v-simple-table>
								<template #default>
									<tbody>
										<tr v-for="element in item.sessions" :key="element.id">
											<td width="15%" class="text-start">
												{{ element.date }}
											</td>
											<td width="24.5%" class="text-left">
												{{ element.name }}
											</td>
											<td width="16.9%" class="text-start">
												{{ element.sessionsNumber }}
											</td>
											<td width="9.5%" class="text-start">
												{{ element.amount }}
											</td>
											<td width="13%" class="text-start">
												{{ element.total }}
											</td>
											<td width="auto" class="text-start">
												{{ element.transDate }}
											</td>
											<td width="auto" class="text-start"></td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</td>
					</template>
				</v-data-table>
			</v-col>
			<v-col cols="3">
				<v-card style="border-radius: 15px" class="elevation-1">
					<v-card-text v-if="transactions">
						<div class="primary--text title">Tu dinero disponible</div>
						<div class="text-h4 my-3">${{ transactions.totalAvailable }}</div>
						<div class="body-1 my-3">
							Sesiones realizadas: {{ transactions.successSessions }}
						</div>
						<div class="body-1 my-3">
							Sesiones por cobrar: {{ transactions.sessionsReceivable }}
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
						>
							Retirar dinero
						</v-btn>
					</v-card-actions>
				</v-card>
				<v-card style="border-radius: 15px" class="elevation-1 mt-4">
					<v-card-text v-if="lastTransaction">
						<div class="title">Última transacción</div>
						<div class="body-1 my-3 d-flex justify-space-between align-center">
							<v-img
								max-width="50px"
								:src="`https://cdn.hablaqui.cl/static/retiro.png`"
							/>
							<div>
								<div class="body-1 text-right">
									$ {{ lastTransaction.total }} -
									{{ lastTransaction.sessionsPaid }}
								</div>
								<div class="body-1 text-right">
									{{ lastTransaction.transactionDate }}
								</div>
							</div>
						</div>
					</v-card-text>
					<v-card-actions v-else>
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
							${{ item.total }}
						</div>
						<div class="font-weight-medium caption secondary--text text-right mt-1">
							{{ formatDate(item.date) }}
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
						<span>${{ item.amount }}</span>
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
						<span>${{ item.total }}</span>
					</div>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script>
import moment from 'moment';
import { mdiMagnify } from '@mdi/js';
export default {
	props: {
		items: {
			type: Array,
			default: () => [],
		},
		transactions: {
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
	},
	data() {
		return {
			expanded: [],
			selected: [],
			menu: false,
			findByDate: moment().format('YYYY-MM'),
			mdiMagnify,
			search: '',
			header: [
				{
					text: 'Fecha de pago',
					sortable: false,
					value: 'datePayment',
				},
				{ text: 'Nombre', value: 'name', sortable: false },
				{ text: 'Suscripción', value: 'suscription', sortable: false },
				{ text: 'Monto', value: 'amount', sortable: false },
				{ text: 'Monto final', value: 'finalAmount', sortable: false },
				{ text: 'Fecha de transferencia', value: 'transState', sortable: false },
			],
		};
	},
	computed: {
		lastTransaction() {
			if (!this.transactions || !this.transactions.transactions.length) return null;
			return this.transactions.transactions[this.transactions.transactions.length - 1];
		},
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
		formatedFindByDate() {
			return moment(this.findByDate, 'YYYY-MM').format('MMMM, YYYY');
		},
	},
	created() {
		moment.locale('es');
	},
	methods: {
		formatDate(item) {
			return moment(item, 'DD/MM/YYYY').format('DD MMMM, YYYY');
		},
	},
};
</script>

<style lang="scss" scoped></style>
