<template>
	<v-app>
		<v-navigation-drawer
			v-model="drawer"
			mini-variant-width="60"
			mini-variant
			color="primary"
			expand-on-hover
			app
			mobile-breakpoint="960"
		>
			<v-sheet color="primary" class="pa-1">
				<v-img
					height="100"
					contain
					style="cursor: pointer"
					:src="`${$config.LANDING_URL}/logo_tiny_white.png`"
					:lazy-src="`${$config.LANDING_URL}/logo_tiny_white.png`"
					alt="logo hablaqui"
					class="my-16"
					@click="() => $router.push({ name: 'psicologos' })"
				/>
			</v-sheet>
			<v-list style="flex: 2" dark color="primary" class="pt-0" left shaped top>
				<v-list-item v-if="false" class="my-4" link>
					<v-list-item-avatar size="35">
						<v-btn outlined fab color="white">
							<icon v-if="online" size="35" color="#8BC34A" :icon="mdiAccount" />
							<icon v-else size="35" color="red" :icon="mdiAccountOff" />
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
							:src="`${$config.LANDING_URL}/cerrar_sesion.png`"
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
import { mdiMenu, mdiAccount, mdiAccountOff } from '@mdi/js';
import Snackbar from '@/components/Snackbar';

export default {
	components: {
		Snackbar,
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiAccount,
			mdiAccountOff,
			mdiMenu,
			drawer: true,
			online: true,
		};
	},
	computed: {
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
					img: `${this.$config.LANDING_URL}/chat.png`,
					visible,
				},
				{
					name: 'Mis sesiones',
					link: { name: 'dashboard-agenda' },
					img: `${this.$config.LANDING_URL}/sesiones.png`,
					visible,
				},
				{
					name: 'Pagos',
					link: { name: 'dashboard-pagos' },
					img: `${this.$config.LANDING_URL}/pay.png`,
					visible:
						this.$auth.$state.loggedIn &&
						this.$auth.$state.user.role === 'psychologist' &&
						this.$auth.$state.user.psychologist,
				},
				{
					name: 'Mi cuenta',
					link: { name: 'dashboard-perfil' },
					img: `${this.$config.LANDING_URL}/home.png`,
					visible,
				},
				{
					name: 'Panel de control',
					link: { name: 'dashboard-panel' },
					img: `${this.$config.LANDING_URL}/apps.png`,
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
	},
	methods: {
		logout() {
			this.$auth.logout();
			this.$router.push('/auth');
		},
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
