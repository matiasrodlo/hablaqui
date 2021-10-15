<template>
	<v-container style="position: relative">
		<v-row v-if="$route.name === 'psicologos'" justify="space-between" align="center">
			<v-col tag="h1" class="text-left font-weight-bold text-h6 text-md-h3 text--secondary">
				Encuentra a tu psicólogo online
			</v-col>
		</v-row>
		<v-row>
			<v-col class="hidden-sm-and-down" cols="12" md="3">
				<v-card style="border-radius: 15px" outlined>
					<v-card-title class="body-1 font-weight-bold text--secondary">
						Filtrar por
					</v-card-title>
					<v-card-text>
						<v-divider></v-divider>
					</v-card-text>
					<v-card-text style="height: 70px" class="d-flex align-center">
						<v-btn icon :class="{ 'primary--text': view == 2 }" @click="setView(2)">
							<icon :icon="mdiMenu" />
						</v-btn>
						<v-divider vertical class="mx-2"></v-divider>
						<v-btn icon :class="{ 'primary--text': view == 1 }" @click="setView(1)">
							<icon :icon="mdiViewGridOutline" />
						</v-btn>
					</v-card-text>
					<v-card-text>
						<v-row>
							<v-col cols="12" sm="4" md="12">
								<div class="body-1 font-weight-bold mt-2">Género</div>
								<v-checkbox
									v-model="gender"
									value="male"
									hide-details
									label="Hombre"
									@change="filterPanel"
								>
								</v-checkbox>
								<v-checkbox
									v-model="gender"
									value="female"
									hide-details
									label="Mujer"
									@change="filterPanel"
								>
								</v-checkbox>
								<v-checkbox
									v-model="gender"
									value="transgender"
									hide-details
									label="Transgénero"
									@change="filterPanel"
								>
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
										:key="`models-${i}`"
										v-model="models"
										:value="item"
										hide-details
										:label="item"
										@change="filterPanel"
									>
									</v-checkbox>
								</template>
							</v-col>
							<v-col cols="12" sm="4" md="12">
								<div class="body-1 font-weight-bold mt-2">Idioma</div>
								<v-checkbox
									v-model="languages"
									value="spanish"
									hide-details
									label="Español"
									@change="filterPanel"
								>
								</v-checkbox>
								<v-checkbox
									v-model="languages"
									value="english"
									hide-details
									label="Ingles"
									@change="filterPanel"
								>
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
							v-model="specialties"
							class="white"
							outlined
							:items="appointments"
							item-value="value"
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
							v-model="searchInput"
							class="white"
							outlined
							:items="itemsSearch"
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
					<v-col class="hidden-md-and-up" cols="12">
						<v-expansion-panels
							flat
							style="border-radius: 10px; border: 1px solid #e0e0e0"
						>
							<v-expansion-panel>
								<v-expansion-panel-header
									expand-icon="mdi-filter"
									disable-icon-rotate
									class="px-3"
								>
									<div class="subtitle-1 text--secondary">Filtros</div>
								</v-expansion-panel-header>
								<v-expansion-panel-content style="border-radius: 10px">
									<v-divider></v-divider>
									<v-card flat style="border-radius: 10px">
										<template v-if="!$vuetify.breakpoint.smAndDown">
											<v-card-title class="text--secondary">
												Filtrar por
											</v-card-title>
											<v-card-text>
												<v-divider></v-divider>
											</v-card-text>
											<v-card-text
												style="height: 70px"
												class="d-flex align-center"
											>
												<v-btn
													icon
													:class="{ 'primary--text': view == 2 }"
													@click="setView(2)"
												>
													<icon :icon="mdiMenu" />
												</v-btn>
												<v-divider vertical class="mx-2"></v-divider>
												<v-btn
													icon
													:class="{ 'primary--text': view == 1 }"
													@click="setView(1)"
												>
													<icon :icon="mdiViewGridOutline" />
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
															:key="`models-mobile-${i}`"
															v-model="models"
															:value="item"
															:label="item"
															:disabled="loading"
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
				<client-only>
					<v-row v-if="loading">
						<template v-if="view == 1">
							<v-col v-for="i in 8" :key="i" cols="12" sm="6" md="4">
								<v-skeleton-loader type="image, card-heading" />
							</v-col>
						</template>
						<template v-else>
							<v-col v-for="i in 3" :key="i" cols="12">
								<v-skeleton-loader type="image" />
							</v-col>
						</template>
					</v-row>
					<v-row v-else>
						<template v-if="view == 1">
							<v-col cols="12" sm="6" lg="4" xl="3">
								<v-hover v-slot="{ hover }">
									<v-card
										:style="
											hover
												? 'transform: scale(1.01);'
												: 'text-transform: none !important;'
										"
										:class="hover ? 'elevation-6' : 'elevation-3'"
										height="350"
										style="border-radius: 15px; transition: transform 0.7s"
										class="text-center"
										color="primary"
										dark
									>
										<v-card-text style="height: 280px">
											<v-img
												height="100"
												width="100"
												class="mx-auto"
												:src="`https://cdn.hablaqui.cl/static/Lupa.png`"
												:lazy-src="`https://cdn.hablaqui.cl/static/Lupa.png`"
											>
												<template #placeholder>
													<v-row
														class="fill-height ma-0"
														align="center"
														justify="center"
													>
														<v-progress-circular
															indeterminate
															color="grey lighten-5"
														></v-progress-circular>
													</v-row>
												</template>
											</v-img>
											<div class="mt-4 title font-weight-bold">
												Te ayudamos a encontrar a tu psicólogo
											</div>
											<div
												class="body-2 mt-2 mx-auto"
												style="max-width: 250px"
											>
												Encuentra al psicólogo que necesitas, solo responde
												las siguientes preguntas.
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
								v-if="!loading && !filterLevelThree.length"
								cols="12"
								class="title primary--text"
							>
								No se encontraron coincidencias
							</v-col>
							<v-col
								v-for="(item, i) in filterLevelThree"
								:key="i"
								cols="12"
								sm="6"
								lg="4"
								xl="3"
							>
								<v-hover v-slot="{ hover }">
									<v-card
										:style="
											hover
												? 'transform: scale(1.01);'
												: 'text-transform: none !important;'
										"
										:class="hover ? 'elevation-3' : 'elevation-1'"
										style="border-radius: 15px; transition: transform 0.6s"
										height="350"
										class="text-center"
									>
										<v-card-text style="height: 250px">
											<div>
												<avatar
													:url="avatar(item, true)"
													:name="item.name"
													:last-name="item.lastName ? item.lastName : ''"
													size="100"
													loading-color="white"
												></avatar>
												<nuxt-link
													v-if="item.name"
													style="text-decoration: none; display: block"
													:to="{ path: `/${item.username}` }"
												>
													<span
														class="
															body-2
															font-weight-bold
															secondary--text
														"
													>
														{{ item.name }}
														{{ item.lastName && item.lastName }}
													</span>
												</nuxt-link>
												<span
													v-if="item.code"
													class="caption primary--text pb-2"
													style="border-bottom: 1px solid #bdbdbd"
												>
													<span> código {{ item.code }} </span>
												</span>
											</div>
											<div class="body-2 mt-4">
												{{
													item.professionalDescription.length > 110
														? item.professionalDescription
																.slice(0, 110)
																.concat('...')
														: item.professionalDescription
												}}
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
													:to="{ path: `/${item.username}` }"
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
										style="border-radius: 15px; transition: transform 0.6s"
										dark
										color="primary"
									>
										<v-card-text>
											<v-row align="center" justify="center">
												<v-col cols="12" sm="3" class="text-center">
													<v-img
														height="140"
														width="140"
														class="mx-auto"
														:src="`https://cdn.hablaqui.cl/static/Lupa.png`"
														:lazy-src="`https://cdn.hablaqui.cl/static/Lupa.png`"
													>
														<template #placeholder>
															<v-row
																class="fill-height ma-0"
																align="center"
																justify="center"
															>
																<v-progress-circular
																	indeterminate
																	color="grey lighten-5"
																></v-progress-circular>
															</v-row>
														</template>
													</v-img>
												</v-col>
												<v-col
													cols="12"
													sm="9"
													class="text-center text-sm-left"
												>
													<v-row justify="space-between">
														<v-col
															class="
																headline
																font-weight-bold
																white--text
															"
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
														<span class="text--secondary"
															>Comenzar</span
														>
													</v-btn>
												</v-col>
											</v-row>
										</v-card-text>
									</v-card>
								</v-hover>
							</v-col>
							<v-col
								v-if="!loading && !filterLevelThree.length"
								cols="12"
								class="title primary--text"
							>
								No se encontraron coincidencias
							</v-col>
							<v-col v-for="item in filterLevelThree" :key="item._id" cols="12">
								<v-hover v-slot="{ hover }">
									<v-card
										:style="
											hover
												? 'transform: scale(1.01);'
												: 'text-transform: none !important;'
										"
										:class="hover ? 'elevation-3' : 'elevation-1'"
										style="border-radius: 15px; transition: transform 0.6s"
									>
										<v-card-text>
											<v-row align="center" justify="center">
												<v-col cols="12" sm="3" class="text-center">
													<avatar
														:url="avatar(item, false)"
														:name="item.name"
														:last-name="
															item.lastName ? item.lastName : ''
														"
														:size="
															$vuetify.breakpoint.lgAndUp
																? '200'
																: '140'
														"
														loading-color="white"
													></avatar>
													<div
														class="
															text-center
															body-2
															text--secondary
															mt-3
															mb-2
														"
													>
														código {{ item.code }}
													</div>
													<nuxt-link
														class="
															primary--text
															body-2
															font-weight-bold
														"
														style="text-decoration: none"
														:to="{ path: `/${item.username}` }"
													>
														Más información
													</nuxt-link>
												</v-col>
												<v-col cols="12" sm="9">
													<v-row
														justify-md="space-between"
														align="center"
													>
														<v-col
															cols="12"
															sm="6"
															class="text-center text-sm-left"
														>
															<nuxt-link
																style="text-decoration: none"
																:to="{
																	path: `/${item.username}`,
																}"
															>
																<span
																	class="
																		body-1
																		text-lg-h5
																		font-weight-bold
																		text--secondary
																	"
																>
																	{{ item.name }}
																	{{
																		item.lastName &&
																		item.lastName
																	}}
																</span>
															</nuxt-link>
														</v-col>
														<v-col
															cols="12"
															sm="6"
															class="
																text-center text-sm-right
																mb-4 mb-sm-0
															"
														>
															<dialog-agenda-cita-online
																:psy="item"
																:mode="view.toString()"
															/>
														</v-col>
													</v-row>
													<v-chip-group v-model="specialties" show-arrows>
														<template
															v-for="(tag, i) in item.specialties"
														>
															<v-chip
																:key="i"
																:value="tag"
																class="ma-2"
																small
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
													<div
														class="
															body-2
															mt-2
															mr-4
															text-center text-sm-left
														"
													>
														{{
															item.professionalDescription.length >
															345
																? item.professionalDescription
																		.slice(0, 345)
																		.concat('...')
																: item.professionalDescription
														}}
													</div>
												</v-col>
											</v-row>
										</v-card-text>
									</v-card>
								</v-hover>
							</v-col>
						</template>
					</v-row>
				</client-only>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { mdiMenu, mdiViewGridOutline } from '@mdi/js';

