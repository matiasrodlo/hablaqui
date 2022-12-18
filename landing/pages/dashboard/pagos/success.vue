<template>
	<v-container fluid style="height: 70vh; max-width: 1200px">
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<v-row justify="center" align="center" style="height: 100%; overflow-y: auto">
			<v-col cols="12" class="text-center" style="color: #5c5c5c">
				<div>
					<v-img
						width="200"
						height="200"
						class="mx-auto"
						:src="`https://cdn.hablaqui.cl/static/balloon.png`"
						:lazy-src="`https://cdn.hablaqui.cl/static/balloon.png`"
					></v-img>
				</div>
				<div class="headline font-weight-bold">¡Bienvenido!</div>
				<div class="my-6 text--secondary body-1 mx-auto" style="max-width: 800px">
					Es momento de comenzar su viaje hacia el bienestar
				</div>
				<div>
					<v-btn depressed class="mx-2" color="primary" rounded @click="redirectReload">
						Ir a mi agenda
					</v-btn>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions } from 'vuex';
/**
 * pagina d epago success
 */
export default {
	data() {
		return {
			sessionsId: '',
			planId: '',
			overlay: true,
		};
	},
	created() {
		// guardamos en variables lo que este en la query url y limpiamos la url
		if (this.$route.query.sessionsId && this.$route.query.planId) {
			this.sessionsId = this.$route.query.sessionsId;
			this.planId = this.$route.query.planId;
			this.$router.replace({ query: null });
		}
	},
	async mounted() {
		// enviamos peticion para marcar como pago success
		if (this.sessionsId && this.planId) {
			await this.mercadopagoSuccess({ sessionsId: this.sessionsId, planId: this.planId });
			this.overlay = false;
		} else {
			// redireccionamos al home
			this.overlay = false;
			this.$router.push('/');
		}
	},
	methods: {
		redirectReload() {
			const url = new URL('/dashboard/agenda', window.location.origin);
			window.location.href = url.toString();
		},
		...mapActions({
			mercadopagoSuccess: 'Psychologist/mercadopagoSuccess',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
