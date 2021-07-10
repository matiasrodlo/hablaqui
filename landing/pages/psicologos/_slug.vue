<template>
	<div>
		<Ubicacion :location="comuna" />
	</div>
</template>

<script>
export default {
	components: {
		Ubicacion: () => import('~/components/psicologos/Ubicacion'),
	},
	async asyncData({ params, payload, $config }) {
		if (payload) return { comuna: payload };
		else {
			const response = await fetch(`${$config.LANDING_URL}/comunas.json`);
			const comunas = response.json();
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
