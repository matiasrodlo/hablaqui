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
			const item = comunas.find(el => el.comuna.slug === params.ubicacion);
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
					href: `${this.$config.LANDING_URL}psicologos/${this.$route.params.ubicacion}/`,
				},
			],
		};
	},
};
</script>
