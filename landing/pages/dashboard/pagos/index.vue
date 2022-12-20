<template>
	<div>
		<card-onboarding
			v-if="stepOnboarding && stepOnboarding.title === 'Pagos'"
			style="position: absolute; top: 250px; left: 10px; z-index: 3"
			arrow="arrow-left"
			:next="
				() => {
					setStepLinks(2);
					$router.push({ name: 'dashboard-consultantes' });
					return {
						title: 'Consultantes',
						card: {
							title: 'Consultantes',
							description:
								'Todos sus consultantes en un solo lugar. Administre sus datos e historial de atención.',
							link: '',
							route: 'dashboard-chat',
						},
						route: 'dashboard-consultantes',
					};
				}
			"
		/>
		<v-container style="height: 100vh; max-width: 1200px">
			<appbar class="hidden-sm-and-down" title="Pagos" />
			<div class="title secondary--text font-weight-bold mb-4 mt-10">Transacciones</div>
			<table-pagos
				hide-search
				:items="payments"
				:transactions="transactions"
				:psychologist="psychologist"
				:loading="loading"
				:fetch-data="initFetch"
			></table-pagos>
		</v-container>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
	name: 'Pagos',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		TablePagos: () => import('~/components/dashboard/TablePagos'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			loading: false,
		};
	},
	computed: {
		...mapGetters({
			payments: 'Psychologist/payments',
			transactions: 'Psychologist/transactions',
			psychologist: 'Psychologist/psychologist',
			stepOnboarding: 'User/step',
		}),
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			if (
				this.$auth.$state.user.role === 'specialist' &&
				!this.$auth.$state.user.psychologist
			)
				return null;
			this.loading = true;
			await this.getPayments();
			await this.getTransactions();
			this.loading = false;
		},
		...mapMutations({ setStepLinks: 'User/setStepLinks' }),
		...mapActions({
			getPayments: 'Psychologist/getPayments',
			getTransactions: 'Psychologist/getTransactions',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
