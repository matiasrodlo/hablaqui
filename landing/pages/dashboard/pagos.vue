<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Pagos" />
		<div class="tex-h5 secondary--text font-weight-bold mb-4">Transacciones</div>
		<table-pagos hide-search :items="payments" :loading="loading"></table-pagos>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
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
