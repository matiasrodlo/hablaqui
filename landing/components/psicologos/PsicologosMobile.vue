<template>
	<div>
		<!-- filter name -->
		<v-container fluid style="max-width: 1200px">
			<v-row>
				<v-col
					cols="12"
					tag="h1"
					class="text-left font-weight-bold text-h5"
					style="color: #54565a"
				>
					Encuentra a tu psicólogo online
				</v-col>
				<v-col cols="12" sm="6">
					<v-autocomplete
						id="searchInput"
						:value="searchInput"
						class="white"
						dense
						outlined
						:items="
							filterLevelTwo.map((item, index) => ({
								text: `${item.name} ${item.lastName && item.lastName}`,
								value: item._id,
								index,
							}))
						"
						label="Busca un psicólogo sin salir de casa"
						:append-icon="mdiChevronDown"
						hide-details
						:menu-props="{
							closeOnClick: true,
						}"
						clearable
						:disabled="loadingPsychologist"
						@change="
							e => {
								searchInput = e;
								visibles = [];
								page = 1;
							}
						"
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
			</v-row>
		</v-container>
		<!-- filters -->
		<v-container
			fluid
			style="max-width: 1200px; z-index: 1"
			:style="scrollHeight > 300 ? 'background-color: #ffffff' : 'background-color: #f0f8ff'"
			class="sticky scroll"
			:class="scrollHeight > 300 ? 'shadowAppBar' : 'elevation-0'"
		>
			<v-row>
				<v-col cols="12">
					<v-text-field
						id="filterfixed"
						placeholder="Filtros"
						readonly
						hide-details
						:flat="scrollHeight > 300"
						:solo="scrollHeight > 300"
						class="white px-0"
						:append-icon="mdiChevronDown"
						dense
						:outlined="scrollHeight < 300"
						@click="showFilters = true"
					></v-text-field>
					<v-dialog
						v-model="showFilters"
						fullscreen
						transition="dialog-bottom-transition"
					>
						<v-card style="height: fit-content; display: flex; flex-direction: column">
							<v-card-title
								style="flex: 0"
								class="titleColor d-flex justify-space-between"
							>
								<div>Filtros</div>
								<v-btn icon @click="showFilters = false">
									<icon size="30px" color="#717171" :icon="mdiCloseCircle" />
								</v-btn>
							</v-card-title>
							<div style="flex: 1">
								<v-card-text class="pa-1">
									<h4 class="titleColor font-weight-bold body-1 ml-1">
										Motivo de consulta
									</h4>
									<v-autocomplete
										v-model="specialties"
										class="white"
										outlined
										:items="appointments"
										item-value="value"
										:append-icon="mdiChevronDown"
										hide-details
										dense
										clearable
										:menu-props="{
											closeOnClick: true,
											closeOnContentClick: true,
										}"
										:disabled="loadingPsychologist"
										@change="changeInput"
									>
										<template #no-data>
											<v-list-item>
												<v-list-item-content>
													<v-list-item-title>
														No se encontraron resultados que coincidan
														con "<strong>
															{{ specialties }}
														</strong>
														" .
													</v-list-item-title>
												</v-list-item-content>
											</v-list-item>
										</template>
									</v-autocomplete>
								</v-card-text>
								<v-card-text class="pa-1">
									<h4 class="titleColor font-weight-bold body-1 ml-1">Género</h4>
									<v-menu
										v-model="menuGender"
										:close-on-content-click="false"
										transition="scale-transition"
										offset-y
										rounded
									>
										<template #activator="{ on, attrs }">
											<v-text-field
												:value="
													gender.length
														? `Seleccionados ${gender.length}`
														: ''
												"
												readonly
												outlined
												dense
												class="white"
												hide-details
												:append-icon="mdiChevronDown"
												v-bind="attrs"
												v-on="on"
											></v-text-field>
										</template>
										<v-card rounded>
											<v-card-text>
												<v-checkbox
													v-model="gender"
													value="male"
													:disabled="loadingPsychologist"
													label="Hombre"
													class="py-2"
													hide-details
													@change="changeInput"
												>
													<template #label>
														<span class="caption">Hombre</span>
													</template>
												</v-checkbox>
												<v-checkbox
													v-model="gender"
													value="female"
													label="Mujer"
													:disabled="loadingPsychologist"
													class="py-2"
													hide-details
													@change="changeInput"
												>
													<template #label>
														<span class="caption">Mujer</span>
													</template>
												</v-checkbox>
												<v-checkbox
													v-model="gender"
													value="transgender"
													label="Transgénero"
													:disabled="loadingPsychologist"
													class="py-2"
													hide-details
													@change="changeInput"
												>
													<template #label>
														<span class="caption">Transgénero </span>
													</template>
												</v-checkbox>
											</v-card-text>
										</v-card>
									</v-menu>
								</v-card-text>
								<v-card-text class="pa-1">
									<h4 class="titleColor font-weight-bold body-1 ml-1">Precios</h4>
									<v-autocomplete
										v-model="prices"
										outlined
										dense
										class="white"
										clearable
										:append-icon="mdiChevronDown"
										:items="[
											{ value: '[9990, 14990]', text: '$9.990 - $14.990' },
											{ value: '[14990, 22990]', text: '$14.990 - $22.990' },
											{ value: '[22990, 29990]', text: '$22.990 - $29.990' },
											{ value: '[29900]', text: '+ $29.900' },
										]"
										hide-details
									></v-autocomplete>
								</v-card-text>
								<v-card-text class="pa-1">
									<h4 class="titleColor font-weight-bold body-1 ml-1">Otros</h4>
									<v-menu
										v-model="menuOthers"
										:close-on-content-click="false"
										transition="scale-transition"
										offset-y
										rounded
										min-width="300px"
									>
										<template #activator="{ on, attrs }">
											<v-text-field
												:value="
													models.length || languages.length
														? `Seleccionados ${
																models.length + languages.length
														  }`
														: ''
												"
												readonly
												outlined
												dense
												class="white"
												hide-details
												:append-icon="mdiChevronDown"
												v-bind="attrs"
												v-on="on"
											>
											</v-text-field>
										</template>
										<v-card rounded width="300px">
											<v-card-text
												><div class="body-2 font-weight-bold">
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
														:key="`models-${i}`"
														v-model="models"
														:value="item"
														class="py-2"
														hide-details
														:label="item"
														@change="changeInput"
													>
														<template #label>
															<span class="caption"> {{ item }}</span>
														</template>
													</v-checkbox>
												</template>
												<div class="body-2 font-weight-bold mt-2">
													Idioma
												</div>
												<v-checkbox
													v-model="languages"
													value="spanish"
													:disabled="loadingPsychologist"
													hide-details
													class="py-2"
													label="Español"
													@change="changeInput"
												>
													<template #label>
														<span class="caption">Español </span>
													</template>
												</v-checkbox>
												<v-checkbox
													v-model="languages"
													value="english"
													:disabled="loadingPsychologist"
													hide-details
													class="py-2"
													label="Ingles"
													@change="changeInput"
												>
													<template #label>
														<span class="caption">Ingles </span>
													</template>
												</v-checkbox>
											</v-card-text>
										</v-card>
									</v-menu>
								</v-card-text>
							</div>
							<v-card-actions style="flex: 0">
								<v-btn
									rounded
									depressed
									color="#E1E1E1"
									@click="
										() => {
											others = [];
											specialties = '';
											gender = [];
											languages = [];
											models = [];
											prices = '';
											changeInput();
										}
									"
								>
									<span style="color: #4e4e4e"> Limpiar filtro </span>
								</v-btn>
								<v-spacer></v-spacer>
								<v-btn
									rounded
									depressed
									color="rgba(26, 165, 216, 0.16)"
									@click="showFilters = false"
								>
									<span class="primary--text"> Mostrar resultados </span>
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-col>
			</v-row>
		</v-container>
		<!-- pychologist -->
		<v-container fluid style="max-width: 1200px" class="my-4">
			<v-row>
				<v-col cols="12">
					<v-sheet class="item" style="border-radius: 15px">
						<v-row>
							<v-col cols="12">
								<v-img
									width="100px"
									height="100px"
									class="mx-auto"
									contain
									src="https://cdn.hablaqui.cl/static/banner_comenzar_mobile.png"
									lazy-src="https://cdn.hablaqui.cl/static/banner_comenzar_mobile.png"
								></v-img>
								<div
									style="width: 290px"
									class="
										mx-auto
										my-3
										text-center
										title
										primary--text
										font-weight-bold
									"
								>
									Te ayudamos a encontrar a tu psicólogo ideal
								</div>
								<div
									style="max-width: 320px"
									class="
										mx-auto
										text-center
										my-3
										body-1
										primary--text
										font-weight-regular
									"
								>
									Encuentra al psicólogo que necesitas, solo responde las
									siguientes preguntas.
								</div>
								<div class="text-center my-4">
									<v-btn rounded color="primary" class="px-8 py-2" @click="start">
										Comenzar
									</v-btn>
								</div>
							</v-col>
						</v-row>
					</v-sheet>
				</v-col>
				<v-col
					v-if="loadingPsychologist"
					cols="12"
					style="height: 300px"
					class="d-flex justify-center align-center"
				>
					<v-progress-circular
						size="40"
						indeterminate
						color="primary"
					></v-progress-circular>
				</v-col>
				<template v-else>
					<template v-for="(item, index) in filterLevelThree">
						<v-col v-if="10 * page > index" :key="item._id" cols="12">
							<v-card
								v-observe-visibility="{
									callback: (isVisible, entry) =>
										handleVisivility(isVisible, entry, item._id),
								}"
								style="border-radius: 15px"
								class="item text-center mt-6"
							>
								<v-card-text>
									<v-row>
										<v-col
											cols="3"
											sm="2"
											class="d-flex align-start justify-center"
										>
											<div class="text-center">
												<nuxt-link
													style="text-decoration: none"
													:to="{
														path: `/${item.username}`,
													}"
												>
													<avatar
														:url="avatar(item, true)"
														:name="item.name"
														:last-name="
															item.lastName ? item.lastName : ''
														"
														size="70"
														loading-color="white"
													></avatar>
												</nuxt-link>
											</div>
										</v-col>
										<v-col cols="9" sm="10">
											<div>
												<nuxt-link
													style="text-decoration: none"
													:to="{
														path: `/${item.username}`,
													}"
												>
													<div
														class="text-left font-weight-bold body-1"
														style="color: #3c3c3b"
													>
														{{ item.name }}
														{{ item.lastName && item.lastName }}
													</div>
												</nuxt-link>
											</div>
											<div
												class="text-capitalize text-left mt-1 mb-2"
												style="color: #706f6f; font-size: 12px"
											>
												código {{ item.code ? item.code : '' }}
											</div>
											<div
												class="text-left font-weight-medium body-2"
												style="color: #3c3c3b"
											>
												${{
													Math.ceil(item.sessionPrices.video / 100) * 100
												}}
												/ 50 min
											</div>
										</v-col>
										<v-col cols="12">
											<div>
												<v-chip-group
													v-model="specialties"
													:show-arrows="false"
												>
													<template v-for="(tag, s) in item.specialties">
														<v-chip
															:key="s"
															:value="tag"
															class="ma-1"
															x-small
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
											</div>
											<div
												class="mt-3 text-left"
												style="color: #54565a; font-size: 14px"
											>
												{{
													item.professionalDescription.length > 110
														? item.professionalDescription
																.slice(0, 110)
																.concat('...')
														: item.professionalDescription
												}}
											</div>
											<mini-calendar
												:id-psy="item._id"
												:username="item.username"
												:sessions="getSessions(item._id)"
											/>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>
						</v-col>
					</template>
				</template>
				<v-col
					v-if="psychologists.length && !filterLevelThree.length"
					cols="12"
					class="title primary--text"
				>
					No se encontraron coincidencias
				</v-col>
			</v-row>
		</v-container>
		<div v-observe-visibility="scrollInfinity" />
	</div>
