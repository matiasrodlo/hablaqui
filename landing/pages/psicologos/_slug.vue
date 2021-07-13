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
	async asyncData({ params, payload, $config }) {
		if (payload) return { comuna: payload };
		else {
			const response = await fetch(`${$config.API_ABSOLUTE}/comunas.json`, { method: 'get' });
			const comunas = await response.json();
			const item = comunas.find(el => el.comuna.slug === params.slug);
			return { comuna: item.comuna };
		}
	},
	head() {
		return {
			title: `Psicologos en ${this.comuna ? this.comuna.name : ''} | Hablaquí`,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: `Nuestros psicologos en ${this.comuna ? this.comuna.name : ''}`,
				},
				{
					hid: 'twitter:url',
					name: 'twitter:url',
					content: process.env.VUE_APP_LANDING + '/' + this.$route.params.slug,
				},
				{
					hid: 'twitter:title',
					name: 'twitter:title',
					content: `Nuestros psicologos en ${this.comuna.name}`,
				},
				{
					hid: 'og:url',
					property: 'og:url',
					content: process.env.VUE_APP_LANDING + '/' + this.$route.params.slug,
				},
				{
					hid: 'og:title',
					property: 'og:title',
					content: `Nuestros psicologos en ${this.comuna.name}`,
				},
			],
			link: [
				{
					rel: 'canonical',
					href: `${this.$config.LANDING_URL}psicologos/${this.$route.params.slug}/`,
				},
			],
		};
	},
};
</script>
