<template>
	<div v-if="form" style="height: 100vh">
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
							Háblanos sobre ti
						</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step :complete="step > 2" step="2">
							Información profesional
						</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step :complete="step > 3" step="3">
							Experiencia laboral
						</v-stepper-step>
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
								<v-col cols="12" md="6">
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
								<v-col cols="12" md="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Género
									</div>
									<v-select
										id="genre"
										v-model="form.gender"
										:items="[
											{ text: 'Hombre', value: 'male' },
											{ text: 'Mujer', value: 'female' },
											{ text: 'Transgénero', value: 'transgender' },
										]"
										filled
										outlined
										hide-details
										placeholder="(Requerido)"
										:rules="rulesTextField"
										dense
									></v-select>
								</v-col>
								<v-col cols="12" md="6">
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
								<v-col cols="12" md="6">
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
								<v-col cols="12" md="6">
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
								<v-col cols="12" md="6">
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
									@click="saveStep(2)"
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
										v-model="form.professionalDescription"
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
												Curso / Institución educativa
											</div>
										</v-col>
										<v-col cols="3" md="2" class="py-0">
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
										<v-col cols="3" md="2" class="py-0">
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
									<v-row v-for="(item, i) in form.formation" :key="i">
										<v-col cols="3" md="3">
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
												@change="e => (form.formation[i].formationType = e)"
											></v-select>
										</v-col>
										<v-col cols="3" md="3">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.description"
												@input="e => (form.formation[i].description = e)"
											></v-text-field>
										</v-col>
										<v-col cols="3" md="2">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.start"
												@input="e => (form.formation[i].start = e)"
											></v-text-field>
										</v-col>
										<v-col cols="3" md="2">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.end"
												@input="e => (form.formation[i].end = e)"
											></v-text-field>
										</v-col>
										<v-col cols="12" md="2" class="text-right text-md-left">
											<v-btn
												v-if="i === form.formation.length - 1"
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
													i === form.formation.length - 1 &&
													form.formation.length - 1
												"
												small
												color="error"
												fab
												depressed
												@click="
													() =>
														(form.formation = form.formation.filter(
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
										<v-col cols="3" md="2" class="py-0">
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
										<v-col cols="3" md="2" class="py-0">
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
									<v-row v-for="(item, i) in form.experience" :key="i">
										<v-col cols="3" md="3">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.title"
												@input="e => (form.experience[i].title = e)"
											></v-text-field>
										</v-col>
										<v-col cols="3" md="3">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.place"
												@input="e => (form.experience[i].place = e)"
											></v-text-field>
										</v-col>
										<v-col cols="3" md="2">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.start"
												@input="e => (form.experience[i].start = e)"
											></v-text-field>
										</v-col>
										<v-col cols="3" md="2">
											<v-text-field
												filled
												outlined
												dense
												type="text"
												:value="item.end"
												@input="e => (form.experience[i].end = e)"
											></v-text-field>
										</v-col>
										<v-col cols="12" md="2" class="text-right text-md-left">
											<v-btn
												v-if="i === form.experience.length - 1"
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
													i === form.experience.length - 1 &&
													form.experience.length - 1
												"
												small
												color="error"
												fab
												depressed
												@click="
													() =>
														(form.experience = form.experience.filter(
															(el, index) => index !== i
														))
												"
											>
												<h1>-</h1>
											</v-btn>
										</v-col>
									</v-row>
								</v-col>
								<v-col cols="12" md="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Especialidades
									</div>
									<v-select
										v-model="form.specialties"
										:loading="!specialties.length"
										filled
										outlined
										dense
										multiple
										hide-details
										type="text"
										class="pb-0"
										:items="specialties"
									>
										<template #selection>
											<div></div>
										</template>
									</v-select>
								</v-col>
								<v-col cols="12" md="6" class="pt-0 hidden-md-and-up">
									<v-chip
										v-for="(item, i) in form.specialties"
										:key="i"
										outlined
										small
										class="ma-2"
										close
										@click:close="rmSpecialties(i)"
									>
										{{ item }}
									</v-chip>
								</v-col>
								<v-col cols="12" md="6">
									<div class="primary--text text-h6 mb-2 font-weight-regular">
										Modelo terapéutico
									</div>
									<v-select
										v-model="form.models"
										filled
										outlined
										dense
										multiple
										hide-details
										type="text"
										class="pb-0"
										:items="[
											'Cognitivo-conductual',
											'Contextual',
											'Psicoanálisis',
											'Humanista',
											'Sistémico',
										]"
									>
										<template #selection>
											<div></div>
										</template>
									</v-select>
								</v-col>
								<v-col cols="12" md="6" class="pt-0 hidden-sm-and-down">
									<v-chip
										v-for="(item, i) in form.specialties"
										:key="i"
										outlined
										small
										class="ma-2"
										close
										@click:close="rmSpecialties(i)"
									>
										{{ item }}
									</v-chip>
								</v-col>
								<v-col cols="12" md="6" class="pt-0">
									<v-chip
										v-for="(item, i) in form.models"
										:key="i"
										outlined
										small
										class="ma-2"
										close
										@click:close="rmModels(i)"
									>
										{{ item }}
									</v-chip>
								</v-col>
							</v-row>
							<div class="d-flex justify-end mt-8">
								<v-btn class="mx-2" rounded color="primary" @click="step = 1">
									Atrás
								</v-btn>
								<v-btn
									:loading="loadingStep"
									class="mx-2"
									rounded
									color="primary"
									@click="saveStep(3)"
								>
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
											v-model="form.yearsExpPsychologist"
											filled
											outlined
											dense
											type="text"
										></v-text-field>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h6 mb-2 font-weight-regular">
										¿Cuántos años has visto pacientes en línea a través de
										consultas por video?
									</div>
									<div>
										<v-text-field
											v-model="form.yearsExpVideocalls"
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
											v-model="form.avgPatients"
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
										<v-radio-group v-model="form.isExclusiveActivity" row>
											<v-radio
												v-for="n in [
													{ text: 'Si', value: true },
													{ text: 'No', value: false },
												]"
												:key="n.text"
												:label="n.text"
												:value="n.value"
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
										<v-radio-group v-model="form.isUnderSupervision" row>
											<v-radio
												v-for="n in [
													{ text: 'Si', value: true },
													{ text: 'No', value: false },
												]"
												:key="n.text"
												:label="n.text"
												:value="n.value"
											></v-radio>
										</v-radio-group>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h6 mb-2 font-weight-regular">
										¿Supervisa actualmente a otros psicólogos?
									</div>
									<div>
										<v-radio-group v-model="form.isSupervisor" row>
											<v-radio
												v-for="n in [
													{ text: 'Si', value: true },
													{ text: 'No', value: false },
												]"
												:key="n.text"
												:label="n.text"
												:value="n.value"
											></v-radio>
										</v-radio-group>
									</div>
								</v-col>
							</v-row>

							<div class="d-flex justify-end mt-4">
								<v-btn class="mx-2" rounded color="primary" @click="step = 2">
									Atrás
								</v-btn>
								<v-btn
									:loading="loadingStep"
									class="mx-2"
									rounded
									color="primary"
									@click="saveStep(4)"
								>
									Finalizar postulación
								</v-btn>
							</div>
						</v-stepper-content>

						<v-stepper-content step="4">
							<v-container fluid style="height: 70vh; max-width: 1200px">
								<v-row
									justify="center"
									align="center"
									style="height: 100%; overflow-y: auto"
								>
									<v-col cols="12" class="text-center" style="color: #5c5c5c">
										<div class="headline font-weight-bold">
											¡Ya has terminado!
										</div>
										<div
											class="my-6 text--secondary body-1 mx-auto"
											style="max-width: 800px"
										>
											Hemos recibido tu registro y verificaremos tu profesión
											en la superintendencia de salud. Será un honor para
											nosotros contar contigo en nuestro equipo de psicólogos,
											te contactaremos pronto.
										</div>
										<div>
											<v-btn
												class="mx-2"
												rounded
												color="primary"
												@click="step = 3"
											>
												Atrás
											</v-btn>
											<v-btn class="mx-2" color="primary" rounded to="/">
												Ir a Hablaquí
											</v-btn>
										</div>
									</v-col>
								</v-row>
							</v-container>
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
	name: 'Postulacion',
	layout: 'simple',
	middleware: ['auth'],
	data() {
		return {
			activePicker: null,
			bmenu: false,
			zone: '',
			step: 1,
			regiones: [],
			comunas: [],
			comunasRegiones: [],
			timezone: [],
			loadingStep: false,
			rules: [
				v => v.length >= 140 || 'Minimo 140 caracteres',
				v => v.length <= 300 || 'Maximo 300 caracteres',
				value => !!value || 'Este campo es requerido.',
			],
			rulesTextField: [value => !!value || 'Este campo es requerido.'],
			form: {
				avgPatients: '',
				birthDate: '',
				comuna: '',
				experience: [{ title: '', place: '', start: '', end: '' }],
				formation: [{ formationType: '', description: '', start: '', end: '' }],
				gender: '',
				instagram: '',
				isExclusiveActivity: false,
				isSupervisor: false,
				isUnderSupervision: false,
				languages: ['spanish'],
				linkedin: '',
				personalDescription: '',
				professionalDescription: '',
				region: '',
				specialties: [],
				timeZone: 'America/Santiago',
				yearsExpPsychologist: '',
				yearsExpVideocalls: '',
				models: [],
			},
			recruitment: null,
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
		await this.getAppointments();
		const responseRecruitment = await this.$axios.$get(`/recruitment/${this.$auth.user.email}`);
		if (responseRecruitment.recruited) this.form = responseRecruitment.recruited;
	},
	methods: {
		async saveStep(step) {
			this.loadingStep = true;
			if (this.validationStep(step)) {
				if (this.form && this.form._id) {
					// actualizamos postulacion
					const { data } = await this.$axios('/recruitment/update', {
						method: 'put',
						data: this.form,
					});
					this.form = data.recruited;
				} else {
					// creamos postulacion
					const { data } = await this.$axios('/recruitment/register', {
						method: 'post',
						data: this.form,
					});
					this.form = data.recruited;
				}
				this.step = step;
			} else {
				alert('Por favor complete el formulario');
			}
			this.loadingStep = false;
		},
		// step el el paso siguiente por lo tanto restamos uno para validar ese step antes pasar al siguiente
		validationStep(step) {
			// validamos el step 1
			if (step - 1 === 1) {
				return (
					this.form.timeZone &&
					this.form.gender &&
					this.form.languages.length &&
					this.form.birthDate &&
					this.form.region &&
					this.form.comuna &&
					this.form.personalDescription &&
					this.form.personalDescription.length <= 300 &&
					this.form.personalDescription.length >= 100
				);
			}
			// validamos el step 2
			else if (step - 1 === 2) {
				return (
					this.form.professionalDescription &&
					this.form.formation.length &&
					this.form.experience.length &&
					this.form.specialties.length
				);
			}
			// Final del formulario, validamos step 3
			else if (step - 1 === 3) {
				return true;
			}
		},
		rmSpecialties(index) {
			this.form.specialties.splice(index, 1);
		},
		rmModels(index) {
			this.form.models.splice(index, 1);
		},
		save(date) {
			this.$refs.menu.save(date);
		},
		newExperience() {
			this.form.experience.push({ title: '', place: '', start: '', end: '' });
		},
		newFormation() {
			this.form.formation.push({ formationType: '', description: '', start: '', end: '' });
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
		}),
	},
};
</script>
