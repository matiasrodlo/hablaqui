<template>
	<div v-if="!loading" style="height: 100vh">
		<div class="ma-4 d-flex justify-space-between align-center">
			<a id="logo-appbar" tabindex="0" href="https://hablaqui.cl/" exact accesskey="h">
				<v-img
					style="max-width: 160px"
					alt="hablaqui Logo"
					:src="`https://cdn.hablaqui.cl/static/logo.png`"
					:lazy-src="`https://cdn.hablaqui.cl/static/logo.png`"
					contain
				/>
			</a>
			<span class="hidden-sm-and-down text--secondary text-h7">
				¿Necesita ayuda?
				<a
					style="text-decoration: none"
					class="primary--text"
					href="https://api.whatsapp.com/message/RZPJ4H5ZTDNWB1?autoload=1&app_absent=0"
					target="_blank"
				>
					Contáctenos
				</a>
			</span>
			<a
				style="text-decoration: none"
				class="hidden-md-and-up"
				href="https://api.whatsapp.com/message/RZPJ4H5ZTDNWB1?autoload=1&app_absent=0"
				target="_blank"
			>
				<v-img
					style="max-width: 30px"
					alt="Ayuda"
					:src="`https://cdn.hablaqui.cl/static/help.png`"
					:lazy-src="`https://cdn.hablaqui.cl/static/help.png`"
					contain
				/>
			</a>
		</div>
		<v-row justify="center">
			<v-col cols="12" :md="step === 4 ? '10' : '8'" :lg="step === 4 ? '8' : '6'">
				<v-stepper v-model="step" flat>
					<v-stepper-header class="elevation-0">
						<v-stepper-step :complete="step > 1" step="1">
							Información personal
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
								<v-col cols="6" align-self="center">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Fecha de nacimiento
									</div>
								</v-col>
								<v-col cols="12" md="6">
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
								<v-col cols="6" align-self="center">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Género
									</div>
								</v-col>
								<v-col cols="12" md="6">
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
								<v-col cols="12" md="4">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										País
									</div>
									<v-autocomplete
										id="region"
										v-model="form.country"
										:items="countries"
										item-text="name"
										item-value="name"
										filled
										outlined
										hide-details
										dense
										placeholder="(Requerido)"
										:rules="rulesTextField"
										@change="
											e => {
												form.phone.code = countries.find(
													item => item.name === e
												).dialCode;
												if (e !== 'Chile') {
													form.region = '';
													form.comuna = '';
												}
											}
										"
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="4">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Región
									</div>
									<v-autocomplete
										id="region"
										v-model="form.region"
										:disabled="form.country !== 'Chile'"
										:items="regiones"
										filled
										outlined
										hide-details
										dense
										:placeholder="form.country !== 'Chile' ? '' : '(Requerido)'"
										:rules="rulesTextField"
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="4">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Comuna
									</div>
									<v-autocomplete
										id="comuna"
										v-model="form.comuna"
										:disabled="!form.region || form.country !== 'Chile'"
										:items="comunas"
										filled
										outlined
										hide-details
										:placeholder="form.country !== 'Chile' ? '' : '(Requerido)'"
										:rules="rulesTextField"
										dense
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="4">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
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
								<v-col cols="4" md="3" offset-md="1">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Código
									</div>
									<v-autocomplete
										id="phonecode"
										v-model="form.phone.code"
										:items="countries"
										item-text="dialCode"
										filled
										outlined
										hide-details
										dense
										:rules="rulesTextField"
									>
										<template #selection="{ item }">
											<div>
												<v-avatar size="20">
													<v-img :src="item.flag"></v-img>
												</v-avatar>
												<span class="caption">{{ item.dialCode }}</span>
											</div>
										</template>
									</v-autocomplete>
								</v-col>
								<v-col cols="8" md="4">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Teléfono
									</div>
									<v-text-field
										id="phoneNumber"
										v-model="form.phone.number"
										filled
										outlined
										type="number"
										:rules="rulesTextField"
										dense
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Idiomas
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
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Descripción personal
									</div>
									<v-textarea
										id="description-personal"
										v-model="form.personalDescription"
										outlined
										placeholder="Me agrada meditar, disfrutar de los pequeños milagros cotidianos, contemplar la naturaleza,
