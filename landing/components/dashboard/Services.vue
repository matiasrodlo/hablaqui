<template>
	<div>
		<v-card flat class="mb-16 mt-3">
			<v-card-title>
				<div class="my-6" style="width: 100%">
					<div class="text-h6" style="color: #3c3c3b">Configuración de servicios</div>
					<div class="text--secondary caption">
						Configura los servicios ofrecidos por medio de Hablaquí.
					</div>
				</div>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col
						cols="12"
						md="6"
						:style="step && step.title === 'Agendamientos' ? 'z-index: 3' : ''"
					>
						<div class="text-h6 mb-5" style="color: #3c3c3b">
							Anticipación de agendamiento:
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
						<card-onboarding
							v-if="step && step.title === 'Agendamientos'"
							style="position: absolute; top: -20px; left: 40px; z-index: 3"
							arrow="arrow-bottom"
							:next="
								() => ({
									title: 'Reprogramación',
									tab: 2,
									card: {
										title: 'Reprogramación',
										description:
											'Establezca la anticipación con que le pueden reagendar',
									},
									route: 'dashboard-perfil',
								})
							"
						/>
					</v-col>
					<v-col
						cols="12"
						md="6"
						:style="step && step.title === 'Reprogramación' ? 'z-index: 3' : ''"
					>
						<div class="text-h6 mb-5" style="color: #3c3c3b">
							<v-tooltip v-if="isFree" right max-width="300" color="white">
								<template #activator="{ on, attrs }">
									<v-btn icon v-bind="attrs" v-on="on">
										<icon :icon="mdiAlertOutline" color="red" />
									</v-btn>
								</template>
								<div class="elevation-5 pa-3">
									<span class="black--text">
										Esta opción se activará contratando un plan premium
									</span>
								</div>
							</v-tooltip>

							Anticipación de reprogramación:
						</div>
						<div>
							<v-select
								:value="psychologist.preferences.minimumRescheduleSession"
								filled
								:disabled="isFree"
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
						<card-onboarding
							v-if="step && step.title === 'Reprogramación'"
							style="position: absolute; top: -20px; left: 52%; z-index: 3"
							arrow="arrow-bottom"
							:next="
								() => ({
									title: 'Valor por sesión',
									tab: 2,
									card: {
										title: 'Valor por sesión',
										description:
											'Configure el valor por sesiones de 50 minutos.',
									},
									route: 'dashboard-perfil',
								})
							"
						/>
					</v-col>
					<v-col cols="12" class="text-h6" style="color: #3c3c3b">
						Valor por sesión
						<v-tooltip right max-width="300" color="white">
							<template #activator="{ on, attrs }">
								<v-btn
									icon
									v-bind="attrs"
									v-on="on"
									@click="
										() => {
											if ($vuetify.breakpoint.smAndDown) tooltip = true;
										}
									"
								>
									<icon :icon="mdiInformationOutline" />
								</v-btn>
							</template>
							<div class="elevation-5 pa-3">
								<span class="primary--text">
									Aqui podras configurar el precio de tus sesiones
								</span>
							</div>
						</v-tooltip>
						<v-dialog v-model="tooltip" max-width="400">
							<v-card>
								<v-card-title class="caption">
									Aqui podras configurar el precio de tus sesiones
								</v-card-title>
							</v-card>
						</v-dialog>
					</v-col>
					<v-col cols="12" style="position: relative">
						<v-alert prominent text color="info">
							<div style="color: #0079ff" class="px-md-6 py-4 font-weight-medium">
								Puede establecer el precio de su sesión solo por primera vez. Para
								cambiar tendrás que contactarnos.
							</div>
						</v-alert>
						<card-onboarding
							v-if="step && step.title === 'Valor por sesión'"
							style="position: absolute; top: -40px; left: 40px; z-index: 3"
							arrow="arrow-bottom"
							:next="
								() => {
									setStep(null);
									setOnBoarding(true);
								}
							"
						/>
					</v-col>
					<v-col
						cols="12"
						md="4"
						:style="step && step.title === 'Valor por sesión' ? 'z-index: 3' : ''"
					>
						<div class="body-1 font-weight-medium mb-3" style="color: #5f5f5f">
							Sesión 50 min
						</div>
						<div>
							<v-text-field
								:value="video"
								outlined
								filled
								suffix="CLP"
								type="number"
								hint="Precio de la session de video sin puntos ni comas"
								@input="setPrice"
							>
							</v-text-field>
						</div>
					</v-col>
					<v-col cols="12" class="text-h6" style="color: #3c3c3b">
						<div>
							<v-tooltip v-if="isFree" right max-width="300" color="white">
								<template #activator="{ on, attrs }">
									<v-btn icon v-bind="attrs" v-on="on">
										<icon :icon="mdiAlertOutline" color="red" />
									</v-btn>
								</template>
								<div class="elevation-5 pa-3">
									<span class="black--text">
										Esta opción se activará contratando un plan premium
									</span>
								</div>
							</v-tooltip>
							Nuevos clientes
							<v-tooltip right max-width="300" color="white">
								<template #activator="{ on, attrs }">
									<v-btn icon v-bind="attrs" v-on="on">
										<icon :icon="mdiInformationOutline" />
									</v-btn>
								</template>
								<div class="elevation-5 pa-3">
									<span class="primary--text">
										Al desactivarlo, su perfil dejará de aparecer en la
										búsqueda. Esto no impide que los clientes antiguos o nuevos
										accedan a su perfil directamente a través de su enlace.
									</span>
								</div>
							</v-tooltip>
						</div>
						<div v-if="psychologist.preferences" class="mt-8">
							<v-switch
								v-model="marketplaceVisibility"
								:disabled="isFree"
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
	</div>
