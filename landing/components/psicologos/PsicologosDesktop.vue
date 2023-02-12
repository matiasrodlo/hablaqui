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
									:disabled="loadingMatchMaking"
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
					<v-col id="menuGender" cols="3" style="position: relative">
						<v-menu
							ref="menuGender"
							v-model="menuGender"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
							rounded
							attach="#menuGender"
							min-width="240px"
						>
							<template #activator="{ on, attrs }">
								<v-text-field
									:value="
										genderBoxes.length == 0
										? genderBoxes
										:
											genderBoxes.length == 1
											? genderList.find(element => element.value == genderBoxes[0]).text
											: `Géneros ${genderBoxes.length}`
									"
									label="Géneros"
									readonly
									:disabled="loadingMatchMaking"
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
							<v-card rounded height="150">
								<v-card-text style="height: 150px; overflow-y: scroll">
									<v-checkbox
										v-for="(element, j) in genderList"
										:key="j"
										v-model="genderBoxes"
										:value="element.value"
										:label="element.text"
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
					<v-col cols="3">
						<div id="menuPrices" style="position: relative">
							<v-menu
							ref="menuPrices"
							v-model="menuPrices"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
							rounded
							attach="#menuPrices"
							min-width="240px"
						>
							<template #activator="{ on, attrs }">
								<v-text-field
									:value="
										priceBoxes.length == 0
										? priceBoxes
										:
											priceBoxes.length == 1
											? priceList.find(element => element.value == priceBoxes[0]).text
											: `Precios ${priceBoxes.length}`
									"
									label="Precios"
									readonly
									:disabled="loadingMatchMaking"
									outlined
									dense
									class="white"
									hide-details
									:append-icon="mdiChevronDown"
									v-bind="attrs"
									@click:append="() => (menuPrices = !menuPrices)"
									v-on="on"
								></v-text-field>
							</template>
							<v-card rounded height="150">
								<v-card-text style="height: 150px; overflow-y: scroll">
									<v-checkbox
										v-for="(element, j) in priceList"
										:key="j"
										v-model="priceBoxes"
										:value="element.value"
										:label="element.text"
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
						</div>
					</v-col>
					<v-col id="menuOthers" cols="3" style="position: relative">
						<v-menu
							ref="menuOthers"
							v-model="menuOthers"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
							rounded
							attach="#menuOthers"
							min-width="240px"
						>
							<template #activator="{ on, attrs }">
								<v-text-field
									:value="
										dispoBoxes.length == 0
										? dispoBoxes
										:
											dispoBoxes.length == 1
											? dispoList.find(element => element.value == dispoBoxes[0]).text
											: `Disponibilidad ${dispoBoxes.length}`
									"
									label="Disponibilidad"
									readonly
									:disabled="loadingMatchMaking"
									outlined
									dense
									class="white"
									hide-details
									:append-icon="mdiChevronDown"
									v-bind="attrs"
									@click:append="() => (menuOthers = !menuOthers)"
									v-on="on"
								></v-text-field>
							</template>
							<v-card rounded height="150">
								<v-card-text style="height: 150px; overflow-y: scroll">
									<v-checkbox
										v-for="(element, j) in dispoList"
										:key="j"
										v-model="dispoBoxes"
										:value="element.value"
										:label="element.text"
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
										getPsychologistsBestMatch();
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
										getPsychologistsEconomicMatch();
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
										getPsychologistsAvailityMatch();
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
		<v-container v-if="psychologists.length" fluid style="max-width: 1080px" class="my-4">
			<v-row>
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
					<template v-for="(item, index) in psychologistFilter">
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
								<!--div
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
								</div-->
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
					v-if="false"
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
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

