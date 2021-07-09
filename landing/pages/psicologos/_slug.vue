<template>
	<div>
		<Ubicacion :location="comuna" />
	</div>
</template>

<script>
import axios from 'axios';

export default {
	components: {
		Ubicacion: () => import('~/components/psicologos/Ubicacion'),
	},
	async asyncData({ params, payload, app, $axios }) {
		if (payload) return { comuna: payload };
		else {
			const response = await axios.get(`${app.$config.LANDING_URL}/comunas.json`);
			const comuna = response.data.find(el => el.comuna.slug === params.slug);
			return { comuna };
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
					hid: 'robots',
					name: 'robots',
					content: 'index,nofollow',
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
