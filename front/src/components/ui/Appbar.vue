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
				<v-btn
					:to="{ name: 'all-psicologos' }"
					light
					rounded
					text
					link
					class="mx-6 body-1 font-weight-bold text--secondary"
				>
					Psicólogos
				</v-btn>
				<v-btn
					light
					rounded
					text
					class="body-1 font-weight-bold text--secondary"
					:href="`${landing_page}/faq`"
				>
					Preguntas frecuentes
				</v-btn>
				<v-btn
					light
					rounded
					text
					active-class="info--text"
					class="body-1 font-weight-bold text--secondary"
					:href="`${landing_page}/blog`"
				>
					Blog
				</v-btn>
				<v-spacer></v-spacer>
				<div v-if="loggedIn" class="text-h6 text--secondary mr-16" rounded text>
					<h3 class="mr-6 secondary--text d-inline-block">Hola {{ user.name }}</h3>
					<v-menu
						rounded="xl"
						open-on-hover
						offset-y
						:close-on-content-click="false"
						:nudge-width="250"
					>
						<template v-slot:activator="{ on, attrs }">
							<div class="d-inline-block" v-bind="attrs" v-on="on">
								<avatar size="80" :name="user.name" :url="user.avatar" />
							</div>
						</template>
						<v-card>
							<v-list>
								<v-list-item
									link
									:to="{ name: item.link }"
									v-for="(item, i) in menu"
									:key="i"
								>
									<v-list-item-avatar size="50" color="primary">
										<img :src="item.img" :alt="item.name" />
									</v-list-item-avatar>
									<v-list-item-content>
										<v-list-item-title class="secondary--text title"
											>{{ item.name }}
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list>
							<v-card-actions class="primary">
								<v-spacer></v-spacer>
								<div class="white--text py-2">Hablaquí</div>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-menu>
				</div>
				<v-btn
					v-else
					class="body-1 font-weight-bold text--secondary"
					rounded
					text
					:to="{ name: 'auth' }"
				>
					Iniciar sesión
				</v-btn>
				<v-btn
					v-if="!loggedIn"
					rounded
					class="mx-2 body-1 font-weight-bold"
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
	components: {
		Avatar: () => import('@/components/ui/Avatar'),
	},
	data() {
		return {
			menu: [
				{ name: 'Chat', link: 'chat', img: '/img/chat.png' },
				{ name: 'Mis sesiones', link: 'agenda', img: '/img/sesiones.png' },
				{ name: 'Diario de bienestar', link: 'diario', img: '/img/notas.png' },
				{ name: 'Mi cuenta', link: 'perfil', img: '/img/home.png' },
			],
			drawer: false,
		};
	},
	computed: {
		landing_page() {
			return landing;
		},
		...mapGetters({ loggedIn: 'User/loggedIn', user: 'User/user' }),
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
