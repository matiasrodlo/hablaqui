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
						scrollable
						@change="$refs.menu.save(findByDate)"
					>
					</v-date-picker>
				</v-menu>
			</v-col>
		</v-row>
		<v-data-table
			class="hidden-sm-and-down"
			:loading="loading"
			:headers="headers"
			:items="payments"
			loading-text="Cargando..."
			:items-per-page="5"
			:footer-props="{
				'items-per-page-text': 'Pagos por página',
			}"
			no-results-text="Sin pagos registrados"
			no-data-text="No hay pagos"
		>
		</v-data-table>
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
			menu: false,
			findByDate: moment().format('YYYY-MM'),
			mdiMagnify,
			search: '',
			headers: [
				{
					text: 'Fecha',
					sortable: false,
					value: 'date',
				},
				{ text: 'Nombre', value: 'name', sortable: false },
				{ text: 'Tipo de plan', value: 'plan', sortable: false },
				{ text: 'Nº Sesión', value: 'sessionsNumber', sortable: false },
				{ text: 'Monto', value: 'amount', sortable: false },
				{ text: '% Hablaquí', value: 'percentage', sortable: false },
				{ text: 'Monto final', value: 'total', sortable: false },
			],
		};
	},
	computed: {
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
