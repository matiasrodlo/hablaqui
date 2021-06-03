<template>
	<div></div>
</template>

<script>
export default {
	head() {
		return {
			title: 'Entrar | Hablaquí',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: 'Ingresa y ¡Empezar ahora!',
				},
			],
		};
	},
	mounted() {
		window.location.href = `${this.$config.FRONTEND_URL}/auth/q=register`;
	},
};
</script>
