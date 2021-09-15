<template>
	<div style="background-color: #f0f8ff; height: 100%">
		<!-- appbar -->
		<appbar />
		<!-- containt -->
		<v-container fluid style="max-width: 1200px">
			<v-row>
				<v-col cols="6">
					<div class="headline font-weight-bold" style="color: #5a5a5a">
						Se parte de la red de salud mental de Hablaquí
					</div>
					<div class="my-3 text--secondary">
						Impulsa tu carrera profesional destacando y teniendo acceso a muchas
						funciones exclusivas que harán tu vida más fácil. Elija el plan que más le
						convenga:
					</div>
				</v-col>
				<v-col cols="3">
					<v-card class="rounded-xl">
						<div class="primary" style="height: 15px; width: 100%"></div>
						<v-card-text class="text-center">
							<div>La mejor opción</div>
							<div class="title font-weight-bold">Plan premium</div>
							<div>
								Para profesionales que buscan visibilidad, clientes y ganancias
							</div>
							<v-divider style="border-color: #2070e5"></v-divider>
							<v-divider style="border-color: #2070e5"></v-divider>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="3">
					<v-card class="rounded-xl">
						<div class="primary" style="height: 15px; width: 100%"></div>
						<v-card-text class="text-center">
							<div>Tu plan actual</div>
							<div class="title font-weight-bold">Plan básico</div>
							<div>
								Para profesionales que quieren servir en una plataforma segura
							</div>
							<v-divider></v-divider>
							<v-divider></v-divider>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	components: { Appbar: () => import('~/components/AppbarWhite') },
	middleware: ['auth'],
};
</script>

<style lang="scss" scoped></style>
