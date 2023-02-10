<template>
	<v-container fluid style="max-width: 1080px">
		<div class="mb-6">
			<h1
				class="d-inline-block text-left font-weight-bold text-h6 text-md-h4 text--secondary"
			>
				<icon x-large :icon="mdiMagnify" color="#BDBDBD" />
				Especialistas desde
				<span class="text-capitalize">{{ location && location.name }}</span>
			</h1>
		</div>
		<v-card flat color="transparent">
			<v-card-text class="secondary--text">
				<div class="body-1">
					<h2 class="primary--text font-weight-bold">
						¿Estás buscando un buen Especialista en
						<span class="text-capitalize">{{ location && location.name }}?</span>
					</h2>
					<br />
					<p>
						Agenda con un especialista en {{ location && location.name }} de forma
						segura y privada en línea. Agenda con total libertad cuando te resulte más
						conveniente y conéctate por videollamada desde tu teléfono, tableta o
						computadora.
					</p>
				</div>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
import { mdiMagnify } from '@mdi/js';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		location: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			mdiMagnify,
		};
	},
};
</script>

<style lang="scss" scoped></style>
