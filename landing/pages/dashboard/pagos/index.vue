<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Pagos" />
		<div class="title secondary--text font-weight-bold mb-4 mt-10">Transacciones</div>
		<template v-if="payments.length">
			<table-pagos
				hide-search
				:items="payments"
				:transactions="transactions"
				:psychologist="psychologist"
				:loading="loading"
				:fetch-data="initFetch"
			></table-pagos>
		</template>
		<recruited-overlay />
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
	name: 'Pagos',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		TablePagos: () => import('~/components/dashboard/TablePagos'),
		RecruitedOverlay: () => import('~/components/RecruitedOverlay'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			loading: false,
			psychologist: null,
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
