<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<div :class="!matchedSpecialists.length && !dialogPrecharge ? 'primary' : 'trasnparent'">
			<div style="margin-bottom: 85px">
				<Appbar />
			</div>
			<!-- content -->
			<div
				v-show="!matchedSpecialists.length && !dialogPrecharge"
				class="primary white--text text-center"
				style="position: relative; padding: 100px; height: 500px"
			>
				<div class="title text-h7 text-sm-h4 font-weight-bold mb-5">
					Encuentre al especialista ideal
				</div>
				<div class="d-flex justify-center text-h7 mb-12 mx-auto" style="max-width: 800px">
					Responda las siguientes preguntas, nosotros hacemos el resto
				</div>
				<div>
					<v-container class="centerCard" fluid style="max-width: 1080px">
						<v-row justify="center">
							<v-col cols="12" md="10" :lg="step == 3 ? '8' : '6'">
								<v-stepper v-model="step" light style="border-radius: 25px">
									<!-- items content -->
									<v-stepper-items>
										<v-stepper-content step="0">
											<div class="primary--text font-weight-bold title">
												¿Cuál es su género?
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
												No binario
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
												¿En qué rango de edad se encuentra?<br />
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
												18-25
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
												¿Primera vez hablando con un especialista?
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
												¿En qué temas le gustaría trabajar? <br />
												<span class="title font-weight-bold">
													Seleccione hasta 3 opciones
												</span>
											</div>
											<v-row>
												<v-col>
													<template v-for="(item, i) in specialties">
														<v-btn
															v-if="i <= 7"
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
															v-if="i >= 8"
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
												¿En qué momento del día <br />
												<span>puede asistir a sus citas?</span>
											</div>
											<div
												class="pa-2 my-4"
												:class="
													schedule == 'early'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="
													border-radius: 25px;
													border: 1px solid #e0e0e0;
												"
												@click="
													() => {
														step = 5;
														schedule = 'early';
													}
												"
											>
												Temprano: Antes de las 9 am
											</div>
											<div
												class="pa-2 my-4"
												:class="
													schedule == 'morning'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="
													border-radius: 25px;
													border: 1px solid #e0e0e0;
												"
												@click="
													() => {
														step = 5;
														schedule = 'morning';
													}
												"
											>
												En la mañana: Entre 9 am y 12 pm
											</div>
											<div
												class="pa-2 my-4"
												:class="
													schedule == 'midday'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="
													border-radius: 25px;
													border: 1px solid #e0e0e0;
												"
												@click="
													() => {
														step = 5;
														schedule = 'midday';
													}
												"
											>
												A Medio día: Entre 12 y 2 pm
											</div>
											<div
												class="pa-2 my-4"
												:class="
													schedule == 'afternoon'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="
													border-radius: 25px;
													border: 1px solid #e0e0e0;
												"
												@click="
													() => {
														step = 5;
														schedule = 'afternoon';
													}
												"
											>
												En la tarde: Entre 2 y 6 pm
											</div>
											<div
												class="pa-2 my-4"
												:class="
													schedule == 'night'
														? 'primary white--text'
														: 'text--disabled'
												"
												style="
													border-radius: 25px;
													border: 1px solid #e0e0e0;
												"
												@click="
													() => {
														step = 5;
														schedule = 'night';
													}
												"
											>
												En la noche: Después de las 6 pm
											</div>
											<v-btn text color="primary" @click="step = 3">
												Atras
											</v-btn>
										</v-stepper-content>
										<v-stepper-content step="5">
											<div class="primary--text font-weight-bold title">
												¿Cuales son sus expectativas sobre el proceso?
											</div>
											<v-btn
												class="pa-2 my-4"
												:color="
													models.includes('Cognitivo-conductual')
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="!models.includes('Cognitivo-conductual')"
												block
												rounded
												large
												@click="() => setModels('Cognitivo-conductual')"
											>
												Sesiones estructuradas con metas
											</v-btn>
											<v-btn
												class="pa-2 my-4"
												:color="
													models.includes('Integrativo')
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="!models.includes('Integrativo')"
												block
												rounded
												large
												@click="() => setModels('Integrativo')"
											>
												Conocer herramientas y tecnicas
											</v-btn>
											<v-btn
												class="pa-2 my-4"
												:color="
													models.includes('Contextual')
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="!models.includes('Contextual')"
												block
												rounded
												large
												@click="() => setModels('Contextual')"
											>
												Comprender mis pensamientos
											</v-btn>
											<v-btn
												class="pa-2 my-4"
												:color="
													models.includes('Psicoanálisis')
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="!models.includes('Psicoanálisis')"
												block
												rounded
												large
												@click="() => setModels('Psicoanálisis')"
											>
												Aprender observando mi pasado
											</v-btn>
											<v-btn
												class="pa-2 my-4"
												:color="
													models.includes('Humanista')
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="!models.includes('Humanista')"
												block
												rounded
												large
												@click="() => setModels('Humanista')"
											>
												Reflexionar sobre mis emociones
											</v-btn>
											<v-btn
												class="pa-2 my-4"
												:color="
													models.includes('Sistémico')
														? 'primary'
														: '#BDBDBD'
												"
												:outlined="!models.includes('Sistémico')"
												block
												rounded
												large
												@click="() => setModels('Sistémico')"
											>
												Entender y mejorar mis relaciones
											</v-btn>
											<v-btn text color="primary" @click="step = 4">
												Atras
											</v-btn>
										</v-stepper-content>
										<v-stepper-content step="6">
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
														step = 7;
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
														step = 7;
													}
												"
											>
												Hombre
											</v-btn>
											<!-- <v-btn
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
														step = 7;
													}
												"
											>
												Transgenero
											</v-btn> -->
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
														step = 7;
													}
												"
											>
												Me es indiferente
											</v-btn>

											<v-btn text color="primary" @click="step = 5">
												Atras
											</v-btn>
										</v-stepper-content>
										<v-stepper-content step="7">
											<div class="primary--text font-weight-bold title">
												¿Cuál es su presupuesto semanal?
											</div>

											<v-btn
												:color="price === 15000 ? 'primary' : '#BDBDBD'"
												:outlined="price !== 15000"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														price = 15000;
														openPrecharge();
													}
												"
											>
												$15.000 CLP
											</v-btn>
											<v-btn
												:color="price === 20000 ? 'primary' : '#BDBDBD'"
												:outlined="price !== 20000"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														price = 20000;
														openPrecharge();
													}
												"
											>
												$20.000 CLP
											</v-btn>
											<v-btn
												:color="price === 30000 ? 'primary' : '#BDBDBD'"
												:outlined="price !== 30000"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														price = 30000;
														openPrecharge();
													}
												"
											>
												$30.000 CLP
											</v-btn>
											<v-btn
												:color="price === 40000 ? 'primary' : '#BDBDBD'"
												:outlined="price !== 40000"
												block
												rounded
												large
												class="my-4"
												@click="
													() => {
														price = 40000;
														openPrecharge();
													}
												"
											>
												$40.000 CLP
											</v-btn>

											<v-btn text color="primary" @click="step = 6">
												Atras
											</v-btn>
										</v-stepper-content>
									</v-stepper-items>
								</v-stepper>
							</v-col>
						</v-row>
						<!-- <v-row>
							<v-col cols="12">
								<v-divider style="border-width: 1px" />
							</v-col>
							<v-col cols="12">
								<v-carousel
									v-model="onboarding"
									cycle
									interval="3000"
									hide-delimiter-background
									hide-delimiters
									:show-arrows="false"
									light
									height="200"
									width="600"
								>
									<v-carousel-item v-for="(element, i) in spec" :key="i">
										<div class="text-center d-flex justify-center align-center">
											<template v-if="$vuetify.breakpoint.mdAndUp">
												<v-card
													v-for="(item, l) in element"
													:key="l"
													flat
													color="transparent"
													width="600"
													height="190"
													class="ma-2"
													:to="{ path: `/${item.username}` }"
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
															<v-col class="text-left align-center">
																<div class="title primary--text">
																	{{ item.name }}
																	{{
																		item.lastName &&
																		item.lastName
																	}}
																</div>
																<template
																	v-for="(
																		tag, k
																	) in item.specialties"
																>
																	<span :key="k">
																		<span
																			v-if="k < 5"
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
													height="120"
													outlined
													class="ma-2"
												>
													<v-card-text>
														<v-row>
															<v-col cols="3">
																<avatar
																	:url="avatar(element, true)"
																	:name="element.name"
																	:last-name="
																		element.lastName
																			? element.lastName
																			: ''
																	"
																	size="80"
																	loading-color="white"
																></avatar>
															</v-col>
															<client-only>
																<v-col class="text-left">
																	<div
																		class="title primary--text"
																	>
																		{{ element.name }}
																		{{
																			element.lastName &&
																			element.lastName
																		}}
																	</div>
																	<template
																		v-for="(
																			tag, k
																		) in element.specialties"
																	>
																		<span :key="k">
																			<span
																				v-if="k < 5"
																				class="ma-1 text-capitalize"
																			>
																				{{ tag }},
																			</span>
																		</span>
																	</template>
																</v-col>
															</client-only>
														</v-row>
													</v-card-text>
												</v-card>
											</template>
										</div>
									</v-carousel-item>
								</v-carousel>
								<v-item-group
									v-if="$vuetify.breakpoint.mdAndUp"
									v-model="onboarding"
									class="text-center"
									mandatory
								>
									<v-item
										v-for="(n, e) in spec"
										:key="`btn-${e}`"
										v-slot="{ active, toggle }"
									>
										<v-btn icon color="#BDBDBD" @click="toggle">
											<icon
												:color="active ? 'primary' : 'info'"
												:icon="mdiRecord"
											/>
										</v-btn>
									</v-item>
								</v-item-group>
							</v-col>
						</v-row> -->
					</v-container>
				</div>
			</div>
		</div>
		<div v-if="dialogPrecharge" style="height: 100vh">
			<v-card flat color="transparent">
				<v-card-text>
					<Precharge
						:close="() => (dialogPrecharge = false)"
						:avatar="
							specialists
								.map(el => {
									if (el.avatarThumbnail) return el.avatarThumbnail;
								})
								.filter(el => el)
						"
					/>
				</v-card-text>
			</v-card>
		</div>
		<div v-show="!dialogPrecharge && matchedSpecialists.length">
			<selection :match="matchedSpecialists" :reset-match="resetMatch" />
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import { mdiRecord } from '@mdi/js';
import Appbar from '~/components/AppbarClean.vue';

