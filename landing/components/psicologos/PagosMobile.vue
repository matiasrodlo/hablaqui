<template>
	<div>
		{{ psychologist }}
	</div>
</template>

<script>
export default {
	props: {
		psychologist: {
			type: Object,
			default: null,
		},
	},
};
</script>
