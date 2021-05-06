<template>
	<v-img :src="backgroundImg" height="100vh">
		<v-container
			:class="$vuetify.breakpoint.smAndUp ? '' : 'white--text'"
			fluid
			class="login-image"
		>
			<v-row justify="center" align="center" style="height: 100vh; overflow-y: auto">
				<v-col cols="12" sm="5">
					<!-- formulario -->
					<h1>hola</h1>
					<v-form>
						<v-text-field outlined></v-text-field>
						<v-text-field outlined></v-text-field>
						<v-text-field outlined></v-text-field>
						<v-text-field outlined></v-text-field>
						<v-text-field outlined></v-text-field>
						<v-btn block rounded color="primary">
							Regístrate
						</v-btn>
					</v-form>
				</v-col>
				<v-col class="12" sm="7"></v-col>
			</v-row>
		</v-container>
	</v-img>
</template>

<script>
import { landing } from '@/config';

export default {
	data() {
		return {
			length: [
				{
					id: 1,
					img: 'img/auth.png',
					text:
						'Habla con tu psicólogo por videollamada, estés donde estés y sin tener que desplazarte',
				},
				{
					id: 2,
					img: 'img/auth.png',
					text: 'Disfruta de las sesiones con tu psicólogo de manera segura y privada',
				},
				{
					id: 3,
					img: 'img/auth.png',
					text:
						' Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios',
				},
				{
					id: 4,
					img: 'img/auth.png',
					text:
						'Precios más asequibles, sin tener que renunciar a la calidad de una terapia presencial',
				},
			],
			onboarding: 0,
			menu: false,
			step: 1,
		};
	},
	created() {
		if (this.$route.params.q) this.step = 2;
	},
	computed: {
		landingUrl() {
			return landing;
		},
		backgroundImg() {
			if (this.$vuetify.breakpoint.smAndUp) return 'img/login.png';
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
	background: url('/img/circle-login.png') no-repeat;
	background-position-y: 60%;
	background-position-x: 75%;
	-webkit-background-size: 25%;
	-moz-background-size: 25%;
	-o-background-size: 25%;
	background-size: 25%;
}
.login-plus-image {
	background: url('/img/plus-login.png') no-repeat;
	background-position-x: 70%;
	-webkit-background-size: 7%;
	-moz-background-size: 7%;
	-o-background-size: 7%;
	background-size: 7%;
}
</style>