export default {
	name: 'Evaluation',
	components: {
		Appbar,
		Precharge: () => import('~/components/evaluation/Precharge'),
		Selection: () => import('~/components/evaluation/Selection'),
		// Icon: () => import('~/components/Icon'),
		// Avatar: () => import('~/components/Avatar'),
	},
	async asyncData({ $axios, error }) {
		try {
			const { appointments } = await $axios.$get('/appointments/all');
			const { specialists } = await $axios.$get('/specialists/all');
			return { specialists, specialties: appointments };
		} catch (e) {
			error({ statusCode: 404, message: 'Page not found' });
		}
	},
	data() {
		return {
			mdiRecord,
			onboarding: 0,
			dialogPrecharge: false,
			step: '0',
			gender: '',
			age: '',
			firstTherapy: null,
			themes: [],
			schedule: '',
			genderConfort: '',
			price: 0,
			specialties: [],
			models: [],
			specialists: [],
			matchedSpecialists: [],
		};
	},
	head() {
		return {
			link: [
				{
					rel: 'canonical',
					href: `https://cdn.hablaqui.cl/static/evaluacion/`,
				},
			],
		};
	},
	computed: {
		spec() {
			if (!this.specialists) return [];
			const items = this.random();
			const n = 3;
			const result = [[], [], []];
			const wordsPerLine = 2;
			for (let line = 0; line < n; line++) {
				for (let i = 0; i < wordsPerLine; i++) {
					const value = items[i + line * wordsPerLine];
					if (!value) continue;
					result[line].push(value);
				}
			}
			return this.$vuetify.breakpoint.mdAndUp ? result : items;
		},
	},
	created() {
		if (process.browser) {
			const spec = JSON.parse(localStorage.getItem('spec'));
			if (spec && spec.match.length) {
				if (spec._id !== null && spec._id === this.$auth.$state.user._id)
					this.matchedSpecialists = spec.match;
				else if (spec._id === null && this.$auth.$state.loggedIn) {
					localStorage.removeItem('spec');
					localStorage.setItem(
						'spec',
						JSON.stringify({
							match: spec.match,
							_id: this.$auth.$state.user._id,
						})
					);
					this.matchedSpecialists = spec.match;
				}
			}
		}
	},
	mounted() {
		this.getFormattedSessionsAll();
	},
	methods: {
		next() {
			this.onboarding = this.onboarding + 1 === this.length ? 0 : this.onboarding + 1;
		},
		prev() {
			this.onboarding = this.onboarding - 1 < 0 ? this.length - 1 : this.onboarding - 1;
		},
		random() {
			return this.specialists.sort(function randOrd() {
				return Math.round(Math.random()) - 0.5;
			});
		},
		resetMatch() {
			localStorage.removeItem('spec');
			this.gender = '';
			this.age = '';
			this.firstTherapy = null;
			this.themes = [];
			this.schedule = '';
			this.genderConfort = '';
			this.matchedSpecialists = [];
			this.models = [];
			this.price = 0;
			this.step = '0';
		},
		setTheme(value) {
			if (this.themes.includes(value)) {
				const index = this.themes.findIndex(item => item === value);
				this.themes.splice(index, 1);
			} else if (this.themes.length < 3) this.themes.push(value);
			if (this.themes.length === 3) this.step = 4;
		},
		setModels(model) {
			if (this.models.includes(model)) {
				const index = this.models.findIndex(item => item === model);
				this.models.splice(index, 1);
			} else if (this.models.length < 3) this.models.push(model);
			if (this.models.length === 3) this.step = 6;
		},
		openPrecharge() {
			this.dialogPrecharge = true;
			const gender = this.genderConfort === 'Me es indiferente' ? '' : this.genderConfort;
			const payload = {
				gender,
				themes: this.themes,
				schedule: this.schedule,
				model: this.models,
				price: this.price,
			};
			this.matchSpec(payload).then(response => {
				if (response && response.length) {
					localStorage.setItem(
						'spec',
						JSON.stringify({
							match: response.filter((el, i) => i < 3),
							_id: !this.$auth.$state.loggedIn ? null : this.$auth.$state.user._id,
						})
					);
					if (!this.$auth.$state.loggedIn)
						this.$router.push('/auth/?register=true&from=spec');
					this.matchedSpecialists = response.filter((el, i) => i < 3);
				}
			});
		},
		avatar(specialist, thumbnail) {
			if (!specialist.approveAvatar) return '';
			if (specialist.avatarThumbnail && thumbnail) return specialist.avatarThumbnail;
			if (specialist.avatar) return specialist.avatar;
			return '';
		},
		...mapActions({
			matchSpec: 'Specialist/matchSpec',
			getFormattedSessionsAll: 'Specialist/getFormattedSessionsAll',
		}),
	},
};
</script>

<style lang="scss" scoped>
.centerCard {
	position: absolute;
	margin-left: auto;
	margin-right: auto;
	left: 0;
	right: 0;
	border-radius: 25px !important;
}
</style>
