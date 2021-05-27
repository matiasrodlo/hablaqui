<template>
	<v-app id="application" style="background-color: #F0F8FF">
		<snackbar />
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
import Snackbar from '@/components/ui/Snackbar';

export default {
	name: 'App',
	components: {
		Snackbar,
	},
};
</script>

<style>
html {
	overflow-y: auto;
	overflow-x: hidden;
}

.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)
	> .v-input__control
	> .v-input__slot
	fieldset {
	color: #e0e0e0 !important;
}

.theme--light.v-label {
	font-weight: 400;
	color: #e0e0e0;
}
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
