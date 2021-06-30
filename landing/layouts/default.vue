<template>
	<v-app>
		<nuxt />
	</v-app>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';

export default {
	mounted() {
		if (process.browser) {
			const psicologos = JSON.parse(localStorage.getItem('psychologists'));
			if (psicologos && psicologos.length) this.setPsychologists(psicologos);
		}
		this.initialFetch();
	},
	methods: {
		async initialFetch() {
			await this.getAppointments();
			this.getPsychologists();
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			getPsychologists: 'Psychologist/getPsychologists',
		}),
		...mapMutations({
			setLoading: 'Psychologist/setLoading',
			setPsychologists: 'Psychologist/setPsychologists',
		}),
	},
};
</script>
