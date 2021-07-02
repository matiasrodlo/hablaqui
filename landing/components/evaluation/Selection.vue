<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12">
				<div class="text-h5 text-md-h4 font-weight-bold text-center">
					Conoce a los especialistas
				</div>
				<div class="text-center">
					Hemos priorizado aquellos que encajan de mejor manera con tus preferencias.
				</div>
				<div class="text-center my-2">
					<v-btn text color="primary" rounded @click="resetMatch">
						Realizar prueba de nuevo
					</v-btn>
				</div>
			</v-col>
			<v-col v-for="(item, r) in match" :key="r" cols="12" class="d-flex justify-center">
				<v-card color="white" style="border-radius: 15px">
					<v-card-text>
						<v-row align="center" justify="center">
							<v-col cols="12" sm="3" class="text-center">
								<v-list-item-avatar
									:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
									class="ml-4"
								>
									<v-img :src="item.avatar"></v-img>
								</v-list-item-avatar>
								<div class="caption text--secondary">code {{ item.code }}</div>
								<v-btn text color="primary" :to="`/psicologos/${item._id}`">
									Mas información
								</v-btn>
							</v-col>
							<v-col cols="12" sm="9">
								<v-row justify="space-between">
									<v-col
										class="text-center text-sm-left font-weight-bold text-h5 text--secondary"
									>
										<nuxt-link
											:to="`psicologo/${item._id}`"
											style="text-decoration: none"
										>
											{{ item.name }}
											{{ item.lastName && item.lastName }}
										</nuxt-link>
									</v-col>
									<v-col cols="12" sm="6" class="text-center text-md-right">
										<dialog-agenda-cita-online :psy="item" :mode="'3'" />
									</v-col>
								</v-row>
								<v-chip-group show-arrows>
									<v-chip
										v-for="(specialties, s) in item.specialties"
										:key="s"
										small
										class="my-4 mx-1"
									>
										{{ specialties }}
									</v-chip>
								</v-chip-group>
								<div class="font-weight-light mt-2">
									{{ item.professionalDescription }}
								</div>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" class="font-weight-bold mt-4 mb-10 text-center">
				¿No estás satisfecho con estas opciones?
				<v-btn text class="primary--text" to="/psicologos/todos"> Buscar más </v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	components: {
		DialogAgendaCitaOnline: () => import('~/components/psicologos/DialogAgendaCitaOnline'),
	},
	props: {
		match: {
			type: Array,
			default: () => [],
		},
		resetMatch: {
			type: Function,
			required: true,
		},
	},
};
</script>
