<template>
	<div></div>
</template>

<script>
export default {
	head() {
		return {
			title: 'Quiero comenzar',
			meta: [
				{
					hid: 'descripción',
					nombre: 'descripción',
					contenido: 'Registrate y ¡Empezar ahora!',
				},
			],
		};
	},
	mounted() {
		window.location.href = `${this.$config.FRONTEND_URL}/auth/q=register`;
	},
};
</script>
