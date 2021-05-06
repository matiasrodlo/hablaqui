<template>
	<v-container>
		<v-card>
			<v-card-text>
				<v-row align="center" justify="center">
					<v-col cols="12" sm="3" class="text-center">
						<v-list-item-avatar
							:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
							class="ml-4"
						>
							<v-img
								v-if="psychologist.avatar"
								:lazy-src="psychologist.avatar"
								:src="psychologist.avatar"
							>
								<template #placeholder>
									<v-row class="fill-height ma-0" align="center" justify="center">
										<v-progress-circular indeterminate color="primary" />
									</v-row>
								</template>
							</v-img>
						</v-list-item-avatar>
						<div v-if="psychologist.code" class="caption text--secondary">
							Codigo {{ psychologist.code }}
						</div>
					</v-col>
					<v-col cols="12" sm="9">
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
						<v-chip
							class="ma-2"
							small
							v-for="(tag, i) in psychologist.specialties"
							:key="i"
						>
							{{ tag }}
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
					<v-col cols="3" class="subtitle-1 primary--text text-uppercase">
						Modelos de trabajo terapéutico
					</v-col>
					<v-col
						v-if="psychologist.specialties.length"
						class="body-1 text-left text-capitalize"
					>
						<ul>
							<li v-for="(model, i) in psychologist.model" :key="i">
								{{ model }}
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
						{{
							psychologist.description ? psychologist.description : 'Sin descripcion'
						}}
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
