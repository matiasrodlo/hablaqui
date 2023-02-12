<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Pagos" />
		<v-row>
			<v-col cols="4">
				<v-card v-if="transactions" style="border-radius: 15px" class="elevation-1">
					<v-card-text>
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
							:disabled="transactions.sessionsReceivable <= 0"
							@click="dialogPayment = true"
						>
							Retirar dinero
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col cols="8">
				<v-card v-if="transactions" style="border-radius: 15px" class="elevation-1">
					<v-card-title>
						<div>
							<div class="title">movimientos de tu dinero</div>
							<div class="body-1 secondary--text">
								Conoce el detalle de los dineros retirados por ti
							</div>
						</div>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text class="pt-0">
						<v-list>
							<div v-for="(item, i) in transactions.transactions" :key="i">
								<v-list-item class="d-flex justify-space-between align-center">
									<v-list-item-avatar>
										<v-img
											max-width="40px"
											contain
											:src="`https://cdn.hablaqui.cl/static/retiro.png`"
										/>
									</v-list-item-avatar>
									<v-list-item-content> </v-list-item-content>
									<v-list-item-action class="text-right">
										<div class="font-weight-bold secondary--text">
											$ {{ item.total }} - {{ item.sessionsPaid }} Sesiones
										</div>
										<div v-if="item.trasactionDate" class="secondary--text">
											{{ formatDatedayjs(item.trasactionDate) }}
										</div>
									</v-list-item-action>
								</v-list-item>
								<v-divider
									v-if="transactions.transactions.length - 1 !== i"
								></v-divider>
							</div>
						</v-list>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
		<v-dialog v-model="dialogPayment" persistent max-width="420">
			<v-card max-width="450">
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
					<v-card-text v-if="specialist" class="pb-0 pt-2">
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
						Transferiremos los {{ transactions.totalAvailable }} dentro de 7 dias
						habiles
					</v-card-title>
					<v-card-text class="text-center">
						<div v-if="specialist" class="body-1">
							El dinero estara disponible el {{ dayWithdraw }} en la cuenta
							{{ specialist.paymentMethod.bank }}
						</div>
						<v-btn rounded color="primary" href="https://hablaqui.cl/" class="mt-4 px-6"
							>Ir a inicio</v-btn
						>
					</v-card-text>
				</template>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mdiClose } from '@mdi/js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import badMutable from 'dayjs/plugin/badMutable';
import 'dayjs/locale/es';
dayjs.extend(badMutable);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault('America/Santiago');

export default {
	name: 'Pagos',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Icon: () => import('~/components/Icon'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			mdiClose,
			dialogPayment: false,
			loadingPayment: false,
			loading: false,
			specialist: null,
			step: 1,
		};
	},
	computed: {
		dayWithdraw() {
			const day = dayjs().add('7', 'days');
			return dayjs.tz(dayjs(day)).format('DD/MM/YYYY');
		},
		...mapGetters({
			payments: 'Specialist/payments',
			transactions: 'Specialist/transactions',
		}),
	},
	created() {
		dayjs.locale('es');
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			if (this.$auth.$state.user.role === 'specialist' && !this.$auth.$state.user.specialist)
				return null;
			this.loading = true;
			await this.getPayments();
			await this.getTransactions();
			const { specialist } = await this.$axios.$get(
				`/specialists/one/${this.$auth.$state.user.specialist}`
			);
			this.specialist = await specialist;
			this.loading = false;
		},
		formatDatedayjs(item) {
			return dayjs.tz(dayjs(item)).format('DD MMMM, YYYY');
		},
		async submitPayment() {
			this.loadingPayment = true;
			await this.paymentRequest();
			await this.initFetch();
			this.loadingPayment = false;
			this.step = 2;
		},
		...mapActions({
			paymentRequest: 'Specialist/paymentRequest',
			getPayments: 'Specialist/getPayments',
			getTransactions: 'Specialist/getTransactions',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
