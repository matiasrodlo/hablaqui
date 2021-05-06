<template>
	<v-container>
		<v-row justify="space-between" align="center">
			<v-col class="text-left font-weight-bold text-h6 text-md-h3 text--secondary">
				{{ $route.meta.title }}
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" md="3">
				<v-card style="border-radius:15px" outlined>
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
					<v-card-text>
						<v-row>
							<v-col cols="4" md="12">
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
									value="No binario"
									:disabled="loading"
									label="No binario"
									hide-details
									@change="filterPanel"
								></v-checkbox>
								<v-checkbox
									v-model="gender"
									value="LGBTIQ+"
									:disabled="loading"
									label="LGBTIQ+"
									hide-details
									@change="filterPanel"
								></v-checkbox>
							</v-col>
							<v-col cols="4" md="12">
								<div class="title mt-2">Modelo terapéuticos</div>
								<v-checkbox
									v-model="sessionType"
									value="Cognitivo conductual"
									:disabled="loading"
									label="Cognitivo conductual"
									hide-details
									@change="filterPanel"
								></v-checkbox>
								<v-checkbox
									v-model="sessionType"
									value="Integrador"
									:disabled="loading"
									label="Integrador"
									hide-details
									@change="filterPanel"
								></v-checkbox>
								<v-checkbox
									v-model="sessionType"
									value="Psicoanalisis"
									:disabled="loading"
									label="Psicoanálisis"
									hide-details
									@change="filterPanel"
								></v-checkbox>
								<v-checkbox
									v-model="sessionType"
									value="Humanista"
									:disabled="loading"
									label="Humanista"
									hide-details
									@change="filterPanel"
								></v-checkbox>
								<v-checkbox
									v-model="sessionType"
									value="Sistemico-relacional"
									:disabled="loading"
									label="Sistemico-relacional"
									hide-details
									@change="filterPanel"
								></v-checkbox>
								<v-checkbox
									v-model="sessionType"
									value="Terapia-breve"
									:disabled="loading"
									label="Terapia-breve"
									hide-details
									@change="filterPanel"
								></v-checkbox>
							</v-col>
							<v-col cols="4" md="12">
								<div class="title mt-2">Idioma</div>
								<v-checkbox
									v-model="language"
									value="spanish"
									:disabled="loading"
									label="Español"
									hide-details
									@change="filterPanel"
								></v-checkbox>
								<v-checkbox
									v-model="language"
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
					<v-col>
						<v-combobox
							class="white"
							outlined
							:items="appointments"
							item-text="name"
							:search-input.sync="motive"
							label="Motivo de consulta"
							hide-details
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
					<v-col>
						<v-combobox
							class="white"
							outlined
							:items="panelFiter"
							item-text="name"
							:search-input.sync="searchInput"
							label="Busca tu psicólogo"
							hide-details
							:disabled="loading"
							no-data-text="No hay psicologos en este momento"
						>
						</v-combobox>
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
								height="400px"
								style="border-radius:15px"
								class="text-center"
								color="primary"
								dark
							>
								<v-card-text style="height: 85%">
									<v-btn
										fab
										light
										depressed
										width="100"
										height="100"
										style="border: 8px solid #5EB3E4;"
										class="mb-10"
									>
										<v-icon color="primary" size="60">mdi-magnify</v-icon>
									</v-btn>
									<div class="title font-weight-bold">
										Te ayudamos a encontrar a tu psicólogo
									</div>
									<div class="subtitle-1 mt-2">
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
									>
										Comenzar
									</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
							</v-card>
						</v-col>
						<v-col cols="12" sm="6" lg="4" v-for="(item, i) in items" :key="i">
							<v-card min-height="400" style="border-radius:15px" class="text-center">
								<v-card-text style="height: 85%">
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
										<div class="subtitle-1 font-weight-bold text--secondary">
											{{ item.name }}
										</div>
										<div v-if="item.code" class="caption primary--text">
											Codigo {{ item.code }}
										</div>
									</div>
									<v-divider></v-divider>
									<div v-if="item.description" class="body-2 mt-2">
										{{
											item.description.length > 300
												? item.description.slice(0, 300) + ' ...'
												: item.description
										}}
									</div>
									<div v-else class="text--secondary headline my-16">
										Sin descripción
									</div>
								</v-card-text>
								<v-card-actions class="text-center">
									<v-spacer></v-spacer>
									<v-btn color="primary" depressed style="border-radius:10px">
										Agenda cita oline
									</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
								<v-card-actions class="text-center">
									<v-spacer></v-spacer>
									<v-btn
										text
										color="#9D9D9C"
										:to="{ name: 'psicologo', params: { id: item._id } }"
									>
										Más información
									</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
							</v-card>
						</v-col>
					</template>
					<template v-if="view == 2">
						<v-col cols="12">
							<v-card style="border-radius:15px" dark color="primary">
								<v-card-text>
									<v-row align="center" justify="center">
										<v-col cols="3" lg="2" class="text-center">
											<v-list-item-avatar size="100" class="ml-4">
												<v-btn
													style="border: 8px solid #5EB3E4"
													color="#9D9D9C"
													class="elevation-0"
													fab
													width="100"
													height="100"
												></v-btn>
											</v-list-item-avatar>
										</v-col>
										<v-col cols="9" lg="10">
											<v-row justify="space-between">
												<v-col
													class="headline font-weight-bold white--text"
												>
													Encuentra a tu psicólogo ideal
												</v-col>
											</v-row>
											<div class="body-2 mt-2">
												Lorempsum dolor sit amet, consectetupsum dolor sit
												amet, consectetu ipsum
											</div>
											<v-btn light class="px-10 mt-4" depressed>
												Comenzar
											</v-btn>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>
						</v-col>
						<v-col cols="12" v-for="(item, i) in items" :key="i">
							<v-card style="border-radius:15px">
								<v-card-text>
									<v-row align="center" justify="center">
										<v-col cols="3" lg="2">
											<v-list-item-avatar text-center size="100" class="ml-4">
												<v-img
													class="primary"
													height="100"
													width="100"
													src=""
												></v-img>
											</v-list-item-avatar>
											<div class="text-center caption text--secondary">
												Cédula {{ item.rut }}
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
										<v-col cols="9" lg="10">
											<v-row justify="space-between">
												<v-col
													class="headline font-weight-bold text--secondary"
												>
													{{ item.name }}
												</v-col>
												<v-col cols="4" lg="3" class="text-right">
													<v-btn color="primary" rounded depressed>
														Agenda cita oline
													</v-btn>
												</v-col>
											</v-row>
											<div>
												<v-chip
													v-for="el in [3, 1, 2]"
													:key="el"
													small
													class="mb-2 mx-2"
												>
													Ansiedad
												</v-chip>
											</div>
											<div class="body-2 mt-2">{{ item.description }}</div>
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
			view: 2,
			gender: [],
			sessionType: [],
			language: [],
		};
	},
	computed: {
		items() {
			return this.panelFiter.filter(item => {
				let result = item;
				if (this.searchInput !== null)
					result =
						result.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1 &&
						result;

				return result;
			});
		},
		panelFiter() {
			return this.psychologists.filter(item => {
				let result = item;
				if (this.gender.length) result = this.gender.includes(result.gender);
				if (this.sessionType.length) result = this.sessionType.includes(result.sessionType);
				if (this.language.length) result = this.language.includes(result.language);

				return result;
			});
		},
		...mapGetters({
			psychologists: 'Psychologist/psychologists',
			appointments: 'Appointments/appointments',
		}),
	},
	mounted() {
		if (this.$vuetify.breakpoint.smAndDown) this.setView(1);
		else {
			const view = localStorage.getItem('view');
			if (view) {
				this.view = view;
			}
		}
		const panel = JSON.parse(localStorage.getItem('panel'));
		if (panel) {
			this.gender = panel.gender;
			this.sessionType = panel.sessionType;
			this.language = panel.language;
		}
	},
	methods: {
		setView(type) {
			localStorage.setItem('view', type);
			this.view = type;
		},
		filterPanel() {
			const panel = {
				gender: this.gender,
				sessionType: this.sessionType,
				language: this.language,
			};
			localStorage.setItem('panel', JSON.stringify(panel));
		},
	},
};
</script>
