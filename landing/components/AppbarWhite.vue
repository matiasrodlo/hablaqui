<template>
	<div>
		<v-navigation-drawer v-if="!$vuetify.breakpoint.mdAndUp" v-model="drawer" app>
			<v-list-item>
				<v-img
					style="max-width: 150px"
					:src="`${$config.LANDING_URL}/logo.png`"
					alt="hablaqui Logo"
				/>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item
					link
					active-class="primary white--text"
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
				<v-list-item link :href="`${$config.FRONTEND_URL}/auth`">
					<v-list-item-content>
						<v-list-item-title>Iniciar sesión</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link :href="`${$config.FRONTEND_URL}/auth/q=register`">
					<v-list-item-content>
						<v-list-item-title>Comenzar</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<div style="height: 150px; overflow: hidden">
			<svg
				class="shadow"
				viewBox="0 0 500 150"
				preserveAspectRatio="none"
				style="height: 100%; width: 100%"
			>
				<path
					d="M0.00,92.27 C216.83,192.92 304.30,8.39 500.00,109.03 L500.00,0.00 L0.00,0.00 Z"
					style="fill: white"
				></path>
			</svg>
		</div>
		<v-app-bar absolute flat height="100" color="transparent">
			<router-link to="/" exact>
				<img
					style="max-width: 180px"
					alt="hablaqui Logo"
					:src="`${$config.LANDING_URL}/logo.png`"
					contain
				/>
			</router-link>
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<v-btn
					:href="`${$config.FRONTEND_URL}/psicologos/todos`"
					light
					rounded
					text
					active-class="info--text"
					class="ml-4 text-h6 text--secondary"
				>
					Psicólogos
				</v-btn>
				<v-btn
					light
					rounded
					text
					active-class="info--text"
					class="text-h6 text--secondary"
					to="/faq"
				>
					Preguntas frecuentes
				</v-btn>
				<v-btn
					light
					rounded
					text
					active-class="info--text"
					class="text-h6 text--secondary"
					to="/blog"
				>
					Blog
				</v-btn>
				<v-spacer></v-spacer>
				<v-btn
					class="text-h6 text--secondary"
					rounded
					text
					:href="`${$config.FRONTEND_URL}/auth`"
				>
					Iniciar sesión
				</v-btn>
				<v-btn
					rounded
					class="mx-2 text-h6"
					color="primary"
					depressed
					x-large
					:href="`${$config.FRONTEND_URL}/auth/q=register`"
				>
					Comenzar
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
