<template>
	<div style="height: 100vh">
		<div class="ma-4 d-flex justify-space-between align-center">
			<nuxt-link id="logo-appbar" tabindex="0" to="/" exact accesskey="h">
				<v-img
					style="max-width: 160px"
					alt="hablaqui Logo"
					:src="`${$config.LANDING_URL}/logo.png`"
					:lazy-src="`${$config.LANDING_URL}/logo.png`"
					contain
				/>
			</nuxt-link>
			<span class="text--secondary text-h6">
				¿Necesitas ayuda? <b class="primary--text">Contáctanos</b>
			</span>
		</div>
		<v-row justify="center">
			<v-col cols="12" md="10" lg="8" xl="6">
				<v-stepper v-model="step" flat>
					<v-stepper-header class="elevation-0">
						<v-stepper-step :complete="step > 1" step="1">
							Hablanos sobre ti
						</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step :complete="step > 2" step="2">
							Información profesional
						</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step step="3"> Experiencia laboral </v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1">
							<v-row>
								<v-col>hola</v-col>
							</v-row>
							<div class="d-flex justify-end">
								<v-btn rounded color="primary" @click="step = 2"> Siguiente </v-btn>
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
							<v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

							<v-btn color="primary" @click="step = 3"> Continue </v-btn>

							<v-btn text> Cancel </v-btn>
						</v-stepper-content>

						<v-stepper-content step="3">
							<v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

							<v-btn color="primary" @click="step = 1"> Continue </v-btn>

							<v-btn text> Cancel </v-btn>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			step: 1,
		};
	},
};
</script>
