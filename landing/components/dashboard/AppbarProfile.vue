<template>
	<v-app-bar style="border-radius: 50px" color="white" light height="110" flat>
		<h1 class="primary--text">{{ $route.meta.title }}</h1>
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
			<v-icon color="primary"> mdi-logout </v-icon>
		</v-btn>
	</v-app-bar>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	methods: {
		logout() {
			this.resetUser();
			localStorage.removeItem('vuex');
			this.$router.push({ name: 'auth' });
		},
		...mapMutations({ resetUser: 'User/reset' }),
	},
};
</script>