agradecer, aprender de las personas, realizar actividades deportivas y reír."
										filled
										no-resize
										hint="Hable de usted más allá de lo profesional. Describa sus gustos y pasatiempos creando un ambiente acogedor."
										counter
										:rules="rulesDescriptionField"
									></v-textarea>
								</v-col>
								<v-col cols="12" md="6">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Instagram
									</div>
									<v-text-field
										v-model="form.instagram"
										filled
										outlined
										dense
										type="text"
										placeholder="instagram.com/usuario"
									></v-text-field>
								</v-col>
								<v-col cols="12" md="6">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										LinkedIn
									</div>
									<v-text-field
										v-model="form.linkedin"
										placeholder="linkedin.com/in/usuario/"
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
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Descripción profesional
									</div>
									<v-textarea
										v-model="form.professionalDescription"
										no-resize
										filled
										outlined
										dense
										placeholder="Realizo psicoterapia familiar, de pareja e individual bajo la premisa de que el ser humano tiene un potencial enorme, colaborando para construir estrategias para solucionar problemas"
										hint="Describa su metodología de trabajo y cómo puedes ayudar a al consultante."
										counter
										:rules="rulesDescriptionField"
									></v-textarea>
								</v-col>
								<v-col cols="12" md="6">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Formación
									</div>
									<div class="text--secondary caption mb-2 font-weight-regular">
										Título, disciplina, institución, periodo
									</div>
									<v-list>
										<v-list-item v-for="(item, t) in form.formation" :key="t">
											<v-list-item-content>
												<v-list-item-title class="text-capitalize">
													{{ item.formationType }} -
													{{ item.description }}
												</v-list-item-title>
												<v-list-item-subtitle class="text-capitalize">
													{{ item.intitucion }}
													{{ item.start }} -
													{{ item.end }}
												</v-list-item-subtitle>
											</v-list-item-content>
											<v-list-item-icon>
												<v-btn icon @click="setFormation(item, t)">
													<icon :icon="mdiPencilOutline" />
												</v-btn>
												<v-btn
													icon
													@click="
														() =>
															(form.formation = form.formation.filter(
																(el, index) => index !== t
															))
													"
												>
													<icon color="error" :icon="mdiDeleteOutline" />
												</v-btn>
											</v-list-item-icon>
										</v-list-item>
									</v-list>
									<v-btn
										depressed
										color="#ecf5ff"
										rounded
										block
										@click="setFormation"
									>
										<span class="primary--text">Agregar formación</span>
									</v-btn>
									<v-dialog
										v-if="selectedFormation"
										v-model="dialogFormation"
										max-width="400"
										@click:outside="
											() => {
												selectedFormation = null;
												indexSelected = null;
												dialogFormation = false;
											}
										"
									>
										<v-card>
											<v-card-text class="pt-8">
												<v-row>
													<v-col cols="12">
														<div
															class="primary--text font-weight-bold body-1 pb-2"
														>
															Formación
														</div>
														<v-select
															v-model="
																selectedFormation.formationType
															"
															filled
															outlined
															hide-details
															placeholder="Título"
															dense
															type="text"
															:items="[
																'Licenciatura',
																'Diplomado',
																'Magister',
																'Doctorado',
																'Curso',
															]"
														></v-select>
													</v-col>
													<v-col cols="12">
														<div class="primary--text body-1 pb-2">
															Disciplina
														</div>
														<v-text-field
															v-model="selectedFormation.description"
															filled
															outlined
															placeholder="Especialista Clinico"
															dense
															hide-details
															type="text"
														></v-text-field>
													</v-col>
													<v-col cols="12">
														<div class="primary--text body-1 pb-2">
															Institución
														</div>
														<v-text-field
															v-model="selectedFormation.intitucion"
															filled
															outlined
															placeholder="Universidad de Chile"
															dense
															hide-details
															type="text"
														></v-text-field>
													</v-col>
													<v-col cols="12">
														<div class="primary--text body-1 pb-2">
															Inicio
														</div>
														<v-text-field
															v-model="selectedFormation.start"
															filled
															outlined
															dense
															type="text"
															placeholder="2019"
															hide-details
														></v-text-field>
													</v-col>
													<v-col cols="12">
														<div class="primary--text body-1 pb-2">
															Termino
														</div>
														<v-text-field
															v-model="selectedFormation.end"
															filled
															outlined
															dense
															placeholder="2021"
															hide-details
															type="text"
														></v-text-field>
													</v-col>
												</v-row>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn
													color="error"
													text
													@click="
														() => {
															selectedFormation = null;
															indexSelected = null;
															dialogFormation = false;
														}
													"
												>
													Cancelar
												</v-btn>
												<v-btn color="primary" text @click="newFormation">
													{{
														parseInt(indexSelected) >= 0 &&
														indexSelected !== null
															? 'Editar'
															: 'Agregar'
													}}
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</v-col>
								<!-- Experiencia -->
								<v-col cols="12" md="6">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
										Experiencia
									</div>
									<div class="text--secondary caption mb-2 font-weight-regular">
										Cargo, institución, periodo
									</div>
									<v-list>
										<v-list-item v-for="(item, t) in form.experience" :key="t">
											<v-list-item-content>
												<v-list-item-title class="text-capitalize">
													{{ item.title }} -
													{{ item.place }}
												</v-list-item-title>
												<v-list-item-subtitle class="text-capitalize">
													{{ item.start }} -
													{{ item.current ? 'Actualmente' : item.end }}
												</v-list-item-subtitle>
											</v-list-item-content>
											<v-list-item-icon>
												<v-btn icon @click="setExperience(item, t)">
													<icon :icon="mdiPencilOutline" />
												</v-btn>
												<v-btn
													icon
													@click="
														() =>
															(form.experience =
																form.experience.filter(
																	(el, index) => index !== t
																))
													"
												>
													<icon color="error" :icon="mdiDeleteOutline" />
												</v-btn>
											</v-list-item-icon>
										</v-list-item>
									</v-list>
									<v-btn
										depressed
										color="#ecf5ff"
										rounded
										block
										@click="() => setExperience()"
									>
										<span class="primary--text">Agregar experiencia</span>
									</v-btn>
									<v-dialog
										v-if="selectedExperience"
										v-model="dialogExperience"
										max-width="400"
										@click:outside="
											() => {
												selectedExperience = null;
												indexSelected = null;
												dialogExperience = false;
											}
										"
									>
										<v-card>
											<v-card-text class="pt-8">
												<v-row>
													<v-col cols="12">
														<div
															class="primary--text font-weight-bold body-1 pb-3"
														>
															Experiencia
														</div>
														<div class="primary--text body-1 pb-2">
															Cargo
														</div>
														<v-text-field
															v-model="selectedExperience.title"
															filled
															outlined
															placeholder="Especialista Clinico"
															dense
															hide-details
															type="text"
														></v-text-field>
													</v-col>
													<v-col cols="12">
														<div class="primary--text body-1 pb-2">
															Institución
														</div>
														<v-text-field
															v-model="selectedExperience.place"
															filled
															outlined
															dense
															hide-details
															placeholder="Clinica Las Condes"
															type="text"
														></v-text-field>
													</v-col>
													<v-col cols="12">
														<v-checkbox
															v-model="selectedExperience.current"
															dense
															hide-details
															label="Actualmente trabajando aquí"
															@change="
																e => {
																	selectedExperience.end = '';
																	if (e) hiddenInput = true;
																	else hiddenInput = false;
																}
															"
														></v-checkbox>
													</v-col>
													<v-col cols="12">
														<div class="primary--text body-1 pb-2">
															Inicio
														</div>
														<v-text-field
															v-model="selectedExperience.start"
															filled
															outlined
															dense
															hide-details
															placeholder="2019"
															type="text"
														></v-text-field>
													</v-col>
													<v-expand-transition>
														<v-col v-show="!hiddenInput" cols="12">
															<div class="primary--text body-1 pb-2">
																Termino
															</div>
															<v-text-field
																v-model="selectedExperience.end"
																filled
																outlined
																dense
																hide-details
																placeholder="2021"
																type="text"
															></v-text-field>
														</v-col>
													</v-expand-transition>
												</v-row>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn
													color="error"
													text
													@click="
														() => {
															selectedExperience = null;
															indexSelected = null;
															dialogExperience = false;
														}
													"
												>
													Cancelar
												</v-btn>
												<v-btn color="primary" text @click="newExperience">
													{{
														parseInt(indexSelected) >= 0 &&
														indexSelected !== null
															? 'Editar'
															: 'Agregar'
													}}
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</v-col>
								<v-col cols="12" md="6">
									<div class="primary--text text-h7 mb-2 font-weight-regular">
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
										@input="limiterSpecialities"
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
									<div class="primary--text text-h7 mb-2 font-weight-regular">
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
										@input="limiterModels"
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
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
										¿Cuántos años lleva trabajando como especialista clínico?
									</div>
									<div>
										<v-text-field
											v-model="form.yearsExpSpecialist"
											filled
											outlined
											dense
											:rules="rulesTextField"
											type="text"
										></v-text-field>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
										¿Cuántos años lleva atendiendo consultantes en línea?
									</div>
									<div>
										<v-text-field
											v-model="form.yearsExpVideocalls"
											filled
											outlined
											:rules="rulesTextField"
											dense
											type="text"
										></v-text-field>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
										¿Número promedio de consultantes que atiende semanalmente?
									</div>
									<div>
										<v-text-field
											v-model="form.avgPatients"
											filled
											outlined
											dense
											:rules="rulesTextField"
											type="text"
										></v-text-field>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
										¿Cómo nos conocio?
									</div>
									<div>
										<v-select
											v-model="form.howFindOut"
											filled
											outlined
											dense
											type="text"
											:items="[
												'Búsqueda de internet',
												'Por redes sociales',
												'Por amigos/familiares',
												'Por blog',
												'Anuncio en google',
												'Otro',
											]"
										></v-select>
									</div>
								</v-col>
								<v-col cols="12">
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
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
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
										¿Está bajo la supervisión clínica de otro profesional?
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
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
										¿Supervisa actualmente a otros especialistas?
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
								<v-col cols="12">
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
										¿Produce contenido en redes sociales?
									</div>
									<div>
										<v-radio-group v-model="form.isContentCreator" row>
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
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
										¿Actualmente atiende en alguna otra plataforma?
									</div>
									<div>
										<v-radio-group v-model="form.isAffiliateExternal" row>
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
									<div class="text--secondary text-h7 mb-2 font-weight-regular">
										¿Le gustaría atender consultantes de la red corporativa?
									</div>
									<div>
										<v-radio-group v-model="form.isInterestedBusiness" row>
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
									@click="
										() => {
											form.isFormCompleted = false;
											saveStep(4);
										}
									"
								>
									Siguiente
								</v-btn>
							</div>
						</v-stepper-content>
						<v-stepper-content step="4">
							<plans
								v-if="form._id"
								:next="
									() => {
										step = 5;
									}
								"
							/>
						</v-stepper-content>
						<v-stepper-content step="5">
							<v-container fluid style="height: 70vh; max-width: 1200px">
								<v-row
									justify="center"
									align="center"
									style="height: 100%; overflow-y: auto"
								>
									<v-col cols="12" class="text-center" style="color: #5c5c5c">
										<div>
											<v-img
												width="200"
												height="200"
												class="mx-auto"
												:src="`https://cdn.hablaqui.cl/static/balloon.png`"
												:lazy-src="`https://cdn.hablaqui.cl/static/balloon.png`"
											></v-img>
										</div>
										<div
											class="my-6 text--secondary body-1 mx-auto"
											style="max-width: 800px"
										>
											Hemos recibido su postulación, en breve verificaremos
											sus datos.
										</div>
										<div>
											<v-btn
												depressed
												class="mx-2"
												color="primary"
												rounded
												:to="{ name: 'dashboard-perfil' }"
											>
												Ir a mi cuenta
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
import { mdiPencilOutline, mdiDeleteOutline } from '@mdi/js';

