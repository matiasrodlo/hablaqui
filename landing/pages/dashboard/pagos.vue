<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Pagos" />
		<div class="tex-h5 secondary--text font-weight-bold mb-4">Transacciones</div>
		<v-row align="center">
			<v-col cols="12" md="4" lg="3">
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
			<v-col cols="12" md="4" lg="3">
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
							:value="findByDate"
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
			<v-col>
				<v-btn rounded class="primary" depressed>Filtrar</v-btn>
			</v-col>
		</v-row>
		<v-data-table
			:search="search"
			:loading="loading"
			:headers="headers"
			:items="items"
			loading-text="Cargando..."
			:items-per-page="5"
			:footer-props="{
				'items-per-page-text': 'Pagos por página',
			}"
			no-data-text="No hay pagos"
		>
		</v-data-table>
		<!-- <div class="ma-6 text-right secondary--text body-1 font-weight-bold">total: $10000</div> -->
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mdiMagnify } from '@mdi/js';
import moment from 'moment';
export default {
	name: 'Pagos',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			menu: false,
			mdiMagnify,
			findByDate: moment().format('YYYY-MM'),
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
			loading: false,
		};
	},
	computed: {
		items: {
			get() {
				return this.payments.filter(
					item =>
						moment(item.date, 'MM-DD-YYYY HH:mm').format('YYYY-MM') === this.findByDate
				);
			},
			set(payments) {
				return payments;
			},
		},
		...mapGetters({
			payments: 'Psychologist/payments',
		}),
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			this.loading = true;
			await this.getPayments();
			this.loading = false;
		},
		...mapActions({
			getPayments: 'Psychologist/getPayments',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
