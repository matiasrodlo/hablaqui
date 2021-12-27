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
						v-model="searchInput"
						class="white"
						dense
						outlined
						:items="itemsSearch"
						label="Busca tu psicólogo"
						:append-icon="mdiChevronDown"
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
			</v-row>
		</v-container>
		<!-- filters -->
		<client-only>
			<v-app-bar
				:color="scrollHeight > 300 ? '#ffffff' : '#f0f8ff'"
				style="z-index: 1"
				class="sticky scroll"
				:class="scrollHeight > 300 ? 'shadowAppBar' : 'elevation-0'"
			>
				<v-container fluid style="max-width: 1200px">
					<v-row>
						<v-col cols="4">
							<v-autocomplete
								id="specialties"
								v-model="specialties"
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
						</v-col>
						<v-col cols="3">
							<v-select
								id="gender"
								v-model="gender"
								class="white"
								multiple
								:items="[
									{ text: 'Mujer', value: 'female' },
									{ text: 'Hombre', value: 'male' },
									{ text: 'Transgénero', value: 'transgender' },
								]"
								:disabled="loading"
								outlined
								dense
								label="Género"
								hide-details
								@change="filterPanel"
							></v-select>
						</v-col>
						<v-col cols="3">
							<v-select
								id="price"
								v-model="gender"
								class="white"
								multiple
								:items="[
									{ text: 'Mujer', value: 'female' },
									{ text: 'Hombre', value: 'male' },
									{ text: 'Transgénero', value: 'transgender' },
								]"
								:disabled="loading"
								outlined
								dense
								label="Precios"
								hide-details
								@change="filterPanel"
							></v-select>
						</v-col>
						<v-col cols="2">
							<v-select
								id="other"
								v-model="gender"
								class="white"
								multiple
								:items="[
									{ text: 'Mujer', value: 'female' },
									{ text: 'Hombre', value: 'male' },
									{ text: 'Transgénero', value: 'transgender' },
								]"
								:disabled="loading"
								outlined
								dense
								label="Precios"
								hide-details
								@change="filterPanel"
							></v-select>
						</v-col>
					</v-row>
				</v-container>
			</v-app-bar>
		</client-only>
		<!-- pychologist -->
		<v-container fluid style="max-width: 1200px">
			<v-row>
				<v-col v-for="item in filterLevelThree" :key="item._id" cols="12">
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
										:to="{ path: `/${item.username}` }"
									>
										Quiero saber más
									</v-btn>
								</div>
							</v-col>
							<v-divider vertical class="my-4"></v-divider>
							<v-col cols="4" style="height: 350px">
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
					v-if="loading"
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
import { mdiChevronDown, mdiPlus, mdiMinus } from '@mdi/js';
import { mapGetters, mapMutations } from 'vuex';

export default {
	name: 'PsicologosDesktop',
	components: {
		CalendarPsychologist: () => import('~/components/CalendarPsychologist'),
	},
	data() {
		return {
			mdiPlus,
			mdiMinus,
			mdiChevronDown,
			view: 1,
			specialties: '',
			searchInput: '',
			gender: [],
			models: [],
			languages: [],
			scrollHeight: 0,
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
			if (psychologist.avatarThumbnail && thumbnail) return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		getSessions(id) {
			const temp = this.sessions.find(element => element.psychologist === id);
			if (!temp) {
				console.log(temp);
				return [];
			}
			return temp.sessions;
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
