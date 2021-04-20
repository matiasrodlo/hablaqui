<template>
	<div>
		<v-container>
			<!-- header -->
			<v-row>
				<v-col
					cols="12"
					class="primary--text font-weight-bold text-h5 text-md-h4 text-lg-h3 text-center py-16"
				>
					Blog
				</v-col>
				<v-col cols="12">
					<v-select
						flat
						solo
						background-color="white"
						hide-details
						:items="['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis']"
						no-data-text="Vacio"
					>
						<template #[`label`]>
							<span class="primary--text"> Seleccione un asunto </span>
						</template>
						<template #[`append`]>
							<span class="primary--text subtitle-2"
								>Editar filtros<v-icon color="primary"
									>mdi-chevron-down</v-icon
								></span
							>
						</template>
						<template #[`selection`]="{ item }">
							<span class="primary--text"> {{ item }} </span>
						</template>
					</v-select>
				</v-col>
			</v-row>
			<!-- blogs -->
			<v-row justify="center">
				<v-col cols="12" sm="8">
					<v-card flat height="400">
						<v-card-text>
							<v-row>
								<v-col cols="6" lg="7" style="height: 400px">
									<div class="font-weight-bold">
										Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
									</div>
									<v-card-title
										class="px-0 caption primary--text font-weight-bold"
									>
										Cafe Badilico
									</v-card-title>
									<div class="caption" style="overflow-y: auto; height: 250px">
										Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
										sed diam nonummy nibh euismod tincidunt ut laoreet dolore
										magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
										quis nostrud exerci tation ullamcorper suscipit lobortis
										nisl ut aliquip ex ea commodo consequat. Duis autem vel eum
										iriure dolor in hendrerit in vulputate velit esse molestie
										consequat, vel illum dolore eu.
										<br />
										<br />
										Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
										sed diam nonummy nibh euismod tincidunt ut laoreet dolore
										magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
										quis nostrud exerci tation ullamcorper suscipit lobortis
										nisl ut aliquip ex ea commodo consequat. Duis autem vel eum
										iriure dolor in hendrerit in vulputate velit esse molestie
										consequat, vel illum dolore eu
										<br />
										<br />
										Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
										sed diam nonummy nibh euismod tincidunt ut laoreet dolore
										magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
										quis nostrud exerci tation ullamcorper suscipit lobortis
										nisl ut aliquip ex ea commodo consequat. Duis autem vel eum
										iriure dolor in hendrerit in vulputate velit esse molestie
										consequat, vel illum dolore eu
										<br />
										<br />
										Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
										sed diam nonummy nibh euismod tincidunt ut laoreet dolore
										magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
										quis nostrud exerci tation ullamcorper suscipit lobortis
										nisl ut aliquip ex ea commodo consequat. Duis autem vel eum
										iriure dolor in hendrerit in vulputate velit esse molestie
										consequat, vel illum dolore eu
									</div>
								</v-col>
								<v-col cols="6" lg="5">
									<v-img
										style="
											background-color: gray;
											border-radius: 5px;
											width: 100%;
											height: 100%;
										"
									></v-img>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col v-for="n in 7" :key="n" cols="12" sm="4">
					<v-card height="400" flat>
						<v-img height="200" style="background-color: gray"> </v-img>

						<v-card-title class="caption primary--text font-weight-bold">
							Cafe Badilico
						</v-card-title>

						<v-card-text class="font-weight-bold">
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
						</v-card-text>
						<v-card-text>
							<span class="caption primary--text font-weight-bold">
								por Valentina Simoneti
							</span>
							<span>18 febrero 2021</span>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
			<v-row justify="center">
				<v-col cols="3">
					<v-btn block color="primary" outlined rounded>Ver todos</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- for companies -->
		<v-img src="container-blue.png">
			<v-container>
				<v-row justify="center">
					<v-col cols="12" class="py-16">
						<div
							class="white--text font-weight-bold text-h5 text-md-h4 text-lg-h3 text-center"
						>
							Para empresas
						</div>
						<div class="white--text text-h6 text-center">
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
						</div>
					</v-col>
					<v-col v-for="n in 4" :key="n" cols="12" sm="6" md="3">
						<v-card flat>
							<v-img height="200" style="background-color: gray"> </v-img>

							<v-card-title class="caption primary--text font-weight-bold">
								Cafe Badilico
							</v-card-title>

							<v-card-text class="font-weight-bold pb-0">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
							</v-card-text>
							<v-card-text class="caption">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
								nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
							</v-card-text>
							<v-card-text>
								<span class="caption primary--text font-weight-bold">
									por Hablaquí
								</span>
								<span>18 febrero 2021</span>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
				<v-row justify="center" class="py-8">
					<v-col cols="3">
						<v-btn block color="white" outlined rounded>Ver todos</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-img>
		<!-- podcast -->
		<v-container>
			<v-row justify="center">
				<v-col cols="12" class="text-center py-8">
					<div class="primary--text font-weight-bold text-h5 text-md-h4 text-lg-h3">
						Hablaquí podcast
					</div>
					<div class="text--secondary text-h6">
						Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
					</div>
				</v-col>
				<v-col v-for="n in 4" :key="n" cols="12" sm="6" md="3">
					<v-card flat>
						<v-img height="200" style="background-color: gray"> </v-img>

						<v-card-title class="caption primary--text font-weight-bold">
							Cafe Badilico
							<v-spacer></v-spacer>
							<v-btn depressed small fab color="primary">
								<v-icon x-large>mdi-play</v-icon>
							</v-btn>
						</v-card-title>

						<v-card-text class="font-weight-bold">
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
						</v-card-text>
						<v-card-text>
							<span class="caption primary--text font-weight-bold">
								por John Smith
							</span>
							<span>18 febrero 2021</span>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
			<v-row justify="center">
				<v-col cols="3">
					<v-btn block color="primary" outlined rounded>Ver todos</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- Categories -->
		<div class="primary">
			<v-container>
				<v-row justify="center">
					<v-col cols="12" class="py-8">
						<div
							class="white--text font-weight-bold text-h5 text-md-h4 text-lg-h3 text-center"
						>
							Categoria Populares
						</div>
						<div class="white--text text-h6 text-center">
							Lorem ipsum dolor sit amet, consectetuer adipiscing
						</div>
					</v-col>
					<v-col v-for="n in 4" :key="n" cols="12" sm="6" md="3">
						<v-card flat>
							<v-card-text class="text-center">
								<v-list-item-avatar size="120" class="ml-4">
									<v-btn
										depressed
										color="#9D9D9C"
										fab
										width="120"
										height="120"
									></v-btn>
								</v-list-item-avatar>
								<div class="text-center caption font-weight-bold">
									Cafe Badilico
								</div>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</div>
		<v-container class="my-10">
			<v-row>
				<v-col cols="12" sm="6">
					<div class="title mt-8">
						Lorem ipsum <span class="primary--text">dolor sit amet</span> consecte
					</div>
					<div class="subtitle-1 mb-8 text--secondary">
						Lorem ipsum dolor sit amet, consectetuer
					</div>
					<v-text-field outlined label="Lorem ipsum dolor sit amet, consectetuer ">
						<template #[`append`]>
							<v-btn rounded small color="primary">LOREM ITSUM</v-btn>
						</template>
					</v-text-field>
				</v-col>
				<v-col cols="12" sm="6">
					<v-img
						style="
							background-color: gray;
							border-radius: 5px;
							width: 100%;
							height: 100%;
						"
					></v-img>
				</v-col>
			</v-row>
		</v-container>
		<!-- Categories -->
		<div class="primary white--text">
			<v-container class="pb-10">
				<v-row justify="center">
					<v-col cols="12" sm="4" class="text-left">
						<div class="title font-weight-bold">Lorem ipsum</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet</div>
					</v-col>
					<v-col cols="12" sm="4" class="text-left">
						<div class="title font-weight-bold">Lorem ipsum</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet</div>
					</v-col>
					<v-col cols="12" sm="4" class="text-left">
						<div class="title font-weight-bold">Lorem ipsum</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet</div>
					</v-col>
					<v-col cols="12">
						<div class="title font-weight-bold">
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam no
						</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet,</div>
					</v-col>
					<v-col cols="12">
						<div class="title font-weight-bold">
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam no
						</div>
						<div class="subtitle-1">Lorem ipsum dolor sit amet,</div>
						<div>
							<v-icon color="white" x-large>mdi-facebook</v-icon>
							<v-icon color="white" x-large>mdi-instagram</v-icon>
							<v-icon color="white" x-large>mdi-linkedin</v-icon>
						</div>
					</v-col>
				</v-row>
			</v-container>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.v-text-field.v-text-field--enclosed,
.v-sheet.v-card {
	border-radius: 25px !important;
}
</style>
