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
			<v-col cols="8"> </v-col>
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
					<v-card-text v-if="psychologist" class="pb-0 pt-2">
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
						<div v-if="psychologist" class="body-1">
							El dinero estara disponible el {{ dayWithdraw }} en la cuenta
							{{ psychologist.paymentMethod.bank }}
						</div>
						<v-btn rounded color="primary" to="/" class="mt-4 px-6">Ir a inicio</v-btn>
					</v-card-text>
				</template>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mdiClose } from '@mdi/js';
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
			loading: false,
			psychologist: null,
			step: 1,
		};
	},
	computed: {
		...mapGetters({
			payments: 'Psychologist/payments',
			transactions: 'Psychologist/transactions',
		}),
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			if (
				this.$auth.$state.user.role === 'psychologist' &&
				!this.$auth.$state.user.psychologist
			)
				return null;
			this.loading = true;
			await this.getPayments();
			await this.getTransactions();
			const { psychologist } = await this.$axios.$get(
				`/psychologists/one/${this.$auth.$state.user.psychologist}`
			);
			this.psychologist = await psychologist;
			this.loading = false;
		},
		...mapActions({
			getPayments: 'Psychologist/getPayments',
			getTransactions: 'Psychologist/getTransactions',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
