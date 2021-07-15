<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<appbar />
		<!-- routing for child -->
		<psicologos />
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
		psicologos: () => import('~/components/psicologos/psicologos'),
	},
	head() {
		return {
			meta: [
				{
					hid: 'twitter:url',
					name: 'twitter:url',
					content: process.env.VUE_APP_LANDING + '/psicologos',
				},
				{
					hid: 'og:url',
					property: 'og:url',
					content: process.env.VUE_APP_LANDING + '/psicologos',
				},
			],
			link: [
				{
					rel: 'canonical',
					href: `${this.$config.LANDING_URL}/psicologos/`,
				},
			],
		};
	},
	jsonld() {
		return {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			leaglName: 'Hablaquí',
			url: 'http://hablaqui.cl/psicologos',
			email: 'c@hablaqui.com',
			slogan: 'Psicólogo y terapia online de calidad sin salir de casa',
			logo: 'https://hablaqui.cl/logo_tiny.png',
		};
	},
};
</script>
