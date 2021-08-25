<template>
	<v-card outlined class="mb-16">
		<v-card-title>
			<div class="my-6">
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
					<v-tooltip bottom>
						<template #activator="{ on, attrs }">
							<v-btn icon v-bind="attrs" v-on="on">
								<icon :icon="mdiInformationOutline" />
							</v-btn>
						</template>
						<span>Aqui podras configurar el precio de tus sesiones</span>
					</v-tooltip>
				</v-col>
				<v-col cols="12">
					<v-alert prominent text color="info">
						<div style="color: #0079ff" class="px-6 py-4 font-weight-medium">
							Puede establecer el precio de su sesión solo por primera vez. Para
							cambiar tendrás que contactarnos. <br />
							Sugerimos el valor de 30 USD por sesiones de una hora para adquirir más
							clientes al principio.
						</div>
					</v-alert>
				</v-col>
				<v-col cols="12" md="4">
					<div class="body-1 font-weight-medium mb-3" style="color: #5f5f5f">
						Sesión 50 min
					</div>
					<div>
						<v-text-field v-model="newPrice" outlined filled suffix="CLP">
						</v-text-field>
					</div>
				</v-col>
				<v-col cols="12" md="4">
					<div class="body-1 font-weight-medium mb-3" style="color: #5f5f5f">
						Sesión mensajería
					</div>
					<div>
						<v-text-field :value="50" readonly disabled outlined filled suffix="CLP">
						</v-text-field>
					</div>
				</v-col>
				<v-col cols="12" md="4">
					<div class="body-1 font-weight-medium mb-3" style="color: #5f5f5f">
						Mensajería y videollamada
					</div>
					<div>
						<v-text-field :value="50" readonly disabled outlined filled suffix="CLP">
						</v-text-field>
					</div>
				</v-col>
				<v-col cols="12" md="6" class="text-h6" style="color: #3c3c3b">
					<div>
						Sesiones corporativas
						<v-tooltip bottom>
							<template #activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<icon :icon="mdiInformationOutline" />
								</v-btn>
							</template>
							<span>Aqui podras configurar el precio de tus sesiones</span>
						</v-tooltip>
					</div>
					<div class="mt-10">
						<div>Felicitaciones, tiene acceso a Clientes Silver</div>
						<v-checkbox
							label="Aceptar Clientes Silver"
							color="primary"
							persistent-hint
							hint="Planes que pagan $ 50/50 min o $ 25/30 min. Los expertos que aceptan este plan suelen tener un aumento de hasta un 60% en el número de sesiones."
						></v-checkbox>
					</div>
					<v-divider class="my-8"></v-divider>
					<div class="mt-8">
						<div>Clientes Gold, no esta disponible</div>
						<v-checkbox
							disabled
							label="Aceptar Clientes corporativos Gold"
							color="primary"
							persistent-hint
							hint="Planes que pagan $ 50/50 min o $ 25/30 min. Los expertos que aceptan este plan suelen tener un aumento de hasta un 60% en el número de sesiones."
						></v-checkbox>
					</div>
					<v-divider class="my-8"></v-divider>
					<div class="mt-8">
						<div>Clientes Diamond, no esta disponible</div>
						<v-checkbox
							disabled
							label="Aceptar Clientes corporativos Diamond"
							color="primary"
							persistent-hint
							hint="Planes que pagan $ 50/50 min o $ 25/30 min. Los expertos que aceptan este plan suelen tener un aumento de hasta un 60% en el número de sesiones."
						></v-checkbox>
					</div>
				</v-col>
				<v-col cols="12" md="6" class="text-h6" style="color: #3c3c3b">
					<div>
						Nuevos clientes
						<v-tooltip bottom>
							<template #activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<icon :icon="mdiInformationOutline" />
								</v-btn>
							</template>
							<span>Aqui podras configurar el precio de tus sesiones</span>
						</v-tooltip>
					</div>
					<div class="mt-8">
						<v-checkbox
							label="Visibilidad en Marketplace"
							color="primary"
							persistent-hint
							hint="Los especialistas que aceptan nuevos clientes tienden a tener un aumento en el número de sesiones."
						></v-checkbox>
					</div>
				</v-col>
				<v-col cols="12" class="text-center">
					<v-btn
						color="primary"
						depressed
						:loading="loading"
						class="px-16"
						style="border-radius: 10px"
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
		};
	},
	methods: {
		async onSubmit() {
			this.loading = true;
			await this.updatePrices(this.newPrice);
			const psychologist = await this.updatePsychologist(this.psychologist);
			this.setPsychologist(psychologist);
			this.loading = false;
		},
		...mapActions({
			updatePsychologist: 'Psychologist/updatePsychologist',
			updatePrices: 'Psychologist/updatePrices',
		}),
	},
};
</script>
