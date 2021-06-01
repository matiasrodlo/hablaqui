<template>
	<div>
		<v-navigation-drawer v-if="!$vuetify.breakpoint.mdAndUp" v-model="drawer" app>
			<v-list-item>
				<v-img
					style="max-width: 150px"
					:src="`${$config.LANDING_URL}/logo.png`"
					alt="hablaqui"
				/>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item
					link
					active-class="primary white--text"
					nuxt
					:to="{ name: 'psicologos' }"
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
				<v-list-item link nuxt :to="{ name: 'entrar' }">
					<v-list-item-content>
						<v-list-item-title>Iniciar sesión</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link nuxt :to="{ name: 'psicologos' }">
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
			<router-link to="/" exact>
				<img
					style="max-width: 160px"
					alt="hablaqui"
					:src="`${$config.LANDING_URL}/logo.png`"
					contain
				/>
			</router-link>
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<v-btn nuxt :to="{ name: 'psicologos' }" light rounded text class="mx-6">
					<span class="text--secondary body-1 font-weight-bold">Psicólogos</span>
				</v-btn>
				<v-btn light rounded text to="/faq">
					<span class="text--secondary body-1 font-weight-bold">
						Preguntas frecuentes
					</span>
				</v-btn>
				<v-btn light rounded text active-class="info--text" to="/blog">
					<span class="body-1 text--secondary font-weight-bold">Blog</span>
				</v-btn>
				<v-spacer></v-spacer>
				<div>
					<v-list-item active-class="transparent" class="mr-2" :to="{ name: 'entrar' }">
						<span class="body-1 font-weight-bold text--secondary">Iniciar sesión</span>
					</v-list-item>
				</div>
				<v-btn
					rounded
					x-large
					class="mx-2 py-0 px-10"
					color="primary"
					depressed
					nuxt
					:to="{ name: 'psicologos' }"
				>
					<span class="font-weight-bold body-1">Comenzar</span>
				</v-btn>
			</template>
			<template v-else>
				<v-spacer></v-spacer>
				<v-btn icon @click="drawer = !drawer">
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</template>
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
