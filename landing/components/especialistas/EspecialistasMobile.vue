<template>
	<div>
		<!-- filter name -->
		<!-- 
		<v-container fluid style="max-width: 1200px">
			<v-row>
				<v-col
					v-if="$route.name === 'especialistas'"
					cols="12"
					tag="h1"
					class="text-left font-weight-bold text-h5"
					style="color: #54565a"
				>
					Encuentra a tu especialista online
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
						label="Busca un especialista sin salir de casa"
						:append-icon="mdiChevronDown"
						hide-details
						:menu-props="{
							closeOnClick: true,
						}"
						clearable
						:disabled="loadingSpecialist"
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
		</v-container> -->
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
						@click:append="() => (showFilters = !showFilters)"
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
									<v-menu
										v-model="menuSpecialties"
										:close-on-content-click="false"
										transition="scale-transition"
										offset-y
										rounded
									>
										<template #activator="{ on, attrs }">
											<v-text-field
												:value="
													specialties.length > 1
														? `Especialidades ${specialties.length}`
														: specialties
												"
												readonly
												outlined
												dense
												class="white"
												hide-details
												:append-icon="mdiChevronDown"
												v-bind="attrs"
												@click:append="
													() => (menuSpecialties = !menuSpecialties)
												"
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
								</v-card-text>
								<!-- ocultado por peticion de daniel -->
								<!-- <v-card-text class="pa-1">
									<h4 class="titleColor font-weight-bold body-1 ml-1">Estado</h4>
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
								</v-card-text> -->
								<v-card-text class="pa-1">
									<h4 class="titleColor font-weight-bold body-1 ml-1">Género</h4>
									<v-autocomplete
										ref="genders"
										v-model="gender"
										outlined
										dense
										class="white"
										:append-icon="mdiChevronDown"
										:items="[
											{ value: 'female', text: 'Mujer' },
											{ value: 'male', text: 'Hombre' },
											{ value: 'transgender', text: 'Transgénero' },
										]"
										hide-details
										@change="e => actualizarMatch({ gender: e })"
									></v-autocomplete>
								</v-card-text>
								<v-card-text class="pa-1">
									<h4 class="titleColor font-weight-bold body-1 ml-1">Precios</h4>
									<v-autocomplete
										v-model="prices"
										outlined
										dense
										class="white"
										:append-icon="mdiChevronDown"
										:items="[
											{ value: 15000, text: 'Hasta $15.000' },
											{ value: 20000, text: 'Hasta $20.000' },
											{ value: 30000, text: 'Hasta $30.000' },
											{ value: 40000, text: 'Hasta $40.000' },
										]"
										:menu-props="{
											closeOnClick: true,
										}"
										hide-details
										@change="e => actualizarMatch({ price: e })"
									></v-autocomplete>
								</v-card-text>
								<v-card-text class="pa-1">
									<h4 class="titleColor font-weight-bold body-1 ml-1">
										Disponibilidad
									</h4>
									<v-autocomplete
										ref="menuOthers"
										v-model="otros"
										outlined
										dense
										class="white"
										:append-icon="mdiChevronDown"
										:items="[
											{ value: 'early', text: 'Temprano: Antes de las 9 am' },
											{
												value: 'morning',
												text: 'En la mañana: Entre 9 am y 12 pm',
											},
											{
												value: 'midday',
												text: 'A Medio día: Entre 12 y 2 pm',
											},
											{
												value: 'afternoon',
												text: 'En la tarde: Entre 2 y 6 pm',
											},
											{
												value: 'night',
												text: 'En la noche: Después de las 6 pm',
											},
										]"
										label="Disponibilidad"
										hide-details
										@change="e => actualizarMatch({ schedule: e })"
									></v-autocomplete>
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
											specialties = [];
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
		<v-container v-if="specialists.length" fluid style="max-width: 600px" class="my-4">
			<v-row>
				<v-col cols="12">
					<v-sheet class="item" style="border-radius: 15px">
						<!-- <v-row>
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
									class="mx-auto my-3 text-center title primary--text font-weight-bold"
								>
									Te ayudamos a encontrar a tu especialista ideal
								</div>
								<div
									style="max-width: 320px"
									class="mx-auto text-center my-3 body-1 primary--text font-weight-regular"
								>
									Encuentra al especialista que necesitas, solo responde las
									siguientes preguntas.
								</div>
								<div class="text-center my-4">
									<v-btn rounded color="primary" class="px-8 py-2" @click="start">
										Comenzar
									</v-btn>
								</div>
							</v-col>
						</v-row> -->
						<v-row class="px-4">
							<v-col cols="12" md="4">
								<div
									style="border: 1px solid #e0e0e0; cursor: pointer"
									class="rounded-lg"
								>
									<div
										class="text-center py-2 white body-2 rounded-lg"
										:class="toggle === 0 ? 'primary--text' : 'textbtn'"
										@click="
											() => {
												toggle = 0;
												getSpecialistsBestMatch();
											}
										"
									>
										Recomendados
									</div>
								</div>
							</v-col>
							<v-col cols="12" md="4">
								<div
									style="border: 1px solid #e0e0e0; cursor: pointer"
									class="rounded-lg"
								>
									<div
										class="text-center white py-2 rounded-lg body-2"
										:class="toggle === 1 ? 'primary--text' : 'textbtn'"
										@click="
											() => {
												toggle = 1;
												getSpecialistsEconomicMatch();
											}
										"
									>
										Economico
									</div>
								</div>
							</v-col>
							<v-col cols="12" md="4">
								<div
									style="border: 1px solid #e0e0e0; cursor: pointer"
									class="rounded-lg"
								>
									<div
										class="text-center white py-2 rounded-lg body-2"
										:class="toggle === 2 ? 'primary--text' : 'textbtn'"
										@click="
											() => {
												toggle = 2;
												getSpecialistsAvailityMatch();
											}
										"
									>
										Disponibilidad
									</div>
								</div>
							</v-col>
						</v-row>
					</v-sheet>
				</v-col>
				<v-col
					v-if="loadingSpecialist"
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
								style="border-radius: 15px; position: relative"
								class="item text-center mt-6"
							>
								<!-- ocultado por peticion de daniel -->
								<!-- <div
									v-if="item.inmediateAttention.activated"
									style="position: absolute; bottom: 0; left: 0"
								>
									<div
										style="background-color: #04c396"
										class="
											white--text
											rounded-tr-xl rounded-bl-lg
											pr-4
											pl-6
											caption
										"
									>
										¡Disponible para atender ahora!
									</div>
								</div> -->
								<div
									style="
										width: 50px;
										height: 50px;
										position: absolute;
										top: 10px;
										right: 20px;
									"
								>
									<div
										v-if="item.rating > 0"
										class="d-flex justify-space-between align-center info rounded-l-lg pa-2"
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
										>
											{{ item.rating.toFixed(1) }}
										</span>
									</div>
								</div>
								<v-card-title class="pt-8">
									<v-row>
										<v-col
											cols="4"
											sm="3"
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
														size="110"
														loading-color="white"
													></avatar>
												</nuxt-link>
											</div>
										</v-col>
										<v-col cols="8" sm="9">
											<div class="mt-4">
												<div
													class="text-left font-weight-bold body-1"
													style="color: #3c3c3b"
												>
													<nuxt-link
														style="text-decoration: none"
														:to="{
															path: `/${item.username}`,
														}"
													>
														{{ item.name }}
														{{ item.lastName && item.lastName }}
													</nuxt-link>
													<v-btn icon @click.stop="() => goChat(item)">
														<icon :icon="mdiChat" />
													</v-btn>
												</div>
											</div>
											<nuxt-link
												style="text-decoration: none"
												:to="{
													path: `/${item.username}`,
												}"
											>
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
														Math.ceil(item.sessionPrices.video / 100) *
														100
													}}
													/ 50 min
												</div>
											</nuxt-link>
										</v-col>
									</v-row>
								</v-card-title>
								<v-card-text>
									<v-row>
										<v-col cols="12">
											<div>
												<v-chip-group :show-arrows="false">
													<template v-for="(tag, s) in item.specialties">
														<v-chip
															:key="s"
															:value="tag"
															class="ma-1"
															x-small
														>
															<span>
																{{ tag }}
															</span>
														</v-chip>
													</template>
												</v-chip-group>
											</div>
											<nuxt-link
												style="text-decoration: none"
												:to="{
													path: `/${item.username}`,
												}"
											>
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
											</nuxt-link>
											<mini-calendar
												:id-spec="item._id"
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
					v-if="specialists.length && !filterLevelThree.length"
					cols="12"
					class="title primary--text"
				>
					No se encontraron coincidencias
				</v-col>
			</v-row>
		</v-container>
		<v-container v-else fluid style="max-width: 600px">
			<v-col v-for="c in 2" :key="c" cols="12" class="my-16">
				<v-skeleton-loader type="image" />
			</v-col>
		</v-container>
		<div v-observe-visibility="scrollInfinity" />
	</div>
