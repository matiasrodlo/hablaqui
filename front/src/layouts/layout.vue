<template>
	<div>
		<v-app-bar
			color="transparent"
			app
			height="190"
			:style="{ backgroundPositionY: height }"
			class="appbar-image"
			flat
			hide-on-scroll
		>
			<template slot:extension>
				<v-row justify="space-between" align="flex-start" no-gutters>
					<v-col cols="8" offset="2" offset-sm="0" sm="2">
						<v-img
							max-width="200"
							alt="habla aqui Logo"
							src="../assets/habla-aqui.png"
						/>
						<!-- TOD0 -->
						<!-- <span>
						<v-btn light rounded text x-large>
							Nuestros especialistas
						</v-btn>
						<v-btn light rounded text x-large>
							Para empresas
						</v-btn>
						<v-btn light rounded text x-large>
							Para especialistas
						</v-btn>
					</span> -->
					</v-col>
					<v-col cols="12" sm="10" class="text-center text-sm-right">
						<v-btn color="primary" rounded text x-large>
							Entrar
						</v-btn>
						<v-btn rounded class="mx-2" color="primary">
							Comenzar
						</v-btn>
					</v-col>
				</v-row>
			</template>
		</v-app-bar>
		<v-main>
			<router-view />
		</v-main>
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
		</v-footer>
	</div>
</template>

<script>
export default {
	computed: {
		height() {
			if (this.$vuetify.breakpoint.xl) return '-100px';
			if (this.$vuetify.breakpoint.lg) return '-80px';
			return '80px';
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
