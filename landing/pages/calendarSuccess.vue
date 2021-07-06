<template lang="">
	<div>
		<p>Acceso otorgado.</p>
	</div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
	created() {
		const code = this.$route.query.code;
		this.saveToken(code);
	},
	methods: {
		...mapActions({
			saveToken: 'Calendar/saveToken',
		}),
	},
};
</script>
<style lang=""></style>
