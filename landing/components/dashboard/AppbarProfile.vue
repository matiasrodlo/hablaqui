<template>
	<v-app-bar style="border-radius: 50px" color="white" light height="110" flat>
		<h1 class="primary--text">{{ title }}</h1>
		<v-spacer></v-spacer>
		<div class="mx-5 body-1 primary--text">
			<router-link
				v-if="$auth.$state.user && $auth.$state.user.role == 'user'"
				style="text-decoration: none"
				:to="{ name: 'psicologos' }"
			>
				Psicólogos
			</router-link>
		</div>
		<div class="mx-5 body-1 primary--text">
			<a style="text-decoration: none" to="/faq"> Centro de ayuda </a>
		</div>
		<v-btn class="ml-2" small fab color="white" @click="logout">
			<icon :icon="mdiLogout" />
		</v-btn>
	</v-app-bar>
</template>

<script>
import { mdiLogout } from '@mdi/js';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		title: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			mdiLogout,
		};
	},
	methods: {
		logout() {
			this.$auth.logout();
			this.$router.push('/auth');
		},
	},
};
</script>
