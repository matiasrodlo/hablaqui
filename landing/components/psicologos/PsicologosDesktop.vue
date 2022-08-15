<template>
	<div>
		<!-- filter name -->
		<v-container fluid style="max-width: 1200px">
			<v-row>
				<v-col
					v-if="$route.name === 'psicologos'"
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
							filterLevelTwo.map((item, index) => ({
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
		<v-app-bar
			id="appbarfilter"
			:color="scrollHeight > 300 ? '#ffffff' : '#f0f8ff'"
			style="z-index: 1"
			class="sticky scroll"
			:class="scrollHeight > 300 ? 'shadowAppBar' : 'elevation-0'"
		>
			<v-container fluid style="max-width: 1200px">
				<v-row>
					<v-col id="menuSpecialties" cols="3">
						<v-menu
							ref="menuSpecialties"
							v-model="menuSpecialties"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
							rounded
							attach="#menuSpecialties"
							min-width="200px"
						>
							<template #activator="{ on, attrs }">
								<v-text-field
									:value="
										specialties.length > 1
											? `Especialidades ${specialties.length}`
											: specialties
									"
									label="Motivo de consulta"
									readonly
									outlined
									dense
									class="white"
									hide-details
									:append-icon="mdiChevronDown"
									v-bind="attrs"
									@click:append="() => (menuSpecialties = !menuSpecialties)"
									v-on="on"
								></v-text-field>
							</template>
							<v-card rounded height="300">
								<v-card-text style="height: 300px; overflow-y: scroll">
									<v-checkbox
										v-for="(element, j) in appointments"
										:key="j"
										v-model="specialties"
										:value="element"
										:label="element"
										class="py-2"
										hide-details
										@change="changeInput"
									>
										<template #label="{ item }">
											<span class="caption">{{ item }}</span>
										</template>
									</v-checkbox>
								</v-card-text>
							</v-card>
						</v-menu>
					</v-col>
					<!-- ocultado por peticion de daniel -->
					<!-- <v-col id="selectStatus" cols="2" style="position: relative">
						<div
							class="pointer"
							@click="
								() => {
									status = !status;
									changeInput();
								}
							"
						>
							<v-text-field
								disabled
								outlined
								readonly
								style="border-color: #04c396"
								hide-details
								dense
								class="white"
								value="Online"
							>
								<template #prepend-inner>
									<div>
										<icon
											size="25px"
											:color="status ? '#04c396' : '#54565a'"
											:icon="mdiAccount"
										/>
									</div>
								</template>
							</v-text-field>
						</div>
					</v-col> -->
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
									:value="gender.length ? `Géneros·${gender.length}` : ''"
									label="Género"
									readonly
									outlined
									dense
									class="white"
									hide-details
									:append-icon="mdiChevronDown"
									v-bind="attrs"
									@click:append="() => (menuGender = !menuGender)"
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
					<v-col id="selectOthers" cols="3" style="position: relative">
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
											? `Otros·${models.length + languages.length}`
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
									@click:append="() => (menuOthers = !menuOthers)"
									v-on="on"
								>
								</v-text-field>
							</template>
							<v-card rounded width="200px">
								<v-card-text
									><div class="body-2 font-weight-bold">Modelo terapéuticos</div>
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
					</v-col>
				</v-row>
			</v-container>
		</v-app-bar>
		<!-- pychologist -->
		<v-container v-if="psychologists.length" fluid style="max-width: 1200px" class="my-4">
			<v-row>
				<v-col cols="12">
					<v-sheet class="item" style="border-radius: 15px; height: 182px">
						<v-row no-gutters align="center" style="height: 182px">
							<v-col cols="3">
								<v-img
									width="250px"
									contain
									src="https://cdn.hablaqui.cl/static/banner_comenzar.png"
									lazy-src="https://cdn.hablaqui.cl/static/banner_comenzar.png"
								></v-img>
							</v-col>
							<v-col class="pl-4">
								<div class="text-h5 primary--text font-weight-bold">
									Te ayudamos a encontrar a tu psicólogo ideal
								</div>
								<div class="my-2 text-h6 primary--text font-weight-regular">
									Encuentra al psicólogo que necesitas, solo responde las
									siguientes preguntas.
								</div>
								<div class="my-4">
									<v-btn
										rounded
										color="primary"
										class="px-8 py-2"
										@click="goEvaluation"
									>
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
						<v-col v-if="5 * page > index" :key="item._id" cols="12">
							<v-card
								v-observe-visibility="{
									callback: (isVisible, entry) =>
										handleVisivility(isVisible, entry, item._id),
								}"
								style="border-radius: 15px"
								:height="fullcard.includes(item._id) ? '100%' : '300px'"
								class="item text-center mt-6"
							>
								<div
									v-if="item.rating > 0"
									style="position: absolute; top: 30px; left: 0"
								>
									<div
										class="
											d-flex
											justify-space-between
											align-center
											info
											rounded-r-lg
											pa-2
										"
										style="
											background-color: rgba(0, 121, 255, 0.23) !important;
											width: 70px;
										"
									>
										<v-img
											style="width: 20px; height: 20px"
											contain
											src="https://cdn.hablaqui.cl/static/start-2.png"
											lazy-src="https://cdn.hablaqui.cl/static/start-2.png"
										></v-img>
										<span
											class="body-1"
											style="width: 30px; height: 20px; color: #484848"
											>{{ item.rating.toFixed(1) }}</span
										>
									</div>
								</div>
								<!-- ocultado por peticion de daniel -->
								<!-- <div
									v-if="item.inmediateAttention.activated"
									style="position: absolute; top: 0; right: 0"
								>
									<div
										style="background-color: #04c396"
										class="
											white--text
											rounded-bl-xl rounded-tr-lg
											pr-4
											pl-6
											caption
										"
									>
										¡Disponible para atender ahora!
									</div>
								</div> -->
								<v-row>
									<v-col
										cols="3"
										style="height: 300px"
										class="d-flex align-center justify-center"
									>
										<nuxt-link
											style="text-decoration: none"
											:to="{
												path: `/${item.username}/`,
											}"
										>
											<div class="text-center">
												<avatar
													:url="avatar(item, true)"
													:name="item.name"
													:last-name="item.lastName ? item.lastName : ''"
													size="160"
													loading-color="white"
												></avatar>
												<div
													class="text-capitalize py-4"
													style="color: #706f6f; font-size: 14px"
												>
													código {{ item.code ? item.code : '' }}
												</div>
											</div>
										</nuxt-link>
									</v-col>
									<v-col cols="5" style="height: 300px">
										<div
											style="height: 260px; flex-direction: column"
											class="d-flex justify-center"
										>
											<div style="flex: 0">
												<nuxt-link
													style="text-decoration: none"
													:to="{
														path: `/${item.username}/`,
													}"
												>
													<div
														class="pt-2 text-left font-weight-bold"
														style="color: #3c3c3b; font-size: 28px"
													>
														{{ item.name }}
														{{ item.lastName && item.lastName }}
													</div>
													<div
														class="text-left font-weight-medium pa-2"
														style="color: #3c3c3b; font-size: 16px"
													>
														${{
															Math.ceil(
																item.sessionPrices.video / 100
															) * 100
														}}
														/ 50 min
													</div>
												</nuxt-link>
											</div>
											<div style="flex: 1">
												<v-chip-group show-arrows>
													<template v-for="(tag, s) in item.specialties">
														<v-chip
															:key="s"
															:value="tag"
															class="ma-2"
															small
														>
															<span>
																{{ tag }}
															</span>
														</v-chip>
													</template>
												</v-chip-group>
												<nuxt-link
													style="text-decoration: none"
													:to="{
														path: `/${item.username}/`,
													}"
												>
													<div
														class="text-left"
														style="color: #54565a; font-size: 14px"
													>
														{{
															item.professionalDescription.length >
															210
																? item.professionalDescription
																		.slice(0, 210)
																		.concat('...')
																: item.professionalDescription
														}}
													</div>
												</nuxt-link>
											</div>
											<div style="flex: 0" class="text-left">
												<v-btn
													small
													rounded
													color="primary"
													class="px-8 py-2"
													:to="{ path: `/${item.username}/` }"
												>
													Quiero saber más
												</v-btn>
												<v-btn
													v-if="
														!$auth.$state.loggedIn ||
														$auth.$state.user.role === 'user'
													"
													small
													rounded
													color="#56b5fc"
													dark
													class="px-4 py-2"
													@click="() => goChat(item)"
												>
													Enviar mensajes
												</v-btn>
											</div>
										</div>
									</v-col>
									<v-divider vertical class="my-4"></v-divider>
									<v-col cols="4">
										<template v-if="visibles.includes(item._id)">
											<calendar-psychologist
												:id-psy="item._id"
												:username="item.username"
												:sessions="getSessions(item._id)"
												:callback="date => null"
												:set-full-card="id => fullcard.push(id)"
												:set-minimal-card="
													id => fullcard.filter(id => item._id != id)
												"
											/>
										</template>
										<template v-else>
											<div
												class="
													primary--text
													caption
													font-weight-bold
													d-flex
													justify-center
													align-center
												"
												style="height: 300px"
											>
												Cargando...
											</div>
										</template>
									</v-col>
								</v-row>
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
		<v-container v-else fluid style="max-width: 1200px">
			<v-col v-for="c in 2" :key="c" cols="12" class="my-16">
				<v-skeleton-loader type="image" />
			</v-col>
		</v-container>
		<div v-observe-visibility="scrollInfinity" />
	</div>
