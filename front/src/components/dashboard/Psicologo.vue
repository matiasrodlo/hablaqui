<template>
	<div>
		<template v-if="user._id == '60a0e168fd8c0f000ace3b71'">
			<v-row align="center" justify="center">
				<v-col cols="12" sm="3" class="text-center">
					<v-list-item-avatar
						:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
						class="ml-4"
					>
						<v-img
							src="https://storage.googleapis.com/plhain-staging-bucket/1623354679550-hablaqu%C3%AD-nombre-joaquin-bustos.png"
							lazy-src="https://storage.googleapis.com/plhain-staging-bucket/1623354679550-hablaqu%C3%AD-nombre-joaquin-bustos.png"
						></v-img>
					</v-list-item-avatar>
					<div class="caption text--secondary">
						Codigo 649978
					</div>
					<div>
						<v-btn
							:to="{
								name: 'psicologo',
								params: { id: '60c26d37f12991000bca3bb9' },
							}"
							text
							color="primary"
							class="mt-3"
							>Mas información</v-btn
						>
					</div>
				</v-col>
				<v-col cols="12" sm="9">
					<v-row justify="space-between">
						<v-col
							class="text-center text-sm-left font-weight-bold text-h5 text--secondary"
						>
							Joaquín Bustos
						</v-col>
						<v-col cols="12" sm="6" class="text-right">
							<v-btn color="primary" rounded :to="{ name: 'all-psicologos' }">
								Cambiar de psicologo
							</v-btn>
						</v-col>
					</v-row>
					<span
						v-for="(el, i) in [
							'Depresión',
							'Ansiedad generalizada',
							'Trastorno obsesivo compulsivo',
							'Fobia social',
							'Regulación emocional',
							'Autoestima',
							'Autoconocimiento',
							'Cambio de hábitos',
						]"
						:key="i"
					>
						<v-chip v-if="i < 6" small class="my-4 mx-1">
							{{ el }}
						</v-chip>
					</span>
					<div class="caption mt-2 text-capitalize">
						Te acompañare en el proceso en el proceso de conocerte más, exploraremos
						juntos aquello que te causa malestar, comprendiendolo y aceptandolo. En este
						proceso aprenderas a relacionarte con tus pensamientos y emociones de una
						nueva forma en la cual puedas construir una vida valiosa, gratificante y
						llena de sentido. Esto dentro de un espacio seguro, sin juicios y
						colaborativo.
					</div>
				</v-col>
			</v-row>
		</template>
		<template v-else>
			<v-card>
				<v-card-text class="text-center">
					<div
						class="headline font-weight-bold primary--text my-5 mx-auto"
						style="max-width: 340px"
					>
						Agenda con un espacialista e inicia tu viaje hacia el bienestar
					</div>
					<div class="body-1 my-5 mx-auto" style="max-width: 280px">
						Orientación psicológica en cualquier momento y lugar. Comienza a mejorar tu
						vida hoy.
					</div>
					<v-btn rounded color="primary" :to="{ name: 'all-psicologos' }">
						Buscar ahora
					</v-btn>
				</v-card-text>
			</v-card>
		</template>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters({ user: 'User/user' }),
	},
};
</script>

<style lang="scss" scoped></style>
