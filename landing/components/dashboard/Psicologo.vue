<template>
	<v-card :loading="loading">
		<v-card-text v-if="loading">
			<v-row align="center" justify="center">
				<v-col cols="12" sm="3" class="text-center">
					<v-avatar size="200" color="grey lighten-1"></v-avatar>
				</v-col>
				<v-col cols="12" sm="9">
					<div class="body-2 mt-2 mr-4 text-center text-sm-left">
						<v-skeleton-loader max-width="300" type="heading"></v-skeleton-loader>
						<v-skeleton-loader class="mt-4" type="paragraph"></v-skeleton-loader>
						<v-skeleton-loader class="mt-2" type="heading"></v-skeleton-loader>
					</div>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-text v-if="psychologist && !loading">
			<v-row align="center" justify="center">
				<v-col cols="12" sm="3" class="text-center">
					<v-avatar
						:size="$vuetify.breakpoint.lgAndUp ? '200' : '140'"
						:color="psychologist.avatar ? 'trasnparent' : 'primary'"
					>
						<v-img
							v-if="psychologist.avatar"
							:src="psychologist.avatar"
							:lazy-src="psychologist.avatar"
							:width="$vuetify.breakpoint.lgAndUp ? '200' : '140'"
							:height="$vuetify.breakpoint.lgAndUp ? '200' : '140'"
						>
							<template #placeholder>
								<v-row class="fill-height ma-0" align="center" justify="center">
									<v-progress-circular indeterminate color="primary" />
								</v-row>
							</template>
						</v-img>
						<span v-else class="white--text headline font-weight-bold">
							{{ psychologist.name.substr(0, 1) }}
						</span>
					</v-avatar>
					<div class="text-center body-2 text--secondary mt-3 mb-2">
						Codigo {{ psychologist.code }}
					</div>
					<nuxt-link
						class="primary--text body-2 font-weight-bold"
						style="text-decoration: none"
						:to="{ path: `/${psychologist.username}` }"
					>
						Más información
					</nuxt-link>
				</v-col>
				<v-col cols="12" sm="9">
					<v-row justify-md="space-between" align="center">
						<v-col cols="12" sm="6" class="text-center text-sm-left">
							<nuxt-link
								style="text-decoration: none"
								:to="{
									path: `/${psychologist.username}`,
								}"
							>
								<span class="body-1 text-lg-h5 font-weight-bold text--secondary">
									{{ psychologist.name }}
									{{ psychologist.lastName && psychologist.lastName }}
								</span>
							</nuxt-link>
						</v-col>
						<v-col cols="12" sm="6" class="text-center text-sm-right mb-4 mb-sm-0">
						</v-col>
					</v-row>
					<v-chip-group v-model="specialties" show-arrows>
						<template v-for="(tag, i) in psychologist.specialties">
							<v-chip
								:key="i"
								:value="tag"
								class="ma-2"
								small
								:color="specialties == tag ? 'primary--text' : ''"
							>
								<span>
									{{ tag }}
								</span>
							</v-chip>
						</template>
					</v-chip-group>
					<div class="body-2 mt-2 mr-4 text-center text-sm-left">
						{{
							psychologist.professionalDescription.length > 345
								? psychologist.professionalDescription.slice(0, 345).concat('...')
								: psychologist.professionalDescription
						}}
					</div>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-text v-if="!psychologist && !loading" class="text-center">
			<div
				class="headline font-weight-bold primary--text my-5 mx-auto"
				style="max-width: 340px"
			>
				Agenda con un espacialista e inicia tu viaje hacia el bienestar
			</div>
			<div class="body-1 my-5 mx-auto" style="max-width: 280px">
				Orientación psicológica en cualquier momento y lugar. Comienza a mejorar tu vida
				hoy.
			</div>
			<v-btn rounded color="primary" :to="{ name: 'psicologos' }"> Buscar ahora </v-btn>
		</v-card-text>
	</v-card>
</template>

<script>
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
			loading: false,
			specialties: '',
		};
	},
};
</script>
