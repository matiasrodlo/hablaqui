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
			<v-col cols="12" md="9" lg="8">
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
								<v-col cols="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										username
									</div>
									<v-text-field
										v-model.trim="form.username"
										filled
										outlined
										dense
										placeholder="(Requerido)"
										:rules="rulesUsername"
										type="text"
										:hint="`hablaqui.com/${form.username}`"
									></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Teléfono
									</div>
									<v-text-field
										v-model="form.phone"
										filled
										outlined
										placeholder="(Requerido)"
										:rules="rulesTextField"
										dense
										type="text"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
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
												id="birthdate"
												v-model="form.birthDate"
												readonly
												filled
												outlined
												hide-details
												placeholder="(Requerido)"
												:rules="rulesTextField"
												dense
												v-bind="attrs"
												v-on="on"
											></v-text-field>
										</template>
										<v-date-picker
											v-model="form.birthDate"
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
								</v-col>
								<v-col cols="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Género
									</div>
									<v-select
										id="genre"
										v-model="form.gender"
										:items="['Hombre', 'Mujer', 'Transgénero']"
										filled
										outlined
										hide-details
										placeholder="(Requerido)"
										:rules="rulesTextField"
										dense
									></v-select>
								</v-col>
								<v-col cols="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Región
									</div>
									<v-select
										id="region"
										v-model="form.region"
										:items="regiones"
										filled
										outlined
										hide-details
										dense
										placeholder="(Requerido)"
										:rules="rulesTextField"
									></v-select>
								</v-col>
								<v-col cols="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Comuna
									</div>
									<v-select
										id="comuna"
										v-model="form.comuna"
										:disabled="!form.region"
										:items="comunas"
										filled
										outlined
										hide-details
										placeholder="(Requerido)"
										:rules="rulesTextField"
										dense
									></v-select>
								</v-col>
								<v-col cols="12">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Zona horaria
									</div>
									<v-combobox
										id="timezone"
										v-model="form.timeZone"
										dense
										filled
										hide-details
										placeholder="(Requerido)"
										:rules="rulesTextField"
										:items="timezone"
										outlined
										:search-input.sync="zone"
									>
										<template #no-data>
											<v-list-item>
												<v-list-item-content>
													<v-list-item-title>
														No se encontraron resultados que coincidan
														con "<strong>
															{{ zone }}
														</strong>
														" .
													</v-list-item-title>
												</v-list-item-content>
											</v-list-item>
										</template>
									</v-combobox>
								</v-col>
								<v-col cols="12">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Idiomas (Requerido)
									</div>
									<div class="d-flex">
										<v-checkbox
											v-model="form.languages"
											class="mx-2"
											value="spanish"
											filled
											label="Español"
											outlined
											hide-details
											dense
										></v-checkbox>
										<v-checkbox
											v-model="form.languages"
											class="mx-2"
											value="english"
											filled
											label="Ingles"
											outlined
											hide-details
											dense
										></v-checkbox>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Descripción personal
									</div>
									<v-textarea
										id="description-personal"
										v-model="form.personalDescription"
										outlined
										filled
										no-resize
										:rules="rules"
										counter
									></v-textarea>
								</v-col>
								<v-col cols="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Instagram
									</div>
									<v-text-field
										v-model="form.instagram"
										filled
										outlined
										dense
										type="text"
										placeholder="Inserte link (opcional)"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Linkedin
									</div>
									<v-text-field
										v-model="form.linkedin"
										placeholder="Inserte link (opcional)"
										filled
										outlined
										dense
										type="text"
									></v-text-field>
								</v-col>
							</v-row>
							<div class="d-flex justify-end mt-4">
								<v-btn
									:loading="loadingStep"
									rounded
									color="primary"
									@click="setStepTwo"
								>
									Siguiente
								</v-btn>
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
							<v-row>
								<v-col cols="12">
									<div class="primary--text">
										¡Estamos ansiosos de saber más de ti!
									</div>
									<div
										class="
											mb-10
											primary--text
											font-weight-bold
											text-h4 text-left
										"
									>
										Cuéntanos sobre tu formación profesional
									</div>
								</v-col>
								<v-col cols="12">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Descripción profesional
									</div>
									<v-textarea
										v-model="professionalDescription"
										no-resize
										filled
										outlined
										dense
										placeholder="Requerido"
										type="text"
										counter
										:rules="rules"
									></v-textarea>
								</v-col>
								<v-col cols="12">
									<v-row>
										<v-col cols="3" md="3" class="py-0">
											<div
												class="
													primary--text
													text-h6
													mb-2
													font-weight-regular
												"
											>
												Formación
											</div>
										</v-col>
										<v-col cols="3" md="3" class="py-0">
											<div
												class="
													primary--text
													body-1
													mb-2
													font-weight-regular
												"
											>
												Ubicación / Curso / Descripción
											</div>
										</v-col>
										<v-col cols="2" md="2" class="py-0">
											<div
												class="
													primary--text
													text-h6
													mb-2
													font-weight-regular
												"
											>
												Inicio
											</div>
										</v-col>
										<v-col cols="2" md="2" class="py-0">
											<div
												class="
													primary--text
													text-h6
													mb-2
													font-weight-regular
												"
											>
												Termino
											</div>
										</v-col>
									</v-row>
									<v-row v-for="(item, i) in formation" :key="i">
										<v-col cols="12" md="3">
											<v-select
												filled
												outlined
												dense
												type="text"
												:items="[
													'Licenciatura',
													'Diplomado',
													'Master',
													'Magister',
													'Doctorado',
													'Curso/especialización',
													'Otro',
												]"
												:value="item.formationType"
												@change="e => (formation[i].formationType = e)"
											></v-select>
										</v-col>
										<v-col cols="12" md="3">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.description"
												@input="e => (formation[i].title = e)"
											></v-text-field>
										</v-col>
										<v-col cols="12" md="2">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.start"
												@input="e => (formation[i].start = e)"
											></v-text-field>
										</v-col>
										<v-col cols="12" md="2">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.end"
												@input="e => (formation[i].end = e)"
											></v-text-field>
										</v-col>
										<v-col cols="12" md="2" class="text-center text-md-left">
											<v-btn
												v-if="i === formation.length - 1"
												small
												color="primary"
												fab
												depressed
												@click="newFormation"
											>
												<h1>+</h1>
											</v-btn>
											<v-btn
												v-if="
													i === formation.length - 1 &&
													formation.length - 1
												"
												small
												color="error"
												fab
												depressed
												@click="
													() =>
														(formation = formation.filter(
															(el, index) => index !== i
														))
												"
											>
												<h1>-</h1>
											</v-btn>
										</v-col>
									</v-row>
								</v-col>
								<v-col cols="12">
									<v-row>
										<v-col cols="3" md="3" class="py-0">
											<div
												class="
													primary--text
													text-h6
													mb-2
													font-weight-regular
												"
											>
												Experiencia
											</div>
										</v-col>
										<v-col cols="3" md="3" class="py-0">
											<div
												class="
													primary--text
													body-1
													mb-2
													font-weight-regular
												"
											>
												Lugar / Descripción
											</div>
										</v-col>
										<v-col cols="2" md="2" class="py-0">
											<div
												class="
													primary--text
													text-h6
													mb-2
													font-weight-regular
												"
											>
												Inicio
											</div>
										</v-col>
										<v-col cols="2" md="2" class="py-0">
											<div
												class="
													primary--text
													text-h6
													mb-2
													font-weight-regular
												"
											>
												Termino
											</div>
										</v-col>
									</v-row>
									<v-row v-for="(item, i) in experience" :key="i">
										<v-col cols="3" md="3">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.title"
												@input="e => (experience[i].title = e)"
											></v-text-field>
										</v-col>
										<v-col cols="3" md="3">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.place"
												@input="e => (experience[i].place = e)"
											></v-text-field>
										</v-col>
										<v-col cols="3" md="2">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.start"
												@input="e => (experience[i].start = e)"
											></v-text-field>
										</v-col>
										<v-col cols="3" md="2">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.end"
												@input="e => (experience[i].end = e)"
											></v-text-field>
										</v-col>
										<v-col cols="12" md="2" class="text-right text-sm-left">
											<v-btn
												v-if="i === experience.length - 1"
												small
												color="primary"
												fab
												depressed
												@click="newExperience"
											>
												<h1>+</h1>
											</v-btn>
											<v-btn
												v-if="
													i === experience.length - 1 &&
													experience.length - 1
												"
												small
												color="error"
												fab
												depressed
												@click="
													() =>
														(experience = experience.filter(
															(el, index) => index !== i
														))
												"
											>
												<h1>-</h1>
											</v-btn>
										</v-col>
									</v-row>
								</v-col>
								<v-col cols="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Especialidades
									</div>
									<v-select
										v-model="specialtiesSelected"
										:loading="!specialties.length"
										filled
										outlined
										dense
										chips
										multiple
										type="text"
										:items="specialties"
									></v-select>
								</v-col>
							</v-row>
							<div class="d-flex justify-end mt-4">
								<v-btn class="mx-2" rounded color="primary" @click="step = 1">
									Atras
								</v-btn>
								<v-btn class="mx-2" rounded color="primary" @click="step = 3">
									Siguiente
								</v-btn>
							</div>
						</v-stepper-content>

						<v-stepper-content step="3">
							<v-row>
								<v-col cols="12">
									<div class="primary--text">¡Ya casi terminamos!</div>
									<div
										class="
											mb-10
											primary--text
											font-weight-bold
											text-h4 text-left
										"
									>
										Háblanos sobre tu trabajo
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h6 mb-2 font-weight-regular">
										¿Cuántos años llevas trabajando como psicólogo clínico?
									</div>
									<div>
										<v-text-field
											filled
											outlined
											dense
											type="text"
										></v-text-field>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h6 mb-2 font-weight-regular">
										¿Cuántos años ha visto pacientes en línea a través de
										consultas por video?
									</div>
									<div>
										<v-text-field
											filled
											outlined
											dense
											type="text"
										></v-text-field>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h6 mb-2 font-weight-regular">
										¿Cuál es el número promedio de paciente que ve semanalmente?
									</div>
									<div>
										<v-text-field
											filled
											outlined
											dense
											type="text"
										></v-text-field>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h6 mb-2 font-weight-regular">
										¿Es la atención clínica su actividad exclusiva?
									</div>
									<div>
										<v-radio-group v-model="exclusiveActivity" row>
											<v-radio
												v-for="n in ['Si', 'No']"
												:key="n"
												:label="n"
												:value="n"
											></v-radio>
										</v-radio-group>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h6 mb-2 font-weight-regular">
										¿Está actualmente bajo la supervisión clínica de otro
										profesional de la psicología?
									</div>
									<div>
										<v-radio-group row>
											<v-radio
												v-for="n in ['Si', 'No']"
												:key="n"
												:label="n"
												:value="n"
											></v-radio>
										</v-radio-group>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h6 mb-2 font-weight-regular">
										¿Supervisa actualmente a otros psicólogos?
									</div>
									<div>
										<v-radio-group row>
											<v-radio
												v-for="n in ['Si', 'No']"
												:key="n"
												:label="n"
												:value="n"
											></v-radio>
										</v-radio-group>
									</div>
								</v-col>
							</v-row>

							<div class="d-flex justify-end mt-4">
								<v-btn class="mx-2" rounded color="primary" @click="step = 2">
									Atras
								</v-btn>
								<v-btn class="mx-2" rounded color="primary">
									Enviar tu postulación
								</v-btn>
							</div>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
	layout: 'simple',
	data() {
		return {
			form: {
				username: '',
				phone: '',
				timeZone: 'America/Santiago',
				gender: '',
				languages: ['spanish'],
				birthDate: '',
				region: '',
				comuna: '',
				personalDescription: '',
				linkedin: '',
				instagram: '',
			},
			experience: [{ title: '', place: '', start: '', end: '' }],
			formation: [{ formationType: '', description: '', start: '', end: '' }],
			professionalDescription: '',
			activePicker: null,
			bmenu: false,
			yearsWorked: '',
			exclusiveActivity: null,
			zone: '',
			step: 1,
			regiones: [],
			comunas: [],
			specialtiesSelected: [],
			comunasRegiones: [],
			timezone: [],
			loadingStep: false,
			rules: [
				v => v.length >= 140 || 'Minimo 140 caracteres',
				v => v.length <= 300 || 'Maximo 300 caracteres',
				value => !!value || 'Este campo es requerido.',
			],
			rulesUsername: [
				value => {
					const re = /^[A-Za-z]+(?:[_-][A-Za-z]+)*$/;
					return re.test(value) || 'Inserte un username valido';
				},
				value => !!value || 'Este campo es requerido.',
			],
			rulesTextField: [value => !!value || 'Este campo es requerido.'],
		};
	},
	computed: {
		...mapGetters({
			specialties: 'Appointments/specialties',
		}),
	},
	watch: {
		bmenu(val) {
			val && setTimeout(() => (this.activePicker = 'YEAR'));
		},
		'form.region'(newVal) {
			this.comunas = this.comunasRegiones.find(item => item.region === newVal).comunas;
		},
	},
	async mounted() {
		const { data } = await axios.get(`${this.$config.API_ABSOLUTE}/timezone.json`);
		const response = await axios.get(`${this.$config.LANDING_URL}/comunas-regiones.json`);
		this.timezone = data;
		this.comunasRegiones = response.data;
		this.regiones = response.data.map(i => i.region);
		this.getAppointments();
	},
	methods: {
		async setStepTwo() {
			this.loadingStep = true;
			if (
				this.form.username &&
				this.form.phone &&
				this.form.timeZone &&
				this.form.gender &&
				this.form.languages.length &&
				this.form.birthDate &&
				this.form.region &&
				this.form.comuna &&
				this.form.personalDescription &&
				this.form.personalDescription.length <= 300 &&
				this.form.personalDescription.length >= 100
			) {
				const available = await this.checkUsername(this.form.username);
				if (available && this.form.username) {
					const { data } = await this.$axios('/recruitment/register', {
						method: 'post',
						data: this.form,
					});
					console.log(data);
					this.form = data;
					this.step = 2;
				} else alert('Username no disponible, por favor cambie');
			} else {
				alert('Faltan campos por llenar');
			}
			this.loadingStep = false;
		},
		save(date) {
			this.$refs.menu.save(date);
		},
		newExperience() {
			this.experience.push({ title: '', place: '', start: '', end: '' });
		},
		newFormation() {
			this.formation.push({ formationType: '', description: '', start: '', end: '' });
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			checkUsername: 'Psychologist/checkUsername',
		}),
	},
};
</script>
