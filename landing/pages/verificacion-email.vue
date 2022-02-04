<template>
	<v-container fluid style="height: 100vh; max-width: 1200px">
		<v-row justify="center" align="center" style="height: 100%; overflow-y: auto">
			<v-col cols="12" class="text-center" style="color: #5c5c5c">
				<div>
					<v-img
						width="200"
						height="200"
						class="mx-auto"
						:src="`https://cdn.hablaqui.cl/static/vc.png`"
						:lazy-src="`https://cdn.hablaqui.cl/static/vc.png`"
					></v-img>
				</div>
				<div class="my-6 text--secondary body-1 mx-auto" style="max-width: 800px">
					Estamos felices de este primer paso, por favor confirme su dirección de correo
					electrónico para terminar de configurar su cuenta.
				</div>
				<div>
					<v-btn
						:loading="loading"
						depressed
						class="mx-2"
						color="primary"
						rounded
						@click="onSubmit"
					>
						Verificar email
					</v-btn>
				</div>
			</v-col>
		</v-row>
		<v-dialog v-model="dialog" max-width="500" persistent>
			<v-card>
				<v-card-title class="text-h5">
					<span>Su email ha sido verificado</span>
				</v-card-title>
				<v-card-text>
					<span class="mr-2">Redirigiendo al login... </span>
					<v-progress-circular
						size="18"
						indeterminate
						color="primary"
					></v-progress-circular>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import axios from 'axios';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';
import { mapMutations } from 'vuex';

export default {
	name: 'VerificationEmail',
	layout: 'simple',
	data() {
		return {
			dialog: false,
			loading: false,
		};
	},
	methods: {
		async onSubmit() {
			try {
				this.loading = true;
				await axios(
					`${this.$config.API_URL}/auth/user/verification/${this.$route.query.id}`,
					{
						method: 'put',
						headers: {
							Authorization: `Bearer ${this.$route.query.token}`,
						},
					}
				);
				this.loading = false;
				this.logout();
			} catch (error) {
				this.loading = false;
				this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
			}
		},
		logout() {
			this.$auth.logout();
			this.dialog = true;
			setTimeout(() => {
				this.dialog = false;
				this.$router.push('/auth');
			}, 3000);
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
};
</script>
