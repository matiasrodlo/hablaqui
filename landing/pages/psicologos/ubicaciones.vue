<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<appbar />
		<!-- footer -->
		<div style="background-color: #0f3860" class="mt-16">
			<v-container class="white--text py-16">
				<v-row>
					<v-col>
						Importante: Los servicios disponibles a través de Hablaquí son
						proporcionados de forma independiente por profesionales en salud mental
						certificados. Hablaquí no proporciona ningún servicio de salud mental u
						otros de atención médica. Los profesionales en salud mental no pre-escriben
						medicamentos a través de Hablaquí. Si estás experimentando una crisis o
						emergencia, por favor comunícate a los servicios de emergencia más cercanos
						a tu localidad.
					</v-col>
				</v-row>
			</v-container>
		</div>
		<Footer />
	</div>
</template>

<script>
export default {
	components: {
		Footer: () => import('~/components/Footer'),
		Appbar: () => import('~/components/AppbarWhite'),
	},
	data() {
		return {
			items: [],
		};
	},
};
</script>

<style lang="scss" scoped></style>
