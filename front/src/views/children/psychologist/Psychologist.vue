<template>
	<v-container>
		<template v-if="!psychologist">
			<v-col cols="12">
				<v-skeleton-loader type="image" />
			</v-col>
			<v-col cols="12">
				<v-skeleton-loader type="image, image, image" height="600" />
			</v-col>
		</template>
		<v-card v-else>
			<v-card-text>
				<v-row align="center" justify="center">
					<v-col cols="12" sm="3" class="text-center">
						<v-list-item-avatar
							:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
							:color="psychologist.avatar ? 'trasnparent' : 'primary'"
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
							<span v-else class="white--text text-h2 font-weight-bold">
								{{ psychologist.name.substr(0, 1) }}
							</span>
						</v-list-item-avatar>
						<div
							v-if="$vuetify.breakpoint.mdAndUp && psychologist.code"
							class="caption text--secondary"
						>
							Codigo {{ psychologist.code }}
						</div>
					</v-col>
					<v-col cols="12" sm="9">
						<v-row justify="space-between">
							<v-col
								class="text-center text-sm-left font-weight-bold text-h6 text-md-h4 text-xl-h3 text--secondary"
							>
								{{ psychologist.name }}
								{{ psychologist.lastName && psychologist.lastName }}
								<div
									v-if="!$vuetify.breakpoint.mdAndUp && psychologist.code"
									class="caption text--secondary"
								>
									Codigo {{ psychologist.code }}
								</div>
							</v-col>
							<v-col cols="12" sm="4" lg="3" class="text-right">
								<dialog-agenda-cita-online :psy="item" mode="3" />
							</v-col>
						</v-row>
						<template v-for="(tag, i) in psychologist.specialties">
							<v-chip v-if="i < 4" class="ma-2" :key="i" small>
								{{ tag }}
							</v-chip>
						</template>
						<div class="body-2 mt-2">
							{{ psychologist.professionalDescription }}
						</div>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
		<v-card v-if="psychologist" class="mt-6">
			<v-card-text class="text-h5 primary--text font-weight-bold">Perfil</v-card-text>
			<v-card-text>
				<v-divider></v-divider>
			</v-card-text>
			<v-card-text>
				<v-row align="center">
					<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
						Experiencia
					</v-col>
					<v-col class="body-1 text-left">
						<ul v-if="psychologist.experience.length">
							<li v-for="(experience, i) in psychologist.experience" :key="i">
								{{ experience }}
							</li>
						</ul>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-text>
				<v-divider></v-divider>
			</v-card-text>
			<v-card-text>
				<v-row align="center">
					<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
						Especialidades
					</v-col>
					<v-col v-if="psychologist.specialties.length" class="body-1 text-left">
						<ul>
							<li v-for="(item, i) in psychologist.specialties" :key="i">
								{{ item }}
							</li>
						</ul>
					</v-col>
					<v-col v-else class="body-1 text-left text-capitalize">
						Vacío
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-text>
				<v-divider></v-divider>
			</v-card-text>
			<v-card-text>
				<v-row align="center">
					<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
						Modelos de trabajo terapéutico
					</v-col>
					<v-col class="body-1 text-left">
						<ul v-if="psychologist.models.length">
							<li v-for="(model, i) in psychologist.models" :key="i">
								{{ model }}
							</li>
						</ul>
						<div v-else>
							Vacío
						</div>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-text>
				<v-divider></v-divider>
			</v-card-text>
			<v-card-text>
				<v-row align="center">
					<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
						Formación
					</v-col>
					<v-col class="body-1 text-left">
						<ul v-if="psychologist.formation.length">
							<li v-for="(formation, i) in psychologist.formation" :key="i">
								{{ formation }}
							</li>
						</ul>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-text><v-divider></v-divider></v-card-text>
			<v-card-text>
				<v-row align="center">
					<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
						Descripción personal
					</v-col>
					<v-col class="body-1 text-left">
						{{
							psychologist.personalDescription
								? psychologist.personalDescription
								: 'Sin descripcion'
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
	components: {
		DialogAgendaCitaOnline: () => import('@/components/psy/DialogAgendaCitaOnline'),
	},
	computed: {
		psychologist() {
			return this.psychologists.find(item => item._id === this.$route.params.id);
		},
		...mapGetters({ psychologists: 'Psychologist/psychologists' }),
	},
	methods: {
		toAuth(item) {
			localStorage.setItem('psi', JSON.stringify(item));
			if (this.loggedIn) this.$router.push({ name: 'plan' });
			else this.$router.push({ path: '/auth/q=register' });
		},
	},
};
</script>

<style lang="scss" scoped></style>
