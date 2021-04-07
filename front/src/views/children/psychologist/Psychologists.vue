<template>
	<v-container fluid>
		<v-row justify="space-between" align="center">
			<v-col class="text-left font-weight-bold text-h6 text-md-h3 text--secondary">
				{{ $route.meta.title }}
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" md="3" lg="2">
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
								<v-checkbox label="Hombre" hide-details></v-checkbox>
								<v-checkbox label="Mujer" hide-details></v-checkbox>
							</v-col>
							<v-col cols="4" md="12">
								<div class="title mt-2">Tipo de cita</div>
								<v-checkbox label="Personal" hide-details></v-checkbox>
								<v-checkbox label="Pareja" hide-details></v-checkbox>
							</v-col>
							<v-col cols="4" md="12">
								<div class="title mt-2">Idioma</div>
								<v-checkbox label="Español" hide-details></v-checkbox>
								<v-checkbox label="Ingles" hide-details></v-checkbox>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" md="9" lg="10">
				<v-row>
					<v-col>
						<v-select
							class="white"
							hide-details
							:items="[]"
							item-text="name"
							outlined
							label="Motivo de consulta"
							no-data-text="Vacio"
						></v-select>
					</v-col>
					<v-col>
						<v-combobox
							class="white"
							outlined
							:items="psychologists"
							item-text="name"
							:search-input.sync="search"
							label="Busca tu psicólogo"
						>
							<template v-slot:no-data>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>
											No se han encontrado psicologos con el nombre "
											<strong>{{ search }} </strong>"
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</template>
						</v-combobox>
					</v-col>
				</v-row>
				<v-row>
					<template v-if="view == 1">
						<v-col cols="12" sm="6" md="4" lg="3">
							<v-card
								height="450px"
								style="border-radius:15px"
								class="text-center"
								color="primary"
								dark
							>
								<v-card-text style="height: 85%">
									<v-btn
										style="border: 8px solid #5EB3E4"
										color="#9D9D9C"
										depressed
										fab
										width="100"
										height="100"
									></v-btn>
									<div class="subtitle-1 font-weight-bold">
										Encuentra a tu psicólogo ideal
									</div>
									<div class="body-2 mt-2">
										Lorempsum dolor sit amet, consectetupsum dolor sit amet,
										consectetu ipsum
									</div>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn class="px-10" light color="#F0F8FF" depressed>
										Comenzar
									</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
							</v-card>
						</v-col>
						<v-col
							cols="12"
							sm="6"
							md="4"
							lg="3"
							v-for="(item, i) in psychologists"
							:key="i"
						>
							<v-card height="450px" style="border-radius:15px" class="text-center">
								<v-card-text style="height: 75%">
									<v-btn
										color="#9D9D9C"
										depressed
										fab
										width="100"
										height="100"
									></v-btn>
									<div class="title text--secondary">
										{{ item.name }}
									</div>
									<div class="body-1 primary--text">Cédula {{ item.rut }}</div>
									<v-divider></v-divider>
									<div class="body-2 mt-2">{{ item.description }}</div>
								</v-card-text>
								<v-card-actions class="text-center">
									<v-spacer></v-spacer>
									<v-btn color="primary" depressed>Agenda cita oline</v-btn>
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
						<v-col cols="12" v-for="(item, i) in psychologists" :key="i">
							<v-card style="border-radius:15px">
								<v-card-text>
									<v-row align="center" justify="center">
										<v-col cols="3" lg="2" class="text-center">
											<v-list-item-avatar size="100" class="ml-4">
												<v-btn
													color="#9D9D9C"
													class="elevation-0"
													fab
													width="100"
													height="100"
												></v-btn>
											</v-list-item-avatar>
											<div class="caption text--secondary">
												Cédula {{ item.rut }}
											</div>
											<v-btn
												text
												color="primary"
												class="font-weight-bold"
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
													<v-btn color="primary" rounded>
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
	data() {
		return { view: 2 };
	},
	computed: {
		...mapGetters({ psychologists: 'Psychologist/psychologists' }),
	},
	mounted() {
		const view = localStorage.getItem('view');
		if (view) {
			this.view = view;
		}
	},
	methods: {
		setView(type) {
			localStorage.setItem('view', type);
			this.view = type;
		},
	},
};
</script>
