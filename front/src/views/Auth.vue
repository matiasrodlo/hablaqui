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
									: '¡Tu bienestar comienza aquí!'
							}}
						</v-col>
						<v-col
							cols="12"
							sm="9"
							lg="6"
							class="text-center subtitle-1 font-weight-bold text--secondary"
						>
							{{
								this.step == 1
									? 'Ingresa y continúa tu viaje de desarrollo personal ahora mismo.'
									: 'Regístrate para iniciar tu camino de desarrollo personal'
							}}
						</v-col>
					</v-row>
					<v-row justify="center" class="text-center">
						<v-col cols="12" sm="10" lg="8">
							<v-window v-model="step">
								<v-window-item :value="1">
									<sign-in />
								</v-window-item>
								<v-window-item :value="2">
									<sign-up />
								</v-window-item>
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
								<span class="primary--text mx-1">y</span>
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
				<v-col v-if="$vuetify.breakpoint.smAndUp" sm="6">
					<v-carousel
						hide-delimiter-background
						hide-delimiters
						cycle
						interval="3000"
						:show-arrows="false"
						v-model="carousel"
						height="600"
					>
						<v-carousel-item
							v-for="n in length"
							:key="`card-${n.id}`"
							class="align-items-center"
							style="position: relative;"
						>
							<div class="text-center mt-10">
								<v-img
									style="z-index:1; position: absolute; top: 30px; right: 30%"
									width="80"
									src="/img/plus-login.png"
								></v-img>
								<v-img
									style="position: absolute; bottom: 30%; right: 17%"
									width="220"
									src="/img/circle-login.png"
								>
								</v-img>
								<v-list-item-avatar size="400" class="ml-4">
									<v-img
										height="400"
										width="400"
										:lazy-src="n.img"
										:src="n.img"
									></v-img>
								</v-list-item-avatar>
								<div
									style="max-width: 500px;"
									class="text-h6 mx-auto white--text py-5 px-10"
								>
									{{ n.text }}
								</div>
							</div>
						</v-carousel-item>
					</v-carousel>
					<v-item-group v-model="carousel" class="text-center" mandatory>
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
					img: 'img/auth.webp',
					text:
						'Habla con tu psicólogo por videollamada, estés donde estés y sin tener que desplazarte',
				},
				{
					id: 2,
					img: 'img/auth-2.webp',
					text: 'Disfruta de las sesiones con tu psicólogo de manera segura y privada',
				},
				{
					id: 3,
					img: 'img/auth-3.webp',
					text:
						' Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios',
				},
				{
					id: 4,
					img: 'img/auth-4.webp',
					text:
						'Precios más asequibles, sin tener que renunciar a la calidad de una terapia presencial',
				},
			],
			carousel: 0,
			menu: false,
			step: 1,
			fromRoute: '',
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
			this.carousel = this.carousel + 1 === this.length ? 0 : this.carousel + 1;
		},
		prev() {
			this.carousel = this.carousel - 1 < 0 ? this.length - 1 : this.carousel - 1;
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