/**
 * Componente: Listado de psicologos en vista de escritorio
 */
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
			toggle: 0,
			mdiChevronDown,
			mdiAccount,
			loadingMatchMaking: false,
			menuGender: false,
			menuSpecialties: false,
			menuOthers: false,
			menuPrices: false,
			specialties: [],
			searchInput: '',
			prices: '',
			gender: [],
			others: [],
			otros: '',
			models: [],
			languages: [],
			scrollHeight: 0,
			visibles: [],
			fullcard: [],
			page: null,
			status: false,
			genderBoxes: [],
			genderList: [
						{ value: 'female', text: 'Mujer' },
						{ value: 'male', text: 'Hombre' },
						{ value: 'transgender', text: 'Transgénero' },
					],
			priceBoxes: [],
			priceList: [
						{ value: 15000, text: 'Hasta $15.000' },
						{ value: 20000, text: 'Hasta $20.000' },
						{ value: 30000, text: 'Hasta $30.000' },
						{ value: 40000, text: 'Hasta $40.000' },
					],
			dispoBoxes: [],
			dispoList: [
						{ value: ['00:00', '9:00'] , text: 'Temprano: Antes de las 9 am' },
						{ value: ['9:00', '12:00'], text: 'En la mañana: Entre 9 am y 12 pm' },
						{ value: ['12:00', '14:00'], text: 'A Medio día: Entre 12 y 2 pm' },
						{ value: ['14:00', '18:00'], text: 'En la tarde: Entre 2 y 6 pm' },
						{ value: ['18:00', '23:59'], text: 'En la noche: Después de las 6 pm' },
					],
		};
	},
	computed: {
		/**
		 * Filtra en base a lo ingresado por el usuario
		 */
    psychologistFilter(){
      let result = this.psychologists;
      // Se filtran los psicólogos por especialidades
      if (this.specialties.length !== 0)
        result = result.filter(item => {
          let flag = true;
          this.specialties.forEach(specialty => {
            if (item.specialties.includes(specialty) === false) flag = false;
          });
          return flag;
        });

      // Se filtran los psicólogos por género
      if (this.genderBoxes.length !== 0)
        result = result.filter(item => {
          return this.genderBoxes.includes(item.gender)
        });

      // Se filtran los psicólogos por precio
      if (this.priceBoxes.length !== 0)
        result = result.filter(item => Math.max(...this.priceBoxes) >= item.sessionPrices.video);

      // Se filtran los psicólogos por disponibilidad
      /*if (this.dispoBoxes.length !== 0)
        result = result.filter(item => {
          let flag = false;
          this.dispoBoxes.forEach(dispo => (item.schedule.forEach(day => {
                (day[0].forEach(hour => {
                if (dayjs(hour).isBetween(dispo[0], dispo[1], 'hour')) flag = true;
                }))})))
          return flag;
        })
       */
      return result;
    },
		...mapGetters({
			appointments: 'Appointments/appointments',
			psychologists: 'Psychologist/psychologists',
			sessions: 'Psychologist/sessionsLimit',
			matchMaking: 'Psychologist/matchMaking',
		}),
	},
	watch: {
		/**
		 * Escucha que cambio de pagina(scroll) y obtiene más sessiones
		 */
		page(value, oldValue) {
			let prev = 0;
			if (oldValue) prev = oldValue;
			const ids = this.psychologistFilter.map(item => item._id).slice(prev * 5, value * 5);
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
			this.$route.name === 'psicologos' &&
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
			if (isVisible && this.page < this.psychologistFilter.length / 5) {
				this.page += 1;
			}
		},
		/**
		 * Esto son los psicologos que se iran viendo segun el scroll
		 */
		handleVisivility(isVisible, entry, idPsychologist) {
			if (isVisible && !this.visibles.includes(idPsychologist))
				this.visibles.push(idPsychologist);
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
		 * @param {Object} psychologist
		 * @returns String con el link del avatar
		 */
		avatar(psychologist, thumbnail) {
			if (!psychologist.approveAvatar) return '';
			if (psychologist.avatarThumbnail && thumbnail) return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		/**
		 * @param {string} id del psicologo
		 * @returns Array de sesiones
		 */
		getSessions(id) {
			const temp = this.sessions.find(element => element.psychologist === id);
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
		 * @param {string} psychologist
		 */
		goChat(psychologist) {
			if (!this.$auth.$state.loggedIn) {
				this.$router.push({
					path: `/auth/?register=true&psychologist=${psychologist.username}`,
				});
			} else {
				return this.$router.push(`/${psychologist.username}/?chat=true`);
			}
		},
		async actualizarMatch(value) {
			if (this.matchMaking !== null) {
				this.loadingMatchMaking = true;
				await this.updateMatchMakig({ ...value, userId: this.$auth.user._id });
				if (this.toggle === 0) await this.getPsychologistsBestMatch();
				if (this.toggle === 1) await this.getPsychologistsEconomicMatch();
				if (this.toggle === 2) await this.getPsychologistsAvailityMatch();
				this.loadingMatchMaking = false;
			}
		},
		...mapMutations({
			setFloatingChat: 'Chat/setFloatingChat',
		}),
		...mapActions({
			updateMatchMakig: 'Psychologist/updateMatchMakig',
			getPsychologistsBestMatch: 'Psychologist/getPsychologistsBestMatch',
			getPsychologistsAvailityMatch: 'Psychologist/getPsychologistsAvailityMatch',
			getPsychologistsEconomicMatch: 'Psychologist/getPsychologistsEconomicMatch',
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
