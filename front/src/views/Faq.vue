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
					hide-details
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
					<v-card-text class="py-1">
						<v-btn text class="primary--text caption">¿Qué es Hablaquí?</v-btn>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-text class="py-1">
						<v-btn text class="primary--text caption">¿Cómo funciona?</v-btn>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-text class="py-1">
						<v-btn text class="primary--text caption">
							¿Cómo agendar mi primera cita en Hablaquí?
						</v-btn>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-text class="py-1">
						<v-btn text class="primary--text caption">
							¿Como tomar mi primera cita en Hablaquí?
						</v-btn>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-text class="py-1">
						<v-btn text class="primary--text caption">
							¿Las consultas en línas son efectivas?
						</v-btn>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-text class="py-1">
						<v-btn text class="primary--text caption">¿Qué es Hablaquí?</v-btn>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-text class="py-1">
						<v-btn text class="primary--text caption">
							¿Necesito descargar alguna App de videollamada?
						</v-btn>
					</v-card-text>
					<v-divider></v-divider>
				</v-card>
			</v-col>
			<v-col
				cols="12"
				class="text-center font-weight-bold text-h5 text-lg-h3 text--secondary"
			>
				Contáctanos
			</v-col>
			<v-col cols="12" class="text-center font-weight-bold">
				<span style="color:#BDBDBD">Lorem ipsum dolor sit amet, consectetuer </span>
				<a style="text-decoration: none">adipiscing elit, sed diam no-</a>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
