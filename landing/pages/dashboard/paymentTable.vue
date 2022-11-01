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
						@click:row="showSessions"
					>
						<template #top>
							<v-toolbar flat>
								<v-toolbar-title>Tabla para pagos</v-toolbar-title>
							</v-toolbar>
						</template>
						<template #item.action="{ item }">
							<v-btn :disabled="item.session.length === 0" @click="editItem(item)">
								Pagar
							</v-btn>
						</template>
					</v-data-table>
					<div class="text-center pt-2">
						<v-pagination v-model="page" :length="pageCount" />
					</div>
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
					<span class="text-h5">Sesiones a pagar</span>
				</v-card-title>
				<v-data-table :headers="headersSessions" :items="sessions" />
			</v-card>
		</v-dialog>
	</v-container>
</template>
<script>
import axios from 'axios';
import { mapMutations } from 'vuex';
import moment from 'moment';
import { isEmpty } from 'lodash';

moment.tz.setDefault('America/Santiago');

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
			headers: [
				{ text: 'Nombre', value: 'name' },
				{ text: 'Apellido', value: 'lastName' },
				{ text: 'Nombre de usuario', value: 'username' },
				{ text: 'Correo', value: 'email' },
				{ text: 'Monto total', value: 'total' },
				{ text: 'Pagar', value: 'action', sortable: false },
			],
			headersSessions: [
				{ text: 'Fecha', value: 'date' },
				{ text: 'N° de sesión', value: 'sessionNumber' },
				{ text: 'Valor de la sesion', value: 'price' },
				{ text: 'Cupón', value: 'coupon' },
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
		},
		async setTransaction(totalMount, sessionsToPay) {
			try {
				const { data } = await this.$axios('/transactions/generate', {
					method: 'POST',
					data: {
						total: totalMount,
						session: sessionsToPay,
						idPsy: this.selected._id,
					},
				});
				this.snackBar({ content: data.message, color: 'success' });
			} catch (error) {
				this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
			}
		},
		showSessions(item) {
			this.dialog = true;
			this.sessions = item.session;
		},
		editItem(item) {
			console.log(item);
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
};
</script>

<style></style>
