<template>
	<div>
		<!-- appbar -->
		<div :class="!matchedPsychologists.length ? 'primary' : 'trasnparent'">
			<appbar />
			<!-- content -->
			<div
				v-if="!matchedPsychologists.length"
				class="primary white--text text-center"
				style="position: relative; padding: 100px 0; height: 500px"
			>
				<div class="title text-h5 text-sm-h4 font-weight-bold my-10">
					Encuentra a tu especialista
				</div>
				<div class="d-flex justify-center text-h6 mb-12 mx-auto" style="max-width: 800px">
					Te ayudamos a encontrar al psicólogo que necesitas, solo responde las siguientes
					preguntas. ¡Queremos conocerte!
				</div>
				<div>
					<v-container>
						<v-row justify="center">
							<v-col cols="12" md="10" :lg="step == 3 ? '8' : '6'">
								<v-stepper v-model="step" light style="border-radius: 25px">
									<!-- items content -->
									<v-stepper-items>
										<v-stepper-content step="0">
											<div class="primary--text font-weight-bold title">
												¿Cuál es tu género?
											</div>
											<v-btn
												:color="gender === 'female' ? 'primary' : '#BDBDBD'"
												:outlined="gender !== 'female'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 1;
														gender = 'female';
													}
												"
											>
												Mujer
											</v-btn>
											<v-btn
												:color="gender === 'male' ? 'primary' : '#BDBDBD'"
												:outlined="gender !== 'male'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 1;
														gender = 'male';
													}
												"
											>
												Hombre
											</v-btn>
											<v-btn
												:color="
													gender === 'transgender' ? 'primary' : '#BDBDBD'
												"
												:outlined="gender !== 'transgender'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 1;
														gender = 'transgender';
													}
												"
											>
												Transgénero
											</v-btn>
											<v-btn
												:color="
													gender === 'Prefiero no indicarlo'
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="gender !== 'Prefiero no indicarlo'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 1;
														gender = 'Prefiero no indicarlo';
													}
												"
											>
												Prefiero no indicarlo
											</v-btn>
										</v-stepper-content>

										<v-stepper-content step="1">
											<div class="primary--text font-weight-bold title">
												¿En qué rango de edad <br />
												<span>te encuentras?</span>
											</div>

											<v-btn
												:color="age === '18-25' ? 'primary' : '#BDBDBD'"
												:outlined="age !== '18-25'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 2;
														age = '18-25';
													}
												"
											>
												18 -25
											</v-btn>

											<v-btn
												:color="age === '26-35' ? 'primary' : '#BDBDBD'"
												:outlined="age !== '26-35'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 2;
														age = '26-35';
													}
												"
											>
												26-35
											</v-btn>

											<v-btn
												:color="age === '36-45' ? 'primary' : '#BDBDBD'"
												:outlined="age !== '36-45'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 2;
														age = '36-45';
													}
												"
											>
												36-45
											</v-btn>

											<v-btn
												:color="age === '+45' ? 'primary' : '#BDBDBD'"
												:outlined="age !== '+45'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 2;
														age = '+45';
													}
												"
											>
												+45
											</v-btn>
											<v-btn text color="primary" @click="step = 0">
												Atras
											</v-btn>
										</v-stepper-content>

										<v-stepper-content step="2">
											<div class="primary--text font-weight-bold title">
												¿Es tu primera vez en terapia?
											</div>

											<v-btn
												:color="
													firstTherapy === 'si' ? 'primary' : '#BDBDBD'
												"
												:outlined="firstTherapy != 'si'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 3;
														firstTherapy = 'si';
													}
												"
											>
												Si
											</v-btn>

											<v-btn
												:color="
													firstTherapy == 'no' ? 'primary' : '#BDBDBD'
												"
												:outlined="firstTherapy != 'no'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														step = 3;
														firstTherapy = 'no';
													}
												"
											>
												No
											</v-btn>
											<v-btn text color="primary" @click="step = 1">
												Atras
											</v-btn>
										</v-stepper-content>

										<v-stepper-content step="3">
											<div class="primary--text font-weight-bold title">
												¿En qué temas te gustaría trabajar? <br />
												<span class="title font-weight-bold">
													Selecciona hasta 3 opciones.
												</span>
											</div>
											<v-row>
												<v-col>
													<template v-for="(item, i) in specialties">
														<v-btn
															v-if="i <= 9"
															:key="i"
															:color="
																themes.includes(item)
																	? 'primary'
																	: '#BDBDBD'
															"
															:outlined="!themes.includes(item)"
															block
															rounded
															large
															class="my-4"
															@click="() => setTheme(item)"
														>
															{{ item }}
														</v-btn>
													</template>
												</v-col>
												<v-col>
													<template v-for="(item, i) in specialties">
														<v-btn
															v-if="i >= 10"
															:key="i"
															:color="
																themes.includes(item)
																	? 'primary'
																	: '#BDBDBD'
															"
															:outlined="!themes.includes(item)"
															block
															rounded
															large
															class="my-4"
															@click="() => setTheme(item)"
														>
															{{ item }}
														</v-btn></template
													>
												</v-col>
											</v-row>
											<v-btn text color="primary" @click="step = 2">
												Atras
											</v-btn>
											<v-btn text color="primary" @click="step = 4">
												Siguiente
											</v-btn>
										</v-stepper-content>
										<v-stepper-content step="4">
											<div class="primary--text font-weight-bold title">
												¿Buscas algún enfoque terapéutico <br />
												<span>en específico?</span>
											</div>
											<div
												class="pa-2 my-4"
												:class="
													focus == 'cognitivo'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="border-radius: 25px; border: 1px solid #E0E0E0"
												@click="
													() => {
														step = 5;
														focus = 'cognitivo';
													}
												"
											>
												Quiero que las sesiones sean estructuradas
												definiendo metas a cumplir. Me gustaría que mi
												psicólogo/a tome un rol activo y me deje tareas
												semanales.
											</div>
											<div
												class="pa-2 my-4"
												:class="
													focus == 'integrativo'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="border-radius: 25px; border: 1px solid #E0E0E0"
												@click="
													() => {
														step = 5;
														focus = 'integrativo';
													}
												"
											>
												Quiero que mi psicólogo conozca diferentes modelos
												de intervención y de acuerdo a mis necesidades me
												brinde diferentes actividades o herramientas para
												ponerlas en práctica.
											</div>
											<div
												class="pa-2 my-4"
												:class="
													focus == 'contextual'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="border-radius: 25px; border: 1px solid #E0E0E0"
												@click="
													() => {
														step = 5;
														focus = 'contextual';
													}
												"
											>
												Quiero que sea un proceso activo donde aprenda a
												relacionarme con mis pensamientos, emociones y
												sensaciones fisicas de una forma distinta en la cual
												no me impida desarrollar la vida que quiero vivir.
											</div>
											<div
												class="pa-2 my-4"
												:class="
													focus == 'psicoanalisis'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="border-radius: 25px; border: 1px solid #E0E0E0"
												@click="
													() => {
														step = 5;
														focus = 'psicoanalisis';
													}
												"
											>
												Quiero que las sesiones sean conversacionales, donde
												pueda platicar cómo me siento y que mi psicólogo me
												ayude a explorar cómo mis experiencias pasadas
												influyen en mi presente.
											</div>
											<div
												class="pa-2 my-4"
												:class="
													focus == 'humanista'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="border-radius: 25px; border: 1px solid #E0E0E0"
												@click="
													() => {
														step = 5;
														focus = 'humanista';
													}
												"
											>
												Quiero que a través de la reflexión, mi psicólogo me
												ayude a conocer el origen de mis emociones y a
												encontrar un significado personal, contactando con
												aquellas áreas que tengo que sanar.
											</div>
											<div
												class="pa-2 my-4"
												:class="
													focus == 'sistemico'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="border-radius: 25px; border: 1px solid #E0E0E0"
												@click="
													() => {
														step = 5;
														focus = 'sistemico';
													}
												"
											>
												Quiero entender mi forma de interactuar con los
												demás para mejorar mis relaciones interpersonales,
												conociendo cómo mi entorno influye en mi conducta y
												en las distintas áreas de mi vida.
											</div>
											<v-btn text color="primary" @click="step = 3">
												Atras
											</v-btn>
										</v-stepper-content>
										<v-stepper-content step="5">
											<div class="primary--text font-weight-bold title">
												¿Con qué género te sientes más cómodo <br />
												<span>compartiendo lo que te sucede?</span>
											</div>

											<v-btn
												:color="
													genderConfort === 'female'
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="genderConfort !== 'female'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														genderConfort = 'female';
														openPrecharge();
													}
												"
											>
												Mujer
											</v-btn>
											<v-btn
												:color="
													genderConfort === 'male' ? 'primary' : '#BDBDBD'
												"
												:outlined="genderConfort !== 'male'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														genderConfort = 'male';
														openPrecharge();
													}
												"
											>
												Hombre
											</v-btn>
											<v-btn
												:color="
													genderConfort === 'transgender'
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="genderConfort !== 'transgender'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														genderConfort = 'transgender';
														openPrecharge();
													}
												"
											>
												Transgenero
											</v-btn>
											<v-btn
												:color="
													genderConfort === 'Me es indiferente'
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="genderConfort !== 'Me es indiferente'"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														genderConfort = 'Me es indiferente';
														openPrecharge();
													}
												"
											>
												Me es indiferente
											</v-btn>

											<v-btn text color="primary" @click="step = 4">
												Atras
											</v-btn>
										</v-stepper-content>
									</v-stepper-items>
								</v-stepper>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12">
								<v-divider style="border-width: 1px"></v-divider>
							</v-col>
							<v-col cols="12">
								<v-window v-model="onboarding">
									<v-window-item v-for="(element, i) in psi" :key="i">
										<div class="text-center d-flex justify-center align-center">
											<template v-if="$vuetify.breakpoint.mdAndUp">
												<v-card
													flat
													max-width="600"
													max-height="190"
													outlined
													v-for="(item, l) in element"
													:key="l"
													class="ma-2"
												>
													<v-card-text>
														<v-row align="center">
															<v-col cols="3">
																<v-avatar size="100">
																	<v-img
																		:src="item.avatar"
																	></v-img>
																</v-avatar>
															</v-col>
															<v-col class="text-left">
																<div class="title primary--text">
																	{{ item.name }}
																</div>
																<template
																	v-for="(tag,
																	k) in item.specialties"
																>
																	<span :key="k">
																		<span
																			class="ma-1 caption text-capitalize"
																		>
																			{{ tag }};
																		</span>
																	</span>
																</template>
															</v-col>
														</v-row>
													</v-card-text>
												</v-card>
											</template>
											<template v-else>
												<v-card
													width="400"
													height="220"
													outlined
													class="ma-2"
												>
													<v-card-text>
														<v-row>
															<v-col cols="3">
																<v-avatar size="80">
																	<v-img
																		:src="element.avatar"
																	></v-img>
																</v-avatar>
															</v-col>
															<v-col class="text-left">
																<div class="title primary--text">
																	{{ element.name }}
																</div>
																Especialidades:
																<template
																	v-for="(tag,
																	k) in element.specialties"
																>
																	<span :key="k">
																		<span
																			class="ma-1 text-capitalize"
																		>
																			{{ tag }};
																		</span>
																	</span>
																</template>
															</v-col>
														</v-row>
													</v-card-text>
												</v-card>
											</template>
										</div>
									</v-window-item>
								</v-window>
								<v-item-group v-model="onboarding" class="text-center" mandatory>
									<v-item
										v-for="(n, e) in psi"
										:key="`btn-${e}`"
										v-slot="{ active, toggle }"
									>
										<v-btn icon @click="toggle" color="#BDBDBD">
											<v-icon :color="active ? 'primary' : 'info'"
												>mdi-record</v-icon
											>
										</v-btn>
									</v-item>
								</v-item-group>
							</v-col>
						</v-row>
					</v-container>
				</div>
			</div>
		</div>
		<v-dialog v-model="dialogPrecharge" transition="dialog-bottom-transition" max-width="600">
			<v-card>
				<v-card-text>
					<Precharge :avatar="psychologists.map(el => el.avatar)" />
				</v-card-text>
			</v-card>
		</v-dialog>
		<div v-if="matchedPsychologists.length">
			<Selection :match="matchedPsychologists" :resetMatch="resetMatch" />
		</div>
	</div>
