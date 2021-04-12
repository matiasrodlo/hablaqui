<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col cols="12">
				<div class="text-center text-h4 font-weight-bold">Lorem ipsum dolor</div>
				<div class="text-center caption font-weight-bold">
					Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
				</div>
			</v-col>
			<template v-if="showLoading">
				<v-col cols="12" sm="12" md="2" class="text-center text-md-right">
					<v-progress-circular indeterminate color="primary" size="130" :width="15">
						<div class="spinner"></div>
					</v-progress-circular>
				</v-col>
				<v-col cols="12" sm="12" md="6" lg="5" xl="4" class="text-center text-md-left">
					<div v-for="el in 4" :key="el" class="my-3 font-weight-bold">
						Lorem ipsum dolor sit amet consectetur adipisicing elit
						<v-badge color="primary" class="mx-2"></v-badge>
					</div>
				</v-col>
			</template>
			<template v-else>
				<v-col cols="8" v-for="element in 3" :key="element">
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
									<v-chip
										v-for="el in [3, 1, 2]"
										:key="el"
										small
										class="my-4 mx-1"
									>
										Ansiedad
									</v-chip>
									<div class="body-2 mt-2 text-capitalize">
										Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
										sed diam nonummy nibh euismod tincidunt ut laoreet dolore
										magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
										quis nostrud exerci tation ullamcorper suscipit loborm dolor
										sit amet, consectetuer adipiscing elit, sed diam nonummy
										nibh euismod tincidunt ut laoreet dolore magna aliquam erat
										volutpat. Ut wisi enim ad minim veniam, qum dolor sit amet,
										consectetuer adipiscing elit, sed diam nonummy
									</div>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" class="font-weight-bold mt-4 mb-16 text-center">
					<span class="primary--text">¿No estas felíz con las opciones?</span> Mostrar mas
					psicólogos Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam no
				</v-col>
			</template>
			<!-- <v-col cols="12">
				<v-window v-model="onboarding" reverse>
					<v-window-item v-for="n in 3" :key="`card-${n}`">
						<v-card color="grey" height="200">
							<v-row class="fill-height" align="center" justify="center">
								<h1 style="font-size: 5rem;" class="white--text">Slide {{ n }}</h1>
							</v-row>
						</v-card>
					</v-window-item>
				</v-window>
			</v-col> -->
		</v-row>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			showLoading: true,
		};
	},
	mounted() {
		setTimeout(() => {
			this.showLoading = false;
		}, 2000);
	},
};
</script>

<style lang="scss" scoped>
.spinner {
	height: 115px;
	width: 115px;
	background-color: #bdbdbd;
	border-radius: 70px;
}
</style>