export default {
	name: 'Postulacion',
	components: {
		Icon: () => import('~/components/Icon'),
		plans: () => import('~/components/postulacion/Plans'),
	},
	layout: 'simple',
	middleware: ['auth'],
	data() {
		return {
			hiddenInput: false,
			countries: [],
			indexSelected: null,
			selectedFormation: null,
			selectedExperience: null,
			dialogExperience: false,
			dialogFormation: false,
			mdiPencilOutline,
			mdiDeleteOutline,
			activePicker: null,
			bmenu: false,
			zone: '',
			step: 1,
			regiones: [],
			comunas: [],
			comunasRegiones: [],
			timezone: [],
			loadingStep: false,
			rulesTextField: [value => !!value || 'Este campo es requerido.'],
			rulesDescriptionField: [value => value.length <= 170 || 'Máximo 170 carácteres'],
			form: {
				avgPatients: '',
				birthDate: '',
				comuna: '',
				country: 'Chile',
				experience: [],
				formation: [],
				gender: '',
				profession: 'psychologist',
				instagram: '',
				isExclusiveActivity: false,
				isSupervisor: false,
				isUnderSupervision: false,
				languages: ['spanish'],
				linkedin: '',
				models: [],
				personalDescription: '',
				phone: { code: '+56', number: '', flag: '' },
				professionalDescription: '',
				region: '',
				specialties: [],
				timeZone: 'America/Santiago',
				yearsExpSpecialist: '',
				yearsExpVideocalls: '',
				howFindOut: 'Búsqueda de internet',
				isContentCreator: false,
				isAffiliateExternal: false,
				isInterestedBusiness: false,
			},
			recruitment: null,
			loading: false,
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
			if (newVal)
				this.comunas = this.comunasRegiones.find(item => item.region === newVal).comunas;
		},
	},
	async mounted() {
		this.loading = true;
		const { data } = await axios.get(`${this.$config.API_ABSOLUTE}/timezone.json`);
		let responseCountries = await fetch(`${this.$config.LANDING_URL}/countries.json`);
		responseCountries = await responseCountries.json();
		this.countries = responseCountries;
		const response = await axios.get(`${this.$config.LANDING_URL}/comunas-regiones.json`);
		this.timezone = data;
		this.comunasRegiones = response.data;
		this.regiones = response.data.map(i => i.region);
		await this.getAppointments();
		const responseRecruitment = await this.$axios.$get(`/recruitment/${this.$auth.user.email}`);
		if (responseRecruitment.recruited) this.form = responseRecruitment.recruited;
		if (this.form.isFormCompleted) this.step = 5;
		this.loading = false;
	},
	methods: {
		async saveStep(step) {
			this.loadingStep = true;
			if (this.validationStep(step)) {
				if (this.form && this.form._id) {
					// actualizamos postulacion
					const { data } = await this.$axios('/recruitment/update?step=' + this.step, {
						method: 'put',
						data: this.form,
					});
					this.$segment.track(this.form._id.toString(), {
						event: 'spec-application-step',
						properties: {
							step,
							email: this.$auth.user.email,
						},
					});
					this.form = data.recruited;
					if (step - 1 === 1) this.setUser();
				} else {
					// creamos postulacion
					const { data } = await this.$axios('/recruitment/register', {
						method: 'post',
						data: this.form,
					});
					this.form = data.recruited;
					if (step - 1 === 1) this.setUser();
				}
				this.step = step;
			}
			this.loadingStep = false;
		},
		// step el el paso siguiente por lo tanto restamos uno para validar ese step antes pasar al siguiente
		validationStep(step) {
			// validamos el step 1
			if (step - 1 === 1) {
				if (
					!this.form.timeZone ||
					!this.form.gender ||
					!this.form.languages.length ||
					!this.form.birthDate ||
					!this.form.country ||
					!this.form.region ||
					!this.form.comuna ||
					!this.form.personalDescription ||
					!this.form.phone.code ||
					!this.form.phone.number
				) {
					alert(`Complete los campos faltantes`);
				}
				// Se comprueba si se excedió el número de carácteres en la descripción
				else if (!(this.form.personalDescription.length <= 170)) {
					alert('Excedió el máximo de carácteres');
				}
				return (
					this.form.timeZone &&
					this.form.gender &&
					this.form.languages.length &&
					this.form.birthDate &&
					this.form.country &&
					this.form.region &&
					this.form.comuna &&
					this.form.personalDescription &&
					this.form.personalDescription.length <= 170 &&
					this.form.phone.code &&
					this.form.phone.number
				);
			}
			// validamos el step 2
			else if (step - 1 === 2) {
				if (
					!this.form.professionalDescription ||
					!this.form.formation.length ||
					!this.form.experience.length ||
					!this.form.specialties.length ||
					!this.form.models.length
				)
					alert('Complete los campos faltantes');
				else if (!(this.form.professionalDescription.length <= 170))
					alert('Excedió el máximo de carácteres');
				return (
					this.form.professionalDescription &&
					this.form.professionalDescription.length <= 170 &&
					this.form.formation.length &&
					this.form.experience.length &&
					this.form.specialties.length &&
					this.form.models.length
				);
			}
			// Final del formulario, validamos step 3
			else if (step - 1 === 3) {
				return true;
			}
			// Final del formulario, validamos step 4
			else if (step - 1 === 4) {
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
			if (this.indexSelected >= 0 && this.indexSelected !== null)
				this.form.experience[parseInt(this.indexSelected)] = this.selectedExperience;
			else this.form.experience.push(this.selectedExperience);
			this.dialogExperience = false;
		},
		setExperience(item, index) {
			if (index !== null) this.indexSelected = index;
			if (item) {
				this.hiddenInput = item.current;
				this.selectedExperience = item;
			} else {
				this.hiddenInput = false;
				this.selectedExperience = {
					title: '',
					place: '',
					start: '',
					end: '',
					current: false,
				};
			}
			this.dialogExperience = true;
		},
		newFormation() {
			if (this.indexSelected >= 0 && this.indexSelected !== null)
				this.form.formation[parseInt(this.indexSelected)] = this.selectedFormation;
			else this.form.formation.push(this.selectedFormation);
			this.dialogFormation = false;
		},
		setFormation(item, index) {
			if (index !== null) this.indexSelected = index;
			if (item) this.selectedFormation = item;
			else
				this.selectedFormation = {
					formationType: '',
					description: '',
					intitucion: '',
					start: '',
					end: '',
				};
			this.dialogFormation = true;
		},
		async setUser() {
			const user = await this.updateUser({
				...this.$auth.$state.user,
				phone: this.form.phone.code + this.form.phone.number,
				gender: this.form.gender,
				birthDate: this.form.birthDate,
			});
			this.$auth.setUser(user);
		},
		limiterModels(e) {
			if (e.length > 2) e.pop();
		},
		limiterSpecialities(e) {
			if (e.length > 6) e.pop();
		},

		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			updateUser: 'User/updateUser',
		}),
	},
};
</script>
