<template>
	<div>
		<Ubicacion />
	</div>
</template>

<script>
export default {
	components: {
		Ubicacion: () => import('~/components/psicologos/Ubicacion'),
	},
};
</script>