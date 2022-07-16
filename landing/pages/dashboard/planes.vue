<template>
	<div style="background-color: #f0f8ff; height: 100%">
		<!-- appbar -->
		<appbar />
		<!-- containt -->
		<v-container fluid style="max-width: 1200px" class="mt-10">
			<plans :next="() => $router.push({ name: 'dashboard-perfil' })" />
		</v-container>
	</div>
</template>

<script>
export default {
	components: {
		Appbar: () => import('~/components/AppbarWhite'),
		plans: () => import('~/components/postulacion/Plans'),
	},
	middleware: ['auth'],
};
</script>

<style lang="scss" scoped></style>
