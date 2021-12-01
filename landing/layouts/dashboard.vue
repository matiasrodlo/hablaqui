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
				<div class="pa-2 caption white--text">
					<icon class="pb-2" size="20" color="white" :icon="mdiAlert" />
					Nuestra plataforma aún está en construcción. Si presentas algún problema, no
					dudes en contactarnos
				</div>
			</template>
		</v-navigation-drawer>
		<v-app-bar absolute flat dense color="white" dark class="hidden-md-and-up">
			<v-btn icon @click="() => $router.go(-1)">
				<icon v-if="goBack" size="30" color="primary" :icon="mdiChevronLeft" />
			</v-btn>
			<h1 class="primary--text text-h5 font-weight-bold">{{ routeName }}</h1>
			<v-spacer></v-spacer>
			<v-btn id="menudrawer-appbar" accesskey="m" icon @click="drawer = !drawer">
				<icon color="primary" :icon="mdiMenu" />
			</v-btn>
		</v-app-bar>
		<v-main
			:class="$vuetify.breakpoint.mdAndUp ? 'primary' : 'white'"
			:style="{ 'padding-top': $vuetify.breakpoint.mdAndUp ? '' : '50px' }"
		>
			<v-overlay :value="overlay" color="white" :opacity="0.8">
				<v-card light>
					<div class="text-right">
						<v-btn text>
							<span class="secondary--text" @click="changeStateOnboarding"> x </span>
						</v-btn>
					</div>
					<v-card-text class="py-0 text-center body-1 px-6">
						Bienvenido a Hablaquí Office
					</v-card-text>
					<v-card-text class="text-center body-2 px-6">
						Agenda un tour por tu oficina y aclara todas tus dudas
					</v-card-text>
					<v-card-actions class="text-center body-2 px-6">
						<v-spacer></v-spacer>
						<v-btn
							rounded
							color="primary"
							href="https://calendly.com/daniel-hablaqui/30min"
							target="_blank"
							:loading="loadingOnboarding"
							@click="changeStateOnboarding"
							>Agendar demo
						</v-btn>
						<v-spacer></v-spacer>
					</v-card-actions>
				</v-card>
			</v-overlay>
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
import { mdiMenu, mdiAccount, mdiAccountOff, mdiAlert, mdiChevronLeft } from '@mdi/js';
import Snackbar from '@/components/Snackbar';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	components: {
		Snackbar,
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			overlay: false,
			loadingOnboarding: false,
			mdiChevronLeft,
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
		goBack() {
			return (
				this.$route.name === 'dashboard-perfil-configuracion-personal' ||
				this.$route.name === 'dashboard-perfil-datos-bancarios' ||
				this.$route.name === 'dashboard-perfil-experiencia-formacion' ||
				this.$route.name === 'dashboard-perfil-informacion-general' ||
				this.$route.name === 'dashboard-perfil-horario' ||
				this.$route.name === 'dashboard-perfil-services' ||
				this.$route.name === 'dashboard-consultantes-consultante-seleccionado'
			);
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
			if (this.$route.name === 'dashboard-consultantes') return 'Consultantes';
			if (this.$route.name === 'dashboard-pagos') return 'Pagos';
			if (this.$route.name === 'dashboard-perfil') return 'Mi cuenta';
			if (this.$route.name === 'dashboard-perfil-configuracion-personal')
				return 'Configuración personal';
			if (this.$route.name === 'dashboard-perfil-datos-bancarios') return 'Datos bancarios';
			if (this.$route.name === 'dashboard-perfil-experiencia-formacion')
				return 'Experiencia y formación';
			if (this.$route.name === 'dashboard-perfil-informacion-general')
				return 'Informacion general';
			if (this.$route.name === 'dashboard-perfil-horario') return 'Horarios';
			if (this.$route.name === 'dashboard-perfil-services') return 'Servicios';
			if (this.$route.name === 'dashboard-consultantes-consultante-seleccionado')
				return 'Consultante';
			return '';
		},
		...mapGetters({ listenerUserOnline: 'User/listenerUserOnline' }),
	},
	mounted() {
		if (!this.$auth.$state.user.onboarding && this.$auth.$state.user.role === 'psychologist')
			this.overlay = true;
	},
	methods: {
		logout() {
			this.$auth.logout();
			this.$router.push('/auth');
		},
		async changeStateOnboarding() {
			this.loadingOnboarding = true;
			await this.updateOne({
				_id: this.$auth.$state.user._id,
				onboarding: true,
			});
			this.loadingOnboarding = false;
			this.overlay = false;
			this.$auth.fetchUser();
		},
		...mapMutations({ setListenerUserOnline: 'User/setListenerUserOnline' }),
		...mapActions({
			updateOne: 'User/updateOne',
		}),
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
