<template>
	<v-container fluid>
		<v-card>
			<v-card-text>
				<v-row align="center" justify="center">
					<v-col cols="12" sm="3" lg="2" class="text-center">
						<v-list-item-avatar
							:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
							class="ml-4"
						>
							<v-btn
								color="#9D9D9C"
								class="elevation-0"
								fab
								:width="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
								:height="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
							></v-btn>
						</v-list-item-avatar>
						<div v-if="psychologist.code" class="caption text--secondary">
							cedula {{ psychologist.code }}
						</div>
					</v-col>
					<v-col cols="12" sm="9" lg="10">
						<v-row justify="space-between">
							<v-col
								class="text-center text-sm-left font-weight-bold text-h3 text--secondary"
							>
								{{ psychologist.name }}
							</v-col>
							<v-col cols="12" sm="4" lg="3" class="text-right">
								<v-btn block color="primary" rounded>
									Agenda cita oline
								</v-btn>
							</v-col>
						</v-row>
						<v-chip v-for="el in [3, 1, 2]" :key="el" small class="my-4 mx-1">
							Ansiedad
						</v-chip>
						<div class="body-2 mt-2 text-capitalize">
							{{ psychologist.description }}
						</div>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
		<v-card class="mt-6">
			<v-card-text class="text-h4 primary--text font-weight-bold">Perfil</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">EXPERIENCIA</v-col>
					<v-col class="body-1 text-left text-capitalize text-capitalize">
						{{ psychologist.experience ? psychologist.experience : 'Vacío' }}
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">ESPECIALIDADES</v-col>
					<v-col
						v-if="psychologist.specialties.length"
						class="body-1 text-left text-capitalize"
					>
						<ul>
							<li v-for="(specialties, i) in psychologist.specialties" :key="i">
								{{ specialties }}
							</li>
						</ul>
					</v-col>
					<v-col v-else class="body-1 text-left text-capitalize">
						Vacío
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">FORMACIÓN</v-col>
					<v-col class="body-1 text-left text-capitalize">
						{{ psychologist.formation ? psychologist.formation : 'Vacío' }}
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">DESCRIPCIÓN PERSONAL</v-col>
					<v-col class="body-1 text-left text-capitalize">
						HARD CODE...
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">REPROGRAMACIÓN</v-col>
					<v-col class="body-1 text-left text-capitalize">
						HARD CODE...
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	computed: {
		psychologist() {
			return this.psychologists.find(item => item._id === this.$route.params.id);
		},
		...mapGetters({ psychologists: 'Psychologist/psychologists' }),
	},
};
</script>

<style lang="scss" scoped></style>
