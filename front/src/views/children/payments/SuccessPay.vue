<template>
	<div class="headline primary--text">
		{{ $route.meta.title }}
		<span v-if="updated">Tu sesion ha sido agendada!</span>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	data() {
		return {
			updated: false,
		};
	},
	created() {
		this.sessionUpdateBtn();
	},
	mounted() {},
	methods: {
		async sessionUpdateBtn() {
			const payload = {
				psyId: this.$route.params.psyId,
				userId: this.$route.params.userId,
				sessionId: this.$route.params.sessionId,
			};
			await this.updateSession(payload);
			this.updated = true;
		},
		...mapActions({
			updateSession: 'Psychologist/updateSession',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
