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
				<v-list-item
					id="link-psi-drawer"
					class="primary"
					accesskey="p"
					link
					:to="{ name: 'psicologos' }"
				>
					<v-list-item-content>
						<v-list-item-title class="white--text font-weight-bold body-2">
							Buscar Psicólogo
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item
					id="link-blog-drawer"
					accesskey="r"
					link
					href="https://hablaqui.cl/blog/para-especialistas"
				>
					<v-list-item-content>
						<v-list-item-title class="secondary--text font-weight-bold body-2">
							Para especialistas
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item
					id="link-para-especialistas-drawer"
					accesskey="q"
					link
					href="https://hablaqui.cl/blog/para-empresas"
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
			</v-list>
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
		<v-app-bar style="z-index: 1" height="83" color="#ffffff">
			<v-container style="max-width: 1200px">
				<v-row align="center" justify="space-between" no-gutters>
					<v-col cols="6" class="d-flex align-center">
						<nuxt-link id="logo-appbar" tabindex="0" to="/" exact accesskey="h">
							<v-img
								style="max-width: 160px"
								alt="hablaqui Logo"
								:src="`https://cdn.hablaqui.cl/static/logo.png`"
								:lazy-src="`https://cdn.hablaqui.cl/static/logo.png`"
								contain
							/>
						</nuxt-link>
						<a
							id="especialistas-appabar"
							accesskey="r"
							style="text-decoration: none"
							class="hidden-sm-and-down ml-4"
							href="https://hablaqui.cl/blog/para-especialistas"
						>
							<span class="body-2 text--secondary font-weight-bold">
								Para especialistas
							</span>
						</a>

						<a
							id="empresas-appbar"
							href="https://hablaqui.cl/blog/para-empresas"
							style="text-decoration: none"
							accesskey="p"
							class="hidden-sm-and-down ml-4"
						>
							<span class="text--secondary body-2 font-weight-bold"
								>Para empresas</span
							>
						</a>
						<a
							id="blog-appabar"
							accesskey="b"
							style="text-decoration: none"
							class="hidden-sm-and-down ml-4"
							href="https://hablaqui.cl/blog/"
						>
							<span class="body-2 text--secondary font-weight-bold">Blog</span>
						</a>
					</v-col>
					<client-only>
						<v-col v-if="$vuetify.breakpoint.smAndDown" cols="3" class="text-right">
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
							<v-col v-if="$auth.$state.loggedIn" cols="3" class="text-right">
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
																class="
																	secondary--text
																	font-weight-bold
																	body-2
																"
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
															class="
																secondary--text
																font-weight-bold
																body-2
															"
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
							<v-col v-else class="text-right" cols="5" md="4" lg="3">
								<v-btn
									id="iniciar-sesion-appbar"
									outlined
									small
									color="#BDBDBD"
									rounded
									accesskey="s"
									style="text-decoration: none"
									class="hidden-sm-and-down text--secondary"
									:to="{ name: 'auth' }"
								>
									Iniciar sesión
								</v-btn>
								<v-btn
									v-show="!$auth.$state.loggedIn"
									id="buscar-psicologo-appbar"
									rounded
									small
									accesskey="c"
									class="mx-2 hidden-sm-and-down"
									color="primary"
									depressed
									to="/psicologos"
								>
									Burcar Psicólogo
								</v-btn>
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
.sticky {
	position: -webkit-sticky !important;
	position: sticky !important;
	top: 0 !important;
}
</style>
