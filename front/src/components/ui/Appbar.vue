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
				<v-list-item link :href="`${landing_page}faq`">
					<v-list-item-content>
						<v-list-item-title>Preguntas frecuentes</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link :href="`${landing_page}blog`">
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
		<div style="height: 150px; overflow: hidden">
			<svg
				class="shadow"
				viewBox="0 0 500 150"
				preserveAspectRatio="none"
				style="height: 100%; width: 100%"
			>
				<path
					d="M0.00,92.27 C216.83,192.92 304.30,8.39 500.00,109.03 L500.00,0.00 L0.00,0.00 Z"
					style="fill: white"
				></path>
			</svg>
		</div>
		<v-app-bar absolute flat height="100" color="transparent">
			<a :href="`${landing_page}`">
				<v-img style="max-width: 180px" alt="hablaqui Logo" src="/img/logo.png" contain />
			</a>
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<v-btn
					:to="{ name: 'all-psicologos' }"
					light
					rounded
					text
					active-class="info--text"
					class="ml-4 text-h6 text--secondary"
				>
					Psicólogos
				</v-btn>
				<v-btn
					light
					rounded
					text
					active-class="info--text"
					class="text-h6 text--secondary"
					:href="`${landing_page}faq`"
				>
					Preguntas frecuentes
				</v-btn>
				<v-btn
					light
					rounded
					text
					active-class="info--text"
					class="text-h6 text--secondary"
					:href="`${landing_page}blog`"
				>
					Blog
				</v-btn>
				<v-spacer></v-spacer>
				<v-btn v-if="loggedIn" class="text-h6 text--secondary" rounded text @click="logout">
					Cerrar sesión
				</v-btn>
				<v-btn v-else class="text-h6 text--secondary" rounded text :to="{ name: 'auth' }">
					Iniciar sesión
				</v-btn>
				<v-btn
					v-if="!loggedIn"
					rounded
					class="mx-2 text-h6"
					color="primary"
					depressed
					x-large
					:to="{ name: 'auth', params: { q: 'register' } }"
				>
					Comenzar
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
			this.$router.push({ name: 'auth' });
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
