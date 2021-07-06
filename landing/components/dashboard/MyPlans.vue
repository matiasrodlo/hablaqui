<template>
	<div>
		<template v-if="$auth.$state.user._id == '60a0e168fd8c0f000ace3b71'">
			<v-card flat>
				<v-card-text>
					<div>
						<span class="text-h6 font-weight-bold">$22.000</span>
						<span class="body-1 text--secondary">/semanal</span>
					</div>
					<div class="primary--text body-2 font-weight-bold">
						Mensajería y Videollamada
					</div>
					<div class="body-2 mt-1">
						Chatea y habla por videollamada (30min) con un psicólogo. Respuestas vía
						texto garantizadas 5 días a la semana.
					</div>
				</v-card-text>
			</v-card>
		</template>
		<template v-else>
			<v-card>
				<v-card-text class="text-center">
					<div
						class="headline font-weight-bold primary--text my-5 mx-auto"
						style="max-width: 295px"
					>
						Adquiere nuestros planes y agenda con un espacialista
					</div>
					<div class="body-1 my-5 mx-auto" style="max-width: 280px">
						Orientación psicológica en cualquier momento y lugar. Comienza a mejorar tu
						vida hoy.
					</div>
					<v-btn rounded color="primary" to="/psicologos"> Buscar ahora </v-btn>
				</v-card-text>
			</v-card>
		</template>
	</div>
</template>
