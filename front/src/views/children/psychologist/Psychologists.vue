<template>
	<v-container style="position: relative">
		<v-row justify="space-between" align="center">
			<v-col class="text-left font-weight-bold text-h6 text-md-h3 text--secondary">
				{{ $route.meta.title }}
			</v-col>
		</v-row>
		<v-row>
			<v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="3">
				<v-card style="border-radius:15px" outlined>
					<template v-if="!this.$vuetify.breakpoint.smAndDown">
						<v-card-title class="body-1 font-weight-bold text--secondary">
							Filtrar por
						</v-card-title>
						<v-card-text>
							<v-divider></v-divider>
						</v-card-text>
						<v-card-text style="height:70px" class="d-flex align-center">
							<v-btn icon :class="{ 'primary--text': view == 2 }" @click="setView(2)">
								<v-icon>mdi-menu</v-icon>
							</v-btn>
							<v-divider vertical class="mx-2"></v-divider>
							<v-btn icon :class="{ 'primary--text': view == 1 }" @click="setView(1)">
								<v-icon>mdi-view-grid-outline</v-icon>
							</v-btn>
						</v-card-text>
					</template>
					<v-card-text>
						<v-row>
							<v-col cols="12" sm="4" md="12">
								<div class="body-1 font-weight-bold mt-2">Género</div>
								<v-checkbox
									v-model="gender"
									value="male"
									:disabled="loading"
									hide-details
									@change="filterPanel"
									><template #label>
										<span class="body-2 text-capitalize">Hombre</span>
									</template>
								</v-checkbox>
								<v-checkbox
									v-model="gender"
									value="female"
									:disabled="loading"
									hide-details
									@change="filterPanel"
								>
									<template #label>
										<span class="body-2 text-capitalize">Mujer</span>
									</template>
								</v-checkbox>
								<v-checkbox
									v-model="gender"
									value="transgender"
									:disabled="loading"
									hide-details
									@change="filterPanel"
								>
									<template #label>
										<span class="body-2 text-capitalize">Transgénero</span>
									</template>
								</v-checkbox>
							</v-col>
							<v-col cols="12" sm="4" md="12">
								<div class="body-1 font-weight-bold mt-2">Modelo terapéuticos</div>
								<template
									v-for="(item, i) in [
										'Cognitivo-conductual',
										'Contextual',
										'Psicoanálisis',
										'Humanista',
										'Sistémico',
									]"
								>
									<v-checkbox
										:key="i"
										v-model="models"
										:value="item"
										:disabled="loading"
										hide-details
										@change="filterPanel"
									>
										<template #label>
											<span class="body-2 text-capitalize">{{ item }}</span>
										</template>
									</v-checkbox>
								</template>
							</v-col>
							<v-col cols="12" sm="4" md="12">
								<div class="body-1 font-weight-bold mt-2">Idioma</div>
								<v-checkbox
									v-model="languages"
									value="spanish"
									:disabled="loading"
									hide-details
									@change="filterPanel"
								>
									<template #label>
										<span class="body-2 text-capitalize">Español</span>
									</template>
								</v-checkbox>
								<v-checkbox
									v-model="languages"
									value="english"
									:disabled="loading"
									hide-details
									@change="filterPanel"
								>
									<template #label>
										<span class="body-2 text-capitalize">Ingles</span>
									</template>
								</v-checkbox>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" md="9">
				<v-row>
					<v-col cols="12" md="6">
						<v-autocomplete
							class="white"
							outlined
							:items="appointments"
							item-value="value"
							v-model="specialties"
							label="Motivo de consulta"
							append-icon="mdi-chevron-down"
							hide-details
							clearable
							:menu-props="{
								closeOnClick: true,
								closeOnContentClick: true,
							}"
							:disabled="loading"
						>
							<template #no-data>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>
											No se encontraron resultados que coincidan con "<strong>
												{{ specialties }}
											</strong>
											" .
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</template>
						</v-autocomplete>
					</v-col>
					<v-col cols="12" md="6">
						<v-autocomplete
							class="white"
							outlined
							:items="
								filterLevelThree.map((item, i) => ({
									text: `${item.name} ${item.lastName && item.lastName}`,
									value: item._id,
									index: i,
								}))
							"
							v-model="searchInput"
							label="Busca tu psicólogo"
							append-icon="mdi-chevron-down"
							hide-details
							:menu-props="{
								closeOnClick: true,
							}"
							clearable
							:disabled="loading"
						>
							<template #no-data>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>
											No se encontraron resultados que coincidan con "<strong>
												{{ searchInput }}
											</strong>
											" .
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</template>
						</v-autocomplete>
					</v-col>
					<v-col v-if="!$vuetify.breakpoint.mdAndUp" cols="12">
						<v-expansion-panels
							flat
							style="border-radius: 10px; border: 1px solid #E0E0E0"
						>
							<v-expansion-panel>
								<v-expansion-panel-header
									expand-icon="mdi-filter"
									disable-icon-rotate
									class="px-3"
								>
									<div class="subtitle-1 text--secondary">
										Filtros
									</div>
								</v-expansion-panel-header>
								<v-expansion-panel-content style="border-radius: 10px">
									<v-divider></v-divider>
									<v-card flat style="border-radius:10px">
										<template v-if="!this.$vuetify.breakpoint.smAndDown">
											<v-card-title class="text--secondary">
												Filtrar por
											</v-card-title>
											<v-card-text>
												<v-divider></v-divider>
											</v-card-text>
											<v-card-text
												style="height:70px"
												class="d-flex align-center"
											>
												<v-btn
													icon
													:class="{ 'primary--text': view == 2 }"
													@click="setView(2)"
												>
													<v-icon>mdi-menu</v-icon>
												</v-btn>
												<v-divider vertical class="mx-2"></v-divider>
												<v-btn
													icon
													:class="{ 'primary--text': view == 1 }"
													@click="setView(1)"
												>
													<v-icon>mdi-view-grid-outline</v-icon>
												</v-btn>
											</v-card-text>
										</template>
										<v-card-text>
											<v-row>
												<v-col cols="12" sm="4" md="12">
													<div class="title mt-2">Género</div>
													<v-checkbox
														v-model="gender"
														value="male"
														:disabled="loading"
														label="Hombre"
														hide-details
														@change="filterPanel"
													></v-checkbox>
													<v-checkbox
														v-model="gender"
														value="female"
														:disabled="loading"
														label="Mujer"
														hide-details
														@change="filterPanel"
													></v-checkbox>
													<v-checkbox
														v-model="gender"
														value="transgender"
														:disabled="loading"
														label="Transgénero"
														hide-details
														@change="filterPanel"
													></v-checkbox>
												</v-col>
												<v-col cols="12" sm="4" md="12">
													<div class="title mt-2">
														Modelo terapéuticos
													</div>
													<template
														v-for="(item, i) in [
															'Cognitivo-conductual',
															'Contextual',
															'Psicoanálisis',
															'Humanista',
															'Sistémico',
														]"
													>
														<v-checkbox
															:key="i"
															v-model="models"
															:value="item"
															:label="item"
															:disabled="loading"
															class="text-capitalize"
															hide-details
															@change="filterPanel"
														></v-checkbox>
													</template>
												</v-col>
												<v-col cols="12" sm="4" md="12">
													<div class="title mt-2">Idioma</div>
													<v-checkbox
														v-model="languages"
														value="spanish"
														:disabled="loading"
														label="Español"
														hide-details
														@change="filterPanel"
													></v-checkbox>
													<v-checkbox
														v-model="languages"
														value="english"
														:disabled="loading"
														label="Ingles"
														hide-details
														@change="filterPanel"
													></v-checkbox>
												</v-col>
											</v-row>
										</v-card-text>
									</v-card>
								</v-expansion-panel-content>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-col>
				</v-row>
				<v-row v-if="loading">
					<template v-if="view == 1">
						<v-col v-for="i in 8" cols="12" sm="6" md="4" :key="i">
							<v-skeleton-loader type="image, card-heading" />
						</v-col>
					</template>
					<template v-else>
						<v-col v-for="i in 3" cols="12" :key="i">
							<v-skeleton-loader type="image" />
						</v-col>
					</template>
				</v-row>
				<v-row v-else>
					<template v-if="view == 1">
						<v-col cols="12" sm="6" lg="4" xl="3"
							><v-hover v-slot="{ hover }">
								<v-card
									:style="
										hover
											? 'transform: scale(1.01);'
											: 'text-transform: none !important;'
									"
									:class="hover ? 'elevation-6' : 'elevation-3'"
									height="350"
									style="border-radius:15px; transition: transform 0.7s"
									class="text-center"
									color="primary"
									dark
								>
									<v-card-text style="height: 280px">
										<v-img
											height="100"
											width="100"
											class="mx-auto"
											src="/img/Lupa.png"
										></v-img>
										<div class="mt-4 title font-weight-bold">
											Te ayudamos a encontrar a tu psicólogo
										</div>
										<div class="body-2 mt-2 mx-auto" style="max-width: 250px">
											Encuentra al psicólogo que necesitas, solo responde las
											siguientes preguntas.
										</div>
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn class="px-10" color="white" @click="start">
											<span class="text--secondary">Comenzar</span>
										</v-btn>
										<v-spacer></v-spacer>
									</v-card-actions> </v-card
							></v-hover>
						</v-col>
						<v-col
							cols="12"
							class="title primary--text"
							v-if="!loading && !filterLevelThree.length"
						>
							No se encontraron coincidencias
						</v-col>
						<v-col
							cols="12"
							sm="6"
							lg="4"
							xl="3"
							v-for="(item, i) in filterLevelThree"
							:key="i"
						>
							<v-hover v-slot="{ hover }">
								<v-card
									:style="
										hover
											? 'transform: scale(1.01);'
											: 'text-transform: none !important;'
									"
									:class="hover ? 'elevation-3' : 'elevation-1'"
									style="border-radius:15px; transition: transform 0.6s"
									height="350"
									class="text-center"
								>
									<v-card-text style="height: 250px">
										<div>
											<v-avatar
												size="100"
												:color="item.avatar ? 'trasnparent' : 'primary'"
											>
												<v-img
													v-if="item.avatar"
													:src="item.avatar"
													:lazy-src="item.avatar"
													width="100"
													height="100"
												>
													<template #placeholder>
														<v-row
															class="fill-height ma-0"
															align="center"
															justify="center"
														>
															<v-progress-circular
																indeterminate
																color="primary"
															/>
														</v-row>
													</template>
												</v-img>
												<span
													v-else
													class="white--text headline font-weight-bold"
												>
													{{ item.name.substr(0, 1) }}
												</span>
											</v-avatar>
											<router-link
												v-if="item.name"
												style="text-decoration: none; display: block"
												:to="{
													name: 'psicologo',
													params: { id: item._id },
												}"
											>
												<span
													class="body-2 font-weight-bold secondary--text"
												>
													{{ item.name }}
													{{ item.lastName && item.lastName }}
												</span>
											</router-link>
											<span
												v-if="item.code"
												class="caption primary--text pb-2"
												style="border-bottom: 1px solid #BDBDBD"
											>
												<span> Codigo {{ item.code }} </span>
											</span>
										</div>
										<div class="body-2 mt-4">
											<template v-for="(el, e) in item.specialties">
												<span v-if="e < 6" :key="e"> {{ el }}; </span>
											</template>
										</div>
									</v-card-text>
									<v-card-text>
										<div>
											<dialog-agenda-cita-online
												:psy="item"
												:mode="view.toString()"
											/>
										</div>
										<div class="mt-1">
											<v-btn
												class="body-2"
												text
												:to="{
													name: 'psicologo',
													params: { id: item._id },
												}"
											>
												Más información
											</v-btn>
										</div>
									</v-card-text>
								</v-card>
							</v-hover>
						</v-col>
					</template>
					<template v-if="view == 2">
						<v-col cols="12">
							<v-hover v-slot="{ hover }">
								<v-card
									:style="
										hover
											? 'transform: scale(1.01);'
											: 'text-transform: none !important;'
									"
									:class="hover ? 'elevation-3' : 'elevation-1'"
									style="border-radius:15px; transition: transform 0.6s"
									dark
									color="primary"
								>
									<v-card-text>
										<v-row align="center" justify="center">
											<v-col cols="3" class="text-center">
												<v-img
													height="140"
													width="140"
													class="mx-auto"
													src="/img/Lupa.png"
												></v-img>
											</v-col>
											<v-col cols="9">
												<v-row justify="space-between">
													<v-col
														class="headline font-weight-bold white--text"
													>
														Encuentra a tu psicólogo ideal
													</v-col>
												</v-row>
												<div class="body-2 mt-2">
													Encuentra al psicólogo que necesitas, solo
													responde las siguientes preguntas.
												</div>
												<v-btn
													color="white"
													class="px-10 mt-4"
													@click="start"
												>
													<span class="text--secondary">Comenzar</span>
												</v-btn>
											</v-col>
										</v-row>
									</v-card-text>
								</v-card>
							</v-hover>
						</v-col>
						<v-col
							cols="12"
							class="title primary--text"
							v-if="!loading && !filterLevelThree.length"
						>
							No se encontraron coincidencias
						</v-col>
						<v-col cols="12" v-for="item in filterLevelThree" :key="item._id">
							<v-hover v-slot="{ hover }">
								<v-card
									height="300"
									:style="
										hover
											? 'transform: scale(1.01);'
											: 'text-transform: none !important;'
									"
									:class="hover ? 'elevation-3' : 'elevation-1'"
									style="border-radius:15px; transition: transform 0.6s"
								>
									<v-card-text class="pa-2">
										<v-row
											align="center"
											justify="center"
											style="height: 270px"
										>
											<v-col cols="3" class="text-center">
												<v-avatar
													:size="
														$vuetify.breakpoint.lgAndUp ? '200' : '140'
													"
													:color="item.avatar ? 'trasnparent' : 'primary'"
												>
													<v-img
														v-if="item.avatar"
														:src="item.avatar"
														:lazy-src="item.avatar"
														:width="
															$vuetify.breakpoint.lgAndUp
																? '200'
																: '140'
														"
														:height="
															$vuetify.breakpoint.lgAndUp
																? '200'
																: '140'
														"
													>
														<template #placeholder>
															<v-row
																class="fill-height ma-0"
																align="center"
																justify="center"
															>
																<v-progress-circular
																	indeterminate
																	color="primary"
																/>
															</v-row>
														</template>
													</v-img>
													<span
														v-else
														class="white--text headline font-weight-bold"
													>
														{{ item.name.substr(0, 1) }}
													</span>
												</v-avatar>
												<div
													class="text-center body-2 text--secondary mt-3 mb-2"
												>
													Codigo {{ item.code }}
												</div>
												<router-link
													class="primary--text body-2 font-weight-bold"
													style="text-decoration: none"
													:to="{
														name: 'psicologo',
														params: { id: item._id },
													}"
												>
													Más información
												</router-link>
											</v-col>
											<v-col cols="9">
												<v-row justify="space-between">
													<v-col cols="6">
														<router-link
															style="text-decoration: none"
															:to="{
																name: 'psicologo',
																params: { id: item._id },
															}"
														>
															<span
																class="headline font-weight-bold text--secondary"
															>
																{{ item.name }}
																{{ item.lastName && item.lastName }}
															</span>
														</router-link>
													</v-col>
													<v-col class="text-right mr-4">
														<dialog-agenda-cita-online
															:psy="item"
															:mode="view.toString()"
														/>
													</v-col>
												</v-row>
												<v-chip-group show-arrows v-model="specialties">
													<template v-for="(tag, i) in item.specialties">
														<v-chip
															:value="tag"
															class="ma-2"
															small
															:key="i"
															:color="
																specialties == tag
																	? 'primary--text'
																	: ''
															"
														>
															<span>
																{{ tag }}
															</span>
														</v-chip>
													</template>
												</v-chip-group>
												<div class="body-2 mt:-2 mr-4">
													{{ item.professionalDescription }}
												</div>
											</v-col>
										</v-row>
									</v-card-text>
								</v-card>
							</v-hover>
						</v-col>
					</template>
				</v-row>
			</v-col>
		</v-row>
		<FloatingChat v-if="loggedIn && user.role == 'user'" />
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	components: {
		DialogAgendaCitaOnline: () => import('@/components/psy/DialogAgendaCitaOnline'),
		FloatingChat: () => import('@/components/dashboard/FloatingChat'),
	},
	name: 'psychologists',
	props: {
		loading: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			view: 1,
			specialties: '',
			searchInput: '',
			gender: [],
			models: [],
			languages: [],
		};
	},
	computed: {
		/**
		 * filter search box
		 */
		filterLevelThree() {
			return this.filterLevelTwo.filter(item => {
				let result = item;
				if (this.searchInput !== null)
					result = result._id.indexOf(this.searchInput) > -1 && result;
				return result;
			});
		},
		/**
		 * filter specialties
		 */
		filterLevelTwo() {
			if (!this.specialties) return this.filterLevelOne;
			return this.filterLevelOne.filter(
				item => item.specialties.length && item.specialties.includes(this.specialties)
			);
		},
		/**
		 * filter panel checkbox
		 */
		filterLevelOne() {
			if (!this.gender.length && !this.models.length && !this.languages.length)
				return this.psychologists;
			let result = this.psychologists;
			if (this.gender.length)
				result = result.filter(item => {
					const trans = item.isTrans && 'transgender';
					const gender = [item.gender];
					trans && gender.push(trans);
					return gender.some(el => this.gender.some(g => g == el));
				});
			if (this.models.length)
				result = result.filter(item => item.models.some(el => this.models.includes(el)));
			if (this.languages.length)
				result = result.filter(item =>
					item.languages.some(el => this.languages.some(languages => languages == el))
				);
			if (this.specialties)
				result = result.filter(item => item.specialties.includes(this.specialties));

			return result;
		},
		...mapGetters({
			loggedIn: 'User/loggedIn',
			user: 'User/user',
			psychologists: 'Psychologist/psychologists',
			appointments: 'Appointments/appointments',
		}),
	},
	created() {
		//  Limpia la query url cuando viene desde mercadopago
		if (JSON.stringify(this.$route.params) !== JSON.stringify({}))
			this.$router.replace({ query: null });

		// Establece la vista cuadricula en mobile device, si no la que tenga en local storage
		if (this.$vuetify.breakpoint.smAndDown) this.setView(1);
		else {
			const view = localStorage.getItem('view');
			if (view) {
				this.view = view;
			}
		}

		// Establece los filtros guardados en localstorage
		const panel = JSON.parse(localStorage.getItem('panel'));
		if (panel) {
			if (panel.gender.length) this.gender = panel.gender;
			if (panel.models.length) this.models = panel.models;
			if (panel.languages.length) this.languages = panel.languages;
		}
	},
	methods: {
		start() {
			if (this.loggedIn) this.$router.push({ name: 'evaluacion' });
			else
				this.$router.push({
					name: 'auth',
					params: { q: 'register' },
					query: { from: 'psy' },
				});
		},
		setView(type) {
			localStorage.setItem('view', type);
			this.view = type;
		},
		filterPanel() {
			const panel = {
				gender: this.gender,
				models: this.models,
				languages: this.languages,
			};
			localStorage.setItem('panel', JSON.stringify(panel));
		},
		filterMatch(payload) {
			this.languages = [];
			this.searchInput = '';
			this.gender = payload.gender;
			this.models = [payload.model];
			this.specialties = payload.themes;
		},
	},
	watch: {
		'$vuetify.breakpoint.mdAndUp': newVal => {
			if (!newVal) this.view = 0;
		},
	},
};
</script>

<style scoped>
.item {
	white-space: nowrap;
	transition: transform 0.3s ease 0s, border 0.2s ease 0s, box-shadow 0.2s ease 0s;
	text-align: center;
	cursor: pointer;
	color: #565656;
	padding: 8px 5px;
	border: 1px solid #0085ff80;
	box-sizing: border-box;
	border-radius: 2px;
}
</style>
