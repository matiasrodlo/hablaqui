<template>
	<v-app-bar style="border-radius: 50px" light height="110" flat>
		<h1 class="primary--text">{{ $route.meta.title }}</h1>
		<v-spacer></v-spacer>
		<div class="mx-5 text-h5 primary--text">
			<router-link style="text-decoration:none" :to="{ name: 'all-psicologos' }">
				Psicólogos
			</router-link>
		</div>
		<div class="mx-5 text-h5 primary--text">
			<a style="text-decoration:none" :href="`${landing_page}/faq`">
				Centro de ayuda
			</a>
		</div>
		<div class="mx-5" @click="logout">
			<v-img height="65" width="65" src="img/down.png" alt="salir" />
		</div>
	</v-app-bar>
</template>

<script>
import { landing } from '@/config';
import { mapMutations } from 'vuex';

export default {
	computed: {
		landing_page() {
			return landing;
		},
	},
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