</template>

<script>
import { mdiChevronDown, mdiAccount } from '@mdi/js';
import { mapGetters, mapMutations } from 'vuex';

export default {
	name: 'PsicologosDesktop',
	components: {
		CalendarPsychologist: () => import('~/components/CalendarPsychologist'),
	},
	props: {
		loadingPsychologist: {
			type: Boolean,
		},
		getSessionsLimit: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			mdiChevronDown,
			mdiAccount,
			menuGender: false,
			menuSpecialties: false,
			menuOthers: false,
			menuPrices: false,
			specialties: [],
			searchInput: '',
			prices: '',
			gender: [],
			others: [],
			models: [],
			languages: [],
			scrollHeight: 0,
			visibles: [],
			fullcard: [],
			page: null,
			status: false,
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
			if (
				!this.gender.length &&
				!this.models.length &&
				!this.languages.length &&
				!this.status
			)
				return result;
			if (this.status) result = result.filter(item => item.inmediateAttention.activated);
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
			if (this.specialties.length) {
				result = result.filter(item =>
					item.specialties.some(el => this.specialties.includes(el))
				);
			}

			return result;
		},
		...mapGetters({
			appointments: 'Appointments/appointments',
			psychologists: 'Psychologist/psychologistsMarketPlace',
			sessions: 'Psychologist/sessionsLimit',
		}),
	},
	watch: {
		page(value, oldValue) {
			let prev = 0;
			if (oldValue) prev = oldValue;
			const ids = this.filterLevelThree.map(item => item._id).slice(prev * 5, value * 5);
			this.getSessionsLimit(ids);
		},
	},
	created() {
		this.setFloatingChat(false);
		//  Limpia la query url cuando viene desde mercadopago
		if (
			this.$route.name === 'psicologos' &&
			JSON.stringify(this.$route.params) !== JSON.stringify({})
		)
			this.$router.replace({ query: null });
	},
	mounted() {
		window.addEventListener('scroll', this.onScroll);
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.onScroll);
	},
	methods: {
		scrollInfinity(isVisible) {
			if (isVisible && this.page < this.filterLevelThree.length / 5) {
				this.page += 1;
			}
		},
		handleVisivility(isVisible, entry, idPsychologist) {
			if (isVisible && !this.visibles.includes(idPsychologist))
				this.visibles.push(idPsychologist);
		},
		onScroll(e) {
			this.scrollHeight = window.top.scrollY; /* or: e.target.documentElement.scrollTop */
		},
		goEvaluation() {
			if (this.$auth.$state.loggedIn) this.$router.push({ name: 'evaluacion' });
			else this.$router.push('/auth/?register=true&from=psy');
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
		goChat(psychologist) {
			if (!this.$auth.$state.loggedIn) {
				this.$router.push({
					path: `/auth/?register=true&psychologist=${psychologist.username}`,
				});
			} else {
				return this.$router.push(`/${psychologist.username}/?chat=true`);
			}
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
