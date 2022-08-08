<template>
	<div>
		<v-navigation-drawer v-model="drawer" class="hidden-md-and-up" app>
			<v-list-item link to="/">
				<v-img
					id="logo-drawer"
					tabindex="0"
					class="mx-auto my-5"
					style="max-width: 150px"
					:src="`https://cdn.hablaqui.cl/static/logo.png`"
					:lazy-src="`https://cdn.hablaqui.cl/static/logo.png`"
					alt="hablaqui Logo"
					accesskey="h"
				/>
			</v-list-item>
			<v-list dense>
				<v-list-item id="link-psi-drawer" accesskey="p" link :to="{ name: 'psicologos' }">
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Psicólogos
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<a id="link-blog-drawer" accesskey="r" href="https://hablaqui.cl/para-especialistas/">
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Para especialistas
						</v-list-item-title>
					</v-list-item-content>
				</a>
				<v-list-item id="link-faq-drawe" accesskey="f" link to="/faq">
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Preguntas frecuentes
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item
					id="link-blog-drawer"
					accesskey="b"
					link
					href="https://hablaqui.cl/blog/"
				>
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Blog
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item
					v-show="!$auth.$state.loggedIn"
					id="comenzar-drawer"
					accesskey="c"
					link
					@click="start"
				>
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Comenzar
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<client-only>
					<template v-if="$auth.$state.loggedIn">
						<template v-for="(item, i) in menu">
							<v-list-item v-show="item.visible" id="i" :key="i" link :to="item.link">
								<v-list-item-content>
									<v-list-item-title
										class="secondary--text font-weight-bold body-2"
									>
										{{ item.name }}
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</template>
					</template>
				</client-only>
				<v-list-item
					v-show="$auth.$state.loggedIn"
					id="logout-drawer"
					accesskey="x"
					@click="logout"
				>
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Cerrar sesión
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item
					v-show="!$auth.$state.loggedIn"
					id="iniciar-sesion-drawer"
					accesskey="s"
					link
					to="/auth"
				>
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Iniciar sesión
						</v-list-item-title>
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
			<a id="logo-appbar" tabindex="0" href="https://hablaqui.cl" exact accesskey="h">
				<v-img
					style="max-width: 160px"
					alt="hablaqui Logo"
					:src="`https://cdn.hablaqui.cl/static/logo.png`"
					:lazy-src="`https://cdn.hablaqui.cl/static/logo.png`"
					contain
				/>
			</a>
			<router-link
				id="psicologo-appbar"
				:to="{ name: 'psicologos' }"
				style="text-decoration: none"
				accesskey="p"
				class="hidden-sm-and-down ml-7 mr-3"
			>
				<span class="text--secondary body-2 font-weight-bold">Psicólogos</span>
			</router-link>
			<a
				v-show="!$auth.$state.loggedIn"
				id="especialistas-appabar"
				accesskey="r"
				style="text-decoration: none"
				class="hidden-sm-and-down mx-2"
				href="https://hablaqui.cl/para-especialistas/"
			>
				<span class="body-2 text--secondary font-weight-bold">Para especialistas</span>
			</a>
			<nuxt-link
				id="faq-appbar"
				accesskey="f"
				style="text-decoration: none"
				class="hidden-sm-and-down mx-2"
				to="/faq"
			>
				<span class="text--secondary body-2 font-weight-bold">Preguntas frecuentes</span>
			</nuxt-link>
			<a
				id="blog-appabar"
				accesskey="b"
				style="text-decoration: none"
				class="hidden-sm-and-down mx-2"
				href="https://hablaqui.cl/blog/"
			>
				<span class="body-2 text--secondary font-weight-bold">Blog</span>
			</a>
			<v-spacer></v-spacer>
			<client-only>
				<div
					v-if="$auth.$state.loggedIn"
					class="hidden-sm-and-down body-2 text--secondary mr-16"
					rounded
					text
				>
					<v-menu
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
								<h3 class="lg-mr-6 secondary--text d-inline-block">
									Hola {{ $auth.$state.user.name }}
								</h3>
								<avatar
									size="50"
									:name="$auth.$state.user.name"
									:last-name="
										$auth.$state.user.lastName ? $auth.$state.user.lastName : ''
									"
									:url="$auth.$state.user.avatarThumbnail"
								/>
							</div>
						</template>
						<v-card>
							<v-list>
								<template v-for="(item, i) in menu">
									<v-list-item
										v-show="item.visible"
										id="i"
										:key="i"
										link
										:to="item.link"
									>
										<v-list-item-avatar size="40" :color="item.color">
											<v-img
												contain
												height="30"
												:src="item.img"
												:alt="item.name"
											/>
										</v-list-item-avatar>
										<v-list-item-content>
											<v-list-item-title
												class="secondary--text font-weight-bold body-2"
											>
												{{ item.name }}
											</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
								</template>
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
										<v-list-item-title
											class="secondary--text font-weight-bold body-2"
										>
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
				</div>
			</client-only>
			<router-link
				v-show="!$auth.$state.loggedIn"
				id="iniciar-sesion-appbar"
				accesskey="s"
				style="text-decoration: none"
				class="mr-4 mr-lg-5 hidden-sm-and-down"
				:to="{ name: 'auth' }"
			>
				<span class="body-2 font-weight-bold text--secondary">Iniciar sesión</span>
			</router-link>
			<v-btn
				v-show="!$auth.$state.loggedIn"
				id="comenzar-appbar"
				rounded
				accesskey="c"
				class="mx-2 py-6 px-lg-10 hidden-sm-and-down"
				color="primary"
				depressed
				@click="start"
			>
				<span class="font-weight-bold body-2">Comenzar</span>
			</v-btn>
			<div class="hidden-md-and-up">
				<v-spacer></v-spacer>
				<v-btn id="menudrawer-appbar" accesskey="m" icon @click="drawer = !drawer">
					<icon :icon="mdiMenu" />
				</v-btn>
			</div>
		</v-app-bar>
	</div>
