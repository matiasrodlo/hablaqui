<template>
	<div>
		<v-navigation-drawer v-if="!$vuetify.breakpoint.mdAndUp" v-model="drawer" app>
			<v-list-item link :href="`${landing_page}`">
				<v-img style="max-width: 150px" src="/img/logo.png" alt="hablaqui Logo" />
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item
					link
					active-class="primary white--text"
					:to="{ name: 'all-psicologos' }"
				>
					<v-list-item-content>
						<v-list-item-title>Psicólogos</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link :href="`${landing_page}/faq`">
					<v-list-item-content>
						<v-list-item-title>Preguntas frecuentes</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link :href="`${landing_page}/blog`">
					<v-list-item-content>
						<v-list-item-title>Blog</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item v-if="loggedIn" @click="logout">
					<v-list-item-content>
						<v-list-item-title>Cerrar sesión</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item v-else link :to="{ name: 'auth' }">
					<v-list-item-content>
						<v-list-item-title>Iniciar sesión</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item v-if="loggedIn" link :to="{ name: 'auth', params: { q: 'register' } }">
					<v-list-item-content>
						<v-list-item-title>Comenzar</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<div style="height: 180px; overflow: hidden">
			<svg
				class="shadow"
				preserveAspectRatio="none"
				viewBox="0 0 1080 216.49"
				style="height: 100%; width: 100%"
			>
				<path
					style="fill: white"
					d="M.16-18.79V122.75c6.88,1,20.8,2.92,38.31,5.1,0,0,215.57,25.78,403,14.18,18.33-1.13,40.69-2.8,83.59-5.21,129.36-7.25,216.16-14.1,298.68-8.34a1547.37,1547.37,0,0,1,256.14,39.69v-187Z"
				/>
			</svg>
		</div>
		<v-app-bar absolute flat height="115" color="transparent">
			<a :href="`${landing_page}`">
				<v-img style="max-width: 160px" alt="hablaqui Logo" src="/img/logo.png" contain />
			</a>
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<router-link
					:to="{ name: 'all-psicologos' }"
					style="text-decoration: none"
					class="mx-12"
				>
					<span class="text--secondary body-1 font-weight-bold">Psicólogos</span>
				</router-link>
				<a style="text-decoration: none" class="mx-5" :href="`${landing_page}/faq`">
					<span class="text--secondary body-1 font-weight-bold">
						Preguntas frecuentes
					</span>
				</a>
				<a style="text-decoration: none" class="mx-5" :href="`${landing_page}/blog`">
					<span class="body-1 text--secondary font-weight-bold">Blog</span>
				</a>
				<v-spacer></v-spacer>
				<span v-if="loggedIn" @click="logout" class="mr-3" style="cursor: pointer">
					<span class="body-1 font-weight-bold text--secondary"> Cerrar sesión</span>
				</span>
				<router-link
					v-else
					style="text-decoration: none"
					class="mr-5"
					:to="{ name: 'auth' }"
				>
					<span class="body-1 font-weight-bold text--secondary">Iniciar sesión</span>
				</router-link>
				<v-btn
					v-if="!loggedIn"
					rounded
					class="mx-2 py-6 px-10"
					color="primary"
					depressed
					:to="{ name: 'auth', params: { q: 'register' } }"
				>
					<span class="font-weight-bold body-1">Comenzar</span>
				</v-btn>
			</template>
			<template v-else>
				<v-spacer></v-spacer>
				<v-btn icon @click="drawer = !drawer">
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</template>
		</v-app-bar>
	</div>
</template>

<script>
import { landing } from '@/config';
import { mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			drawer: false,
		};
	},
	computed: {
		landing_page() {
			return landing;
		},
		...mapGetters({ loggedIn: 'User/loggedIn' }),
	},
	methods: {
		logout() {
			this.resetUser();
			localStorage.removeItem('vuex');
			if (this.$route.meta.requiresAuth) this.$router.push({ name: 'auth' });
		},
		...mapMutations({ resetUser: 'User/reset' }),
	},
};
</script>
<style lang="scss" scoped>
.shadow {
	-webkit-filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
	filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
}
</style>
