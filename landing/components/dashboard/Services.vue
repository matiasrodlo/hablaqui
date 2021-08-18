<template>
	<v-card outlined>
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
							v-model="one"
							filled
							outlined
							dense
							:items="hours"
							hide-details
							label="Seleccione"
						></v-select>
					</div>
				</v-col>
				<v-col cols="12" md="6">
					<div class="text-h6 mb-5" style="color: #3c3c3b">
						Anticipación para reprogramar:
					</div>
					<div>
						<v-select
							v-model="two"
							filled
							outlined
							dense
							:items="hours"
							hide-details
							label="Seleccione"
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
						<v-text-field outlined filled>
							<template #prepend>
								<v-btn disabled> <span class="secondary--text">CLP</span> </v-btn>
							</template>
						</v-text-field>
					</div>
				</v-col>
				<v-col cols="12" md="4">
					<div class="body-1 font-weight-medium mb-3" style="color: #5f5f5f">
						Sesión mensajería
					</div>
					<div>
						<v-text-field outlined filled>
							<template #prepend>
								<v-btn disabled> <span class="secondary--text">CLP</span> </v-btn>
							</template>
						</v-text-field>
					</div>
				</v-col>
				<v-col cols="12" md="4">
					<div class="body-1 font-weight-medium mb-3" style="color: #5f5f5f">
						Mensajería y videollamada
					</div>
					<div>
						<v-text-field outlined filled>
							<template #prepend>
								<v-btn disabled> <span class="secondary--text">CLP</span> </v-btn>
							</template>
						</v-text-field>
					</div>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import { mdiInformationOutline } from '@mdi/js';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiInformationOutline,
			hours: [
				{ value: '1', text: '1 hora' },
				{ value: '2', text: '2 horas' },
				{ value: '3', text: '3 horas' },
				{ value: '6', text: '6 horas' },
				{ value: '12', text: '12 horas' },
				{ value: '24', text: '24 horas' },
			],
			one: '',
			two: '',
		};
	},
};
</script>
