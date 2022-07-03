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
			<client-only>
				<floating-chat />
			</client-only>
		</template>
	</v-app>
</template>
<script>
import { mapActions } from 'vuex';
import Snackbar from '@/components/Snackbar';

export default {
	components: {
		Snackbar,
		FloatingChat: () => import('@/components/dashboard/FloatingChat'),
	},
	async mounted() {
		await this.getMarketplacePsychologists();
	},
	methods: {
		...mapActions({
			getMarketplacePsychologists: 'Psychologist/getMarketplacePsychologists',
		}),
	},
};
</script>
