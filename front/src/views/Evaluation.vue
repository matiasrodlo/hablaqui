<template>
	<div>
		<!-- appbar -->
		<div class="primary">
			<appbar />
		</div>
		<!-- content -->
		<div
			class="primary white--text text-center"
			style="position: relative; padding: 100px 0; height: 500px"
		>
			<div class="title text-h5 text-sm-h4 font-weight-bold">
				Encuentra a tu especialista
			</div>
			<div class="d-flex justify-center text-h6 mb-10">
				Te ayudamos a encontrar al psicólogo que necesitas, solo responde las siguientes
				preguntas. ¡Queremos conocerte!
			</div>
			<v-stepper v-model="step" class="centerCard">
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
							:color="gender === 'Prefiero no indicarlo' ? 'primary' : '#BDBDBD'"
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
							:color="firstTherapy ? 'primary' : '#BDBDBD'"
							:outlined="!firstTherapy"
							block
							rounded
							large
							class="my-4"
							@click="firstTherapy = true"
						>
							Si
						</v-btn>

						<v-btn
							:color="!firstTherapy ? 'primary' : '#BDBDBD'"
							:outlined="firstTherapy"
							block
							rounded
							large
							class="my-4"
							@click="firstTherapy = false"
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
							<span class="subtitle-2">Selecciona hasta 3 opciones.</span>
						</div>
						<v-row>
							<v-col cols="6">
								<v-btn
									:color="themes.includes('Ansiedad') ? 'primary' : '#BDBDBD'"
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
									:color="themes.includes('Sexualidad') ? 'primary' : '#BDBDBD'"
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
									:color="themes.includes('Depresión') ? 'primary' : '#BDBDBD'"
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
										themes.includes('Enfoque de género y diversidad')
											? 'primary'
											: '#BDBDBD'
									"
									:outlined="!themes.includes('Enfoque de género y diversidad')"
									block
									rounded
									large
									class="my-4"
									@click="() => setTheme('Enfoque de género y diversidad')"
								>
									Enfoque de género y diversidad
								</v-btn>
								<v-btn
									:color="
										themes.includes('Dificultades interpersonales')
											? 'primary'
											: '#BDBDBD'
									"
									:outlined="!themes.includes('Dificultades interpersonales')"
									block
									rounded
									large
									class="my-4"
									@click="() => setTheme('Dificultades interpersonales')"
								>
									Dificultades interpersonales
								</v-btn>
								<v-btn
									:color="
										themes.includes('Problemas de parejas')
											? 'primary'
											: '#BDBDBD'
									"
									:outlined="!themes.includes('Problemas de parejas')"
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
										themes.includes('Trastornos de personalidad')
											? 'primary'
											: '#BDBDBD'
									"
									:outlined="!themes.includes('Trastornos de personalidad')"
									block
									rounded
									large
									class="my-4"
									@click="() => setTheme('Trastornos de personalidad')"
								>
									Trastornos de personalidad
								</v-btn>
							</v-col>
							<v-col cols="6">
								<v-btn
									:color="
										themes.includes('Control de ira') ? 'primary' : '#BDBDBD'
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
										themes.includes('Autoconocimiento') ? 'primary' : '#BDBDBD'
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
										themes.includes('Cambio de hábitos') ? 'primary' : '#BDBDBD'
									"
									:outlined="!themes.includes('Cambio de hábitos')"
									block
									rounded
									large
									class="my-4"
									@click="() => setTheme('Cambio de hábitos')"
								>
									Cambio de hábitos
								</v-btn>
								<v-btn
									:color="themes.includes('Autoestima') ? 'primary' : '#BDBDBD'"
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
										themes.includes('Duelo y pérdida') ? 'primary' : '#BDBDBD'
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
									:outlined="!themes.includes('Trastornos del sueño')"
									block
									rounded
									large
									class="my-4"
									@click="() => setTheme('Trastornos del sueño')"
								>
									Trastornos del sueño
								</v-btn>
								<v-btn
									:color="themes.includes('Otros') ? 'primary' : '#BDBDBD'"
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

						<v-btn text color="primary" @click="step = 4">
							Siguiente
						</v-btn>

						<v-btn text color="primary" @click="step = 2">
							Atras
						</v-btn>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
		</div>
		<v-container style="margin-top: 300px">
			<v-row>
				<v-col cols="6">
					<v-card>
						<v-card-text
							>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, et
							earum, distinctio sint mollitia accusantium aut sed vel molestiae
							eveniet repudiandae libero assumenda quisquam totam eum. Explicabo
							reiciendis sunt velit.</v-card-text
						>
					</v-card>
				</v-col>
				<v-col cols="6">
					<v-card>
						<v-card-text
							>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, et
							earum, distinctio sint mollitia accusantium aut sed vel molestiae
							eveniet repudiandae libero assumenda quisquam totam eum. Explicabo
							reiciendis sunt velit.</v-card-text
						>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import Appbar from '@/components/ui/Appbar.vue';

export default {
	name: 'Evaluation',
	components: {
		Appbar,
	},
	data() {
		return {
			step: '0',
			gender: '',
			age: '',
			firstTherapy: null,
			themes: [],
			focus: '',
			genreConfort: '',
		};
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
