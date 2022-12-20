<template>
	<div style="background-color: #f0f8ff; height: 100%">
		<!-- appbar -->
		<div style="margin-bottom: 83px">
			<Appbar />
		</div>
		<!-- containt -->
		<v-container fluid style="max-width: 1080px" class="mt-10">
			<plans :next="() => $router.push({ name: 'dashboard-perfil' })" />
		</v-container>
	</div>
</template>

<script>
/**
 * Pagina listado de planes
 */
export default {
	components: {
		Appbar: () => import('~/components/AppbarWhite'),
		plans: () => import('~/components/postulacion/Plans'),
	},
	middleware: ['auth'],
};
</script>

<style lang="scss" scoped></style>
