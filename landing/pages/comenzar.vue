<template>
	<div></div>
</template>

<script>
export default {
	head() {
		return {
			title: 'Quiero comenzar | Hablaquí',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: 'Registrate y ¡Empezar ahora!',
				},
			],
		};
	},
	mounted() {
		window.location.href = `${this.$config.FRONTEND_URL}/auth/q=register`;
	},
};
</script>
