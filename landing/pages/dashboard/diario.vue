<template>
	<v-container fluid style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Mi diario" />
		<v-row
			justify="center"
			align="center"
			style="height: calc(100vh - 110px); overflow-y: auto"
		>
			<v-col class="text-center text-h6 font-weight-bold">En contruccion</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
};
</script>

<style lang="scss" scoped></style>
