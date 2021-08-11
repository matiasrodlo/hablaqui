<template>
	<v-app>
		<v-navigation-drawer v-model="drawer" color="primary" app mobile-breakpoint="960">
			<v-sheet color="primary" class="pa-4">
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
import { mdiMenu } from '@mdi/js';
import Snackbar from '@/components/Snackbar';

export default {
	components: {
		Snackbar,
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiMenu,
			drawer: true,
		};
	},
	computed: {
		links() {
			return [
				{
					name: 'Chat',
					link: 'chat',
					img: `${this.$config.LANDING_URL}/chat.png`,
					visible: true,
				},
				{
					name: 'Mis sesiones',
					link: 'agenda',
					img: `${this.$config.LANDING_URL}/sesiones.png`,
					visible: true,
				},
				{
					name: 'Diario de bienestar',
					link: 'diario',
					img: `${this.$config.LANDING_URL}/notas.png`,
					visible: false,
				},
				{
					name: 'Pagos',
					link: 'pagos',
					img: `${this.$config.LANDING_URL}/pagos.png`,
					visible:
						this.$auth.$state.user && this.$auth.$state.user.role === 'psychologist',
				},
				{
					name: 'Mi cuenta',
					link: 'perfil',
					img: `${this.$config.LANDING_URL}/home.png`,
					visible: true,
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
