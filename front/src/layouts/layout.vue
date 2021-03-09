<template>
	<div>
		<v-app-bar color="white" app height="140" class="appbar-image" flat>
			<v-row justify="space-between" align="center">
				<v-col cols="12" sm="8" md="6" lg="3">
					<img style="width:100%" alt="habla aqui Logo" src="../assets/habla-aqui.png" />
				</v-col>
				<v-col class="text-right">
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
export default {};
</script>

<style lang="scss" scoped>
.appbar-image {
	background: url('../assets/appbar.png') no-repeat;
	background-position-y: -80px;
	background-size: 100%;
}
</style>