</template>

<script>
import { mdiChevronDown, mdiCloseCircle, mdiAccount, mdiChat } from '@mdi/js';
import { mapGetters, mapMutations, mapActions } from 'vuex';
/**
 * Componente: Listado de especialistas en vista de mobile
 */
export default {
	name: 'EspecialistasMobile',
	components: {
		MiniCalendar: () => import('~/components/especialistas/MiniCalendar'),
		Icon: () => import('~/components/Icon'),
	},
	props: {
		loadingSpecialist: {
			type: Boolean,
		},
		getSessionsLimit: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			toggle: 0,
			mdiChat,
			showFilters: false,
			mdiCloseCircle,
			mdiChevronDown,
			mdiAccount,
			status: false,
			menuGender: false,
			menuSpecialties: false,
			menuOthers: false,
			specialties: [],
			searchInput: '',
			prices: '',
			otros: '',
			gender: [],
			others: [],
			models: [],
			languages: [],
			scrollHeight: 0,
			visibles: [],
			fullcard: [],
			page: null,
		};
	},
	computed: {
		/**
		 * Filter search box
		 * Filtra en base a los resultados del panel
		 * Este es el filtro final que se utiliza para iterar en el template
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
		 * Filtro en base a los precios de los especialistas
		 */
		filterLevelTwo(item) {
			if (this.toggle == null || this.matchMaking == null) {
				if (!this.prices) return this.filterLevelOne;
				return this.filterLevelOne.filter(item => {
					const prices = JSON.parse(this.prices);
					if (prices.length > 1)
						return (
							prices[0] < item.sessionPrices.video &&
							prices[1] > item.sessionPrices.video
						);
					else return prices[0] < item.sessionPrices.video;
				});
			} else return this.filterLevelOne;
		},
		/**
		 * items for search box
		 * Primer filtro de especialistas en base a:
		 * marketplaceVisibility, inmediateAttention, gender, models, status, languages, pecialties
		 */
		filterLevelOne() {
			// fitro de marketplaceVisibility
			let result = this.specialists.filter(item => item.preferences.marketplaceVisibility);
			// si no hay genero , models, laguajes o status marcado entonces restorna el resultado
			if (
				!this.gender.length &&
				!this.models.length &&
				!this.languages.length &&
				!this.specialties.length &&
				!this.status
			)
				return result;
			// si quiere ver por especialista online, filtramos estos
			if (this.status) result = result.filter(item => item.inmediateAttention.activated);
			// if (this.gender.length)
			// 	result = result.filter(item => {
			// 		const trans = item.isTrans && 'transgender';
			// 		const gender = [item.gender];
			// 		trans && gender.push(trans);
			// 		return gender.some(el => this.gender.some(g => g === el));
			// 	});
			if (this.models.length)
				result = result.filter(item => item.models.some(el => this.models.includes(el)));
			// filtramos segun los leguajes que habla el especialista
			if (this.languages.length)
				result = result.filter(item =>
					item.languages.some(el => this.languages.some(languages => languages === el))
				);
			// filtramos segun las specialties
			if (this.specialties.length) {
				result = result.filter(item =>
					item.specialties.some(el => this.specialties.includes(el))
				);
			}

			return result;
		},
		...mapGetters({
			appointments: 'Appointments/appointments',
			specialists: 'Specialist/specialistsMarketPlace',
			sessions: 'Specialist/sessionsLimit',
			matchMaking: 'Specialist/matchMaking',
		}),
	},
	watch: {
		/**
		 * Escucha que cambio de pagina(scroll) y obtiene más sessiones
		 */
		page(value, oldValue) {
			let prev = 0;
			if (oldValue) prev = oldValue;
			const ids = this.filterLevelThree.map(item => item._id).slice(prev * 10, value * 10);
			this.getSessionsLimit(ids);
		},
		matchMaking(newVal) {
			if (newVal) {
				this.specialties = newVal.themes;
				this.gender = newVal.gender;
				this.prices = newVal.price;
				this.otros = newVal.schedule;
			}
		},
		menuSpecialties(newVal) {
			if (!newVal) {
				this.actualizarMatch({ themes: this.specialties });
			}
		},
	},
	created() {
		// Cuando venimos de otra ruta con el chat abierto lo cerramos
		this.setFloatingChat(false);
		//  Limpia la query url cuando viene desde mercadopago
		if (
			this.$route.name === 'especialistas' &&
			JSON.stringify(this.$route.params) !== JSON.stringify({})
		)
			this.$router.replace({ query: null });
	},
	mounted() {
		// Cuando se monta el componente activamos el listener que ejecuta la funcion onscroll
		window.addEventListener('scroll', this.onScroll);
	},
	beforeDestroy() {
		// Cuando salimos de el componente removemos el listener que ejecuta la funcion onscroll
		window.removeEventListener('scroll', this.onScroll);
	},
	methods: {
		/**
		 * Cambia aumenta de pagina con el scroll
		 */
		scrollInfinity(isVisible) {
			if (isVisible && this.page < this.filterLevelThree.length / 10) this.page += 1;
		},
		/**
		 * Esto son los especialistas que se iran viendo segun el scroll
		 */
		handleVisivility(isVisible, entry, idSpecialist) {
			if (isVisible && !this.visibles.includes(idSpecialist))
				this.visibles.push(idSpecialist);
		},
		/**
		 * Al ejecutar la funcion guarda en scrollHeight la distancion en ese momento que tiene de scroll
		 */
		onScroll(e) {
			this.scrollHeight = window.top.scrollY; /* or: e.target.documentElement.scrollTop */
		},
		/**
		 * Ir a la ruta de evaluacion
		 */
		start() {
			if (this.$auth.$state.loggedIn) this.$router.push({ name: 'evaluacion' });
			else this.$router.push('/auth/?register=true&from=spec');
		},
		/**
		 * Busca el src del avatar
		 * @param {boolean} thumbnail
		 * @param {Object} specialist
		 * @returns String con el link del avatar
		 */
		avatar(specialist, thumbnail) {
			if (!specialist.approveAvatar) return '';
			if (specialist.avatarThumbnail && thumbnail) return specialist.avatarThumbnail;
			if (specialist.avatar) return specialist.avatar;
			return '';
		},
		/**
		 * @param {string} id del especialista
		 * @returns Array de sesiones
		 */
		getSessions(id) {
			const temp = this.sessions.find(element => element.specialist === id);
			if (!temp) {
				return [];
			}
			return temp.sessions;
		},
		/**
		 * Reestablece valores
		 */
		changeInput() {
			this.page = 0;
			this.searchInput = '';
			this.page = 1;
			this.visibles = [];
		},
		/**
		 * si no esta logeado lo envia a registro, si no lo envia al perfil y abre el chat
		 * @param {string} specialist
		 */
		goChat(specialist) {
			if (!this.$auth.$state.loggedIn) {
				this.$router.push({
					path: `/auth/?register=true&specialist=${specialist.username}`,
				});
			} else {
				return this.$router.push(`/${specialist.username}/?chat=true`);
			}
		},
		async actualizarMatch(value) {
			if (this.matchMaking !== null) {
				await this.updateMatchMakig({ ...value, userId: this.$auth.user._id });
				if (this.toggle === 0) await this.getSpecialistsBestMatch();
				if (this.toggle === 1) await this.getSpecialistsEconomicMatch();
				if (this.toggle === 2) await this.getSpecialistsAvailityMatch();
				this.showFilters = false;
			}
		},
		...mapMutations({
			setFloatingChat: 'Chat/setFloatingChat',
		}),
		...mapActions({
			updateMatchMakig: 'Specialist/updateMatchMakig',
			getSpecialistsBestMatch: 'Specialist/getSpecialistsBestMatch',
			getSpecialistsAvailityMatch: 'Specialist/getSpecialistsAvailityMatch',
			getSpecialistsEconomicMatch: 'Specialist/getSpecialistsEconomicMatch',
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
