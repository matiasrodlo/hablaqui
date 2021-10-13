<template>
	<div>
		<v-navigation-drawer v-model="drawer" class="hidden-md-and-up" app>
			<v-list-item>
				<nuxt-link to="/" style="width: 100%">
					<v-img
						id="logo-blue-drawer"
						accesskey="h"
						style="max-width: 150px"
						class="mx-auto my-5"
						:src="`https://cdn.hablaqui.cl/static/logo.png`"
						alt="hablaqui logo"
					/>
				</nuxt-link>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item id="comenzar-blue-drawer" accesskey="c" link nuxt to="/psicologos">
					<v-list-item-content>
						<v-list-item-title>Quiero comenzar</v-list-item-title>
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
					d="M.16-18.79V122.75c6.88,1,20.8,2.92,38.31,5.1,0,0,215.57,25.78,403,14.18,18.33-1.13,40.69-2.8,83.59-5.21,129.36-7.25,216.16-14.1,298.68-8.34a1547.37,1547.37,0,0,1,256.14,39.69v-187Z"
					style="fill: #2070e5"
				></path>
			</svg>
		</div>
		<v-app-bar absolute flat height="115" color="transparent">
			<nuxt-link to="/" exact>
				<v-img
					id="logo-blue-appbar"
					accesskey="h"
					style="max-width: 160px"
					alt="hablaqui Logo"
					:src="`https://cdn.hablaqui.cl/static/logo_white.png`"
					:lazy-src="`https://cdn.hablaqui.cl/static/logo_white.png`"
					contain
				/>
			</nuxt-link>
			<v-spacer></v-spacer>
			<v-btn
				id="psi-appbar-blue"
				to="/psicologos"
				large
				rounded
				class="hidden-sm-and-down mx-4 px-8"
				color="white"
				depressed
				accesskey="c"
			>
				<span class="body-1 font-weight-bold primary--text">Quiero comenzar</span>
			</v-btn>
			<div class="hidden-md-and-up">
				<v-spacer></v-spacer>
				<v-btn
					id="appbar-blue-menu-drawer"
					accesskey="m"
					class="mr-2"
					dark
					icon
					@click="drawer = !drawer"
				>
					<icon color="white" :icon="mdiMenu" />
				</v-btn>
			</div>
		</v-app-bar>
	</div>
</template>

<script>
import { mdiMenu } from '@mdi/js';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiMenu,
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
