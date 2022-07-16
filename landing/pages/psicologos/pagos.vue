<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<appbar />
		<!-- desktop -->
		<template v-if="!loadingPsychologist">
			<pagos-desktop
				:psychologist="psychologist"
				:has-sessions="hasSessions"
				class="mt-10 hidden-sm-and-down"
			/>
			<!-- mobile -->
			<pagos-mobile
				:psychologist="psychologist"
				:has-sessions="hasSessions"
				class="mt-10 hidden-md-and-up"
			/>
		</template>
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
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

export default {
	components: {
		Footer: () => import('~/components/Footer'),
		Appbar: () => import('~/components/AppbarWhite'),
		PagosDesktop: () =>
			import(
				/* webpackChunkName: "PsicologosDesktop" */ '~/components/psicologos/PagosDesktop'
			),
		PagosMobile: () =>
			import(
				/* webpackChunkName: "PsicologosMobile" */ '~/components/psicologos/PagosMobile'
			),
	},
	async asyncData({ query, $axios, error }) {
		try {
			const { psychologist } = await $axios.$get(`/psychologists/one/${query.username}`);
			return { psychologist };
		} catch (e) {
			error({ statusCode: 404, message: 'Page not found' });
		}
	},
	data() {
		return {
			loadingPsychologist: false,
			loadingSession: false,
			hasSessions: false,
			psychologist: null,
		};
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
					href: process.env.VUE_APP_LANDING + '/psicologos/',
				},
			],
		};
	},
	computed: {
		...mapGetters({
			plan: 'User/plan',
		}),
	},
	jsonld() {
		return {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			leaglName: 'Hablaquí',
			url: 'http://hablaqui.cl/psicologos',
			email: 'soporte@hablaqui.cl',
			slogan: 'Psicólogo y terapia online de calidad sin salir de casa',
			logo: 'https://hablaqui.cl/logo_tiny.png',
		};
	},
	created() {
		this.hasSessions =
			this.plan &&
			this.plan.payment === 'success' &&
			moment().isBefore(moment(this.plan.expiration)) &&
			this.plan.psychologist === this.psychologist._id &&
			this.plan.remainingSessions > 0;
	},
	async mounted() {
		window.scrollTo(0, 0);
		if (this.hasSessions) {
			await this.newSession();
		}
	},
	methods: {
		async newSession() {
			this.loadingSession = true;
			const payload = {
				date: `${this.$route.query.date} ${this.$route.query.start}`,
				sessionNumber: this.plan.session.length + 1,
				remainingSessions: (this.plan.remainingSessions -= 1),
			};
			await this.addSession({
				id: this.plan.idSessions,
				idPlan: this.plan._id,
				payload,
			});
			await this.$auth.fetchUser();
			this.loadingSession = false;
			this.$router.push({ name: 'dashboard-agenda' });
		},
		...mapActions({
			addSession: 'Psychologist/addSession',
		}),
	},
};
</script>