</template>

<script>
import { mdiChevronDown, mdiPlus, mdiMinus, mdiCloseCircle } from '@mdi/js';
import { mapGetters, mapMutations } from 'vuex';

export default {
	name: 'PsicologosMobile',
	components: {
		MiniCalendar: () => import('~/components/psicologos/MiniCalendar'),
		Icon: () => import('~/components/Icon'),
	},
	props: {
		loadingPsychologist: {
			type: Boolean,
		},
	},
	data() {
		return {
			seeMoreSpecialties: false,
			showFilters: false,
			mdiCloseCircle,
			mdiPlus,
			mdiMinus,
			mdiChevronDown,
			menuGender: false,
			menuOthers: false,
			menuPrices: false,
			view: 1,
			specialties: '',
			searchInput: '',
			prices: '',
			gender: [],
			others: [],
			models: [],
			languages: [],
			scrollHeight: 0,
			visibles: [],
			fullcard: [],
			page: 1,
		};
	},
	computed: {
		/**
		 * Filter search box
		 * Filtra en base a los resultados del panel
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
		 * Filter prices
		 */
		filterLevelTwo(item) {
			if (!this.prices) return this.filterLevelOne;
			return this.filterLevelOne.filter(item => {
				const prices = JSON.parse(this.prices);
				if (prices.length > 1)
					return (
						prices[0] < item.sessionPrices.video && prices[1] > item.sessionPrices.video
					);
				else return prices[0] < item.sessionPrices.video;
			});
		},
		/**
		 * items for search box
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
			psychologists: 'Psychologist/psychologistsMarketPlace',
			sessions: 'Psychologist/sessionsFormattedAll',
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
	mounted() {
		window.addEventListener('scroll', this.onScroll);
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.onScroll);
	},
	methods: {
		scrollInfinity(isVisible) {
			if (isVisible && this.page < this.filterLevelThree.length / 10) this.page += 1;
		},
		handleVisivility(isVisible, entry, idPsychologist) {
			if (isVisible && !this.visibles.includes(idPsychologist))
				this.visibles.push(idPsychologist);
		},
		onScroll(e) {
			this.scrollHeight = window.top.scrollY; /* or: e.target.documentElement.scrollTop */
		},
		start() {
			if (this.$auth.$state.loggedIn) this.$router.push({ name: 'evaluacion' });
			else this.$router.push('/auth/?register=true&from=psy');
		},
		setView(type) {
			localStorage.setItem('view', type);
			this.view = type;
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
			if (psychologist.avatarThumbnail && thumbnail) return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		getSessions(id) {
			const temp = this.sessions.find(element => element.psychologist === id);
			if (!temp) {
				return [];
			}
			return temp.sessions;
		},
		changeInput() {
			this.page = 0;
			this.searchInput = '';
			this.page = 1;
			this.visibles = [];
		},
		...mapMutations({
			setFloatingChat: 'Chat/setFloatingChat',
		}),
	},
};
</script>

<style lang="scss" scoped>
.titleColor {
	color: #525252;
}
.sticky {
	position: -webkit-sticky !important;
	position: sticky !important;
	top: 0 !important;
}
.shadowAppBar {
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}

.item {
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
	transition: transform 0.6s !important;
}

.item:hover {
	box-shadow: 0 8px 16px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
