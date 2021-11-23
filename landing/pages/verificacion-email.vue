<template>
	<div style="height: 100vh">
		<v-row class="fill-height ma-0" align="center" justify="center">
			<v-card color="primary" dark>
				<v-card-text class="text-center headline font-weight-bold">
					Verificando su correo electronico
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-progress-circular indeterminate color="white"></v-progress-circular>
					<v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
		</v-row>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	data() {
		return {
			email: '',
			token: '',
		};
	},
	created() {
		this.email = this.$route.query.email;
		this.token = this.$route.query.token;
	},
	async mounted() {
		this.$auth.setUserToken(this.token);
		await this.verifyEmail(this.email);
		this.$auth.logout();
		this.$router.push('auth');
	},
	methods: {
		...mapActions({
			verifyEmail: 'User/verifyEmail',
		}),
	},
};
</script>
