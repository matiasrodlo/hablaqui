<template>
	<div style="position: relative">
		<v-img
			class="hidden-sm-and-down"
			:src="`${$config.LANDING_URL}/login.png`"
			:lazy-src="`${$config.LANDING_URL}/login.png`"
			style="height: 100vh"
		></v-img>
		<v-container
			:class="$vuetify.breakpoint.mdAndUp ? '' : 'white--text'"
			fluid
			style="position: absolute; top: 0; height: 100vh"
		>
			<v-row justify="center" align="center" style="height: 100vh; overflow-y: auto">
				<v-col cols="12" md="6">
					<v-row justify="center">
						<v-col cols="6" sm="5" md="4" lg="3">
							<nuxt-link to="/" class="tex-center">
								<v-img
									class="mx-auto"
									style="max-width: 200px"
									:src="`${$config.LANDING_URL}/logo.png`"
									:lazy-src="`${$config.LANDING_URL}/logo.png`"
								/>
							</nuxt-link>
						</v-col>
						<v-col
							cols="12"
							class="py-1 text-center text-h6 text-lg-h4 font-weight-bold text--secondary"
						>
							{{
								step == 1
									? '¡Qué gusto verte nuevamente!'
									: '¡Tu bienestar comienza aquí!'
							}}
						</v-col>
						<v-col
							cols="12"
							sm="9"
							lg="6"
							class="py-1 text-center subtitle-1 font-weight-bold text--secondary"
						>
							{{
								step == 1
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
								<small v-if="step == 1"> ¿No eres parte de Hablaquí? </small>
								<small v-else>¿Ya tienes cuenta Hablaquí?</small>
							</div>
							<v-btn outlined block rounded color="primary" @click="setStep">
								{{ step == 1 ? 'Crea una cuenta' : 'Entra' }}
							</v-btn>
							<div class="mt-16">
								<v-btn class="px-0" text color="primary" :to="{ name: 'politicas' }"
									>Aviso de privacidad</v-btn
								>
								<span class="primary--text mx-1">y</span>
								<v-btn
									class="px-0"
									text
									color="primary"
									:to="{ name: 'condiciones' }"
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
				<v-col class="hidden-sm-and-down" md="6">
					<v-carousel
						v-model="carousel"
						hide-delimiter-background
						hide-delimiters
						cycle
						interval="3000"
						:show-arrows="false"
						height="600"
					>
						<v-carousel-item
							v-for="n in length"
							:key="`card-${n.id}`"
							class="align-items-center"
							style="position: relative"
						>
							<div class="text-center mt-10">
								<v-img
									style="z-index: 1; position: absolute; top: 30px; right: 30%"
									width="80"
									:src="`${$config.LANDING_URL}/plus-login.png`"
								></v-img>
								<v-img
									style="position: absolute; bottom: 30%; right: 17%"
									width="220"
									:src="`${$config.LANDING_URL}/circle-login.png`"
								>
								</v-img>
								<v-list-item-avatar size="400" class="ml-4">
									<v-img height="400" width="400" :src="n.img" :lazy-src="n.img">
										<template #placeholder>
											<v-row
												class="fill-height ma-0"
												align="center"
												justify="center"
											>
												<v-progress-circular
													indeterminate
													color="white"
												></v-progress-circular>
											</v-row>
										</template>
									</v-img>
								</v-list-item-avatar>
								<div
									style="max-width: 500px"
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
							<v-btn icon color="#BDBDBD" @click="toggle">
								<v-icon :color="active ? 'info' : ''">mdi-record</v-icon>
							</v-btn>
						</v-item>
					</v-item-group>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	components: {
		SignIn: () => import('~/components/auth/SignIn'),
		SignUp: () => import('~/components/auth/SignUp'),
	},
	data() {
		return {
			length: [
				{
					id: 1,
					img: `${this.$config.LANDING_URL}/auth.webp`,
					text:
						'Habla con tu psicólogo por videollamada, estés donde estés y sin tener que desplazarte',
				},
				{
					id: 2,
					img: `${this.$config.LANDING_URL}/auth-2.webp`,
					text: 'Disfruta de las sesiones con tu psicólogo de manera segura y privada',
				},
				{
					id: 3,
					img: `${this.$config.LANDING_URL}/auth-3.webp`,
					text:
						' Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios',
				},
				{
					id: 4,
					img: `${this.$config.LANDING_URL}/auth-4.webp`,
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
	methods: {
		setStep() {
			if (this.step === 1) this.step = 2;
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
