<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<div style="margin-bottom: 140px">
			<Appbar />
		</div>
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
	</div>
</template>

<script>
import dayjs from 'dayjs';
import { mapActions, mapGetters } from 'vuex';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

export default {
	components: {
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
			plan: null,
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
			plans: 'User/plan',
		}),
	},
	jsonld() {
		return {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			leaglName: 'Hablaquí',
			url: 'http://app.hablaqui.cl/psicologos',
			email: 'soporte@hablaqui.cl',
			slogan: 'Psicólogo y terapia online de calidad sin salir de casa',
			logo: 'https://app.hablaqui.cl/logo_tiny.png',
		};
	},
	created() {
		this.hasSessions =
			this.plan &&
			this.plan.payment === 'success' &&
			dayjs(Date.now()).isBefore(dayjs(this.plan.expiration)) &&
			this.plan.psychologist === this.psychologist._id &&
			this.plan.remainingSessions > 0;
	},
	async mounted() {
		this.plan =
			this.plans && this.plans.sortedPlans.length > 0 ? this.plans.sortedPlans[0] : null;
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
