<template>
	<v-row class="mb-16 mt-10">
		<v-col cols="12">
			<div class="body-1 font-weight-bold secondary--text mb-2">Modelo Terapéutico</div>
		</v-col>
		<v-col cols="12" md="6">
			<v-select
				filled
				outlined
				dense
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
		</v-col>
		<v-col cols="12">
			<div class="body-1 font-weight-bold secondary--text mb-2">Especialidades</div>
		</v-col>
		<v-col cols="12" md="6">
			<v-select
				:loading="!specialties.length"
				filled
				outlined
				dense
				chips
				multiple
				type="text"
				:items="specialties"
				:value="psychologist.specialties"
				@change="e => setPsychologist({ ...psychologist, specialties: e })"
			></v-select>
		</v-col>
		<!-- idioma -->
		<v-col cols="12">
			<div class="body-1 font-weight-bold secondary--text mb-2">Idiomas</div>
		</v-col>
		<v-col cols="12" md="6">
			<v-select
				filled
				outlined
				dense
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
		</v-col>
		<!-- formacion -->
		<v-col cols="12">
			<div class="body-1 font-weight-bold secondary--text mb-2">Formación</div>
		</v-col>
		<v-col cols="12">
			<template v-if="psychologist.formation.length">
				<v-row v-for="(formation, i) in psychologist.formation" :key="i">
					<v-col>
						<v-select
							filled
							outlined
							label="Seleccione"
							dense
							type="text"
							:items="[
								'Licenciatura',
								'Diplomado',
								'Master',
								'Magister',
								'Doctorado',
								'Curso/especialización',
								'Otro',
							]"
							:value="formation.type"
							@change="
								e => {
									const formation = psychologist.formation;
									formation[i].type = e;
									setPsychologist({ ...psychologist, formation });
								}
							"
						></v-select>
					</v-col>
					<v-col>
						<v-text-field
							label="Curso/Ubicación/Descripción"
							filled
							outlined
							dense
							type="text"
							:value="formation.description"
							@input="
								e => {
									const formation = psychologist.formation;
									formation[i].description = e;
									setPsychologist({ ...psychologist, formation });
								}
							"
						></v-text-field>
					</v-col>
					<v-col>
						<v-text-field
							label="Inicio"
							filled
							outlined
							dense
							type="text"
							:value="formation.start"
							@input="
								e => {
									const formation = psychologist.formation;
									formation[i].start = e;
									setPsychologist({ ...psychologist, formation });
								}
							"
						></v-text-field>
					</v-col>
					<v-col>
						<v-text-field
							label="Fin"
							filled
							outlined
							dense
							type="text"
							:value="formation.end"
							@input="
								e => {
									const formation = psychologist.formation;
									formation[i].end = e;
									setPsychologist({ ...psychologist, formation });
								}
							"
						></v-text-field>
					</v-col>
					<v-col>
						<v-btn small color="primary" fab depressed @click="newFormation">
							<h1>+</h1>
						</v-btn>
					</v-col>
				</v-row>
			</template>
		</v-col>
		<!-- experiencia -->
		<v-col cols="12">
			<div class="body-1 font-weight-bold secondary--text mb-2">Experiencia laboral</div>
		</v-col>
		<v-col cols="12">
			<pre>{{ psychologist.experience }}</pre>
			<template v-if="psychologist.experience.length">
				<v-row v-for="(experience, i) in psychologist.experience" :key="i">
					<v-col>
						<v-text-field
							label="Lugar"
							filled
							outlined
							dense
							type="text"
							:value="experience.title"
							@input="
								e => {
									const experience = psychologist.experience;
									experience[i].title = e;
									setPsychologist({ ...psychologist, experience });
								}
							"
						></v-text-field>
					</v-col>
					<v-col>
						<v-text-field
							label="Lugar"
							filled
							outlined
							dense
							type="text"
							:value="experience.place"
							@input="
								e => {
									const experience = psychologist.experience;
									experience[i].place = e;
									setPsychologist({ ...psychologist, experience });
								}
							"
						></v-text-field>
					</v-col>
					<v-col>
						<v-text-field
							label="Inicio"
							filled
							outlined
							dense
							type="text"
							:value="experience.start"
							@input="
								e => {
									const experience = psychologist.experience;
									experience[i].start = e;
									setPsychologist({ ...psychologist, experience });
								}
							"
						></v-text-field>
					</v-col>
					<v-col>
						<v-text-field
							label="Fin"
							filled
							outlined
							dense
							type="text"
							:value="experience.end"
							@input="
								e => {
									const experience = psychologist.experience;
									experience[i].end = e;
									setPsychologist({ ...psychologist, experience });
								}
							"
						></v-text-field>
					</v-col>
					<v-col>
						<v-btn small color="primary" fab depressed @click="newExperience">
							<h1>+</h1>
						</v-btn>
					</v-col>
				</v-row></template
			>
		</v-col>
	</v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
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
		async onSubmite() {
			const psychologist = await this.updatePsychologist(this.psychologist);
			this.setPsychologist(psychologist);
		},
		newFormation() {
			const formation = { type: '', description: '', start: '', end: '' };
			this.setPsychologist({
				...this.psychologist,
				formation: [...this.psychologist.formation, formation],
			});
		},
		newExperience() {
			const experience = { title: '', place: '', start: '', end: '' };
			this.setPsychologist({
				...this.psychologist,
				experience: [...this.psychologist.experience, experience],
			});
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			updatePsychologist: 'Psychologist/updatePsychologist',
		}),
	},
};
</script>