export default {
	name: 'AllPsicologos',
	components: {
		Avatar: () => import('~/components/Avatar'),
		DialogAgendaCitaOnline: () => import('~/components/psicologos/DialogAgendaCitaOnline'),
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiMenu,
			mdiViewGridOutline,
			view: 1,
			specialties: '',
			searchInput: '',
			gender: [],
			models: [],
			languages: [],
		};
	},
	computed: {
		loading() {
			return !this.psychologists.length;
		},
		/**
		 * items for search box
		 */
		itemsSearch() {
			return this.filterLevelThree.map((item, index) => ({
				text: `${item.name} ${item.lastName && item.lastName}`,
				value: item._id,
				index,
			}));
		},
		/**
		 * filter search box
		 */
		filterLevelThree() {
			return this.filterLevelTwo.filter(item => {
				let result = item;
				if (this.searchInput !== null)
					result = result._id.includes(this.searchInput) && result;
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
			let result = this.psychologists.filter(item => item.preferences.marketplaceVisibility);
			if (!this.gender.length && !this.models.length && !this.languages.length) return result;
			if (this.gender.length)
				result = result.filter(item => {
					const trans = item.isTrans && 'transgender';
					const gender = [item.gender];
					trans && gender.push(trans);
					return gender.some(el => this.gender.some(g => g === el));
				});
			if (this.models.length)
				result = result.filter(item => item.models.some(el => this.models.includes(el)));
			if (this.languages.length)
				result = result.filter(item =>
					item.languages.some(el => this.languages.some(languages => languages === el))
				);
			if (this.specialties)
				result = result.filter(item => item.specialties.includes(this.specialties));

			return result;
		},
		...mapGetters({
			appointments: 'Appointments/appointments',
			psychologists: 'Psychologist/psychologists',
		}),
	},
	created() {
		this.setFloatingChat(false);
		//  Limpia la query url cuando viene desde mercadopago
		if (
			this.$route.name === 'psicologos' &&
			JSON.stringify(this.$route.params) !== JSON.stringify({})
		)
			this.$router.replace({ query: null });

		// Establece la vista cuadricula en mobile device, si no la que tenga en local storage
		if (process.browser) {
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
		}
	},
	methods: {
		start() {
			if (this.$auth.$state.loggedIn) this.$router.push({ name: 'evaluacion' });
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
		avatar(psychologist, thumbnail) {
			if (!psychologist.approveAvatar) return '';
			if (psychologist.avatarThumbnail && (thumbnail || this.$vuetify.breakpoint.smAndDown))
				return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		...mapMutations({
			setFloatingChat: 'Chat/setFloatingChat',
		}),
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
