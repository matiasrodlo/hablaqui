<template>
	<v-row class="primary" style="height: 100vh;" no-gutters>
		<v-col cols="2" class="d-flex" style="flex-direction: column">
			<div style="flex:1; height: 230px" class="d-flex align-center justify-center">
				<img
					@click="() => $router.push({ name: 'all-psicologos' })"
					style="width: 70px; cursor: pointer;"
					src="img/logo_tiny_white.png"
				/>
			</div>
			<v-list style="flex: 2" dark color="primary" class="pt-0" left shaped top>
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
						<v-list-item-title class="font-weight-bold body-2">
							{{ item.name }}
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-list-item style="flex: 1">
				Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonum
			</v-list-item>
		</v-col>
		<v-col cols="10">
			<div style="border-radius: 50px 0 0 0" class="white">
				<router-view />
			</div>
		</v-col>
	</v-row>
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
