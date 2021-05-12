<template>
	<div>
		<!-- appbar -->
		<div :class="inEvaluation ? 'primary' : 'trasnparent'">
			<appbar />
		</div>
		<!-- content -->
		<div
			v-if="inEvaluation"
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
											<v-col cols="6">
												<v-btn
													:color="
														themes.includes('Ansiedad')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="!themes.includes('Ansiedad')"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Ansiedad')"
												>
													Ansiedad
												</v-btn>
												<v-btn
													:color="
														themes.includes('Sexualidad')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="!themes.includes('Sexualidad')"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Sexualidad')"
												>
													Sexualidad
												</v-btn>
												<v-btn
													:color="
														themes.includes('Depresión')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="!themes.includes('Depresión')"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Depresión')"
												>
													Depresión
												</v-btn>
												<v-btn
													:color="
														themes.includes(
															'Enfoque de género y diversidad'
														)
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="
														!themes.includes(
															'Enfoque de género y diversidad'
														)
													"
													block
													rounded
													large
													class="my-4"
													@click="
														() =>
															setTheme(
																'Enfoque de género y diversidad'
															)
													"
												>
													Enfoque de género y diversidad
												</v-btn>
												<v-btn
													:color="
														themes.includes(
															'Dificultades interpersonales'
														)
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="
														!themes.includes(
															'Dificultades interpersonales'
														)
													"
													block
													rounded
													large
													class="my-4"
													@click="
														() =>
															setTheme('Dificultades interpersonales')
													"
												>
													Dificultades interpersonales
												</v-btn>
												<v-btn
													:color="
														themes.includes('Problemas de parejas')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="
														!themes.includes('Problemas de parejas')
													"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Problemas de parejas')"
												>
													Problemas de parejas
												</v-btn>
												<v-btn
													:color="
														themes.includes(
															'Trastornos de personalidad'
														)
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="
														!themes.includes(
															'Trastornos de personalidad'
														)
													"
													block
													rounded
													large
													class="my-4"
													@click="
														() => setTheme('Trastornos de personalidad')
													"
												>
													Trastornos de personalidad
												</v-btn>
											</v-col>
											<v-col cols="6">
												<v-btn
													:color="
														themes.includes('Control de ira')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="!themes.includes('Control de ira')"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Control de ira')"
												>
													Control de ira
												</v-btn>
												<v-btn
													:color="
														themes.includes('Autoconocimiento')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="!themes.includes('Autoconocimiento')"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Autoconocimiento')"
												>
													Autoconocimiento
												</v-btn>
												<v-btn
													:color="
														themes.includes('Cambio de hábitos')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="
														!themes.includes('Cambio de hábitos')
													"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Cambio de hábitos')"
												>
													Cambio de hábitos
												</v-btn>
												<v-btn
													:color="
														themes.includes('Autoestima')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="!themes.includes('Autoestima')"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Autoestima')"
												>
													Autoestima
												</v-btn>
												<v-btn
													:color="
														themes.includes('Duelo y pérdida')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="!themes.includes('Duelo y pérdida')"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Duelo y pérdida')"
												>
													Duelo y pérdida
												</v-btn>
												<v-btn
													:color="
														themes.includes('Trastornos del sueño')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="
														!themes.includes('Trastornos del sueño')
													"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Trastornos del sueño')"
												>
													Trastornos del sueño
												</v-btn>
												<v-btn
													:color="
														themes.includes('Otros')
															? 'primary'
															: '#BDBDBD'
													"
													:outlined="!themes.includes('Otros')"
													block
													rounded
													large
													class="my-4"
													@click="() => setTheme('Otros')"
												>
													Otros
												</v-btn>
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
												genreConfort === 'female' ? 'primary' : '#BDBDBD'
											"
											:outlined="genreConfort !== 'female'"
											block
											rounded
											large
											class="my-4"
											@click="genreConfort = 'female'"
										>
											Mujer
										</v-btn>
										<v-btn
											:color="genreConfort === 'male' ? 'primary' : '#BDBDBD'"
											:outlined="genreConfort !== 'male'"
											block
											rounded
											large
											class="my-4"
											@click="genreConfort = 'male'"
										>
											Hombre
										</v-btn>
										<v-btn
											:color="
												genreConfort === 'No-binario'
													? 'primary'
													: '#BDBDBD'
											"
											:outlined="genreConfort !== 'No-binario'"
											block
											rounded
											large
											class="my-4"
											@click="genreConfort = 'No-binario'"
										>
											No-binario
										</v-btn>
										<v-btn
											:color="
												genreConfort === 'Me es indiferente'
													? 'primary'
													: '#BDBDBD'
											"
											:outlined="genreConfort !== 'Me es indiferente'"
											block
											rounded
											large
											class="my-4"
											@click="genreConfort = 'Me es indiferente'"
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
					<Precharge />
				</v-card-text>
			</v-card>
		</v-dialog>
		<div v-if="inSelection"><Selection /></div>
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
			inEvaluation: true,
			dialogPrecharge: false,
			inSelection: false,
			step: '0',
			gender: '',
			age: '',
			firstTherapy: null,
			themes: [],
			focus: 1,
			genreConfort: '',
		};
	},
	computed: {
		psi() {
			if (!this.psychologists) return [];
			const items = this.psychologists;
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
			psychologists: 'Psychologist/psychologists',
		}),
	},
	mounted() {
		this.getPsychologists();
	},
	methods: {
		setTheme(value) {
			if (this.themes.includes(value)) {
				const index = this.themes.findIndex(item => item == value);
				this.themes.splice(index, 1);
			} else {
				if (this.themes.length < 3) this.themes.push(value);
			}
		},
		openPrecharge() {
			this.dialogPrecharge = true;
			setTimeout(() => {
				this.dialogPrecharge = false;
				this.inEvaluation = false;
				this.inSelection = true;
			}, 2100);
			// const payload = {
			// 	gender: this.gender,
			// 	age: this.age,
			// 	firstTherapy: this.firstTherapy,
			// 	themes: this.themes,
			// 	genreConfort: this.genreConfort,
			// 	focus: this.focus,
			// };
			// console.log(payload);
			// this.matchPsi(payload);
		},
		...mapActions({
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
