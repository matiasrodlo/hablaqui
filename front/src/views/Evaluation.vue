<template>
	<div>
		<!-- appbar -->
		<div :class="!matchedPsychologists.length ? 'primary' : 'trasnparent'">
			<appbar />
		</div>
		<!-- content -->
		<div
			v-if="!matchedPsychologists.length"
			class="primary white--text text-center"
			style="position: relative; padding: 100px 0; height: 400px"
		>
			<div class="title text-h5 text-sm-h4 font-weight-bold">
				Encuentra a tu especialista
			</div>
			<div class="d-flex justify-center text-h6 mb-10">
				Te ayudamos a encontrar al psicólogo que necesitas, solo responde las siguientes
				preguntas. ¡Queremos conocerte!
			</div>
			<div>
				<v-container>
					<v-row justify="center">
						<v-col cols="12" md="10" lg="8">
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
											@click="gender = 'female'"
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
											@click="gender = 'male'"
										>
											Hombre
										</v-btn>
										<v-btn
											:color="gender === 'No-binario' ? 'primary' : '#BDBDBD'"
											:outlined="gender !== 'No-binario'"
											block
											rounded
											large
											class="my-4"
											@click="gender = 'No-binario'"
										>
											No-binario
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
											@click="gender = 'Prefiero no indicarlo'"
										>
											Prefiero no indicarlo
										</v-btn>

										<v-btn text color="primary" @click="step = 1">
											Siguiente
										</v-btn>
									</v-stepper-content>

									<v-stepper-content step="1">
										<div class="primary--text font-weight-bold title">
											¿En qué rango de edad te encuentras?
										</div>

										<v-btn
											:color="age === '18-25' ? 'primary' : '#BDBDBD'"
											:outlined="age !== '18-25'"
											block
											rounded
											large
											class="my-4"
											@click="age = '18-25'"
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
											@click="age = '26-35'"
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
											@click="age = '36-45'"
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
											@click="age = '+45'"
										>
											+45
										</v-btn>
										<v-btn text color="primary" @click="step = 0">
											Atras
										</v-btn>
										<v-btn text color="primary" @click="step = 2">
											Siguiente
										</v-btn>
									</v-stepper-content>

									<v-stepper-content step="2">
										<div class="primary--text font-weight-bold title">
											¿Es tu primera vez en terapia?
										</div>

										<v-btn
											:color="firstTherapy === 'si' ? 'primary' : '#BDBDBD'"
											:outlined="firstTherapy != 'si'"
											block
											rounded
											large
											class="my-4"
											@click="firstTherapy = 'si'"
										>
											Si
										</v-btn>

										<v-btn
											:color="firstTherapy == 'no' ? 'primary' : '#BDBDBD'"
											:outlined="firstTherapy != 'no'"
											block
											rounded
											large
											class="my-4"
											@click="firstTherapy = 'no'"
										>
											No
										</v-btn>
										<v-btn text color="primary" @click="step = 1">
											Atras
										</v-btn>
										<v-btn text color="primary" @click="step = 3">
											Siguiente
										</v-btn>
									</v-stepper-content>

									<v-stepper-content step="3">
										<div class="primary--text font-weight-bold title">
											¿En qué temas te gustaría trabajar? <br />
											<span class="subtitle-2"
												>Selecciona hasta 3 opciones.</span
											>
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
											¿Buscas algún enfoque terapéutico en específico?
										</div>
										<div
											class="pa-2 my-4"
											:class="
												focus == 1
													? 'primary white--text'
													: 'text--disabled'
											"
											style="border-radius: 25px; border: 1px solid #E0E0E0"
											@click="focus = 1"
										>
											Quiero que las sesiones sean estructuradas definiendo
											metas a cumplir. Me gustaría que mi psicólogo/a tome un
											rol activo y me deje tareas semanales.
										</div>
										<div
											class="pa-2 my-4"
											:class="
												focus == 2
													? 'primary white--text'
													: 'text--disabled'
											"
											style="border-radius: 25px; border: 1px solid #E0E0E0"
											@click="focus = 2"
										>
											Quiero que mi psicólogo conozca diferentes modelos de
											intervención y de acuerdo a mis necesidades me brinde
											diferentes actividades o herramientas para ponerlas en
											práctica.
										</div>
										<div
											class="pa-2 my-4"
											:class="
												focus == 3
													? 'primary white--text'
													: 'text--disabled'
											"
											style="border-radius: 25px; border: 1px solid #E0E0E0"
											@click="focus = 3"
										>
											Quiero que las sesiones sean conversacionales, donde
											pueda platicar cómo me siento y que mi psicólogo me
											ayude a explorar cómo mis experiencias pasadas influyen
											en mi presente.
										</div>
										<div
											class="pa-2 my-4"
											:class="
												focus == 4
													? 'primary white--text'
													: 'text--disabled'
											"
											style="border-radius: 25px; border: 1px solid #E0E0E0"
											@click="focus = 4"
										>
											Quiero que a través de la reflexión, mi psicólogo me
											ayude a conocer el origen de mis emociones y a encontrar
											un significado personal, contactando con aquellas áreas
											que tengo que sanar.
										</div>
										<div
											class="pa-2 my-4"
											:class="
												focus == 5
													? 'primary white--text'
													: 'text--disabled'
											"
											style="border-radius: 25px; border: 1px solid #E0E0E0"
											@click="focus = 5"
										>
											Quiero entender mi forma de interactuar con los demás
											para mejorar mis relaciones interpersonales, conociendo
											cómo mi entorno influye en mi conducta y en las
											distintas áreas de mi vida.
										</div>
										<v-btn text color="primary" @click="step = 3">
											Atras
										</v-btn>
										<v-btn text color="primary" @click="step = 5">
											Siguiente
										</v-btn>
									</v-stepper-content>
									<v-stepper-content step="5">
										<div class="primary--text font-weight-bold title">
											¿Con qué género te sientes más cómodo compartiendo lo
											que te sucede?
										</div>

										<v-btn
											:color="
												genderConfort === 'female' ? 'primary' : '#BDBDBD'
											"
											:outlined="genderConfort !== 'female'"
											block
											rounded
											large
											class="my-4"
											@click="genderConfort = 'female'"
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
											@click="genderConfort = 'male'"
										>
											Hombre
										</v-btn>
										<v-btn
											:color="
												genderConfort === 'No-binario'
													? 'primary'
													: '#BDBDBD'
											"
											:outlined="genderConfort !== 'No-binario'"
											block
											rounded
											large
											class="my-4"
											@click="genderConfort = 'No-binario'"
										>
											No-binario
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
											@click="genderConfort = 'Me es indiferente'"
										>
											Me es indiferente
										</v-btn>

										<v-btn text color="primary" @click="step = 4">
											Atras
										</v-btn>
										<v-btn text color="primary" @click="openPrecharge">
											Buscar
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
						<v-col>
							<v-carousel
								:show-arrows="false"
								reverse-transition="fade-transition"
								transition="fade-transition"
								hide-delimiter-background
								height="270"
								light
							>
								<v-carousel-item v-for="(element, i) in psi" :key="i">
									<div class="text-center d-flex justify-center align-center">
										<v-card
											outlined
											v-for="(item, l) in element"
											:key="l"
											class="ma-2"
										>
											<v-card-text>
												<v-row>
													<v-col cols="3">
														<v-avatar size="80">
															<v-img :src="item.avatar"></v-img>
														</v-avatar>
													</v-col>
													<v-col class="text-left">
														<div class="title primary--text">
															{{ item.name }}
														</div>
														Especialidades:
														<span
															v-for="(tag, k) in item.specialties"
															:key="k"
														>
															<v-chip class="ma-2" small>
																<span class="text-capitalize">
																	{{ tag }}
																</span>
															</v-chip>
														</span>
													</v-col>
												</v-row>
											</v-card-text>
										</v-card>
									</div>
								</v-carousel-item>
							</v-carousel>
						</v-col>
					</v-row>
				</v-container>
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
			dialogPrecharge: false,
			step: '0',
			gender: '',
			age: '',
			firstTherapy: null,
			themes: [],
			focus: 1,
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
			return result;
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
			};
			const response = await this.matchPsi(payload);
			if (response.length) {
				localStorage.setItem('match', JSON.stringify(response));
				this.matchedPsychologists = response;
			} else {
				alert('no se encontraron coindencias, por favor reintenta de nuevo');
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
