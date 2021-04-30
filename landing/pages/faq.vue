<template>
	<div>
		<client-only>
			<Appbar />
		</client-only>
		<v-container fluid>
			<v-row justify="center">
				<v-col cols="12" class="text-center font-weight-bold text-h5 text-lg-h3 py-16">
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
				<v-col v-for="el in [1, 2, 3, 4]" :key="el" cols="12" sm="6" lg="3">
					<v-card>
						<v-card-title class="text--secondary font-weight-bold title">
							¿Qué es y como funciona Hablaquí?
							<div class="caption font-weight-bold" style="color: #bdbdbd">
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
			</v-row>
			<!-- footer -->
			<v-row class="py-16">
				<v-col
					cols="12"
					class="text-center font-weight-bold text-h5 text-lg-h3 text--secondary"
				>
					Contáctanos
				</v-col>
				<v-col cols="12" class="text-center font-weight-bold">
					<span style="color: #bdbdbd">Lorem ipsum dolor sit amet, consectetuer </span>
					<a style="text-decoration: none">adipiscing elit, sed diam no-</a>
				</v-col>
			</v-row>
			<v-row class="primary white--text py-16">
				<v-col cols="12">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat, harum
					dolorem! A qui quaerat eius unde beatae adipisci ex culpa. Quod, adipisci esse
					voluptas nisi omnis nihil animi similique natus. Lorem ipsum dolor sit amet,
					consectetur adipisicing elit. Placeat, harum dolorem! A qui quaerat eius unde
					beatae adipisci ex culpa. Quod, adipisci esse voluptas nisi omnis nihil animi
					similique natus. Lorem ipsum dolor sit ame.
				</v-col>
			</v-row>
			<v-row justify="center" class="py-16">
				<v-col cols="12" sm="6" md="5" class="text-center text-sm-left">
					<div style="color: #bdbdbd">Aviso de privacidad Términos y Condiciones</div>
					<div class="text--secondary">
						© 2019 Terapify Network, S.A.P.I. de C.V. Todos los derechos reservados.
					</div>
				</v-col>
				<v-col cols="12" sm="6" md="5" class="text-center text-sm-right text--secondary">
					<v-chip color="secondary" label class="mx-2 px-4"></v-chip>
					<v-chip color="secondary" label class="mx-2 px-4"></v-chip>
					<v-chip color="secondary" label class="ml-2 px-4"></v-chip>
					<div>Atención a clientes: clientes@hablaqui.com</div>
					<div>Soporte técnico: soporte@hablaaqui.com</div>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	components: {
		Appbar: () => import('@/components/AppbarWhite'),
	},
};
</script>

<style lang="scss" scoped></style>