</template>

<script>
import { mdiMenu, mdiAccountDetails } from '@mdi/js';

export default {
	components: {
		Avatar: () => import('~/components/Avatar'),
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiMenu,
			mdiAccountDetails,
			drawer: false,
		};
	},
	computed: {
		menu() {
			const visible =
				(this.$auth.$state.loggedIn && this.$auth.user.role === 'psychologist') ||
				(this.$auth.$state.loggedIn && this.$auth.user.role === 'user');
			return [
				{
					name: 'Postulación',
					link: { name: 'postulacion' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/info.png',
					visible:
						this.$auth.$state.loggedIn &&
						this.$auth.user.role === 'psychologist' &&
						!this.$auth.user.psychologist,
				},
				{
					name: 'Chat',
					link: { name: 'dashboard-chat' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/chat.png',
					visible,
				},
				{
					name: 'Mi agenda',
					link: { name: 'dashboard-agenda' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/sesiones.png',
					visible,
				},
				{
					name: 'Pagos',
					link: { name: 'dashboard-pagos' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/pay.png',
					visible:
						this.$auth.$state.loggedIn &&
						this.$auth.$state.user.role === 'psychologist',
				},
				{
					name: 'Consultantes',
					link: { name: 'dashboard-consultantes' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/icon-consultante.png',
					visible:
						this.$auth.$state.loggedIn &&
						this.$auth.$state.user.role === 'psychologist',
				},
				{
					name: 'Mi cuenta',
					link: { name: 'dashboard-perfil' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/home.png',
					visible:
						(this.$auth.$state.loggedIn && this.$auth.user.role === 'psychologist') ||
						(this.$auth.$state.loggedIn && this.$auth.user.role === 'user'),
				},
				{
					name: 'Panel de control',
					link: { name: 'dashboard-panel' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/apps.png',
					visible: this.$auth.$state.user?.role === 'superuser',
				},
			];
		},
	},
	methods: {
		async logout() {
			await this.$auth.logout();
		},
		start() {
			if (this.$auth.$state.loggedIn) this.$router.push({ name: 'evaluacion' });
			else
				this.$router.push({
					name: 'auth',
					params: { q: 'register' },
					query: { from: 'psy' },
				});
		},
	},
};
</script>
<style lang="scss" scoped>
.shadow {
	-webkit-filter: drop-shadow(4px 4px 3px rgba(26, 165, 216, 0.16));
	filter: drop-shadow(4px 4px 3px rgba(26, 165, 216, 0.16));
}
</style>
