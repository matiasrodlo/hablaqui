<template>
	<div class="primary">
		<v-navigation-drawer dark color="primary" permanent app>
			<div style="height: 310px" class="d-flex align-center justify-center">
				<img
					@click="() => $router.push({ name: 'all-psicologos' })"
					style="width: 70px; cursor: pointer;"
					src="img/logo_tiny_white.png"
				/>
			</div>
			<v-list class="pt-0" left shaped top>
				<v-list-item
					class="my-4"
					link
					:to="{ name: item.link }"
					v-for="(item, i) in links"
					:key="i"
				>
					<v-list-item-avatar size="35">
						<v-img :src="item.img" :alt="item.name" />
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="font-weight-bold subtitle-1">
							{{ item.name }}
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<div style="border-radius: 50px" class="white">
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
			<router-view />
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
import { landing } from '@/config';

export default {
	data() {
		return {
			links: [
				{ name: 'Chat', link: 'chat', img: '/img/chat.png' },
				{ name: 'Mis sesiones', link: 'agenda', img: '/img/sesiones.png' },
				{ name: 'Diario de bienestar', link: 'diario', img: '/img/notas.png' },
				{ name: 'Mi cuenta', link: 'perfil', img: '/img/home.png' },
			],
		};
	},
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
