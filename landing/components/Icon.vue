<template>
	<v-icon
		:color="color"
		:large="large"
		:left="left"
		:right="right"
		:small="small"
		:x-large="xLarge"
		:x-small="xSmall"
		:size="size"
	>
		{{ icon }}
	</v-icon>
</template>

<script>
/**
 * componente para visualizar icono
 */
export default {
	props: {
		size: {
			type: String,
			default: '',
		},
		xLarge: {
			type: Boolean,
			default: false,
		},
		large: {
			type: Boolean,
			default: false,
		},
		xSmall: {
			type: Boolean,
			default: false,
		},
		small: {
			type: Boolean,
			default: false,
		},
		left: {
			type: Boolean,
			default: false,
		},
		right: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: String,
			default: '',
		},
		color: {
			type: String,
			default: 'primary',
		},
	},
};
</script>
