<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col
				cols="12"
				class="text-center font-weight-bold text-h5 text-lg-h3 text--secondary"
			>
				Bienvenido a nuestro portal de ayuda
			</v-col>
			<v-col cols="12" md="10" xl="8">
				<v-text-field
					class="white"
					label="Busca por tema o pregunta"
					outlined
					hide-details=""
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="6" lg="3" v-for="el in [1, 2, 3, 4]" :key="el">
				<v-card>
					<v-card-title class="text--secondary font-weight-bold title">
						¿Qué es y como funciona Hablaquí?
						<div class="caption font-weight-bold" style="color:#BDBDBD">
							5 artículos sobre el tema
						</div>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo voluptas aut
						incidunt sequi alias rerum suscipit harum assumenda itaque modi, nobis fugit
						vitae eaque eius animi molestiae aperiam, at ducimus.
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
