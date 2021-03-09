<template>
	<div>
		<v-app-bar
			color="white"
			app
			height="170"
			:style="{ backgroundPositionY: height }"
			class="appbar-image"
			flat
			hide-on-scroll
		>
			<v-row justify="space-between" align="center" no-gutters>
				<v-col cols="8" offset="2" offset-sm="0" sm="3">
					<img style="width:100%" alt="habla aqui Logo" src="../assets/habla-aqui.png" />
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
				<v-col cols="12" sm="9" class="text-center text-sm-right">
					<v-btn color="primary" rounded text x-large>
						Entrar
					</v-btn>
					<v-btn rounded class="mx-2" color="primary">
						Comenzar
					</v-btn>
				</v-col>
			</v-row>
		</v-app-bar>
		<v-main>
			<router-view />
		</v-main>
	</div>
</template>

<script>
export default {
	computed: {
		height() {
			if (this.$vuetify.breakpoint.xl) return '-120px';
			if (this.$vuetify.breakpoint.lg) return '-50px';
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
</style>
