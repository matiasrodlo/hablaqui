<template>
	<v-app dark>
		<div style="height: 100vh" class="d-flex align-center justify-center">
			<v-card flat rounded width="600">
				<v-card-text class="text-center">
					<div v-if="error.statusCode === 404" class="body-1">
						<v-img src="https://cdn.hablaqui.cl/static/404.png" contain></v-img>
						<div class="mt-4 font-weight-bold">
							¡Oops! No pudimos encontrar la página
						</div>
						<div class="mb-4">
							Quizá escribiste mal la dirección o tienes un link malo o muy viejo.
						</div>
					</div>
					<h1 v-else>
						{{ otherError }}
					</h1>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						rounded
						color="primary"
						class="px-16"
						href="https://hablaqui.cl/"
						depressed
						>Ir a casa
					</v-btn>
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
			otherError: '¡Oops! ha ocurrido un error indesperado.',
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
