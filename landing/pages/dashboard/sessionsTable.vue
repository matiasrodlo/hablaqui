<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Sesiones" />
		<v-row>
			<v-col cols="12">
				<div>
					<v-card>
						<v-card-title>
							<v-row>
								<v-col>
									<v-menu
										ref="startMenu"
										v-model="startMenu"
										:close-on-content-click="false"
										:return-value.sync="startDate"
										transition="scale-transition"
										offset-y
										min-width="auto"
									>
										<template #activator="{ on, attrs }">
											<v-text-field
												v-model="startDate"
												label="Desde"
												readonly
												v-bind="attrs"
												v-on="on"
											></v-text-field>
										</template>
										<v-date-picker v-model="startDate">
											<v-spacer></v-spacer>
											<v-btn
												text
												color="primary"
												@click="() => (endMenu = false)"
											>
												Cancelar
											</v-btn>
											<v-btn
												text
												color="primary"
												@click="$refs.startMenu.save(startDate)"
											>
												OK
											</v-btn>
										</v-date-picker>
									</v-menu>
								</v-col>
								<v-col>
									<v-menu
										ref="endMenu"
										v-model="endMenu"
										:close-on-content-click="false"
										:return-value.sync="endDate"
										transition="scale-transition"
										offset-y
										min-width="auto"
									>
										<template #activator="{ on, attrs }">
											<v-text-field
												v-model="endDate"
												label="Hasta"
												readonly
												v-bind="attrs"
												v-on="on"
											></v-text-field>
										</template>
										<v-date-picker v-model="endDate">
											<v-spacer></v-spacer>
											<v-btn
												text
												color="primary"
												@click="() => (endMenu = false)"
											>
												Cancelar
											</v-btn>
											<v-btn
												text
												color="primary"
												@click="$refs.endMenu.save(endDate)"
											>
												OK
											</v-btn>
										</v-date-picker>
									</v-menu>
								</v-col>
								<v-col>
									<v-select
										v-model="statFilterText"
										:item-value="status.value"
										:item-text="status.text"
										:items="status"
										label="Estado de Realización"
									>
									</v-select>
								</v-col>
								<v-col>
									<v-text-field
										v-model="psyFilterText"
										label="Filtro por Especialista"
									></v-text-field>
								</v-col>
								<v-col>
									<v-text-field
										v-model="userFilterText"
										label="Filtro por Usuario"
									></v-text-field>
								</v-col>
								<v-col>
									<v-select
										v-model="payFilterText"
										:item-value="payStatus.value"
										:item-text="payStatus.text"
										:items="payStatus"
										label="Estado de Pago"
									>
									</v-select>
								</v-col>
							</v-row>
						</v-card-title>
						<v-card-text>
							<v-data-table
								:headers="sessionsHeaders"
								:items="filteredSessions"
								:items-per-page="5"
							>
							</v-data-table>
						</v-card-text>
					</v-card>
				</div>
			</v-col>
		</v-row>
		<v-spacer></v-spacer>
		<v-row>
			<v-col cols="12">
				<div>
					<v-card>
						<v-card-title>
							<v-row>
								<v-col>
									<v-text-field
										v-model="nameFilterText"
										label="Nombre"
									></v-text-field>
								</v-col>
								<v-col>
									<v-text-field
										v-model="lastNameFilterText"
										label="Apellido"
									></v-text-field>
								</v-col>
								<v-col>
									<v-text-field
										v-model="mailFilterText"
										label="Correo"
									></v-text-field>
								</v-col>
								<v-col>
									<v-text-field
										v-model="phoneFilterText"
										label="Teléfono"
									></v-text-field>
								</v-col>
								<v-col>
									<v-text-field v-model="idFilterText" label="ID"></v-text-field>
								</v-col>
								<v-col>
									<v-text-field
										v-model="rutFilterText"
										label="Rut"
									></v-text-field>
								</v-col>
							</v-row>
						</v-card-title>
						<v-card-text>
							<v-data-table
								:headers="usersHeaders"
								:items="filteredUsers"
								:items-per-page="5"
							>
								<template #item.action="{ item }">
									<v-btn
										:disabled="item.sessions.length === 0"
										small
										@click="showUserSessions(item)"
									>
										Sesiones
									</v-btn>
								</template>
							</v-data-table>
						</v-card-text>
					</v-card>
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
					<span class="text-h5">Sesiones del usuario</span>
				</v-card-title>
				<v-data-table :headers="headersUserSessions" :items="userSessions" />
			</v-card>
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
import customParseFormat from 'dayjs/plugin/customParseFormat';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
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
			psychologist: [],
			transactions: [],
			users: [],
			menu: '',
			startDate: '',
			endDate: '',
			label: 'Sesiones a pagar',
			dialog: false,
			endMenu: false,
			startMenu: false,
			showBank: false,
			paymentMethods: {},
			dateFilterText: null,
			statFilterText: '',
			psyFilterText: '',
			userFilterText: '',
			payFilterText: '',
			nameFilterText: '',
			lastNameFilterText: '',
			mailFilterText: '',
			phoneFilterText: '',
			idFilterText: '',
			rutFilterText: '',
			userSessions: [],
			sessionsHeaders: [
				{ text: 'Consultante', value: 'user' },
				{ text: 'Especialista', value: 'specialist' },
				{ text: 'Fecha', value: 'date' },
				{ text: 'Teléfono usuario', value: 'userPhone' },
				{ text: 'Email Consultante', value: 'emailUser' },
				{ text: 'Email Especialista', value: 'emailSpecialist' },
				{ text: 'Estado de Realización', value: 'statusSession' },
				{ text: 'Estado de Pago', value: 'paymentPlan' },
			],
			usersHeaders: [
				{ text: 'Nombre', value: 'name' },
				{ text: 'Apellido', value: 'lastName' },
				{ text: 'Correo', value: 'email' },
				{ text: 'Teléfono', value: 'phone' },
				{ text: 'ID', value: '_id' },
				{ text: 'Rut', value: 'rut' },
				{ text: 'Acciones', value: 'action', sortable: false },
			],
			headersUserSessions: [
				{ text: 'Fecha', value: 'date' },
				{ text: 'Consultante', value: 'name' },
				{ text: 'Correo', value: 'email' },
				{ text: 'N° de sesión', value: 'sessionNumber' },
				{ text: 'Estado de realización', value: 'status' },
				{ text: 'Estado de Pago', value: 'paidToSpecialist' },
			],
			sessions: [],
			status: [
				{ text: 'Pendiente', value: 'pending' },
				{ text: 'Realizada', value: 'success' },
			],
			payStatus: [
				{ text: 'Pendiente', value: 'pending' },
				{ text: 'Pagada', value: 'success' },
			],
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
		filteredSessions() {
			console.log(this.startDate, this.endDate);
			console.log(dayjs(this.startDate, 'YYYY-MM-DD'), dayjs(this.endDate, 'YYYY-MM-DD'));
			this.sessions.forEach(session => {
				console.log(dayjs(session.date, 'DD/MM/YYYY HH:mm'));
			});
			// Método que filtra las sesiones según 5 condiciones, nombre de usuario, estatus de la sesión, nombre del psicólogo, fecha de la sesión y estado de pago
			return this.sessions.filter(
				session =>
					session.user.toLowerCase().includes(this.userFilterText.toLowerCase()) &&
					session.statusSession.includes(this.statFilterText) &&
					session.specialist.toLowerCase().includes(this.psyFilterText.toLowerCase()) &&
					session.paymentPlan.includes(this.payFilterText) &&
					(this.startDate && this.endDate
						? dayjs(dayjs(session.date, 'DD/MM/YYYY HH:mm')).isBetween(
								dayjs(this.startDate, 'YYYY-MM-DD'),
								dayjs(this.endDate, 'YYYY-MM-DD')
						  )
						: true)
			);
		},
		filteredUsers() {
			return this.users.filter(
				//  correo telefono id rut
				user =>
					(this.nameFilterText === ''
						? true
						: user.name === undefined
						? false
						: user.name.toLowerCase().includes(this.nameFilterText.toLowerCase())) &&
					(this.lastNameFilterText === ''
						? true
						: user.lastName === undefined
						? false
						: user.lastName
								.toLowerCase()
								.includes(this.lastNameFilterText.toLowerCase())) &&
					(this.mailFilterText === ''
						? true
						: user.email === undefined
						? false
						: user.email.toLowerCase().includes(this.mailFilterText.toLowerCase())) &&
					(this.phoneFilterText === ''
						? true
						: user.phone === undefined
						? false
						: user.phone.toLowerCase().includes(this.phoneFilterText.toLowerCase())) &&
					user._id.includes(this.idFilterText.toLowerCase()) &&
					(this.rutFilterText === ''
						? true
						: user.rut === undefined
						? false
						: user.rut.includes(this.rutFilterText.toLowerCase()))
			);
		},
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			await this.getFormattedSessions();
			const { amounts } = await this.$axios.$get('/dashboard/pay-mount');
			this.psychologist = amounts;
			const { transactions } = await this.$axios.$get('/transaction/get/all');
			this.transactions = transactions;
			let usersObjects = await this.getUsers();
			this.users = usersObjects.users;
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
		showBankInfo(item) {
			this.paymentMethods = item.paymentMethod;
			this.showBank = true;
		},
		async getUsers() {
			try {
				const { data } = await this.$axios('/dashboard/get-users', {
					method: 'GET',
				});
				return data;
			} catch (e) {
				this.snackBar({
					content: e,
					color: 'error',
				});
			}
		},
		showUserSessions(item) {
			this.userSessions = item.sessions;
			this.userSessions.forEach(session => {
				session.name = item.name;
				session.email = item.email;
			});
			this.dialog = true;
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
		async getFormattedSessions() {
			try {
				const { data } = await this.$axios('/sessions/get-all-sessions-formatted', {
					method: 'GET',
				});
				const { formattedSessions } = data;
				this.sessions = formattedSessions;
				return formattedSessions;
			} catch (e) {
				this.snackBar({
					content: e,
					color: 'error',
				});
			}
		},
	},
};
</script>
<style></style>
