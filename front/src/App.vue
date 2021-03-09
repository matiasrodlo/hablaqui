<template>
	<v-app>
		<component :is="$route.meta.layout">
			<router-view />
		</component>
	</v-app>
</template>

<script>
export default {
	name: 'App',

	data: () => ({
		//
	}),
};
</script>
