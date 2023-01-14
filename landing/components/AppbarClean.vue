<template>
	<div>
		<v-navigation-drawer v-model="drawer" class="hidden-md-and-up" app>
			<v-list-item>
				<a href="https://hablaqui.cl/">
					<v-img
						id="logo-drawer"
						tabindex="0"
						class="mx-auto my-5"
						style="max-width: 150px"
						src="https://storage.googleapis.com/hablaqui-blog/2022/01/d978f84d-logo-1024x242.png"
						lazy-src="`https://cdn.hablaqui.cl/static/logo.png"
						alt="hablaqui Logo"
						accesskey="h"
					/>
				</a>
			</v-list-item>
			<!-- <v-list dense>
				<v-list-item
					id="link-psi-drawer"
					class="primary"
					accesskey="p"
					link
					:to="{ name: 'especialistas' }"
				>
					<v-list-item-content>
						<v-list-item-title class="white--text font-weight-bold body-2">
							Buscar Psicólogo
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<a
					id="link-blog-drawer"
					accesskey="r"
					href="https://hablaqui.cl/para-especialistas/"
				>
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Para especialistas
						</v-list-item-title>
					</v-list-item-content>
				</a>
				<v-list-item
					id="link-para-especialistas-drawer"
					accesskey="q"
					link
					href="https://hablaqui.cl/#"
				>
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Para empresas
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item
					id="link-para-empresas-drawer"
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
			</v-list> -->
		</v-navigation-drawer>
		<!-- <div style="height: 180px; overflow: hidden">
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
		</div> -->
		<v-app-bar
			class="shadowAppBar"
			width="100%"
			height="83"
			color="#ffffff"
			style="opacity: 0.9"
			:elevate-on-scroll="$route.name !== 'especialistas'"
			:app="$route.name !== 'especialistas'"
		>
			<v-container fluid style="max-width: 1080px">
				<v-row align="center" justify="space-between" no-gutters>
					<v-col class="d-flex align-center" md="7" lg="8">
						<a id="logo-appbar" href="https://hablaqui.cl/" exact accesskey="h">
							<v-img
								style="max-width: 176px"
								alt="hablaqui Logo"
								src="https://storage.googleapis.com/hablaqui-blog/2022/01/d978f84d-logo-1024x242.png"
								lazy-src="https://cdn.hablaqui.cl/static/logo.png"
								contain
							/>
						</a>
						<!-- <a
							id="especialistas-appabar"
							accesskey="r"
							style="text-decoration: none; font-size: 12.8px"
							class="hidden-sm-and-down ml-7"
							href="https://hablaqui.cl/para-especialistas"
						>
							<span class="text-uppercase font-nav"> Para especialistas </span>
						</a>

						<a
							id="empresas-appbar"
							href="https://hablaqui.cl/#"
							style="text-decoration: none; font-size: 12.8px"
							accesskey="p"
							class="hidden-sm-and-down ml-4"
						>
							<span class="text-uppercase font-nav">Para empresas</span>
						</a>
						<a
							id="blog-appabar"
							accesskey="b"
							style="text-decoration: none; font-size: 12.8px"
							class="hidden-sm-and-down ml-4"
							href="https://hablaqui.cl/blog/"
						>
							<span class="text-uppercase font-nav">Blog</span>
						</a> -->
					</v-col>
					<client-only>
						<v-col
							v-if="$vuetify.breakpoint.smAndDown"
							cols="4"
							lg="3"
							class="text-right"
						>
							<div class="hidden-md-and-up">
								<v-btn
									id="menudrawer-appbar"
									accesskey="m"
									icon
									@click="drawer = !drawer"
								>
									<icon :icon="mdiMenu" />
								</v-btn>
							</div>
						</v-col>
						<template v-else>
							<v-col v-if="$auth.$state.loggedIn" class="text-right">
								<div class="hidden-sm-and-down body-2 text--secondary" rounded text>
									<v-menu
										id="menu-sesion"
										rounded="xl"
										offset-y
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
														$auth.$state.user.lastName
															? $auth.$state.user.lastName
															: ''
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
														<v-list-item-avatar
															size="40"
															:color="item.color"
														>
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
							</v-col>
							<v-col v-else class="text-right">
								<v-btn
									id="iniciar-sesion-appbar"
									outlined
									small
									color="#999999"
									rounded
									accesskey="s"
									style="
										text-decoration: none;
										font-family: 'Lato', sans-serif;
										font-size: 13.2px;
										line-height: 1.6;
									"
									class="py-4 hidden-sm-and-down text-uppercase font-weight-bold"
									:to="{ name: 'auth' }"
								>
									Iniciar sesión
								</v-btn>
								<!-- <v-btn
									v-show="!$auth.$state.loggedIn"
									id="buscar-especialista-appbar"
									rounded
									small
									accesskey="c"
									style="
										font-family: 'Lato', sans-serif;
										font-size: 13.2px;
										line-height: 1.6;
									"
									class="py-4 ml-2 hidden-sm-and-down text-uppercase font-weight-bold"
									color="primary"
									depressed
									to="/especialistas"
								>
									Buscar Psicólogo
								</v-btn> -->
							</v-col>
						</template>
					</client-only>
				</v-row>
			</v-container>
		</v-app-bar>
	</div>
</template>

<script>
import { mdiMenu, mdiAccountDetails } from '@mdi/js';
// El logo en VUE carga pixelado y las letras se ven algo distintas, los botones estan desplazados, etc
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
				(this.$auth.$state.loggedIn && this.$auth.user.role === 'specialist') ||
				(this.$auth.$state.loggedIn && this.$auth.user.role === 'user');
			return [
				{
					name: 'Postulación',
					link: { name: 'postulacion' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/info.png',
					visible:
						this.$auth.$state.loggedIn &&
						this.$auth.user.role === 'specialist' &&
						!this.$auth.user.specialist,
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
						this.$auth.$state.loggedIn && this.$auth.$state.user.role === 'specialist',
				},
				{
					name: 'Consultantes',
					link: { name: 'dashboard-consultantes' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/icon-consultante.png',
					visible:
						this.$auth.$state.loggedIn && this.$auth.$state.user.role === 'specialist',
				},
				{
					name: 'Cuenta',
					link: { name: 'dashboard-perfil' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/home.png',
					visible:
						(this.$auth.$state.loggedIn && this.$auth.user.role === 'specialist') ||
						(this.$auth.$state.loggedIn && this.$auth.user.role === 'user'),
				},
				{
					name: 'Panel de control',
					link: { name: 'dashboard-panel' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/apps.png',
					visible: this.$auth.$state.user?.role === 'superuser',
				},
				{
					name: 'Reagendamiento',
					link: { name: 'dashboard-reschedule-session' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/apps.png',
					visible: this.$auth.$state.user?.role === 'superuser',
				},
				{
					name: 'Cambio de especialista',
					link: { name: 'dashboard-change-spec' },
					color: 'primary',
					img: 'https://cdn.hablaqui.cl/static/apps.png',
					visible: this.$auth.$state.user?.role === 'superuser',
				},
				{
					name: 'Tabla de pagos',
					link: { name: 'dashboard-paymentTable' },
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
					query: { from: 'spec' },
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
.sticky {
	position: -webkit-sticky !important;
	position: sticky !important;
	top: 0 !important;
}
.shadowAppBar {
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
.font-nav {
	color: #666666d9;
	line-height: 16px;
	font-weight: 700;
	font-family: 'Lato', sans-serif;
	letter-spacing: 0.02em;
}
</style>
