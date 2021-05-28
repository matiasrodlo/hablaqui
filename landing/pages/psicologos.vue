<template>
	<div></div>
</template>

<script>
export default {
	head() {
		return {
			title: 'Psicologos',
			meta: [
				{
					hid: 'descripción',
					nombre: 'descripción',
					contenido:
						'Encuentra un psicólogo online y cuida tu salud emocional sin salir de casa. Contamos con terapeutas y entrenadores de todas las especialidades. ¡Empezar ahora!',
				},
			],
		};
	},
	mounted() {
		window.location.href = `${this.$config.FRONTEND_URL}/psicologos/todos`;
	},
};
</script>