</template>

<script>
import { mdiInformationOutline, mdiAlertOutline } from '@mdi/js';
import { mapGetters, mapActions, mapMutations } from 'vuex';

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
			mdiAlertOutline,
			mdiInformationOutline,
			tooltip: false,
			hours: [
				{ value: 1, text: '1 hora' },
				{ value: 2, text: '2 horas' },
				{ value: 3, text: '3 horas' },
				{ value: 6, text: '6 horas' },
				{ value: 12, text: '12 horas' },
				{ value: 24, text: '24 horas' },
			],
			video: 0,
			loading: false,
			marketplaceVisibility: false,
		};
	},
	computed: {
		isFree() {
			const length = this.psychologist.psyPlans.length;
			return this.psychologist.psyPlans[length - 1].tier === 'free';
		},
		...mapGetters({ step: 'User/step' }),
	},
	mounted() {
		this.video = this.psychologist.sessionPrices.video;
		this.marketplaceVisibility = this.psychologist.preferences.marketplaceVisibility;
	},
	methods: {
		async onSubmit() {
			this.loading = true;
			const psychologist = await this.updatePsychologist(this.psychologist);
			this.setPsychologist(psychologist);
			this.video = psychologist.sessionPrices.video;
			this.loading = false;
		},
		setPrice(e) {
			if (this.verifyOnlyNumbers(e)) {
				this.video = Number(e);
			} else {
				this.video = Number(e.split('.').join(''));
			}
			const sessionPrices = {
				video: Math.round(this.video),
				text: Math.round(this.video * 0.75),
				full: Math.round(this.video * 1.25),
			};
			this.setPsychologist({
				...this.psychologist,
				sessionPrices,
			});
		},
		verifyOnlyNumbers(value) {
			const regex = /^[0-9]*$/;
			return regex.test(value.toString());
		},
		...mapMutations({
			setOnBoarding: 'User/setOnBoarding',
			setStep: 'User/setStep',
		}),
		...mapActions({
			updatePsychologist: 'Psychologist/updatePsychologist',
		}),
	},
};
</script>
