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
		<div v-if="$auth.$state.user.role === 'psychologist'" class="mx-5 body-1 primary--text">
			<a
				style="text-decoration: none"
				href="https://calendly.com/daniel-hablaqui/30min"
				target="_blank"
			>
				<div class="d-flex align-center">
					<v-img
						src="https://cdn.hablaqui.cl/static/demo.png"
						contain
						height="30"
						width="30"
						class="mx-2"
					></v-img>
					Agendar demo
				</div>
			</a>
		</div>
		<div v-if="$auth.$state.user.role == 'psychologist'" class="mx-5 body-1 primary--text">
			<nuxt-link style="text-decoration: none" to="/dashboard/planes">
				<div class="d-flex align-center">
					<v-img
						src="https://cdn.hablaqui.cl/static/diamond.png"
						contain
						height="30"
						width="30"
						class="mx-2"
					></v-img>
					Mi plan premium
				</div>
			</nuxt-link>
		</div>
		<div class="mx-5 body-1 primary--text">
			<a style="text-decoration: none" href="https://soporte.hablaqui.cl/hc" target="_blank">
				Centro de ayuda
			</a>
		</div>
		<v-btn class="ml-2" small elevation="1" fab color="white" @click="logout">
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
