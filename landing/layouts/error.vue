<template>
	<v-app dark>
		<div style="height: 100vh" class="d-flex align-center justify-center">
			<v-card color="primary" rounded width="600">
				<v-card-text class="text-center">
					<h1 v-if="error.statusCode === 404" class="white--text bady-1">
						{{ pageNotFound }}
					</h1>
					<h1 v-else>
						{{ otherError }}
					</h1>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn to="/" depressed light> Ir a página de inicio </v-btn>
					<v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
		</div>
	</v-app>
</template>

<script>
export default {
	layout: 'empty',
	props: {
		error: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			pageNotFound: '404 Página no encontrada',
			otherError: 'Ha ocurrido un error',
		};
	},
	head() {
		const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
		return {
			title,
		};
	},
};
</script>

<style scoped>
h1 {
	font-size: 20px;
}
</style>
