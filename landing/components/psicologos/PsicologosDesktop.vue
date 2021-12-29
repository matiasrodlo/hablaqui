<template>
	<div>
		<!-- filter name -->
		<v-container fluid style="max-width: 1200px">
			<v-row>
				<v-col
					cols="12"
					tag="h1"
					class="text-left font-weight-bold text-h6 text-md-h3"
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
							filterPrice.map((item, index) => ({
								text: `${item.name} ${item.lastName && item.lastName}`,
								value: item._id,
								index,
							}))
						"
						label="Busca tu psicólogo"
						:append-icon="mdiChevronDown"
						hide-details
						:menu-props="{
							closeOnClick: true,
						}"
						clearable
						:disabled="loading"
						@change="e => (searchInput = e)"
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
		<client-only>
			<v-app-bar
				id="appbarfilter"
				:color="scrollHeight > 300 ? '#ffffff' : '#f0f8ff'"
				style="z-index: 1"
				class="sticky scroll"
				:class="scrollHeight > 300 ? 'shadowAppBar' : 'elevation-0'"
			>
				<v-container fluid style="max-width: 1200px">
					<v-row>
						<v-col cols="4">
							<div id="autocompleteSpecialties" style="position: relative">
								<v-autocomplete
									id="specialties"
									v-model="specialties"
									attach="#autocompleteSpecialties"
									class="white"
									outlined
									:items="appointments"
									item-value="value"
									label="Motivo de consulta"
									:append-icon="mdiChevronDown"
									hide-details
									dense
									clearable
									:menu-props="{
										closeOnClick: true,
										closeOnContentClick: true,
									}"
									:disabled="loading"
									@change="changeInput"
								>
									<template #no-data>
										<v-list-item>
											<v-list-item-content>
												<v-list-item-title>
													No se encontraron resultados que coincidan con
													"<strong>
														{{ specialties }}
													</strong>
													" .
												</v-list-item-title>
											</v-list-item-content>
										</v-list-item>
									</template>
								</v-autocomplete>
							</div>
						</v-col>
						<v-col id="selectgender" cols="3" style="position: relative">
							<v-menu
								ref="menuGender"
								v-model="menuGender"
								:close-on-content-click="false"
								transition="scale-transition"
								offset-y
								rounded
								attach="#selectgender"
								min-width="200px"
							>
								<template #activator="{ on, attrs }">
									<v-text-field
										:value="
											gender.length ? `Seleccionados ${gender.length}` : ''
										"
										label="Género"
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
								<v-card rounded width="200px">
									<v-card-text>
										<v-checkbox
											v-model="gender"
											value="male"
											:disabled="loading"
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
											:disabled="loading"
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
											:disabled="loading"
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
						</v-col>
						<v-col cols="3">
							<div id="selectPrices" style="position: relative">
								<v-autocomplete
									ref="menuPrices"
									v-model="prices"
									outlined
									dense
									class="white"
									attach="#selectPrices"
									clearable
									:append-icon="mdiChevronDown"
									:items="[
										{ value: '[9990, 14990]', text: '$9.990 - $14.990' },
										{ value: '[14990, 22990]', text: '$14.990 - $22.990' },
										{ value: '[22990, 29990]', text: '$22.990 - $29.990' },
										{ value: '[29900]', text: '+ $29.900' },
									]"
									label="Precios"
									hide-details
								></v-autocomplete>
							</div>
						</v-col>
						<v-col id="selectOthers" cols="2" style="position: relative">
							<v-menu
								ref="menuOthers"
								v-model="menuOthers"
								:close-on-content-click="false"
								transition="scale-transition"
								offset-y
								rounded
								attach="#selectOthers"
								min-width="200px"
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
										label="Otros"
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
								<v-card rounded width="200px">
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
										<div class="body-2 font-weight-bold mt-2">Idioma</div>
										<v-checkbox
											v-model="languages"
											value="spanish"
											:disabled="loading"
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
											:disabled="loading"
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
						</v-col>
					</v-row>
				</v-container>
			</v-app-bar>
		</client-only>
		<!-- pychologist -->
		<v-container fluid style="max-width: 1200px" class="my-4">
			<v-row>
				<v-col cols="12">
					<v-sheet class="item" style="border-radius: 15px; height: 182px">
						<v-row no-gutters align="center">
							<v-col cols="3">
								<v-img
									width="250px"
									contain
									src="https://cdn.hablaqui.cl/static/banner_comenzar.png"
									lazy-src="https://cdn.hablaqui.cl/static/banner_comenzar.png"
								></v-img>
							</v-col>
							<v-col>
								<div class="headline primary--text font-weight-bold">
									Te ayudamos a encontrar a tu psicólogo ideal
								</div>
								<div class="my-2 body-1 primary--text font-weight-regular">
									Encuentra al psicólogo que necesitas, solo responde las
									siguientes preguntas.
								</div>
								<div class="my-4">
									<v-btn rounded color="primary" class="px-8 py-2" @click="start">
										Comenzar
									</v-btn>
								</div>
							</v-col>
						</v-row>
					</v-sheet>
				</v-col>

				<v-col v-for="item in searchFilter" :key="item._id" cols="12">
					<v-card style="border-radius: 15px" height="350" class="item text-center mt-6">
						<v-row>
							<v-col
								cols="3"
								class="d-flex align-center justify-center"
								style="height: 350px"
							>
								<div class="text-center">
									<avatar
										:url="avatar(item, true)"
										:name="item.name"
										:last-name="item.lastName ? item.lastName : ''"
										size="170"
										loading-color="white"
									></avatar>
									<div
										class="text-capitalize py-4"
										style="color: #706f6f; font-size: 14px"
									>
										código {{ item.code ? item.code : '' }}
									</div>
								</div>
							</v-col>
							<v-col
								cols="5"
								style="display: flex; flex-direction: column; height: 350px"
							>
								<div style="flex: 1">
									<nuxt-link
										style="text-decoration: none"
										:to="{
											path: `/${item.username}`,
										}"
									>
										<div
											class="text-left font-weight-bold"
											style="color: #3c3c3b; font-size: 28px"
										>
											{{ item.name }}
											{{ item.lastName && item.lastName }}
										</div>
									</nuxt-link>
								</div>
								<div
									class="text-left font-weight-medium pa-2"
									style="color: #3c3c3b; font-size: 16px; flex: 1"
								>
									${{ Math.ceil(item.sessionPrices.video / 100) * 100 }}
									/ 50 min
								</div>
								<div style="flex: 1">
									<v-chip-group
										v-model="specialties"
										:next-icon="mdiPlus"
										:prev-icon="mdiMinus"
										show-arrows
									>
										<template v-for="(tag, s) in item.specialties">
											<v-chip
												:key="s"
												:value="tag"
												class="ma-2"
												small
												:color="specialties == tag ? 'primary--text' : ''"
											>
												<span>
													{{ tag }}
												</span>
											</v-chip>
										</template>
									</v-chip-group>
								</div>
								<div style="flex: 5">
									<div class="text-left" style="color: #54565a; font-size: 14px">
										{{
											item.professionalDescription.length > 210
												? item.professionalDescription
														.slice(0, 210)
														.concat('...')
												: item.professionalDescription
										}}
									</div>
								</div>
								<div style="flex: 2" class="text-left">
									<v-btn
										small
										rounded
										color="primary"
										class="px-8 py-2"
										:to="{ path: `/${item.username}` }"
									>
										Quiero saber más
									</v-btn>
								</div>
							</v-col>
							<v-divider vertical class="my-4"></v-divider>
							<v-col v-if="false" cols="4" style="height: 350px">
								<calendar-psychologist
									v-if="sessions"
									:id-psy="item._id"
									:sessions="getSessions(item._id)"
									:set-date="date => null"
								/>
							</v-col>
						</v-row>
					</v-card>
				</v-col>
				<v-col
					v-if="loading || isFiltering"
					cols="12"
					style="height: 400px"
					class="d-flex justify-center align-center"
				>
					<v-progress-circular
						size="40"
						indeterminate
						color="primary"
					></v-progress-circular>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import { mdiChevronDown, mdiPlus, mdiMinus, mdiCloseCircle } from '@mdi/js';
