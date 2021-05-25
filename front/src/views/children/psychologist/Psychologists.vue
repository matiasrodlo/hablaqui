<template>
	<v-container>
		<v-row justify="space-between" align="center">
			<v-col class="text-left font-weight-bold text-h6 text-md-h3 text--secondary">
				{{ $route.meta.title }}
			</v-col>
		</v-row>
		<v-row>
			<v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="3">
				<v-card style="border-radius:15px" outlined>
					<template v-if="!this.$vuetify.breakpoint.smAndDown">
						<v-card-title class="text--secondary">
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
								<div class="title mt-2">Modelo terapéuticos</div>
								<template
									v-for="(item, i) in [
										'cognitivo',
										'integrativo',
										'contextual',
										'psicoanalisis',
										'humanista',
										'sistemico',
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
			</v-col>
			<v-col cols="12" md="9">
				<v-row>
					<v-col cols="12" md="6">
						<v-combobox
							class="white"
							outlined
							:items="appointments"
							item-text="name"
							:search-input.sync="motive"
							label="Motivo de consulta"
							append-icon="mdi-chevron-down"
							hide-details
							clearable
							:menu-props="{
								closeOnClick: true,
							}"
							:disabled="loading"
						>
							<template v-slot:no-data>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>
											No se encontraron resultados que coincidan con "<strong>
												{{ motive }}
											</strong>
											" .
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</template>
						</v-combobox>
					</v-col>
					<v-col cols="12" md="6">
						<v-combobox
							class="white"
							outlined
							:items="filterLevelThree"
							item-text="name"
							:search-input.sync="searchInput"
							label="Busca tu psicólogo"
							append-icon="mdi-chevron-down"
							hide-details
							:menu-props="{
								closeOnClick: true,
							}"
							clearable
							:disabled="loading"
							no-data-text="No hay psicologos en este momento"
						>
						</v-combobox>
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
															'cognitivo',
															'integrativo',
															'contextual',
															'psicoanalisis',
															'humanista',
															'sistemico',
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
						<v-col cols="12" sm="6" lg="4">
							<v-card
								height="380"
								style="border-radius:15px"
								class="text-center"
								color="primary"
								dark
							>
								<v-card-text style="height: 310px">
									<v-btn
										fab
										light
										depressed
										width="100"
										height="100"
										style="border: 8px solid #5EB3E4;"
										class="mb-5 mt-3"
									>
										<v-icon color="primary" size="60">mdi-magnify</v-icon>
									</v-btn>
									<div class="title font-weight-bold">
										Te ayudamos a encontrar a tu psicólogo
									</div>
									<div class="body-1 mt-2 mx-auto" style="max-width: 250px">
										Encuentra al psicólogo que necesitas, solo responde las
										siguientes preguntas.
									</div>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn
										class="px-10"
										light
										color="#F0F8FF"
										style="border-radius:10px"
										depressed
										:to="{ name: 'auth', params: { q: 'register' } }"
									>
										Comenzar
									</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
							</v-card>
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
							v-for="(item, i) in filterLevelThree"
							:key="i"
						>
							<v-card height="380" style="border-radius:15px" class="text-center">
								<v-card-text style="height: 280px">
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
										<div
											v-if="item.name"
											class="subtitle-1 font-weight-bold text--secondary"
										>
											{{
												item.name.length > 25
													? item.name.slice(0, 25).concat('...')
													: item.name
											}}
										</div>
										<span v-if="item.code" class="caption primary--text">
											<span> Codigo {{ item.code }} </span>
											<v-divider
												style="margin-left: 90px; margin-right: 90px"
											></v-divider>
										</span>
									</div>
									<template v-if="$vuetify.breakpoint.mdAndUp">
										<div v-if="item.description" class="body-2 mt-2">
											{{
												item.description.length > 160
													? item.description.slice(0, 160).concat('...')
													: item.description
											}}
										</div>
										<div v-else class="text--secondary headline my-16">
											Sin descripción
										</div>
									</template>
									<div v-else class="body-2 mt-2">
										<span v-for="(el, e) in item.specialties" :key="e">
											{{ el }};
										</span>
									</div>
								</v-card-text>
								<v-card-text>
									<div>
										<v-btn
											color="primary"
											depressed
											style="border-radius:10px"
											@click="toAuth(item)"
										>
											Agenda cita oline
										</v-btn>
									</div>
									<div>
										<v-btn
											text
											:to="{ name: 'psicologo', params: { id: item._id } }"
										>
											Más información
										</v-btn>
									</div>
								</v-card-text>
							</v-card>
						</v-col>
					</template>
					<template v-if="view == 2">
						<v-col v-if="!loggedIn" cols="12">
							<v-card style="border-radius:15px" dark color="primary">
								<v-card-text>
									<v-row align="center" justify="center">
										<v-col cols="3" class="text-center">
											<v-list-item-avatar size="140" class="ml-4">
												<v-btn
													fab
													light
													depressed
													width="140"
													height="140"
													style="border: 8px solid #5EB3E4;"
												>
													<v-icon color="primary" size="60"
														>mdi-magnify</v-icon
													>
												</v-btn>
											</v-list-item-avatar>
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
												Encuentra al psicólogo que necesitas, solo responde
												las siguientes preguntas.
											</div>
											<v-btn
												light
												class="px-10 mt-4"
												depressed
												:to="{ name: 'auth', params: { q: 'register' } }"
											>
												Comenzar
											</v-btn>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>
						</v-col>
						<v-col
							cols="12"
							class="title primary--text"
							v-if="!loading && !filterLevelThree.length"
						>
							No se encontraron coincidencias
						</v-col>
						<v-col cols="12" v-for="item in filterLevelThree" :key="item._id">
							<v-card height="270" style="border-radius:15px">
								<v-card-text class="my-2">
									<v-row align="center" justify="center" style="height: 270px">
										<v-col cols="3" class="text-center">
											<v-avatar
												size="140"
												:color="item.avatar ? 'trasnparent' : 'primary'"
											>
												<v-img
													v-if="item.avatar"
													:src="item.avatar"
													:lazy-src="item.avatar"
													width="140"
													height="140"
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
											<div class="text-center caption text--secondary">
												Codigo {{ item.code }}
											</div>
											<v-btn
												text
												color="primary"
												depressed
												class="pa-0 font-weight-bold"
												:to="{
													name: 'psicologo',
													params: { id: item._id },
												}"
											>
												Más información
											</v-btn>
										</v-col>
										<v-col cols="9">
											<v-row justify="space-between">
												<v-col
													class="headline font-weight-bold text--secondary"
												>
													{{ item.name }}
												</v-col>
												<v-col cols="5" class="text-right">
													<v-btn
														color="primary"
														rounded
														depressed
														@click="toAuth(item)"
													>
														Agenda cita oline
													</v-btn>
												</v-col>
											</v-row>
											<v-chip-group show-arrows v-model="motive">
												<template v-for="(tag, i) in item.specialties">
													<v-chip
														:value="tag"
														class="ma-2"
														small
														:key="i"
														:color="
															motive == tag ? 'primary--text' : ''
														"
													>
														<span class="text-capitalize">
															{{ tag }}
														</span>
													</v-chip>
												</template>
											</v-chip-group>
											<div class="body-2 mt-2">
												{{ item.description }}
											</div>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>
						</v-col>
					</template>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: 'psychologists',
	props: {
		loading: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			motive: '',
			searchInput: '',
			view: 1,
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
					result =
						result.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1 &&
						result;
				return result;
			});
		},
		/**
		 * filter motive
		 */
		filterLevelTwo() {
			if (!this.motive) return this.filterLevelOne;
			return this.filterLevelOne.filter(
				item => item.specialties.length && item.specialties.includes(this.motive)
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
				result = result.filter(item => this.gender.includes(item.gender));
			if (this.models.length)
				result = result.filter(item =>
					item.models.some(el => this.models.some(model => model == el))
				);
			if (this.languages.length)
				result = result.filter(item =>
					item.languages.some(el => this.languages.some(languages => languages == el))
				);
			if (this.motive) result = result.filter(item => item.specialties.includes(this.motive));

			return result;
		},
		...mapGetters({
			psychologists: 'Psychologist/psychologists',
			appointments: 'Appointments/appointments',
			loggedIn: 'User/loggedIn',
		}),
	},
	created() {
		if (this.$vuetify.breakpoint.smAndDown) this.setView(1);
		else {
			const view = localStorage.getItem('view');
			if (view) {
				this.view = view;
			}
		}
		const panel = JSON.parse(localStorage.getItem('panel'));
		if (panel) {
			if (panel.gender.length) this.gender = panel.gender;
			if (panel.models.length) this.models = panel.models;
			if (panel.languages.length) this.languages = panel.languages;
		}
	},
	methods: {
		setView(type) {
			localStorage.setItem('view', type);
			this.view = type;
		},
		toAuth(item) {
			localStorage.setItem('psi', JSON.stringify(item));
			if (this.loggedIn) this.$router.push({ name: 'plan' });
			else this.$router.push({ path: '/auth/q=register' });
		},
		filterPanel() {
			const panel = {
				gender: this.gender,
				models: this.models,
				languages: this.languages,
			};
			localStorage.setItem('panel', JSON.stringify(panel));
		},
	},
};
</script>
