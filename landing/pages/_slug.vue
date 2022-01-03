<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<appbar />
		<!-- desktop -->
		<profile-desktop
			:psychologist="psychologist"
			:set-psychologist="setPsychologist"
			class="hidden-sm-and-down"
		/>
		<!-- mobile -->
		<profile-mobile
			:psychologist="psychologist"
			:set-psychologist="setPsychologist"
			class="hidden-md-and-up"
		/>
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
		ProfileDesktop: () =>
			import(
				/* webpackChunkName: "PsicologosDesktop" */ '~/components/psicologos/ProfileDesktop'
			),
		ProfileMobile: () =>
			import(
				/* webpackChunkName: "PsicologosMobile" */ '~/components/psicologos/ProfileMobile'
			),
	},
	async asyncData({ $axios, params, error }) {
		try {
			const { psychologist } = await $axios.$get(`/psychologists/one/${params.slug}`);
			return { psychologist };
		} catch (e) {
			error({ statusCode: 404, message: 'Post not found' });
		}
	},
	head() {
		return {
			title: `${
				this.psychologist ? this.psychologist.name + ' ' + this.psychologist.lastName : ''
			} | Hablaquí`,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: this.psychologist ? this.psychologist.professionalDescription : '',
				},
				{
					hid: 'twitter:url',
					name: 'twitter:url',
					content: process.env.VUE_APP_LANDING + '/' + this.$route.params.slug,
				},
				{
					hid: 'twitter:title',
					name: 'twitter:title',
					content: `${this.psychologist.name + this.psychologist.lastName} | Hablaquí`,
				},
				{
					hid: 'twitter:description',
					name: 'twitter:description',
					content: this.psychologist.professionalDescription,
				},
				{
					hid: 'twitter:image',
					name: 'twitter:image',
					content: this.psychologist.avatar,
				},
				{
					hid: 'og:url',
					property: 'og:url',
					content: process.env.VUE_APP_LANDING + '/' + this.$route.params.slug,
				},
				{
					hid: 'og:title',
					property: 'og:title',
					content: `${this.psychologist.name + this.psychologist.lastName} | Hablaquí`,
				},
				{
					hid: 'og:description',
					property: 'og:description',
					content: this.psychologist.professionalDescription,
				},
				{
					hid: 'og:image',
					property: 'og:image',
					content: this.psychologist.avatar,
				},
				{
					hid: 'og:image:secure_url',
					property: 'og:image:secure_url',
					content: this.psychologist.avatar,
				},
				{
					hid: 'og:image:alt',
					property: 'og:image:alt',
					content: this.psychologist.name,
				},
			],
			link: [
				{
					rel: 'canonical',
					href: `https://cdn.hablaqui.cl/static/${this.psychologist.username}/`,
				},
			],
		};
	},
	methods: {
		setPsychologist(value) {
			this.psychologist = value;
		},
	},
};
</script>