import { mapGetters, mapMutations } from 'vuex';

export default {
	name: 'PsicologosDesktop',
	components: {
		CalendarPsychologist: () => import('~/components/CalendarPsychologist'),
	},
	data() {
		return {
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
			isFiltering: false,
		};
	},
	computed: {
		loading() {
			return !this.psychologists.length;
		},
		/**
		 * Filter search box
		 * Filtra en base a los resultados del panel
		 */
		searchFilter() {
			return this.filterPrice.filter(item => {
				let result = item;
				if (this.searchInput !== null)
					result = result._id.includes(this.searchInput) && result;
				return result;
			});
		},
		/**
		 * Filter prices
		 */
		filterPrice(item) {
			if (!this.prices) return this.superFilter;
			return this.superFilter.filter(item => {
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
		superFilter() {
			if (
				this.gender.length ||
				this.models.length ||
				this.languages.length ||
				this.specialties
			) {
				return this.psychologists.filter(item => {
					const trans = item.isTrans && 'transgender';
					const gender = [item.gender];
					trans && gender.push(trans);

					return (
						gender.some(el => this.gender.includes(el)) ||
						item.models.some(el => this.models.includes(el)) ||
						item.languages.some(el => this.languages.includes(el)) ||
						item.specialties.includes(this.specialties)
					);
				});
			}

			return this.psychologists;
		},
		...mapGetters({
			appointments: 'Appointments/appointments',
			psychologists: 'Psychologist/psychologistsMarketPlace',
			sessions: 'Psychologist/sessionsFormattedAll',
		}),
	},
	asyncComputed: {},
	beforeUpdate() {
		this.$emit('setIsFiltering', true);
	},
	updated() {
		this.$emit('setIsFiltering', false);
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
		onScroll(e) {
			this.scrollHeight = window.top.scrollY; /* or: e.target.documentElement.scrollTop */
		},
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
			this.searchInput = '';
		},
		...mapMutations({
			setFloatingChat: 'Chat/setFloatingChat',
		}),
	},
};
</script>

<style lang="scss" scoped>
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
