<template>
	<div>
		<!-- only sm and down drawer -->
		<v-navigation-drawer v-if="!$vuetify.breakpoint.mdAndUp" app v-model="drawer">
			<v-list-item>
				<v-img max-width="150" src="../assets/habla-aqui.png"></v-img>
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
			src="@/assets/appbar.png"
			:color="scrolled > 40 ? 'transparent' : $route.meta.appBarColor"
		>
			<router-link :to="{ name: 'psicologos' }">
				<v-img
					max-width="180"
					alt="habla aqui Logo"
					src="../assets/habla-aqui.png"
					contain
				/>
			</router-link>
			<template v-if="$vuetify.breakpoint.mdAndUp">
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
				<v-btn icon @click="drawer = !drawer">
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</template>
		</v-app-bar>
		<v-main class="mb-16">
			<router-view />
		</v-main>
		<v-footer absolute padless app>
			<v-card flat tile>
				<v-card-text class="primary white--text py-16">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat, harum
					dolorem! A qui quaerat eius unde beatae adipisci ex culpa. Quod, adipisci esse
					voluptas nisi omnis nihil animi similique natus. Lorem ipsum dolor sit amet,
					consectetur adipisicing elit. Placeat, harum dolorem! A qui quaerat eius unde
					beatae adipisci ex culpa. Quod, adipisci esse voluptas nisi omnis nihil animi
					similique natus. Lorem ipsum dolor sit ame.
				</v-card-text>
				<v-card-text class="white--text py-16">
					<v-row>
						<v-col cols="12" sm="3">
							<div class="text-center headline text--secondary font-weight-bold">
								Acuerdos
							</div>
							<div class="text-center headline text--secondary">
								Políticas de Privacidad
							</div>
							<div class="text-center headline text--secondary">
								Terminos y Condiciones
							</div>
						</v-col>
						<v-col cols="12" sm="3">
							<div class="text-center headline text--secondary font-weight-bold">
								Soporte Técnico
							</div>
							<div class="text-center headline text--secondary">
								+52 1 5568 2686 6322
							</div>
							<div class="text-center headline text--secondary">
								soporte@hablaqui.com
							</div>
						</v-col>
						<v-col cols="12" sm="3">
							<div class="text-center headline text--secondary font-weight-bold">
								Atención a clientes
							</div>
							<div class="text-center headline text--secondary">
								clientes@hablaqui.com
							</div>
							<div class="text-center headline text--secondary">
								John Harvard
							</div>
						</v-col>
						<v-col cols="12" sm="3">
							<div class="text-center headline text--secondary font-weight-bold">
								Pago seguro
							</div>
							<div class="text-center headline text--secondary">
								LOGO PAYPAL
							</div>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-footer>
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
