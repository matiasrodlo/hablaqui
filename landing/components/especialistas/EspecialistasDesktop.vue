<template>
	<div>
		<!-- filters -->
		<v-app-bar
			id="appbarfilter"
			:color="scrollHeight > 300 ? '#ffffff' : '#f0f8ff'"
			style="z-index: 1"
			class="sticky scroll"
			height="120"
			:class="scrollHeight > 300 ? 'shadowAppBar' : 'elevation-0'"
		>
			<v-container fluid style="max-width: 1080px">
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
										:disabled="loadingSpecialist"
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
										:disabled="loadingSpecialist"
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
										:disabled="loadingSpecialist"
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
									{ value: 15000, text: 'Hasta $15.000' },
									{ value: 20000, text: 'Hasta $20.000' },
									{ value: 30000, text: 'Hasta $30.000' },
									{ value: 40000, text: 'Hasta $40.000' },
								]"
								label="Precios"
								hide-details
								@change="e => actualizarMatch({ price: e })"
							></v-autocomplete>
						</div>
					</v-col>
					<v-col id="selectOthers" cols="3" style="position: relative">
						<v-autocomplete
							ref="menuOthers"
							outlined
							dense
							class="white"
							attach="#selectOthers"
							clearable
							:append-icon="mdiChevronDown"
							:items="[
								{ value: 'early', text: 'Temprano: Antes de las 9 am' },
								{ value: 'morning', text: 'En la mañana: Entre 9 am y 12 pm' },
								{ value: 'midday', text: 'A Medio día: Entre 12 y 2 pm' },
								{ value: 'afternoon', text: 'En la tarde: Entre 2 y 6 pm' },
								{ value: 'night', text: 'En la noche: Después de las 6 pm' },
							]"
							label="Disponibilidad"
							hide-details
							@change="e => actualizarMatch({ schedule: e })"
						></v-autocomplete>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="4">
						<div style="border: 1px solid #e0e0e0; cursor: pointer" class="rounded-lg">
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
						<div style="border: 1px solid #e0e0e0; cursor: pointer" class="rounded-lg">
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
						<div style="border: 1px solid #e0e0e0; cursor: pointer" class="rounded-lg">
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
			</v-container>
		</v-app-bar>
		<!-- pychologist -->
		<v-container v-if="specialists.length" fluid style="max-width: 1080px" class="my-4">
			<v-row>
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
												path: `/${item.username}`,
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
														path: `/${item.username}`,
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
														path: `/${item.username}`,
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
													:to="{ path: `/${item.username}` }"
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
											<calendar-specialist
												:id-spec="item._id"
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
					v-if="specialists.length && !filterLevelThree.length"
					cols="12"
					class="title primary--text"
				>
					No se encontraron coincidencias
				</v-col>
			</v-row>
		</v-container>
		<!-- loader -->
		<v-container v-else fluid style="max-width: 1080px">
			<v-col v-for="c in 2" :key="c" cols="12" class="my-16">
				<v-skeleton-loader type="image" />
			</v-col>
		</v-container>
		<!-- scroll infinito(al llegar aqui se enejuta la funcion) -->
		<div v-observe-visibility="scrollInfinity" />
	</div>
</template>

<script>
import { mdiChevronDown, mdiAccount } from '@mdi/js';
import { mapGetters, mapMutations, mapActions } from 'vuex';

/**
 * Componente: Listado de especialistas en vista de escritorio
 */
export default {
	name: 'EspecialistasDesktop',
	components: {
		CalendarSpecialist: () => import('~/components/CalendarSpecialist'),
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
			toggle: null,
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
			if (this.toggle) {
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
				!this.status
			)
				return result;
			// si quiere ver por especialista online, filtramos estos
			if (this.status) result = result.filter(item => item.inmediateAttention.activated);
			// filtramos los especialista segun el genero marcados
			if (this.gender.length)
				result = result.filter(item => {
					const trans = item.isTrans && 'transgender';
					const gender = [item.gender];
					trans && gender.push(trans);
					return gender.some(el => this.gender.some(g => g === el));
				});
			// filtramos los especialistas segun los models marcados
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
		}),
	},
	watch: {
		/**
		 * Escucha que cambio de pagina(scroll) y obtiene más sessiones
		 */
		page(value, oldValue) {
			let prev = 0;
			if (oldValue) prev = oldValue;
			const ids = this.filterLevelThree.map(item => item._id).slice(prev * 5, value * 5);
			this.getSessionsLimit(ids);
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
			if (isVisible && this.page < this.filterLevelThree.length / 5) {
				this.page += 1;
			}
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
		goEvaluation() {
			this.$router.push({ name: 'evaluacion' });
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
			await this.updateMatchMakig({ ...value, userId: this.$auth.user._id });
			if (this.toggle === 0) await this.getSpecialistsBestMatch();
			if (this.toggle === 1) await this.getSpecialistsEconomicMatch();
			if (this.toggle === 2) await this.getSpecialistsAvailityMatch();
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
.textbtn {
	color: #54565a;
}
</style>
