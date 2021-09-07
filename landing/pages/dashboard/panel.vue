<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Panel de control" />
	</v-container>
</template>

<script>
export default {
	name: 'Panel',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
};
</script>

<style lang="scss" scoped></style>
