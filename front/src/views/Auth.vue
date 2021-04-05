<template>
	<v-img :src="backgroundImg" height="100vh">
		<v-container fluid class="login-image">
			<v-row justify="center" align="center" style="height: 100vh; overflow-y: auto">
				<v-col cols="12" sm="6">
					<v-row justify="center">
						<v-col cols="6" sm="5" md="4" lg="3" class="text-center">
							<v-img max-width="200" src="../assets/logo.png"></v-img>
						</v-col>
						<v-col
							cols="12"
							class="text-center text-h6 text-lg-h4 font-weight-bold text--secondary"
						>
							¡Me alegra que estés aquí!
						</v-col>
						<v-col
							cols="12"
							sm="10"
							lg="8"
							class="text-center text-h6 text-lg-h5 text--secondary"
						>
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
							nonummy
						</v-col>
					</v-row>
					<v-row justify="center" class="text-center">
						<v-col cols="12" sm="10" lg="8">
							<v-window v-model="step">
								<v-window-item :value="1"><sign-in /></v-window-item>
								<v-window-item :value="2"><sign-up /></v-window-item>
							</v-window>
							<div class="mt-4 mb-2 subtitle-1 font-weight-bold secondary--text">
								<small v-if="step == 1">
									¿No eres parte de Hablaquí?
								</small>
								<small v-else>¿Ya tienes cuenta Hablaquí?</small>
							</div>
							<v-btn outlined block rounded color="primary" @click="setStep">
								{{ step == 1 ? 'Crea una cuenta' : 'Entra' }}
							</v-btn>
							<v-btn text color="primary" to="/privacidad">Aviso de privacidad</v-btn>
							-
							<v-btn text color="primary" to="/terminos-y-condiciones"
								>Términos y Condiciones</v-btn
							>
							<div class="font-weight-bold caption secondary--text">
								2021 Hablaqui
							</div>
						</v-col>
					</v-row>
				</v-col>
				<v-col v-if="$vuetify.breakpoint.smAndUp" sm="6" class="login-plus-image">
					<v-window v-model="onboarding" class="login-circle-image">
						<v-window-item v-for="n in length" :key="`card-${n}`">
							<div class="text-center ">
								<v-list-item-avatar
									size="200"
									class="ml-4 "
									style="border: 10px solid white"
								>
									<v-btn
										color="#9D9D9C"
										depressed
										fab
										width="200"
										height="200"
									></v-btn>
								</v-list-item-avatar>
							</div>
							<div class="text-center white--text py-4">
								Lorem ipsum dolor sit amet consectetur, fuga incidunt distinctio
								laudantium impedit voluptate.
							</div>
						</v-window-item>
					</v-window>
					<v-item-group v-model="onboarding" class="text-center" mandatory>
						<v-item v-for="n in length" :key="`btn-${n}`" v-slot="{ active, toggle }">
							<v-btn :input-value="active" icon @click="toggle" color="#BDBDBD">
								<v-icon>mdi-record</v-icon>
							</v-btn>
						</v-item>
					</v-item-group>
				</v-col>
			</v-row>
		</v-container>
	</v-img>
</template>

<script>
import background from '@/assets/login.png';
export default {
	components: {
		SignIn: () => import('@/components/auth/SignIn'),
		SignUp: () => import('@/components/auth/SignUp'),
	},
	data() {
		return {
			length: 4,
			onboarding: 0,
			menu: false,
			step: 1,
		};
	},
	computed: {
		backgroundImg() {
			if (this.$vuetify.breakpoint.smAndUp) return background;
			return null;
		},
	},
	methods: {
		setStep() {
			if (this.step == 1) this.step = 2;
			else this.step = 1;
		},
		next() {
			this.onboarding = this.onboarding + 1 === this.length ? 0 : this.onboarding + 1;
		},
		prev() {
			this.onboarding = this.onboarding - 1 < 0 ? this.length - 1 : this.onboarding - 1;
		},
	},
};
</script>

<style lang="scss" scoped>
.login-circle-image {
	background: url('../assets/circle-login.png') no-repeat;
	background-position-y: 70%;
	background-position-x: 60%;
	-webkit-background-size: 15%;
	-moz-background-size: 15%;
	-o-background-size: 15%;
	background-size: 15%;
}
.login-plus-image {
	background: url('../assets/plus-login.png') no-repeat;
	background-position-x: 66%;
	-webkit-background-size: 7%;
	-moz-background-size: 7%;
	-o-background-size: 7%;
	background-size: 7%;
}
</style>
