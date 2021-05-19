<template>
	<div>
		data:
		<pre>{{ article }}</pre>
	</div>
</template>

<script>
export default {
	data() {
		return {
			article: null,
		};
	},
	async mounted() {
		let response = await fetch(`${this.$config.API_URL}/blog/${this.$route.params.slug}`);
		response = await response.json();
		this.article = response.article;
		// eslint-disable-next-line no-console
		console.log(this.articles);
	},
};
</script>
