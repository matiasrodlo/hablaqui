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
								<v-col cols="12">
									<div
										class="
											mb-10
											primary--text
											font-weight-bold
											text-h4 text-left
										"
									>
										¡Es un placer conocerte!
									</div>
								</v-col>
								<v-col cols="12">
									<label for="birthdate" class="d-flex align-center">
										<div
											style="min-width: 300px"
											class="primary--text text-h6 font-weight-regular"
										>
											Fecha de nacimiento
										</div>
										<v-menu
											ref="menu"
											v-model="bmenu"
											:close-on-content-click="false"
											transition="scale-transition"
											offset-y
											min-width="auto"
										>
											<template #activator="{ on, attrs }">
												<v-text-field
													v-model="birthDate"
													readonly
													filled
													outlined
													hide-details
													dense
													v-bind="attrs"
													v-on="on"
												></v-text-field>
											</template>
											<v-date-picker
												v-model="birthDate"
												locale="es"
												:active-picker.sync="activePicker"
												:max="
													new Date(
														Date.now() -
															new Date().getTimezoneOffset() * 60000
													)
														.toISOString()
														.substr(0, 10)
												"
												min="1950-01-01"
												@change="save"
											></v-date-picker>
										</v-menu>
									</label>
								</v-col>
								<v-col cols="12">
									<label for="birthdate" class="d-flex align-center mt-10">
										<div
											style="min-width: 300px"
											class="primary--text text-h6 font-weight-regular"
										>
											Género
										</div>
										<v-select
											v-model="gender"
											:items="['Hombre', 'Mujer', 'Transgénero']"
											filled
											outlined
											hide-details
											dense
										></v-select>
									</label>
								</v-col>
								<v-col
									cols="4"
									class="mt-10 primary--text text-h6 font-weight-regular"
								>
									País
								</v-col>
								<v-col
									cols="4"
									class="mt-10 primary--text text-h6 font-weight-regular"
								>
									Región
								</v-col>
								<v-col
									cols="4"
									class="mt-10 primary--text text-h6 font-weight-regular"
								>
									Comuna
								</v-col>
								<v-col cols="4">
									<v-select
										v-model="country"
										:items="countries"
										filled
										disabled
										item-text="name"
										item-value="code"
										outlined
										hide-details
										dense
										label="Seleccione"
									></v-select>
								</v-col>
								<v-col cols="4">
									<v-select
										v-model="region"
										:items="regiones"
										filled
										outlined
										hide-details
										dense
										label="Seleccione"
									></v-select>
								</v-col>
								<v-col cols="4">
									<v-select
										v-model="comuna"
										:disabled="!region"
										:items="comunas"
										filled
										outlined
										hide-details
										dense
										label="Seleccione"
									></v-select>
								</v-col>
								<v-col cols="12">
									<label for="birthdate" class="d-flex align-center mt-10">
										<div
											style="min-width: 300px"
											class="primary--text text-h6 font-weight-regular"
										>
											Zona horaria
										</div>
										<v-combobox
											v-model="timeZone"
											dense
											filled
											hide-details
											label="Zona horaria"
											:items="timezone"
											outlined
											:search-input.sync="zone"
										>
											<template #no-data>
												<v-list-item>
													<v-list-item-content>
														<v-list-item-title>
															No se encontraron resultados que
															coincidan con "<strong>
																{{ zone }}
															</strong>
															" .
														</v-list-item-title>
													</v-list-item-content>
												</v-list-item>
											</template>
										</v-combobox>
									</label>
								</v-col>
								<v-col cols="12">
									<label for="birthdate" class="d-flex align-center mt-10">
										<div
											style="min-width: 300px"
											class="primary--text text-h6 font-weight-regular"
										>
											Idiomas
										</div>
										<v-checkbox
											class="mx-2"
											value="ingles"
											filled
											label="Ingles"
											outlined
											hide-details
											dense
										></v-checkbox>
										<v-checkbox
											class="mx-2"
											value="Español"
											filled
											label="Español"
											outlined
											hide-details
											dense
										></v-checkbox>
									</label>
								</v-col>
							</v-row>
							<div class="d-flex justify-end mt-4">
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
import axios from 'axios';

export default {
	data() {
		return {
			bmenu: false,
			country: 'CL',
			region: '',
			gender: '',
			birthDate: '',
			step: 1,
			regiones: [],
			comunas: [],
			comunasRegiones: [],
			countries: [],
			timezone: [],
			timeZone: 'America/Santiago',
		};
	},
	watch: {
		bmenu(val) {
			val && setTimeout(() => (this.activePicker = 'YEAR'));
		},
		region(newVal) {
			if (newVal) {
				this.comunas = this.comunasRegiones.find(
					item => item.region === this.region
				).comunas;
			}
		},
	},
	async mounted() {
		const { data } = await axios.get(`${this.$config.API_ABSOLUTE}/timezone.json`);
		const response = await axios.get(`${this.$config.LANDING_URL}/comunas-regiones.json`);
		const countries = await axios.get(`${this.$config.LANDING_URL}/countries.json`);
		this.countries = countries.data;
		this.timezone = data;
		this.comunasRegiones = response.data;
		this.regiones = response.data.map(i => i.region);
	},
};
</script>
