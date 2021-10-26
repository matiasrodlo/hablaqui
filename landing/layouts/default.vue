<template>
	<v-app>
		<snackbar />
		<nuxt keep-alive />
		<template
			v-if="
				$route.name !== 'index' &&
				$route.name !== 'para-especialistas' &&
				$auth.$state.loggedIn &&
				$auth.$state.user.role == 'user'
			"
		>
			<client-only>
				<floating-chat />
			</client-only>
		</template>
	</v-app>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Snackbar from '@/components/Snackbar';

export default {
	components: {
		Snackbar,
		FloatingChat: () => import('@/components/dashboard/FloatingChat'),
	},
	computed: {
		...mapGetters({ listenerUserOnline: 'User/listenerUserOnline' }),
	},
	mounted() {
		this.initialFetch();
	},
	methods: {
		async initialFetch() {
			await this.getPsychologists();
			await this.getAppointments();
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			getPsychologists: 'Psychologist/getPsychologists',
		}),
		...mapMutations({
			setListenerUserOnline: 'User/setListenerUserOnline',
			setLoading: 'Psychologist/setLoading',
			setPsychologists: 'Psychologist/setPsychologists',
		}),
	},
};
</script>
