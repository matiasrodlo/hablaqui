<template>
	<v-card flat class="mb-16">
		<v-card-title>
			<div class="my-6" style="width: 100%">
				<div class="text-h6" style="color: #3c3c3b">Configuración de servicios</div>
				<div class="text--secondary body-2">
					Configura los servicios ofrecidos por medio de Hablaquí.
				</div>
			</div>
		</v-card-title>
		<v-divider></v-divider>
		<v-card-text>
			<v-row>
				<v-col cols="12" md="6">
					<div class="text-h6 mb-5" style="color: #3c3c3b">
						Anticipación para agendar:
					</div>
					<div>
						<v-select
							filled
							outlined
							dense
							:items="hours"
							hide-details
							label="Seleccione"
							:value="psychologist.preferences.minimumNewSession"
							@change="
								e => {
									const preferences = psychologist.preferences;
									setPsychologist({
										...psychologist,
										preferences: { ...preferences, minimumNewSession: e },
									});
								}
							"
						></v-select>
					</div>
				</v-col>
				<v-col cols="12" md="6">
					<div class="text-h6 mb-5" style="color: #3c3c3b">
						Anticipación para reprogramar:
					</div>
					<div>
						<v-select
							:value="psychologist.preferences.minimumRescheduleSession"
							filled
							outlined
							dense
							:items="hours"
							hide-details
							label="Seleccione"
							@change="
								e => {
									const preferences = psychologist.preferences;
									setPsychologist({
										...psychologist,
										preferences: {
											...preferences,
											minimumRescheduleSession: e,
										},
									});
								}
							"
						></v-select>
					</div>
				</v-col>
				<v-col cols="12" class="text-h6" style="color: #3c3c3b">
					Valor por sesión
					<v-tooltip right max-width="300" color="white">
						<template #activator="{ on, attrs }">
							<v-btn icon v-bind="attrs" v-on="on">
								<icon :icon="mdiInformationOutline" />
							</v-btn>
						</template>
						<div class="elevation-5 pa-3">
							<span class="primary--text">
								Aqui podras configurar el precio de tus sesiones
							</span>
						</div>
					</v-tooltip>
				</v-col>
				<v-col cols="12">
					<v-alert prominent text color="info">
						<div style="color: #0079ff" class="px-6 py-4 font-weight-medium">
							Puede establecer el precio de su sesión solo por primera vez. Para
							cambiar tendrás que contactarnos.
						</div>
					</v-alert>
				</v-col>
				<v-col cols="12" md="4">
					<div class="body-1 font-weight-medium mb-3" style="color: #5f5f5f">
						Sesión 50 min
					</div>
					<div>
						<v-text-field
							:value="psychologist.sessionPrices.full"
							outlined
							filled
							suffix="CLP"
							@change="
								e => {
									const sessionPrices = psychologist.sessionPrices;
									setPsychologist({
										...psychologist,
										sessionPrices: {
											...sessionPrices,
											full: e,
										},
									});
								}
							"
						>
						</v-text-field>
					</div>
				</v-col>
				<v-col cols="12" md="4">
					<div class="body-1 font-weight-medium mb-3" style="color: #5f5f5f">
						Sesión mensajería
					</div>
					<div>
						<v-text-field
							:value="psychologist.sessionPrices.text"
							readonly
							disabled
							outlined
							filled
							suffix="CLP"
						>
						</v-text-field>
					</div>
				</v-col>
				<v-col cols="12" md="4">
					<div class="body-1 font-weight-medium mb-3" style="color: #5f5f5f">
						Mensajería y videollamada
					</div>
					<div>
						<v-text-field
							:value="psychologist.sessionPrices.video"
							readonly
							disabled
							outlined
							filled
							suffix="CLP"
						>
						</v-text-field>
					</div>
				</v-col>
				<v-col cols="12" class="text-h6" style="color: #3c3c3b">
					<div>
						Nuevos clientes
						<v-tooltip right max-width="300" color="white">
							<template #activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<icon :icon="mdiInformationOutline" />
								</v-btn>
							</template>
							<div class="elevation-5 pa-3">
								<span class="primary--text">
									Al desactivarlo, su perfil dejará de aparecer en la búsqueda.
									Esto no impide que los clientes antiguos o nuevos accedan a su
									perfil directamente a través de su enlace.
								</span>
							</div>
						</v-tooltip>
					</div>
					<div v-if="psychologist.preferences" class="mt-8">
						<v-switch
							v-model="marketplaceVisibility"
							label="Visibilidad en Marketplace"
							color="primary"
							persistent-hint
							hint="Los especialistas que aceptan nuevos clientes suelen tener un aumento en el número de sesiones."
							@change="
								e => {
									const preferences = psychologist.preferences;
									setPsychologist({
										...psychologist,
										preferences: {
											...preferences,
											marketplaceVisibility:
												!psychologist.preferences.marketplaceVisibility,
										},
									});
								}
							"
						></v-switch>
					</div>
				</v-col>
				<v-col cols="12" class="mt-6 text-center">
					<v-btn
						depressed
						:loading="loading"
						color="primary"
						rounded
						class="px-10"
						@click="onSubmit"
					>
						Editar
					</v-btn>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import { mdiInformationOutline } from '@mdi/js';
import { mapActions } from 'vuex';

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
			mdiInformationOutline,
			hours: [
				{ value: 1, text: '1 hora' },
				{ value: 2, text: '2 horas' },
				{ value: 3, text: '3 horas' },
				{ value: 6, text: '6 horas' },
				{ value: 12, text: '12 horas' },
				{ value: 24, text: '24 horas' },
			],
			newPrice: 0,
			loading: false,
			marketplaceVisibility: false,
		};
	},
	mounted() {
		this.marketplaceVisibility = this.psychologist.preferences.marketplaceVisibility;
	},
	methods: {
		async onSubmit() {
			this.loading = true;
			const psychologist = await this.updatePsychologist(this.psychologist);
			this.setPsychologist(psychologist);
			this.loading = false;
		},
		...mapActions({
			updatePsychologist: 'Psychologist/updatePsychologist',
		}),
	},
};
</script>
