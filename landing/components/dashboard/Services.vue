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
						<v-text-field
							filled
							outlined
							readonly
							dense
							hide-details
							label="Nombre"
						></v-text-field>
					</div>
				</v-col>
				<v-col cols="12" md="6">
					<div class="text-h6 mb-5" style="color: #3c3c3b">
						Anticipación para reprogramar:
					</div>
					<div>
						<v-text-field
							filled
							outlined
							readonly
							dense
							hide-details
							label="Nombre"
						></v-text-field>
					</div>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
export default {};
</script>
