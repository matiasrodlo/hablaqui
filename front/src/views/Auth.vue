<template>
	<v-img :src="backgroundImg" height="100vh">
		<v-container
			:class="$vuetify.breakpoint.smAndUp ? '' : 'white--text'"
			fluid
			class="login-image"
		>
			<v-row justify="center" align="center" style="height: 100vh; overflow-y: auto">
				<v-col cols="12" sm="6">
					<v-row justify="center">
						<v-col cols="6" sm="5" md="4" lg="3" class="text-center">
							<a :href="landingUrl">
								<v-img max-width="200" src="img/logo.png"></v-img>
							</a>
						</v-col>
						<v-col
							cols="12"
							class="text-center text-h6 text-lg-h4 font-weight-bold text--secondary"
						>
							{{
								this.step == 1
									? '¡Qué gusto verte nuevamente!'
									: '¡Nos alegra que estés aquí!'
							}}
						</v-col>
						<v-col
							cols="12"
							sm="10"
							lg="8"
							class="text-center subtitle-1 font-weight-bold text--secondary"
						>
							{{
								this.step == 1
									? 'Ingresa y continúa tu viaje de desarrollo personal ahora mismo.'
									: 'Regístrate y comienza tu viaje de desarrollo personal ahora mismo.'
							}}
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
							<div class="mt-16">
								<v-btn
									class="px-0"
									text
									color="primary"
									:href="`${landingUrl}/politicas`"
									>Aviso de privacidad</v-btn
								>
								y
								<v-btn
									class="px-0"
									text
									color="primary"
									:href="`${landingUrl}/condiciones`"
								>
									Términos y Condiciones</v-btn
								>
							</div>
							<div class="font-weight-bold caption secondary--text">
								2021 Hablaqui
							</div>
						</v-col>
					</v-row>
				</v-col>
				<v-col v-if="$vuetify.breakpoint.smAndUp" sm="6" class="login-plus-image">
					<v-window v-model="onboarding" class="login-circle-image">
						<v-window-item v-for="n in length" :key="`card-${n.id}`">
							<div class="text-center ">
								<v-list-item-avatar size="400" class="ml-4">
									<v-img :src="n.img"></v-img>
								</v-list-item-avatar>
							</div>
							<div class="text-h6 text-center white--text py-4 px-10">
								{{ n.text }}
							</div>
						</v-window-item>
					</v-window>
					<v-item-group v-model="onboarding" class="text-center" mandatory>
						<v-item
							v-for="n in length"
							:key="`btn-${n.id}`"
							v-slot="{ active, toggle }"
						>
							<v-btn icon @click="toggle" color="#BDBDBD">
								<v-icon :color="active ? 'info' : ''">mdi-record</v-icon>
							</v-btn>
						</v-item>
					</v-item-group>
				</v-col>
			</v-row>
		</v-container>
	</v-img>
</template>

<script>
import { landing } from '@/config';

export default {
	components: {
		SignIn: () => import('@/components/auth/SignIn'),
		SignUp: () => import('@/components/auth/SignUp'),
	},
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
					img: 'img/auth-2.png',
					text: 'Disfruta de las sesiones con tu psicólogo de manera segura y privada',
				},
				{
					id: 3,
					img: 'img/auth-3.png',
					text:
						' Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios',
				},
				{
					id: 4,
					img: 'img/auth-4.png',
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
