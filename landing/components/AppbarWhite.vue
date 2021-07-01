<template>
	<div>
		<v-navigation-drawer v-model="drawer" class="hidden-md-and-up" app>
			<v-list-item link to="/">
				<v-img
					class="mx-auto my-5"
					style="max-width: 150px"
					:src="`${$config.LANDING_URL}/logo.png`"
					:lazy-src="`${$config.LANDING_URL}/logo.png`"
					alt="hablaqui Logo"
				/>
			</v-list-item>
			<v-list dense>
				<v-list-item link active-class="primary white--text" :to="{ name: 'psicologos' }">
					<v-list-item-content>
						<v-list-item-title>Psicólogos</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link to="/faq">
					<v-list-item-content>
						<v-list-item-title>Preguntas frecuentes</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link to="/blog">
					<v-list-item-content>
						<v-list-item-title>Blog</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item v-if="$auth.$state.loggedIn" @click="logout">
					<v-list-item-content>
						<v-list-item-title>Cerrar sesión</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item v-else link to="/auth">
					<v-list-item-content>
						<v-list-item-title>Iniciar sesión</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item v-if="!$auth.$state.loggedIn" link @click="start">
					<v-list-item-content>
						<v-list-item-title>Comenzar</v-list-item-title>
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
			<nuxt-link to="/" exact>
				<v-img
					style="max-width: 160px"
					alt="hablaqui Logo"
					:src="`${$config.LANDING_URL}/logo.png`"
					:lazy-src="`${$config.LANDING_URL}/logo.png`"
					contain
				/>
			</nuxt-link>
			<router-link
				:to="{ name: 'psicologos' }"
				style="text-decoration: none"
				class="hidden-sm-and-down ml-7 mr-3"
			>
				<span class="text--secondary body-1 font-weight-bold">Psicólogos</span>
			</router-link>
			<nuxt-link style="text-decoration: none" class="hidden-sm-and-down mx-5" to="/faq">
				<span class="text--secondary body-1 font-weight-bold"> Preguntas frecuentes </span>
			</nuxt-link>
			<nuxt-link style="text-decoration: none" class="hidden-sm-and-down mx-5" to="/blog">
				<span class="body-1 text--secondary font-weight-bold">Blog</span>
			</nuxt-link>
			<v-spacer></v-spacer>
			<div
				v-if="$auth.$state.loggedIn"
				class="hidden-sm-and-down body-1 text--secondary mr-16"
				rounded
				text
			>
				<h3 class="mr-6 secondary--text d-inline-block">
					Hola {{ $auth.$state.user.name }}
				</h3>
				<v-menu
					rounded="xl"
					open-on-hover
					offset-y
					:close-on-content-click="false"
					:nudge-width="200"
				>
					<template #activator="{ on, attrs }">
						<div class="d-inline-block" v-bind="attrs" v-on="on">
							<avatar
								size="50"
								:name="$auth.$state.user.name"
								:url="$auth.$state.user.avatar"
							/>
						</div>
					</template>
					<v-card>
						<v-list>
							<v-list-item v-for="(item, i) in menu" :key="i" link :to="item.link">
								<v-list-item-avatar size="40" color="primary">
									<v-img contain height="30" :src="item.img" :alt="item.name" />
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title
										class="secondary--text font-weight-bold body-2"
										>{{ item.name }}
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item @click="logout">
								<v-list-item-avatar size="40" color="primary">
									<v-icon color="white">mdi-logout</v-icon>
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
			<router-link
				v-else
				style="text-decoration: none"
				class="mr-4 mr-lg-5 hidden-sm-and-down"
				:to="{ name: 'auth' }"
			>
				<span class="body-1 font-weight-bold text--secondary">Iniciar sesión</span>
			</router-link>
			<v-btn
				v-if="!$auth.$state.loggedIn"
				rounded
				class="mx-2 py-6 px-lg-10 hidden-sm-and-down"
				color="primary"
				depressed
				@click="start"
			>
				<span class="font-weight-bold body-1">Comenzar</span>
			</v-btn>
			<div class="hidden-md-and-up">
				<v-spacer></v-spacer>
				<v-btn icon @click="drawer = !drawer">
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</div>
		</v-app-bar>
	</div>
</template>

<script>
export default {
	components: {
		Avatar: () => import('~/components/Avatar'),
	},
	data() {
		return {
			menu: [
				{
					name: 'Chat',
					link: '/dashboard/chat',
					img: `${this.$config.LANDING_URL}/chat.png`,
				},
				{
					name: 'Mis sesiones',
					link: '/dashboard/agenda',
					img: `${this.$config.LANDING_URL}/sesiones.png`,
				},
				// { name: 'Diario de bienestar', link: '/dashboard/diario', img: '/img/notas.png' },
				{
					name: 'Mi cuenta',
					link: '/dashboard/perfil',
					img: `${this.$config.LANDING_URL}/home.png`,
				},
			],
			drawer: false,
		};
	},
	methods: {
		logout() {
			this.$auth.logout();
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
	-webkit-filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
	filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
}
</style>
