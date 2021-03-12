<template>
	<v-app style="background-color: #F0F8FF">
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

<style>
.v-text-field.v-text-field--enclosed {
	border-radius: 10px;
	padding: 1px !important;
}

.v-btn i:hover {
	transform: scale(1.15);
}

.v-btn {
	text-transform: none !important;
}
</style>
