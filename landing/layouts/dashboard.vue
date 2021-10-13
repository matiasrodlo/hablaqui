<template>
	<v-app>
		<v-navigation-drawer
			v-model="drawer"
			mini-variant-width="60"
			:mini-variant.sync="isMini"
			color="primary"
			:expand-on-hover="$vuetify.breakpoint.mdAndUp"
			app
			mobile-breakpoint="960"
		>
			<v-sheet color="primary" class="pa-1">
				<v-img
                    height="100"
                    contain
                    style="cursor: pointer"
                    :src="`https://cdn.hablaqui.cl/static/logo_tiny_white.png`"
                    :lazy-src="`https://cdn.hablaqui.cl/static/logo_tiny_white.png`"
                    alt="logo hablaquí"
                    class="my-16"
                    @click="() => $router.push({ name: 'psicologos' })"
				/>
			</v-sheet>
			<v-list style="flex: 2" dark color="primary" class="pt-0" left shaped top>
				<v-list-item v-if="false" class="my-4" link>
					<v-list-item-avatar size="35">
                        <v-btn outlined fab color="white">
                            <icon v-if="online" size="30" color="#8BC34A" :icon="mdiAccount" />
                            <icon v-else size="30" color="red" :icon="mdiAccountOff" />
                        </v-btn>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="font-weight-bold body-2">
							<v-switch v-model="online" dense>
								<template #prepend>
									<div class="pt-1 white--text">
										{{ online ? 'En linea' : 'Desconectado' }}
									</div>
								</template>
							</v-switch>
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<template v-for="(item, i) in links">
					<v-list-item v-if="item.visible" :key="i" class="my-4" link :to="item.link">
						<v-list-item-avatar size="35">
							<v-img
								height="35"
								width="35"
								:src="item.img"
								:lazy-src="item.img"
								:alt="item.name"
							/>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title class="font-weight-bold body-2">
								{{ item.name }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</template>
				<v-list-item class="my-4 hidden-md-and-up" link @click="logout">
					<v-list-item-avatar size="40">
						<v-img
							height="50"
							width="50"
							:src="`https://cdn.hablaqui.cl/static/cerrar_sesion.png`"
							alt="cerrar sesión"
						/>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="font-weight-bold body-2">
							Salir
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<template v-if="!isMini" #append>
				<div class="pa-2 white--text">
					<icon class="pb-2" size="20" color="white" :icon="mdiAlert" />
					Nuestra plataforma aún se esta construyendo si presentas algún error puedes
					contactarnos
				</div>
			</template>
		</v-navigation-drawer>
		<v-app-bar absolute flat height="85" color="primary" dark class="hidden-md-and-up">
			<h1 class="white--text">{{ routeName }}</h1>
			<v-spacer></v-spacer>
			<v-btn id="menudrawer-appbar" accesskey="m" icon @click="drawer = !drawer">
				<icon color="white" :icon="mdiMenu" />
			</v-btn>
		</v-app-bar>
		<v-main
			class="primary"
			:style="{ 'padding-top': $vuetify.breakpoint.mdAndUp ? '' : '140px' }"
		>
			<div
				:class="$vuetify.breakpoint.mdAndUp ? 'border-desktop' : 'border-mobile'"
				class="white"
			>
				<snackbar />
				<nuxt />
			</div>
		</v-main>
	</v-app>
</template>

<script>
import { mdiMenu, mdiAccount, mdiAccountOff, mdiAlert } from '@mdi/js';
import Snackbar from '@/components/Snackbar';
import { mapGetters, mapMutations } from 'vuex';

export default {
	components: {
		Snackbar,
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiAlert,
			mdiAccount,
			mdiAccountOff,
			mdiMenu,
			drawer: true,
			online: true,
			isMini: true,
		};
	},
	computed: {
		expand() {
			return true;
		},
		links() {
			const visible =
				(this.$auth.$state.loggedIn &&
					this.$auth.user.role === 'psychologist' &&
					!!this.$auth.user.psychologist) ||
				(this.$auth.$state.loggedIn && this.$auth.user.role === 'user');
			return [
				{
					name: 'Chat',
					link: { name: 'dashboard-chat' },
					img: `https://cdn.hablaqui.cl/static/chat.png`,
					visible,
				},
				{
					name: 'Mis sesiones',
					link: { name: 'dashboard-agenda' },
					img: `https://cdn.hablaqui.cl/static/sesiones.png`,
					visible,
				},
				{
					name: 'Pagos',
					link: { name: 'dashboard-pagos' },
					img: `https://cdn.hablaqui.cl/static/pay.png`,
					visible:
						this.$auth.$state.loggedIn &&
						this.$auth.$state.user.role === 'psychologist' &&
						this.$auth.$state.user.psychologist,
				},
				{
					name: 'Consultantes',
					link: { name: 'dashboard-consultantes' },
					img: `https://cdn.hablaqui.cl/static/icon-consultante.png`,
					visible:
						this.$auth.$state.loggedIn &&
						this.$auth.$state.user.role === 'psychologist' &&
						this.$auth.$state.user.psychologist,
				},
				{
					name: 'Mi cuenta',
					link: { name: 'dashboard-perfil' },
					img: `https://cdn.hablaqui.cl/static/home.png`,
					visible,
				},
				{
					name: 'Panel de control',
					link: { name: 'dashboard-panel' },
					img: `https://cdn.hablaqui.cl/static/apps.png`,
					visible: this.$auth.$state.user?.role === 'superuser',
				},
				{
					name: 'Nuevo articulo',
					link: { name: 'dashboard-newArticle' },
					img: `https://cdn.hablaqui.cl/static/article.png`,
					visible: this.$auth.$state.user?.role === 'superuser',
				},
			];
		},
		routeName() {
			if (this.$route.name === 'dashboard-chat') return 'Mis Chats';
			if (this.$route.name === 'dashboard-agenda') return 'Mi Agenda';
			if (this.$route.name === 'dashboard-diario') return 'Mi diario';
			if (this.$route.name === 'dashboard-pagos') return 'Pagos';
			if (this.$route.name === 'dashboard-perfil') return 'Mi cuenta';
			return '';
		},
		...mapGetters({ listenerUserOnline: 'User/listenerUserOnline' }),
	},
	mounted() {
		if (!this.listenerUserOnline) {
			this.setListenerUserOnline(true);
			document.addEventListener('visibilitychange', this.visibilityListener);
			this.visibilityListener();
		}
	},
	methods: {
		logout() {
			this.$auth.logout();
			this.$router.push('/auth');
		},
		visibilityListener() {
			if (document.visibilityState === 'visible') {
				console.info('user online');
			} else {
				console.info('user offline');
			}
		},
		...mapMutations({ setListenerUserOnline: 'User/setListenerUserOnline' }),
	},
};
</script>

<style scoped>
.border-desktop {
	border-radius: 50px 0 0 0;
}
.border-mobile {
	border-radius: 50px 50px 0 0;
}
</style>