</template>

<script>
import Appbar from '@/components/ui/Appbar.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'Evaluation',
	components: {
		Appbar,
		Precharge: () => import('@/components/evaluation/Precharge'),
		Selection: () => import('@/components/evaluation/Selection'),
	},
	data() {
		return {
			onboarding: 0,
			dialogPrecharge: false,
			step: '0',
			gender: '',
			age: '',
			firstTherapy: null,
			themes: [],
			focus: '',
			genderConfort: '',
			matchedPsychologists: [],
		};
	},
	computed: {
		psi() {
			if (!this.psychologists) return [];
			const items = this.random();
			const n = 3;
			const result = [[], [], []];
			const wordsPerLine = Math.ceil(items.length / 4);
			for (let line = 0; line < n; line++) {
				for (let i = 0; i < wordsPerLine; i++) {
					const value = items[i + line * wordsPerLine];
					if (!value) continue;
					result[line].push(value);
				}
			}
			return this.$vuetify.breakpoint.mdAndUp ? result : items;
		},
		...mapGetters({
			specialties: 'Appointments/specialties',
			psychologists: 'Psychologist/psychologists',
		}),
	},
	created() {
		const match = JSON.parse(localStorage.getItem('match'));
		if (match) this.matchedPsychologists = match;
	},
	mounted() {
		this.getPsychologists();
		this.getAppointments();
	},
	methods: {
		next() {
			this.onboarding = this.onboarding + 1 === this.length ? 0 : this.onboarding + 1;
		},
		prev() {
			this.onboarding = this.onboarding - 1 < 0 ? this.length - 1 : this.onboarding - 1;
		},
		random() {
			return this.psychologists.sort(function randOrd() {
				return Math.round(Math.random()) - 0.5;
			});
		},
		resetMatch() {
			this.matchedPsychologists = [];
			this.step = '0';
			localStorage.removeItem('match');
			localStorage.removeItem('psi');
		},
		setTheme(value) {
			if (this.themes.includes(value)) {
				const index = this.themes.findIndex(item => item == value);
				this.themes.splice(index, 1);
			} else {
				if (this.themes.length < 3) this.themes.push(value);
			}
		},
		async openPrecharge() {
			this.dialogPrecharge = true;
			setTimeout(() => {
				this.dialogPrecharge = false;
			}, 2300);
			const gender = this.genderConfort == 'Me es indiferente' ? '' : this.genderConfort;
			const payload = {
				gender,
				themes: this.themes,
				model: this.focus,
			};
			const response = await this.matchPsi(payload);
			if (response.length) {
				localStorage.setItem('match', JSON.stringify(response));
				this.matchedPsychologists = response;
			}
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			getPsychologists: 'Psychologist/getPsychologists',
			matchPsi: 'Psychologist/matchPsi',
		}),
	},
};
</script>

<style lang="scss" scoped>
.centerCard {
	max-width: 700px;
	position: absolute;
	margin-left: auto;
	margin-right: auto;
	left: 0;
	right: 0;
	border-radius: 25px !important;
}
</style>
