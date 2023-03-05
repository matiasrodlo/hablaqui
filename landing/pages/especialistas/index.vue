<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<appbar />
		<!-- desktop -->
		<especialistas-desktop
			:loading-specialist="loadingSpecialist"
			:get-sessions-limit="getSessions"
			class="mt-10 hidden-sm-and-down"
		/>
		<!-- mobile -->
		<especialistas-mobile
			:loading-specialist="loadingSpecialist"
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
import EspecialistasDesktop from '~/components/especialistas/EspecialistasDesktop';
import EspecialistasMobile from '~/components/especialistas/EspecialistasMobile';
import Footer from '~/components/Footer';
import Appbar from '~/components/AppbarWhite';
/**
 * Pagina inicial de especialistas
 */
export default {
	components: {
		// eslint-disable-next-line vue/no-reserved-component-names
		Footer,
		Appbar,
		EspecialistasDesktop,
		EspecialistasMobile,
	},
	head() {
		return {
			meta: [
				{
					hid: 'twitter:url',
					name: 'twitter:url',
					content: process.env.VUE_APP_LANDING + '/especialistas/',
				},
				{
					hid: 'og:url',
					property: 'og:url',
					content: process.env.VUE_APP_LANDING + '/especialistas/',
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
					href: process.env.VUE_APP_LANDING + '/especialistas/',
				},
			],
		};
	},
	jsonld() {
		return {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			leaglName: 'Hablaquí',
			url: 'http://app.hablaqui.cl/especialistas/',
			email: 'soporte@hablaqui.cl',
			slogan: 'Especialista y terapia online de calidad sin salir de casa',
			logo: 'https://app.hablaqui.cl/logo_tiny.png',
		};
	},
	computed: {
		...mapGetters({
			loadingSpecialist: 'Specialist/loadingSpecialist',
			matchMaking: 'Specialist/matchMaking',
		}),
	},
	created() {
		if (!this.$auth.$state.loggedIn) this.$router.push('/auth');
	},
	mounted() {
		window.scrollTo(0, 0);
		this.initialFetch();
	},
	methods: {
		/**
		 * obtiene los datos iniciales
		 */
		async initialFetch() {
			if (this.$auth.$state.loggedIn) {
				await this.getMatchMakig(this.$auth.$state.user._id);
				if (!this.matchMaking) {
					this.$router.push('evaluacion');
				} else {
					await this.getSpecialistsBestMatchId();
					await this.getSpecialistsBestMatch();
				}
			}
			await this.getAppointments();
		},
		/**
		 * Obtiene la sessiones segun los ids pasados
		 */
		getSessions(ids) {
			this.getSessionsLimit(ids);
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			getSessionsLimit: 'Specialist/getSessionsLimit',
			getMatchMakig: 'Specialist/getMatchMakig',
			getSpecialistsBestMatch: 'Specialist/getSpecialistsBestMatch',
			getSpecialists: 'Specialist/getSpecialists',
			getSpecialistsBestMatchId: 'Specialist/getSpecialistsBestMatchId',
		}),
	},
};
</script>
