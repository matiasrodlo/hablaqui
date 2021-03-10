<template>
	<div>
		<!-- only mobile drawer -->
		<v-navigation-drawer v-model="drawer" absolute temporary>
			<v-list-item>
				<v-img max-width="150" src="../assets/habla-aqui.png"></v-img>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item link>
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
			color="transparent"
			app
			:height="appbarHeight"
			class="appbar-image"
			flat
			hide-on-scroll
		>
			<v-img max-width="200" alt="habla aqui Logo" src="../assets/habla-aqui.png" contain />
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<v-btn light rounded text x-large>
					Nuestros especialistas
				</v-btn>
				<v-btn light rounded text x-large>
					Para empresas
				</v-btn>
				<v-btn light rounded text x-large>
					Para especialistas
				</v-btn>
				<v-spacer></v-spacer>
				<v-btn color="primary" rounded text x-large>
					Entrar
				</v-btn>
				<v-btn rounded class="mx-2" color="primary">
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
		<v-main>
			<router-view />
		</v-main>
		<!--
		<v-footer absolute padless app>
			<v-row>
				<v-col cols="12" class="primary white--text">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat, harum
					dolorem! A qui quaerat eius unde beatae adipisci ex culpa. Quod, adipisci esse
					voluptas nisi omnis nihil animi similique natus. Lorem ipsum dolor sit amet,
					consectetur adipisicing elit. Placeat, harum dolorem! A qui quaerat eius unde
					beatae adipisci ex culpa. Quod, adipisci esse voluptas nisi omnis nihil animi
					similique natus. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Placeat, harum dolorem! A qui quaerat eius unde beatae adipisci ex culpa. Quod,
					adipisci esse voluptas nisi omnis nihil animi similique natus. ipsum dolor sit
					amet, consectetur adipisicing elit. Placeat, harum dolorem! A qui quaerat eius
					unde beatae adipisci ex culpa. Quod, adipisci esse voluptas nisi omnis nihil
					animi similique natus. ipsum dolor sit amet, consectetur adipisicing elit.
					Placeat, harum dolorem! A qui quaerat eius unde beatae adipisci ex culpa. Quod,
					adipisci esse voluptas nisi omnis nihil animi similique natus.
				</v-col>
				<v-col cols="3">
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
				<v-col cols="3">
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
				<v-col cols="3">
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
				<v-col cols="3">
					<div class="text-center headline text--secondary font-weight-bold">
						Pago seguro
					</div>
					<div class="text-center headline text--secondary">
						LOGO PAYPAL
					</div>
				</v-col>
			</v-row>
		</v-footer> -->
	</div>
</template>

<script>
export default {
	data() {
		return {
			drawer: false,
		};
	},
	computed: {
		height() {
			if (this.$vuetify.breakpoint.xl) return '-100px';
			if (this.$vuetify.breakpoint.lg) return '-80px';
			return '0';
		},
		appbarHeight() {
			if (this.$vuetify.breakpoint.xl) return '170';
			if (this.$vuetify.breakpoint.lg) return '120';
			return '80';
		},
	},
};
</script>

<style lang="scss" scoped>
.appbar-image {
	background: url('../assets/appbar.png') no-repeat;
	background-size: 100%;
}

v-app-bar.v-toolbar__content {
	display: flex !important;
	align-items: flex-start !important;
}
</style>
