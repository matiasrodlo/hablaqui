<template>
	<div></div>
</template>

<script>
export default {
	head() {
		return {
			title: 'Entrar',
			meta: [
				{
					hid: 'descripción',
					nombre: 'descripción',
					contenido: 'Ingresa y ¡Empezar ahora!',
				},
			],
		};
	},
	mounted() {
		window.location.href = `${this.$config.FRONTEND_URL}/auth/q=register`;
	},
};
</script>
