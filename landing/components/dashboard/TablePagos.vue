<template>
	<div>
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
		</v-row>
		<v-data-table
			:search="search"
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
				return this.items.filter(
					item =>
						moment(item.date, 'MM-DD-YYYY HH:mm').format('YYYY-MM') === this.findByDate
				);
			},
			set(item) {
				return item;
			},
		},
	},
};
</script>

<style lang="scss" scoped></style>
