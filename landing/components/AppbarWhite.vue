<template>
	<div>
		<v-navigation-drawer v-model="drawer" class="hidden-md-and-up" app>
			<v-list-item>
				<nuxt-link to="/" style="width: 100%">
					<v-img
						style="max-width: 150px"
						class="mx-auto"
						:src="`${$config.LANDING_URL}/logo.png`"
						alt="hablaqui"
					/>
				</nuxt-link>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item
					link
					active-class="primary white--text"
					nuxt
					:href="`${$config.FRONTEND_URL}/psicologos/todos`"
				>
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
				<v-list-item link nuxt :href="`${$config.FRONTEND_URL}/auth`">
					<v-list-item-content>
						<v-list-item-title>Iniciar sesión</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link nuxt :href="`${$config.FRONTEND_URL}/psicologos/todos`">
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
					alt="hablaqui"
					:src="`${$config.LANDING_URL}/logo.png`"
					:lazy-src="`${$config.LANDING_URL}/logo.png`"
					contain
				>
				</v-img>
			</nuxt-link>

			<a
				:href="`${$config.FRONTEND_URL}/psicologos/todos`"
				style="text-decoration: none"
				class="hidden-sm-and-down ml-7 mr-3"
			>
				<span class="text--secondary body-1 font-weight-bold">Psicólogos</span>
			</a>
			<nuxt-link class="mx-5 hidden-sm-and-down" style="text-decoration: none" to="/faq">
				<span class="text--secondary body-1 font-weight-bold"> Preguntas frecuentes </span>
			</nuxt-link>
			<nuxt-link class="mx-5 hidden-sm-and-down" style="text-decoration: none" to="/blog">
				<span class="body-1 text--secondary font-weight-bold">Blog</span>
			</nuxt-link>
			<v-spacer></v-spacer>
			<div class="hidden-sm-and-down">
				<a
					class="mr-5"
					style="text-decoration: none"
					:href="`${$config.FRONTEND_URL}/auth`"
				>
					<span class="body-1 font-weight-bold text--secondary">Iniciar sesión</span>
				</a>
			</div>
			<v-btn
				rounded
				class="hidden-sm-and-down py-6 px-10"
				color="primary"
				depressed
				nuxt
				:href="`${$config.FRONTEND_URL}/auth/q=register`"
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
	data() {
		return {
			drawer: false,
		};
	},
};
</script>
<style lang="scss" scoped>
.shadow {
	-webkit-filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
	filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.1));
}
</style>
