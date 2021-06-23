<template>
	<v-row align="center" justify="center">
		<v-col cols="12" sm="3" class="text-center">
			<v-list-item-avatar :size="$vuetify.breakpoint.mdAndUp ? '180' : '100'" class="ml-4">
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
				<v-col class="text-center text-sm-left font-weight-bold text-h5 text--secondary">
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
			<div class="body-2 mt-2 text-capitalize">
				Te acompañare en el proceso en el proceso de conocerte más, exploraremos juntos
				aquello que te causa malestar, comprendiendolo y aceptandolo. En este proceso
				aprenderas a relacionarte con tus pensamientos y emociones de una nueva forma en la
				cual puedas construir una vida valiosa, gratificante y llena de sentido. Esto dentro
				de un espacio seguro, sin juicios y colaborativo.
			</div>
		</v-col>
	</v-row>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
