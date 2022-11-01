<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Tabla de pagos" />
		<v-row>
			<v-col cols="12">
				<div>
					<v-data-table
						:headers="headers"
						:items="psychologist"
						sort-by="total"
						:sort-desc="true"
						class="elevation-1"
						:page.sync="page"
						hide-default-footer
						@page-count="pageCount = $event"
					>
						<template #top>
							<v-toolbar flat>
								<v-toolbar-title>Tabla para pagos</v-toolbar-title>
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
						:items="transactions"
						sort-by="createdAt"
						:sort-desc="false"
						class="elevation-1"
					>
						<template #top>
							<v-toolbar flat>
								<v-toolbar-title>Tabla de pagos hechos</v-toolbar-title>
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
	</v-container>
</template>
<script>
import axios from 'axios';
import { mapMutations } from 'vuex';
import { isEmpty } from 'lodash';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';

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
			psychologist: [],
			transactions: [],
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
			sessions: [],
		};
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			const { amounts } = await this.$axios.$get('/dashboard/pay-mount');
			this.psychologist = amounts;
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

				const index = this.psychologist.indexOf(item);
				this.psychologist[index].total = 0;
				this.psychologist[index].session = [];
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
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
};
</script>

<style></style>
