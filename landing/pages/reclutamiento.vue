<template>
	<div>
		<client-only>
			<div class="primary">
				<Appbar />
			</div>
		</client-only>
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
										<div class="subtitle-2 my-6">
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
													v-for="it in 4"
													:key="it"
													class="d-inline-block"
												>
													<div
														style="
															border: 1px solid #bdbdbd;
															height: 50px;
															width: 50px;
															border-radius: 10px;
														"
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
			<v-row justify="center">
				<v-col cols="12">
					<div class="mt-16 text-center text-h4 text-lg-h3 font-weight-bold">
						Tenga un consultorio sin salir de casa
					</div>
					<div class="mt-3 mb-16 text-center text-h6">
						Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
						nibh
					</div>
				</v-col>
				<v-col v-for="item in 6" :key="item" cols="4">
					<v-card flat>
						<v-card-text class="text-center">
							<v-avatar size="150" color="secondary"></v-avatar>
						</v-card-text>
						<v-card-text class="text-center">
							<div class="title">Tenga un consultorio sin</div>
							<div class="subtitle-2">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, nobis
								facilis. Et quidem laborum, quibusdam vel debitis.
							</div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<v-img :src="`${$config.LANDING_URL}/wave-blue-1.png`" />
		<div class="primary">
			<v-container class="py-16">
				<v-row justify="center" class="my-10">
					<v-col cols="3" class="text-right">
						<v-avatar color="white" size="100" class="mt-10"></v-avatar>
						<div class="title white--text">Tenga un consultorio sin</div>
						<v-avatar color="white" size="100" class="mt-10"></v-avatar>
						<div class="title white--text">Tenga un consultorio sin</div>
						<v-avatar color="white" size="100" class="mt-10"></v-avatar>
						<div class="title white--text">Tenga un consultorio sin</div>
					</v-col>
					<v-col cols="4" class="text-center">
						<v-avatar color="white" size="400"></v-avatar>
					</v-col>
					<v-col cols="3" class="text-left">
						<v-avatar color="white" size="100" class="mt-10"></v-avatar>
						<div class="title white--text">Tenga un consultorio sin</div>
						<v-avatar color="white" size="100" class="mt-10"></v-avatar>
						<div class="title white--text">Tenga un consultorio sin</div>
						<v-avatar color="white" size="100" class="mt-10"></v-avatar>
						<div class="title white--text">Tenga un consultorio sin</div>
					</v-col>
				</v-row>
			</v-container>
		</div>
		<v-img :src="`${$config.LANDING_URL}/wave-blue-2.png`" />
		<v-container>
			<v-row justify="center">
				<v-col cols="12">
					<div class="mt-16 text-center text-h4 text-lg-h3 font-weight-bold">
						Tenga un consultorio sin salir de casa
					</div>
					<div class="mt-3 mb-16 text-center text-h6">
						Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
						nibh
					</div>
				</v-col>
				<v-col v-for="item in 3" :key="item" cols="4">
					<v-card flat>
						<v-card-text class="text-center">
							<v-avatar size="150" color="secondary"></v-avatar>
						</v-card-text>
						<v-card-text class="text-center">
							<div class="title">Tenga un consultorio sin</div>
							<div class="subtitle-2">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, nobis
								facilis. Et quidem laborum, quibusdam vel debitis.
							</div>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" class="text-center">
					<v-btn color="primary" rounded x-large>Enviar solicitud</v-btn>
					<div class="my-10 title">Lorem ipsum dolor sit amet</div>
				</v-col>
			</v-row>
		</v-container>
		<v-img :src="`${$config.LANDING_URL}/wave-blue-1.png`" />
		<div class="primary">
			<v-container class="py-16">
				<v-row align="center" justify="center" class="my-10">
					<v-col cols="12">
						<div
							class="mt-16 white--text text-center text-h4 text-lg-h3 font-weight-bold"
						>
							Tenga un consultorio sin salir de casa
						</div>
						<div class="mt-3 white--text mb-16 text-center text-h6">
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
							nonummy nibh
						</div>
					</v-col>
					<v-col cols="5">
						<v-card flat height="300" style="border-radius: 15px"> </v-card>
					</v-col>
					<v-col cols="5">
						<v-list three-line color="primary" dark>
							<template v-for="item in 3">
								<v-list-item :key="item" class="my-10">
									<v-list-item-avatar
										size="60"
										color="white"
									></v-list-item-avatar>
									<v-list-item-content>
										<v-list-item-title class="text-h4">
											Tenga un consultorio sin
										</v-list-item-title>
										<v-list-item-subtitle class="title">
											Lorem ipsum dolor sit amet, consecte-
										</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</template>
						</v-list>
					</v-col>
				</v-row>
			</v-container>
		</div>
		<v-img :src="`${$config.LANDING_URL}/wave-blue-2.png`" />
		<Footer />
	</div>
</template>

<script>
export default {
	components: {
		Footer: () => import('@/components/Footer'),
		Appbar: () => import('@/components/AppbarWhite'),
	},
};
</script>

<style lang="scss" scoped></style>
