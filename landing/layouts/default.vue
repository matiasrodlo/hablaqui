<template>
	<v-app>
		<nuxt />
	</v-app>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';

export default {
	mounted() {
		this.initialFetch();
	},
	methods: {
		async initialFetch() {
			await this.getPsychologists();
			await this.getAppointments();
			this.setLoading();
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			getPsychologists: 'Psychologist/getPsychologists',
		}),
		...mapMutations({
			setLoading: 'Psychologist/setLoading',
		}),
	},
};
</script>
