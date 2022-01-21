<template>
	<v-app>
		<snackbar />
		<nuxt :keep-alive="$route.name === 'psicologos'" />
		<template
			v-if="
				$route.name !== 'index' &&
				$route.name !== 'para-especialistas' &&
				$auth.$state.loggedIn &&
				$auth.$state.user.role == 'user'
			"
		>
			<client-only v-if="$route.name !== 'psicologos'">
				<floating-chat />
			</client-only>
		</template>
	</v-app>
</template>
<script>
import Snackbar from '@/components/Snackbar';
import { mapActions } from 'vuex';

export default {
	components: {
		Snackbar,
		FloatingChat: () => import('@/components/dashboard/FloatingChat'),
	},
	async mounted() {
		await this.getPsychologists();
	},
	methods: {
		...mapActions({
			getPsychologists: 'Psychologist/getPsychologists',
		}),
	},
};
</script>
