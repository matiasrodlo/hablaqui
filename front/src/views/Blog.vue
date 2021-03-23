<template>
	<div>
		<v-container>
			<!-- header -->
			<v-row>
				<v-col
					cols="12"
					class="primary--text font-weight-bold text-h5 text-md-h4 text-lg-h3 text-center py-16"
				>
					{{ $route.meta.title }}
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
						<template v-slot:[`label`]>
							<span class="primary--text"> Seleccione un asunto </span>
						</template>
						<template v-slot:[`append`]>
							<span class="primary--text subtitle-2"
								>Editar filtros<v-icon color="primary"
									>mdi-chevron-down</v-icon
								></span
							>
						</template>
						<template v-slot:[`selection`]="{ item }">
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
								<v-col cols="6" lg="7" style="height: 400px;">
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
										style="background-color: gray; border-radius: 5px; width: 100%; height: 100%"
									></v-img>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" sm="4" v-for="n in 7" :key="n">
					<v-card height="400" flat>
						<v-img height="200" style="background-color: gray;"> </v-img>

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
		<!-- podcast -->
		<div class="primary">
			<v-container>
				<v-row justify="center">
					<v-col cols="12" sm="6" md="3" v-for="n in 4" :key="n">
						<v-card flat>
							<v-img height="200" style="background-color: gray;"> </v-img>

							<v-card-title class="caption primary--text font-weight-bold">
								Cafe Badilico
							</v-card-title>

							<v-card-text class="font-weight-bold">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
							</v-card-text>
							<v-card-text class="caption">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
								nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
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
						<v-btn block color="white" outlined rounded>Ver todos</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.v-text-field.v-text-field--enclosed,
.v-sheet.v-card {
	border-radius: 25px !important;
}
</style>
