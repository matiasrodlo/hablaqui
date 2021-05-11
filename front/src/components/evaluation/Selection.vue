<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12">
				<div class="text-h4 font-weight-bold text-center">
					Conoce a los especialistas
				</div>
				<div class="text-center">
					Hemos priorizado aquellos que encajan de mejor manera con tus preferencias.
				</div>
			</v-col>
			<v-col cols="12" v-for="element in 3" :key="element" class="d-flex justify-center">
				<v-card color="white" style="border-radius: 15px">
					<v-card-text>
						<v-row align="center" justify="center">
							<v-col cols="12" sm="3" class="text-center">
								<v-list-item-avatar
									:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
									class="ml-4"
								>
									<v-btn
										color="#9D9D9C"
										class="elevation-0"
										fab
										width="100"
										height="100"
									></v-btn>
								</v-list-item-avatar>
								<div class="caption text--secondary">
									cedula xxxxxx
								</div>
								<v-btn text color="primary">Mas información</v-btn>
							</v-col>
							<v-col cols="12" sm="9">
								<v-row justify="space-between">
									<v-col
										class="text-center text-sm-left font-weight-bold text-h5 text--secondary"
									>
										Fernanda Croffman
									</v-col>
									<v-col cols="12" sm="6" class="text-right">
										<v-btn color="primary" rounded>
											Agenda cita online
										</v-btn>
									</v-col>
								</v-row>
								<v-chip v-for="el in [3, 1, 2]" :key="el" small class="my-4 mx-1">
									Ansiedad
								</v-chip>
								<div class="body-2 mt-2 text-capitalize">
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
									diam nonummy nibh euismod tincidunt ut laoreet dolore magna
									aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
									nostrud exerci tation ullamcorper suscipit loborm dolor sit
									amet, consectetuer adipiscing elit, sed diam nonummy nibh
									euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
									Ut wisi enim ad minim veniam, qum dolor sit amet, consectetuer
									adipiscing elit, sed diam nonummy
								</div>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" class="font-weight-bold mt-4 mb-16 d-flex justify-center align-center">
				¿No estás satisfecho con estas opciones?
				<v-btn text class="primary--text" to="/psicologos/todos"> Buscar más </v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
