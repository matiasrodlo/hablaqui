<template>
	<div style="height: 100vh">
		<v-app-bar height="100">
			<nuxt-link id="logo-appbar" tabindex="0" to="/" exact accesskey="h">
				<v-img
					style="max-width: 160px"
					alt="hablaqui Logo"
					:src="`https://cdn.hablaqui.cl/static/logo.png`"
					:lazy-src="`https://cdn.hablaqui.cl/static/logo.png`"
					contain
				/>
			</nuxt-link>
			<v-spacer></v-spacer>
			<v-menu
				v-if="$auth.$state.loggedIn"
				id="menu-sesion"
				rounded="xl"
				offset-y
				offset-x
				open-on-hover
				:close-on-content-click="false"
				:nudge-width="100"
			>
				<template #activator="{ on, attrs }">
					<div
						id="link-sesion"
						accesskey="j"
						class="d-inline-block"
						v-bind="attrs"
						v-on="on"
					>
						<h3 class="mr-6 secondary--text d-inline-block">
							Hola {{ $auth.$state.user.name }}
						</h3>
						<avatar
							size="50"
							:name="$auth.$state.user.name"
							:url="$auth.$state.user.avatar"
						/>
					</div>
				</template>
				<v-card>
					<v-list>
						<v-list-item v-for="(item, i) in menu" id="i" :key="i" link :to="item.link">
							<v-list-item-avatar size="40" color="primary">
								<v-img contain height="30" :src="item.img" :alt="item.name" />
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="secondary--text font-weight-bold body-2"
									>{{ item.name }}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item id="logout-appbar" @click="logout">
							<v-list-item-avatar size="40" color="primary">
								<v-img
									contain
									height="30"
									:src="`https://cdn.hablaqui.cl/static/cerrar_sesion.png`"
									alt="cerrar sesión"
								/>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="secondary--text font-weight-bold body-2">
									Cerrar sesion
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
					<v-card-actions class="primary">
						<v-spacer></v-spacer>
						<div class="white--text py-1">Hablaquí</div>
						<v-spacer></v-spacer>
					</v-card-actions>
				</v-card>
			</v-menu>
		</v-app-bar>
		<div style="position: relative; height: calc(100% - 180px)">
			<div
				class="mx-auto text-center flex align-items-center"
				style="
					background-color: #272727;
					position: absolute;
					bottom: 20px;
					left: 0;
					right: 0;
					z-index: 1;
					width: 60px;
					height: 60px;
				"
			/>
			<iframe
				style="width: 100%; height: 100%"
				:src="`https://brie.fi/ng/${$route.params.slug}?audio=1&video=1&fs=1&invite=0&prefs=0&share=0&chat=0`"
				allow="camera; microphone; speaker; display-capture"
			>
			</iframe>
		</div>
		<v-toolbar height="80">
			<v-spacer></v-spacer>
			<v-btn class="mx-2" color="primary" rounded to="/dashboard/chat">
				Salir de la sala
			</v-btn>
			<!-- <v-btn class="mx-2" fab small color="white">
				<icon color="primary" :icon="mdiMessageOutline" />
			</v-btn> -->
			<v-spacer></v-spacer>
		</v-toolbar>
	</div>
</template>

<script>
import { mdiMessageOutline } from '@mdi/js';
export default {
	components: {
		Avatar: () => import('~/components/Avatar'),
		// Icon: () => import('~/components/Icon'),
	},
	layout: 'simple',
	middleware: ['auth'],
	data() {
		return {
			mdiMessageOutline,
			menu: [
				{
					name: 'Chat',
					link: '/dashboard/chat',
					img: `https://cdn.hablaqui.cl/static/chat.png`,
				},
				{
					name: 'Mis sesiones',
					link: '/dashboard/agenda',
					img: `https://cdn.hablaqui.cl/static/sesiones.png`,
				},
				// { name: 'Diario de bienestar', link: '/dashboard/diario', img: '/img/notas.png' },
				{
					name: 'Mi cuenta',
					link: '/dashboard/perfil',
					img: `https://cdn.hablaqui.cl/static/home.png`,
				},
			],
		};
	},
	methods: {
		logout() {
			this.$auth.logout();
		},
	},
};
</script>
