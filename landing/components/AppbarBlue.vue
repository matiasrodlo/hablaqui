<template>
	<div>
		<v-navigation-drawer v-if="!$vuetify.breakpoint.mdAndUp" v-model="drawer" app>
			<v-list-item>
				<img
					style="max-width: 150px"
					:src="`${$config.LANDING_URL}/logo.png`"
					alt="hablaqui logo"
				/>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item link active-class="primary white--text">
					<v-list-item-content>
						<v-list-item-title>Nuestros especialistas</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-content>
						<v-list-item-title>Para empresas</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-content>
						<v-list-item-title>Para especialistas</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-content>
						<v-list-item-title>Entrar</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
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
					style="fill: #2070e5"
				></path>
			</svg>
		</div>
		<v-app-bar absolute flat height="100" color="transparent">
			<router-link to="/" exact>
				<img
					style="max-width: 180px"
					alt="hablaqui Logo"
					:src="`${$config.LANDING_URL}/logo_white.png`"
					contain
				/>
			</router-link>
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<v-spacer></v-spacer>
				<v-btn
					:href="`${$config.FRONTEND_URL}/auth/q=register`"
					large
					rounded
					class="mx-2 primary--text font-weight-bold"
					color="white"
					depressed
				>
					Comience su terapia ahora
				</v-btn>
				<v-icon x-large color="white" class="ma-2">mdi-magnify</v-icon>
				<v-icon x-large color="white" class="ma-2">mdi-menu</v-icon>
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
