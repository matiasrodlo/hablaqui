<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<appbar />
		<!-- desktop -->
		<psicologos-desktop
			:loading-psychologist="loadingPsychologist"
			:get-sessions-limit="getSessions"
			class="mt-10 hidden-sm-and-down"
		/>
		<!-- mobile -->
		<psicologos-mobile
			:loading-psychologist="loadingPsychologist"
			:get-sessions-limit="getSessions"
			class="mt-10 hidden-md-and-up"
		/>
		<!-- footer -->
		<div style="background-color: #0f3860" class="mt-16">
			<v-container class="white--text py-16">
				<v-row>
					<v-col>
						disponibles a través de Hablaquí son proporcionados de forma independiente
						por profesionales en salud mental certificados. Hablaquí no proporciona
						ningún servicio de salud mental u otros dImportante: Los serviciose atención
						médica. Los profesionales en salud mental no pre-escriben medicamentos a
						través de Hablaquí. Si estás experimentando una crisis o emergencia, por
						favor comunícate a los servicios de emergencia más cercanos a tu localidad.
					</v-col>
				</v-row>
			</v-container>
		</div>
		<Footer />
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PsicologosDesktop from '~/components/psicologos/PsicologosDesktop';
import PsicologosMobile from '~/components/psicologos/PsicologosMobile';
import Footer from '~/components/Footer';
import Appbar from '~/components/AppbarWhite';

export default {
	components: {
		Footer,
		Appbar,
		PsicologosDesktop,
		PsicologosMobile,
	},
	head() {
		return {
			meta: [
				{
					hid: 'twitter:url',
					name: 'twitter:url',
					content: process.env.VUE_APP_LANDING + '/psicologos/',
				},
				{
					hid: 'og:url',
					property: 'og:url',
					content: process.env.VUE_APP_LANDING + '/psicologos/',
				},
				{
					hid: 'robots',
					name: 'robots',
					content: 'index,follow',
				},
			],
			link: [
				{
					rel: 'canonical',
					href: process.env.VUE_APP_LANDING + '/psicologos/',
				},
			],
		};
	},
	jsonld() {
		return {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			leaglName: 'Hablaquí',
			url: 'http://app.hablaqui.cl/psicologos/',
			email: 'soporte@hablaqui.cl',
			slogan: 'Psicólogo y terapia online de calidad sin salir de casa',
			logo: 'https://app.hablaqui.cl/logo_tiny.png',
		};
	},
	computed: {
		...mapGetters({ loadingPsychologist: 'Psychologist/loadingPsychologist' }),
	},
	mounted() {
		window.scrollTo(0, 0);
		this.initialFetch();
	},
	methods: {
		async initialFetch() {
			if (this.$auth.$state.loggedIn) {
				await this.getMatchMakig(this.$auth.$state.user._id);
				await this.getPsychologistsBestMatch();
			} else {
				this.getPsychologists();
			}
			await this.getAppointments();
		},
		getSessions(ids) {
			this.getSessionsLimit(ids);
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			getSessionsLimit: 'Psychologist/getSessionsLimit',
			getMatchMakig: 'Psychologist/getMatchMakig',
			getPsychologistsBestMatch: 'Psychologist/getPsychologistsBestMatch',
			getPsychologists: 'Psychologist/getPsychologists',
		}),
	},
};
</script>
