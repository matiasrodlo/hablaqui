<template>
	<div>
		<v-dialog v-model="dialog" :width="step == 4 ? '800' : '600'">
			<template #activator="{ on, attrs }">
				<v-btn
					v-if="mode == '1'"
					class="px-10"
					light
					v-bind="attrs"
					color="#F0F8FF"
					style="border-radius: 5px"
					v-on="on"
				>
					<span class="text--secondary">Comenzar</span>
				</v-btn>
				<v-btn v-if="mode == '2'" v-bind="attrs" light class="px-10 mt-4" v-on="on">
					<span class="text--secondary">Comenzar</span>
				</v-btn>
			</template>

			<v-stepper v-model="step" light style="border-radius: 25px">
				<!-- items content -->
				<v-stepper-items step="0">
					<v-stepper-content step="0">
						<div class="mt-3 text-center title text-h5 text-sm-h4 font-weight-bold">
							Encuentra a tu especialista
						</div>
						<div
							class="mt-12 d-flex text-center text-h6 mb-12 mx-auto"
							style="max-width: 800px"
						>
							Te ayudamos a encontrar al psicólogo que necesitas, solo responde las
							siguientes preguntas. ¡Queremos conocerte!
						</div>
						<div class="text-center">
							<v-btn color="primary" @click="step = 1">Comenzar</v-btn>
						</div>
					</v-stepper-content>
					<v-stepper-content step="1">
						<div class="primary--text font-weight-bold title">¿Cuál es tu género?</div>
						<v-btn
							:color="gender === 'female' ? 'primary' : '#BDBDBD'"
							:outlined="gender !== 'female'"
							block
							rounded
							large
							class="my-4"
							@click="
								() => {
									step = 2;
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
									step = 2;
									gender = 'male';
								}
							"
						>
							Hombre
						</v-btn>
						<v-btn
							:color="gender === 'transgender' ? 'primary' : '#BDBDBD'"
							:outlined="gender !== 'transgender'"
							block
							rounded
							large
							class="my-4"
							@click="
								() => {
									step = 2;
									gender = 'transgender';
								}
							"
						>
							Transgénero
						</v-btn>
						<v-btn
							:color="gender === 'Prefiero no indicarlo' ? 'primary' : '#BDBDBD'"
							:outlined="gender !== 'Prefiero no indicarlo'"
							block
							rounded
							large
							class="my-4"
							@click="
								() => {
									step = 2;
									gender = 'Prefiero no indicarlo';
								}
							"
						>
							Prefiero no indicarlo
						</v-btn>
					</v-stepper-content>

					<v-stepper-content step="2">
						<div class="text-center primary--text font-weight-bold title">
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
									step = 3;
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
									step = 3;
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
									step = 3;
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
									step = 3;
									age = '+45';
								}
							"
						>
							+45
						</v-btn>
						<v-btn text color="primary" @click="step = 0"> Atras </v-btn>
					</v-stepper-content>

					<v-stepper-content step="3">
						<div class="text-center primary--text font-weight-bold title">
							¿Es tu primera vez en terapia?
						</div>

						<v-btn
							:color="firstTherapy === 'si' ? 'primary' : '#BDBDBD'"
							:outlined="firstTherapy != 'si'"
							block
							rounded
							large
							class="my-4"
							@click="
								() => {
									step = 4;
									firstTherapy = 'si';
								}
							"
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
							@click="
								() => {
									step = 4;
									firstTherapy = 'no';
								}
							"
						>
							No
						</v-btn>
						<v-btn text color="primary" @click="step = 1"> Atras </v-btn>
					</v-stepper-content>

					<v-stepper-content step="4">
						<div class="text-center primary--text font-weight-bold title">
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
										:color="themes.includes(item) ? 'primary' : '#BDBDBD'"
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
										:color="themes.includes(item) ? 'primary' : '#BDBDBD'"
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
						<v-btn text color="primary" @click="step = 3"> Atras </v-btn>
						<v-btn text color="primary" @click="step = 5"> Siguiente </v-btn>
					</v-stepper-content>
					<v-stepper-content step="5">
						<div class="text-center primary--text font-weight-bold title">
							¿Buscas algún enfoque terapéutico <br />
							<span>en específico?</span>
						</div>
						<div
							class="pa-2 my-4"
							:class="focus == 'cognitivo' ? 'primary white--text' : 'text--disabled'"
							style="border-radius: 25px; border: 1px solid #e0e0e0"
							@click="
								() => {
									step = 6;
									focus = 'cognitivo';
								}
							"
						>
							Quiero que las sesiones sean estructuradas definiendo metas a cumplir.
							Me gustaría que mi psicólogo/a tome un rol activo y me deje tareas
							semanales.
						</div>
						<div
							class="pa-2 my-4"
							:class="
								focus == 'integrativo' ? 'primary white--text' : 'text--disabled'
							"
							style="border-radius: 25px; border: 1px solid #e0e0e0"
							@click="
								() => {
									step = 6;
									focus = 'integrativo';
								}
							"
						>
							Quiero que mi psicólogo conozca diferentes modelos de intervención y de
							acuerdo a mis necesidades me brinde diferentes actividades o
							herramientas para ponerlas en práctica.
						</div>
						<div
							class="pa-2 my-4"
							:class="
								focus == 'contextual' ? 'primary white--text' : 'text--disabled'
							"
							style="border-radius: 25px; border: 1px solid #e0e0e0"
							@click="
								() => {
									step = 6;
									focus = 'contextual';
								}
							"
						>
							Quiero que sea un proceso activo donde aprenda a relacionarme con mis
							pensamientos, emociones y sensaciones fisicas de una forma distinta en
							la cual no me impida desarrollar la vida que quiero vivir.
						</div>
						<div
							class="pa-2 my-4"
							:class="
								focus == 'psicoanalisis' ? 'primary white--text' : 'text--disabled'
							"
							style="border-radius: 25px; border: 1px solid #e0e0e0"
							@click="
								() => {
									step = 6;
									focus = 'psicoanalisis';
								}
							"
						>
							Quiero que las sesiones sean conversacionales, donde pueda platicar cómo
							me siento y que mi psicólogo me ayude a explorar cómo mis experiencias
							pasadas influyen en mi presente.
						</div>
						<div
							class="pa-2 my-4"
							:class="focus == 'humanista' ? 'primary white--text' : 'text--disabled'"
							style="border-radius: 25px; border: 1px solid #e0e0e0"
							@click="
								() => {
									step = 6;
									focus = 'humanista';
								}
							"
						>
							Quiero que a través de la reflexión, mi psicólogo me ayude a conocer el
							origen de mis emociones y a encontrar un significado personal,
							contactando con aquellas áreas que tengo que sanar.
						</div>
						<div
							class="pa-2 my-4"
							:class="focus == 'sistemico' ? 'primary white--text' : 'text--disabled'"
							style="border-radius: 25px; border: 1px solid #e0e0e0"
							@click="
								() => {
									step = 6;
									focus = 'sistemico';
								}
							"
						>
							Quiero entender mi forma de interactuar con los demás para mejorar mis
							relaciones interpersonales, conociendo cómo mi entorno influye en mi
							conducta y en las distintas áreas de mi vida.
						</div>
						<v-btn text color="primary" @click="step = 3"> Atras </v-btn>
					</v-stepper-content>
					<v-stepper-content step="6">
						<div class="text-center primary--text font-weight-bold title">
							¿Con qué género te sientes más cómodo <br />
							<span>compartiendo lo que te sucede?</span>
						</div>

						<v-btn
							:color="genderConfort === 'female' ? 'primary' : '#BDBDBD'"
							:outlined="genderConfort !== 'female'"
							block
							rounded
							large
							class="my-4"
							@click="
								() => {
									genderConfort = 'female';
									step = 7;
									precharge();
								}
							"
						>
							Mujer
						</v-btn>
						<v-btn
							:color="genderConfort === 'male' ? 'primary' : '#BDBDBD'"
							:outlined="genderConfort !== 'male'"
							block
							rounded
							large
							class="my-4"
							@click="
								() => {
									genderConfort = 'male';
									step = 7;
									precharge();
								}
							"
						>
							Hombre
						</v-btn>
						<v-btn
							:color="genderConfort === 'transgender' ? 'primary' : '#BDBDBD'"
							:outlined="genderConfort !== 'transgender'"
							block
							rounded
							large
							class="my-4"
							@click="
								() => {
									genderConfort = 'transgender';
									step = 7;
									precharge();
								}
							"
						>
							Transgenero
						</v-btn>
						<v-btn
							:color="genderConfort === 'Me es indiferente' ? 'primary' : '#BDBDBD'"
							:outlined="genderConfort !== 'Me es indiferente'"
							block
							rounded
							large
							class="my-4"
							@click="
								() => {
									genderConfort = 'Me es indiferente';
									step = 7;
									precharge();
								}
							"
						>
							Me es indiferente
						</v-btn>
						<v-btn text color="primary" @click="step = 4"> Atras </v-btn>
					</v-stepper-content>
					<v-stepper-content step="7">
						<Precharge :avatar="psychologists.map(el => el.avatar)" />
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
		</v-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	components: {
		Precharge: () => import('~/components/evaluation/Precharge'),
	},
	props: {
		mode: {
			type: String,
			default: '1',
		},
		setMatch: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			dialog: false,
			step: '0',
			gender: '',
			age: '',
			firstTherapy: null,
			themes: [],
			focus: '',
			genderConfort: '',
		};
	},
	computed: {
		...mapGetters({
			specialties: 'Appointments/specialties',
			psychologists: 'Psychologist/psychologists',
		}),
	},
	methods: {
		setTheme(value) {
			if (this.themes.includes(value)) {
				const index = this.themes.findIndex(item => item === value);
				this.themes.splice(index, 1);
			} else if (this.themes.length < 3) this.themes.push(value);
		},
		precharge() {
			const gender = this.genderConfort === 'Me es indiferente' ? '' : this.genderConfort;
			const payload = {
				gender,
				themes: this.themes,
				model: this.focus,
			};
			this.setMatch(payload);
			setTimeout(() => {
				this.dialog = false;
			}, 2500);
		},
	},
};
</script>

<style lang="scss" scoped></style>
