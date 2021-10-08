<template>
	<div>
		<Ubicacion :location="comuna" />
	</div>
</template>

<script>
export default {
	name: 'UbicacionSlug',
	components: {
		Ubicacion: () => import('~/components/psicologos/Ubicacion'),
	},
	async asyncData({ params, $config, redirect }) {
		try {
			const response = await fetch(`${$config.API_ABSOLUTE}/comunas.json`, { method: 'get' });
			const comunas = await response.json();
			const item = comunas.find(el => el.comuna.slug === params.slug);
			return { comuna: item.comuna };
		} catch (e) {
			redirect('/psicologos');
		}
	},
	head() {
		return {
			title: `Psicólogos en ${this.$route.params.slug} | Hablaquí`,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: `Nuestros psicólogos en ${this.$route.params.slug}`,
				},
				{
					hid: 'twitter:url',
					name: 'twitter:url',
					content: process.env.VUE_APP_LANDING + '/' + this.$route.params.slug,
				},
				{
					hid: 'twitter:title',
					name: 'twitter:title',
					content: `Nuestros psicólogos en ${this.$route.params.slug}`,
				},
				{
					hid: 'og:url',
					property: 'og:url',
					content: process.env.VUE_APP_LANDING + '/' + this.$route.params.slug,
				},
				{
					hid: 'og:title',
					property: 'og:title',
					content: `Nuestros psicólogos en ${this.$route.params.slug}`,
				},
			],
			link: [
				{
					rel: 'canonical',
					href: `${this.$config.LANDING_URL}/psicologos/${this.$route.params.slug}/`,
				},
			],
		};
	},
};
</script>
