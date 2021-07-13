<template>
	<v-container>
		<div class="mb-6">
			<h1
				class="d-inline-block text-left font-weight-bold text-h6 text-md-h4 text--secondary"
			>
				<v-icon size="40" class="grey--text lighten-1">mdi-magnify</v-icon>
				Psicólogos desde
				<span class="text-capitalize">{{ location && location.name }}</span>
			</h1>
		</div>
		<v-card outlined class="rounded-xl">
			<v-card-text class="secondary--text">
				<div class="body-1">
					<span class="primary--text font-weight-bold">
						¿Estás buscando un buen Psicólogo en
						<span class="text-capitalize">{{ location && location.name }}</span>
					</span>
					? Habla con un psicólogo en <span>{{ location && location.name }}</span> de
					forma segura y privada en línea. Agenda con total libertad cuando te resulte más
					conveniente y conéctate por videollamada desde tu teléfono, tableta o
					computadora.
				</div>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
export default {
	props: {
		location: {
			type: Object,
			default: null,
		},
	},
};
</script>

<style lang="scss" scoped></style>
