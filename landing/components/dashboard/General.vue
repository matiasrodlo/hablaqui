<template>
	<div v-if="$auth.$state.user">
		<div class="hidden-md-and-up">
			<v-card to="perfil/configuracion-personal" elevation="4" class="my-4" rounded>
				<v-card-text class="body-2 font-weight-bold secondary--text">
					Configuración personal
				</v-card-text>
			</v-card>
			<template v-if="$auth.$state.user.role === 'specialist'">
				<v-card to="perfil/datos-bancarios" elevation="4" class="my-4" rounded>
					<v-card-text class="body-2 font-weight-bold secondary--text">
						Datos bancarios
					</v-card-text>
				</v-card>
				<v-card to="perfil/informacion-general" elevation="4" class="my-4" rounded>
					<v-card-text class="body-2 font-weight-bold secondary--text">
						Información profesional
					</v-card-text>
				</v-card>
				<v-card to="perfil/experiencia-formacion" elevation="4" class="my-4" rounded>
					<v-card-text class="body-2 font-weight-bold secondary--text">
						Experiencia y formación
					</v-card-text>
				</v-card>
			</template>
		</div>
		<v-expansion-panels
			v-model="panel"
			multiple
			class="hidden-sm-and-down mb-4"
			:style="step && step.title === 'Datos bancarios' ? 'z-index: 3' : ''"
		>
			<v-expansion-panel
				:disabled="!!step"
				:style="step && step.title === 'Datos bancarios' ? 'opacity: 0.3' : ''"
			>
				<v-expansion-panel-header>
					<div>
						<div class="text-h6" style="color: #3c3c3b">
							Información personal
							<v-progress-circular
								v-if="!psychologist && $auth.$state.user.role === 'specialist'"
								size="20"
								indeterminate
								color="primary"
							></v-progress-circular>
						</div>
						<div class="text--secondary">
							Nombre, apellido, zona horaria, telefono, contraseña, entre otros
						</div>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<update-profile
						:psychologist="psychologist"
						:set-psychologist="setPsychologist"
					/>
					<update-password />
				</v-expansion-panel-content>
			</v-expansion-panel>

			<v-expansion-panel v-if="$auth.$state.user.role === 'specialist'">
				<v-expansion-panel-header style="position: relative">
					<div>
						<div class="text-h6" style="color: #3c3c3b">
							Datos bancarios
							<v-progress-circular
								v-if="!psychologist"
								size="20"
								indeterminate
								color="primary"
							></v-progress-circular>
						</div>
						<div class="text--secondary">
							Cada miercoles transferiremos las sesiones de la semana anterior
						</div>
						<card-onboarding
							v-if="step && step.title === 'Datos bancarios'"
							style="position: absolute; top: -65px; left: 30%; z-index: 3"
							arrow="arrow-left"
							:next="
								() => {
									return {
										title: 'Horarios',
										tab: 1,
										card: {
											title: 'Disponibilidad',
											description:
												'Establezca fácilmente sus horarios de atención al público.',
										},
										route: 'dashboard-perfil',
									};
								}
							"
						/>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content v-if="psychologist">
					<bank-data :psychologist="psychologist" :set-psychologist="setPsychologist" />
				</v-expansion-panel-content>
			</v-expansion-panel>

			<v-expansion-panel
				v-if="$auth.$state.user.role === 'specialist'"
				:disabled="!!step"
				:style="step && step.title === 'Datos bancarios' ? 'opacity: 0.3' : ''"
			>
				<v-expansion-panel-header>
					<div>
						<div class="text-h6" style="color: #3c3c3b">
							Información profesional
							<v-progress-circular
								v-if="!psychologist"
								size="20"
								indeterminate
								color="primary"
							></v-progress-circular>
						</div>
						<div class="text--secondary">
							Datos profesionales, descripción personal y profesional
						</div>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content v-if="psychologist">
					<information-general-psi
						:psychologist="psychologist"
						:set-psychologist="setPsychologist"
					/>
				</v-expansion-panel-content>
			</v-expansion-panel>

			<v-expansion-panel
				v-if="$auth.$state.user.role === 'specialist'"
				:disabled="!!step"
				:style="step && step.title === 'Datos bancarios' ? 'opacity: 0.3' : ''"
			>
				<v-expansion-panel-header>
					<div>
						<div class="text-h6" style="color: #3c3c3b">
							Experiencia y formación
							<v-progress-circular
								v-if="!psychologist"
								size="20"
								indeterminate
								color="primary"
							></v-progress-circular>
						</div>
						<div class="text--secondary">
							Modelo terapéutico, especialidades, experiencia y formación
						</div>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content v-if="psychologist">
					<experiencia-formacion
						:psychologist="psychologist"
						:set-psychologist="setPsychologist"
					/>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	components: {
		UpdateProfile: () => import('~/components/dashboard/UpdateProfile'),
		UpdatePassword: () => import('~/components/dashboard/UpdatePassword'),
		BankData: () => import('~/components/dashboard/BankData'),
		InformationGeneralPsi: () => import('~/components/dashboard/InformationGeneralPsi'),
		ExperienciaFormacion: () => import('~/components/dashboard/ExperienciaFormacion'),
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
		setView: {
			type: Function,
			default: () => null,
		},
	},
	data() {
		return {
			panel: [],
		};
	},
	computed: {
		...mapGetters({ step: 'User/step' }),
	},
};
</script>
