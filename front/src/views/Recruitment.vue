<template>
	<div>
		<v-container fluid class="primary py-16">
			<v-row justify="center" align="center">
				<v-col cols="12" md="5" lg="6">
					<div class="text-left white--text text-h4 text-lg-h3 font-weight-bold">
						Tenga un consultorio sin salir de casa
					</div>
					<div class="mt-3 text-left white--text text-h6 font-weight-bold">
						Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
						nibh
					</div>
					<v-list color="primary" dark class="text-h6">
						<v-list-item v-for="el in 3" :key="el">
							<v-list-item-icon>
								<v-icon>mdi-check</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								Lorem ipsum dolor sit amet, consectetuer adipis-
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-col>
				<v-col cols="12" md="7" lg="6">
					<v-form>
						<v-card flat style="border-radius: 15px">
							<v-card-text>
								<v-row justify="center">
									<v-col cols="6" style="border-right: 1px solid #bdbdbd">
										<div class="title">Faca parte</div>
										<div class="subtitle-2 my-2">
											Lorem ipsum dolor sit amet, consectetuer adi-piscing
											elit, sed diam nonummy nibh diam
										</div>
										<v-row no-gutters>
											<v-col cols="12">
												<v-text-field
													label="Nombre completo"
													outlined
													dense
												></v-text-field>
											</v-col>
											<v-col cols="12">
												<v-text-field
													label="Correo electronico"
													outlined
													dense
												></v-text-field>
											</v-col>
											<v-col cols="12">
												<v-text-field
													label="senha"
													outlined
													dense
												></v-text-field>
											</v-col>
											<v-col cols="6">
												<v-text-field
													label="senha"
													outlined
													dense
												></v-text-field>
											</v-col>
											<v-col cols="6">
												<v-text-field
													label="senha"
													outlined
													dense
												></v-text-field>
											</v-col>
										</v-row>
									</v-col>
									<v-col cols="6">
										<div style="height: 60%">
											<div class="title text-left">
												Seleccione su especialidad
											</div>
											<div class="d-flex justify-space-between">
												<div
													class="d-inline-block"
													v-for="it in 4"
													:key="it"
												>
													<div
														style="border: 1px solid #bdbdbd; height: 50px; width: 50px; border-radius: 10px"
													/>
													<div class="text-center text--secondary">
														Psicologo
													</div>
												</div>
											</div>
											<v-text-field></v-text-field>
											<v-text-field></v-text-field>
										</div>

										<div class="mt-4">
											<v-checkbox dense hide-details class="d-inline-block" />
											Aceptar
											<span
												class="primary--text p-0 caption"
												style="cursor: pointer"
												@click="
													$router.push({ name: 'terminos-y-condiciones' })
												"
											>
												Términos y Condiciones
											</span>
											y
											<span
												class="primary--text p-0 caption"
												style="cursor: pointer"
												@click="$router.push({ name: 'privacidad' })"
											>
												politicas de privacidad
											</span>
										</div>
										<v-btn rounded color="primary" block depressed>
											Enviar solicitud
										</v-btn>
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>
					</v-form>
				</v-col>
			</v-row>
		</v-container>
		<v-container>
			<v-row>
				<v-col cols="12" class="text-center text-h4 text-lg-h3 font-weight-bold">
					Tenga un consultorio sin salir de casa
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
