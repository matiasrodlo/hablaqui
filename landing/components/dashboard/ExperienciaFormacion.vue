<template>
	<v-row class="mb-16 mt-10">
		<v-col cols="12" md="8">
			<v-sheet elevation="3" class="pa-4">
				<div class="body-1 font-weight-bold secondary--text mb-2">Modelo Terapéutico</div>
				<v-select
					filled
					outlined
					chips
					multiple
					:items="[
						'Psicoanálisis',
						'Sistémico',
						'Humanista',
						'Cognitivo-conductual',
						'Contextual',
					]"
					type="text"
					:value="psychologist.models"
					@change="e => setPsychologist({ ...psychologist, models: e })"
				></v-select>
			</v-sheet>
		</v-col>
		<v-col cols="12" md="8">
			<v-sheet elevation="3" class="pa-4">
				<div class="body-1 font-weight-bold secondary--text mb-2">Especialidades</div>
				<v-select
					:loading="!specialties.length"
					filled
					outlined
					chips
					multiple
					type="text"
					:items="specialties"
					:value="psychologist.specialties"
					@change="e => setPsychologist({ ...psychologist, specialties: e })"
				></v-select>
			</v-sheet>
		</v-col>
		<!-- idioma -->
		<v-col cols="12" md="8">
			<v-sheet elevation="3" class="pa-4">
				<div class="body-1 font-weight-bold secondary--text mb-2">Idiomas</div>
				<v-select
					filled
					outlined
					type="text"
					:items="[
						{ value: 'english', text: 'Ingles' },
						{ value: 'spanish', text: 'Español' },
					]"
					chips
					multiple
					:value="psychologist.languages"
					@change="e => setPsychologist({ ...psychologist, languages: e })"
				></v-select>
			</v-sheet>
		</v-col>
		<!-- formacion -->
		<v-col cols="12" md="8">
			<v-sheet elevation="3" class="pa-4">
				<div class="body-1 font-weight-bold secondary--text mb-2">Formación</div>
				<v-list>
					<v-list-item v-for="(item, t) in psychologist.formation" :key="t">
						<v-list-item-content>
							<v-list-item-title class="text-capitalize">
								{{ item.formationType }} -
								{{ item.description }}
							</v-list-item-title>
							<v-list-item-subtitle class="text-capitalize">
								{{ item.intitucion }}
								{{ item.start }} -
								{{ item.end }}
							</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-icon>
							<v-btn icon @click="setFormation(item, t)">
								<icon :icon="mdiPencilOutline" />
							</v-btn>
							<v-btn
								icon
								@click="
									() =>
										setPsychologist({
											...psychologist,
											formation: psychologist.formation.filter(
												(el, index) => index !== t
											),
										})
								"
							>
								<icon color="error" :icon="mdiDeleteOutline" />
							</v-btn>
						</v-list-item-icon>
					</v-list-item>
				</v-list>
				<v-btn depressed color="#ecf5ff" rounded block @click="setFormation">
					<span class="primary--text">Agregar formación</span>
				</v-btn>
			</v-sheet>
			<v-dialog
				v-if="selectedFormation"
				v-model="dialogFormation"
				max-width="400"
				@click:outside="
					() => {
						selectedFormation = null;
						indexSelected = null;
						dialogFormation = false;
					}
				"
			>
				<v-card>
					<v-card-text class="pt-8">
						<v-row>
							<v-col cols="12">
								<div class="primary--text font-weight-bold body-1 pb-2">
									Formación
								</div>
								<v-select
									v-model="selectedFormation.formationType"
									filled
									outlined
									hide-details
									placeholder="Título"
									dense
									type="text"
									:items="[
										'Licenciatura',
										'Diplomado',
										'Magister',
										'Doctorado',
										'Curso',
									]"
								></v-select>
							</v-col>
							<v-col cols="12">
								<div class="primary--text body-1 pb-2">Disciplina académica</div>
								<v-text-field
									v-model="selectedFormation.description"
									filled
									outlined
									placeholder="P. ej: Psicología forense"
									dense
									hide-details
									type="text"
								></v-text-field>
							</v-col>
							<v-col cols="12">
								<div class="primary--text body-1 pb-2">Institución académica</div>
								<v-text-field
									v-model="selectedFormation.intitucion"
									filled
									outlined
									placeholder="P. ej: universidad de Chile"
									dense
									hide-details
									type="text"
								></v-text-field>
							</v-col>
							<v-col cols="12">
								<div class="primary--text body-1 pb-2">Año de inicio</div>
								<v-text-field
									v-model="selectedFormation.start"
									filled
									outlined
									dense
									type="text"
									placeholder="P. ej: 2019"
									hide-details
								></v-text-field>
							</v-col>
							<v-col cols="12">
								<div class="primary--text body-1 pb-2">Año de termino</div>
								<v-text-field
									v-model="selectedFormation.end"
									filled
									outlined
									dense
									placeholder="P. ej: 2021"
									hide-details
									type="text"
								></v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="error"
							text
							@click="
								() => {
									selectedFormation = null;
									indexSelected = null;
									dialogFormation = false;
								}
							"
						>
							Cancelar
						</v-btn>
						<v-btn color="primary" text @click="newFormation">
							{{
								parseInt(indexSelected) >= 0 && indexSelected !== null
									? 'Editar'
									: 'Agregar'
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
		<!-- experiencia -->
		<v-col cols="12" md="8">
			<v-sheet elevation="3" class="pa-4">
				<div class="body-1 font-weight-bold secondary--text mb-2">Experiencia laboral</div>
				<v-list>
					<v-list-item v-for="(item, t) in psychologist.experience" :key="t">
						<v-list-item-content>
							<v-list-item-title class="text-capitalize">
								{{ item.title }} -
								{{ item.place }}
							</v-list-item-title>
							<v-list-item-subtitle class="text-capitalize">
								{{ item.start }} -
								{{ item.current ? 'Actualmente' : item.end }}
							</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-icon>
							<v-btn icon @click="setExperience(item, t)">
								<icon :icon="mdiPencilOutline" />
							</v-btn>
							<v-btn
								icon
								@click="
									() =>
										setPsychologist({
											...psychologist,
											experience: psychologist.experience.filter(
												(el, index) => index !== t
											),
										})
								"
							>
								<icon color="error" :icon="mdiDeleteOutline" />
							</v-btn>
						</v-list-item-icon>
					</v-list-item>
				</v-list>
				<v-btn depressed color="#ecf5ff" rounded block @click="setExperience">
					<span class="primary--text">Agregar experiencia</span>
				</v-btn>
			</v-sheet>
			<v-dialog
				v-if="selectedExperience"
				v-model="dialogExperience"
				max-width="400"
				@click:outside="
					() => {
						selectedExperience = null;
						indexSelected = null;
						dialogExperience = false;
					}
				"
			>
				<v-card>
					<v-card-text class="pt-8">
						<v-row>
							<v-col cols="12">
								<div class="primary--text font-weight-bold body-1 pb-3">
									Experiencia
								</div>
								<div class="primary--text body-1 pb-2">Cargo</div>
								<v-text-field
									v-model="selectedExperience.title"
									filled
									outlined
									placeholder="P. ej: Psicólogo"
									dense
									hide-details
									type="text"
								></v-text-field>
							</v-col>
							<v-col cols="12">
								<div class="primary--text body-1 pb-2">Institución</div>
								<v-text-field
									v-model="selectedExperience.place"
									filled
									outlined
									dense
									hide-details
									placeholder="P. ej: Hospital del Cáncer"
									type="text"
								></v-text-field>
							</v-col>
							<v-col cols="12">
								<v-checkbox
									v-model="selectedExperience.current"
									dense
									hide-details
									label="Actualmente tengo este cargo"
									@change="
										e => {
											selectedExperience.end = '';
											if (e) hiddenInput = true;
											else hiddenInput = false;
										}
									"
								></v-checkbox>
							</v-col>
							<v-col cols="12">
								<div class="primary--text body-1 pb-2">Año de inicio</div>
								<v-text-field
									v-model="selectedExperience.start"
									filled
									outlined
									dense
									hide-details
									placeholder="P. ej: 2019"
									type="text"
								></v-text-field>
							</v-col>
							<v-expand-transition>
								<v-col v-show="!hiddenInput" cols="12">
									<div class="primary--text body-1 pb-2">Año de Termino</div>
									<v-text-field
										v-model="selectedExperience.end"
										filled
										outlined
										dense
										hide-details
										placeholder="P. ej: 2021"
										type="text"
									></v-text-field>
								</v-col>
							</v-expand-transition>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="error"
							text
							@click="
								() => {
									selectedExperience = null;
									indexSelected = null;
									dialogExperience = false;
								}
							"
						>
							Cancelar
						</v-btn>
						<v-btn color="primary" text @click="newExperience">
							{{
								parseInt(indexSelected) >= 0 && indexSelected !== null
									? 'Editar'
									: 'Agregar'
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
		<v-col cols="12" md="8" class="text-center mb-10">
			<v-btn
				color="primary"
				elevation="3"
				class="px-16"
				style="border-radius: 10px"
				@click="onSubmit"
			>
				Guardar
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mdiPencilOutline, mdiDeleteOutline } from '@mdi/js';
export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		psychologist: {
			type: Object,
			default: null,
		},
		setPsychologist: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			mdiPencilOutline,
			mdiDeleteOutline,
			selectedExperience: null,
			dialogExperience: false,
			indexSelected: null,
			selectedFormation: null,
			dialogFormation: false,
			rules: [v => v.length <= 300 || 'Maximo 300 caracteres'],
		};
	},
	computed: {
		...mapGetters({
			specialties: 'Appointments/specialties',
		}),
	},
	mounted() {
		this.getAppointments();
	},
	methods: {
		async onSubmit() {
			const psychologist = await this.updatePsychologist(this.psychologist);
			this.setPsychologist(psychologist);
		},
		newExperience() {
			const experience = [...this.psychologist.experience];
			if (this.indexSelected >= 0 && this.indexSelected !== null) {
				this.setPsychologist({
					...this.psychologist,
					experience: experience.map(item => {
						if (this.selectedExperience._id === item._id)
							return this.selectedExperience;
						return item;
					}),
				});
			} else {
				this.setPsychologist({
					...this.psychologist,
					experience: [...experience, this.selectedExperience],
				});
			}
			this.dialogExperience = false;
		},
		setExperience(item, index) {
			if (index !== null) this.indexSelected = index;
			if (item) {
				this.hiddenInput = item.current;
				this.selectedExperience = item;
			} else {
				this.hiddenInput = false;
				this.selectedExperience = {
					title: '',
					place: '',
					start: '',
					end: '',
					current: false,
				};
			}
			this.dialogExperience = true;
		},
		newFormation() {
			const formation = [...this.psychologist.formation];
			if (this.indexSelected >= 0 && this.indexSelected !== null) {
				this.setPsychologist({
					...this.psychologist,
					formation: formation.map(item => {
						if (this.selectedFormation._id === item._id) return this.selectedFormation;
						return item;
					}),
				});
			} else {
				this.setPsychologist({
					...this.psychologist,
					formation: [...formation, this.selectedFormation],
				});
			}
			this.dialogFormation = false;
		},
		setFormation(item, index) {
			if (index !== null) this.indexSelected = index;
			if (item) this.selectedFormation = item;
			else
				this.selectedFormation = {
					formationType: '',
					description: '',
					intitucion: '',
					start: '',
					end: '',
				};
			this.dialogFormation = true;
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			updatePsychologist: 'Psychologist/updatePsychologist',
		}),
	},
};
</script>
