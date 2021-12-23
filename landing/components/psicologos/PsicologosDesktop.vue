<template>
	<div style="height: 3000px">
		<v-container>
			<v-row>
				<v-col
					cols="12"
					tag="h1"
					class="text-left font-weight-bold text-h6 text-md-h3 text--secondary"
				>
					Encuentra a tu psicólogo online
				</v-col>
				<v-col cols="12" sm="6">
					<v-autocomplete
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

		<v-app-bar
			:color="scrollHeight > 300 ? '#ffffff' : '#f0f8ff'"
			class="sticky scroll"
			:class="scrollHeight > 300 ? 'elevation-6' : 'elevation-0'"
		>
			<v-container>
				<v-row>
					<v-col cols="4">
						<v-autocomplete
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
					<v-col cols="3">
						<v-select
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
					<v-col cols="2"> {{ scrollHeight }} </v-col>
				</v-row>
			</v-container>
		</v-app-bar>
	</div>
</template>

<script>
import { mdiChevronDown } from '@mdi/js';
import { mapGetters, mapMutations } from 'vuex';

export default {
	name: 'PsicologosDesktop',
	data() {
		return {
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
</style>
