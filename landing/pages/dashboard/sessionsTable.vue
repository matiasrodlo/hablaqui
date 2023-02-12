<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Sesiones" />
		<v-row>
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
								<v-toolbar-title>Sesiones</v-toolbar-title>
								<v-spacer />
								<v-text-field v-model="start" type="datetime-local" label="Desde" />
								<v-spacer />
								<v-text-field v-model="end" type="datetime-local" label="Hasta" />
							</v-toolbar>
						</template>
					</v-data-table>
				</div>
			</v-col>
		</v-row>
		<v-dialog
			v-model="dialog"
			@click:outside="
				() => {
					dialog = false;
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
					showBank = false;
				}
			"
		>
		</v-dialog>
	</v-container>
</template>
<script>
import axios from 'axios';
import { mapMutations } from 'vuex';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

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
			],
			headersSessions: [
				{ text: 'Fecha', value: 'date' },
				{ text: 'Consultante', value: 'name' },
				{ text: 'Correo', value: 'email' },
				{ text: 'N° de sesión', value: 'sessionNumber' },
				{ text: 'Valor de la sesion', value: 'price' },
				{ text: 'Cupón', value: 'coupon' },
			],
			dialog: false,
			showBank: false,
			paymentMethods: {},
			sessions: [],
		};
	},
	computed: {
		filteredTransactions() {
			let transactions = [];
			if (this.start === '' || this.end === '') transactions = this.transactions;
			else {
				transactions = this.transactions.filter(t =>
					dayjs(t.createdAt, 'DD/MM/YYYY HH:mm').isBetween(
						dayjs(this.start, 'yyyy-MM-DDTHH:mm'),
						dayjs(this.end, 'yyyy-MM-DDTHH:mm')
					)
				);
			}
			return transactions;
		},
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			const { amounts } = await this.$axios.$get('/dashboard/pay-mount');
			this.specialist = amounts;
			const { transactions } = await this.$axios.$get('/transaction/get/all');
			this.transactions = transactions;
		},
		async setTransaction(item) {
			try {
				const { data } = await this.$axios('/transaction/generate', {
					method: 'POST',
					data: {
						total: item.total,
						session: item.session,
						idPsy: item._id,
					},
				});

				const index = this.specialist.indexOf(item);
				this.specialist[index].total = 0;
				this.specialist[index].session = [];
				this.snackBar({ content: data.message, color: 'success' });
			} catch (error) {
				this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
			}
		},
		showSessionsToPay(item, label) {
			this.label = label;
			this.dialog = true;
			this.sessions = item.session;
		},
		showBankInfo(item) {
			this.paymentMethods = item.paymentMethod;
			this.showBank = true;
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
};
</script>

<style></style>
