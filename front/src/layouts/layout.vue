<template>
	<div>
		<!-- only sm and down drawer -->
		<v-navigation-drawer app v-if="!$vuetify.breakpoint.mdAndUp" v-model="drawer">
			<v-list-item>
				<v-img max-width="150" src="@/assets/logo.png"></v-img>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item link active-class="primary white--text" :to="{ name: 'psicologos' }">
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
				<v-list-item link :to="{ name: 'auth' }">
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
			:src="appbarBlue ? require('@/assets/appbar_blue.png') : require('@/assets/appbar.png')"
			:color="scrolled > 40 ? 'transparent' : $route.meta.appBarColor"
		>
			<router-link :to="{ name: 'psicologos' }">
				<v-img
					max-width="180"
					alt="habla aqui Logo"
					:src="
						appbarBlue
							? require('@/assets/logo_white.png')
							: require('@/assets/logo.png')
					"
					contain
				/>
			</router-link>
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<template v-if="$route.name !== 'blog'">
					<v-btn
						light
						rounded
						text
						:to="{ name: 'psicologos' }"
						active-class="info--text"
						class="ml-4"
					>
						Nuestros especialistas
					</v-btn>
					<v-btn light rounded text active-class="info--text">
						Para empresas
					</v-btn>
					<v-btn light rounded text active-class="info--text">
						Para especialistas
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn color="primary" rounded text :to="{ name: 'auth' }">
						Entrar
					</v-btn>
					<v-btn rounded class="mx-2" color="primary" depressed>
						Comenzar
					</v-btn>
				</template>
				<template v-else>
					<v-spacer></v-spacer>
					<v-btn
						x-large
						rounded
						class="mx-2 primary--text font-weight-bold"
						color="white"
						depressed
						:to="{ name: 'psicologos' }"
					>
						Comience su terapia ahora
					</v-btn>
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
			<router-view />
		</v-main>
	</div>
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
		appbarBlue() {
			const route = this.$route.name;
			return route == 'privacidad' || route == 'blog' || route == 'terminos-y-condiciones';
		},
		height() {
			if (this.$vuetify.breakpoint.lgAndUp) return '220px';
			if (this.$vuetify.breakpoint.mdAndUp) return '180px';
			if (this.$vuetify.breakpoint.smAndUp) return '150px';
			return '100px';
		},
	},
	created() {
		window.addEventListener('scroll', this.handleScroll);
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
