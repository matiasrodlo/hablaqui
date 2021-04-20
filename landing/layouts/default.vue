<template>
	<v-app app>
		<v-navigation-drawer v-if="!$vuetify.breakpoint.mdAndUp" v-model="drawer" app>
			<v-list-item>
				<img style="max-width: 150px" src="logo.png" />
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
		<v-app-bar
			app
			flat
			hide-on-scroll
			:height="height"
			:src="$route.name === 'blog' ? 'appbar_blue.png' : 'appbar.png'"
			:color="bg"
		>
			<router-link to="/" exact>
				<img
					style="max-width: 180px"
					alt="habla aqui Logo"
					:src="$route.name === 'blog' ? 'logo_white.png' : 'logo.png'"
					contain
				/>
			</router-link>
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<template v-if="$route.name !== 'blog'">
					<v-btn light rounded text active-class="info--text" class="ml-4">
						Nuestros especialistas
					</v-btn>
					<v-btn light rounded text active-class="info--text"> Para empresas </v-btn>
					<v-btn light rounded text active-class="info--text"> Para especialistas </v-btn>
					<v-spacer></v-spacer>
					<v-btn color="primary" rounded text :href="`${$config.FRONTEND_URL}/auth`">
						Entrar
					</v-btn>
					<v-btn rounded class="mx-2" color="primary" depressed> Comenzar </v-btn>
				</template>
				<template v-else>
					<v-spacer></v-spacer>
					<v-btn
						x-large
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
			</template>
			<template v-else>
				<v-spacer></v-spacer>
				<v-btn icon @click="drawer = !drawer">
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</template>
		</v-app-bar>
		<v-main>
			<nuxt />
		</v-main>
	</v-app>
</template>

<script>
export default {
	data() {
		return {
			drawer: false,
			scrolled: null,
		};
	},
	computed: {
		bg() {
			const route = this.$route.name;
			const color = route === 'blog' || route === 'index' ? 'transparent' : 'primary';
			return this.scrolled > 40 ? 'transparent' : color;
		},
		height() {
			if (this.$vuetify.breakpoint.lgAndUp) return '220px';
			if (this.$vuetify.breakpoint.mdAndUp) return '180px';
			if (this.$vuetify.breakpoint.smAndUp) return '150px';
			return '100px';
		},
	},
	created() {
		if (process.browser) {
			// eslint-disable-next-line nuxt/no-globals-in-created
			window.addEventListener('scroll', this.handleScroll);
		}
	},
	destroyed() {
		window.removeEventListener('scroll', this.handleScroll);
	},
	methods: {
		handleScroll() {
			this.scrolled = window.scrollY;
		},
	},
};
</script>
