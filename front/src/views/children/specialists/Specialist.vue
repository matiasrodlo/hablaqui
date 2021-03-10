<template>
	<v-container fluid>
		<v-card>
			<v-card-text>
				<v-row>
					<v-col cols="3" class="text-center">
						<v-btn
							color="#9D9D9C"
							class="elevation-0"
							fab
							width="130"
							height="130"
						></v-btn>
						<div class="mt-2">Cédula: xxxxxxxx</div>
					</v-col>
					<v-col cols="9">
						<v-row justify="space-between">
							<v-col class="text-left font-weight-bold text-h3 text--secondary">
								Fernanda Croffman
							</v-col>
							<v-col cols="3">
								<v-btn color="primary" rounded>Agenda cita online</v-btn>
							</v-col>
						</v-row>
						<v-row no-gutters>
							<v-col cols="12">
								<v-chip class="mx-2">ansiedad</v-chip>
								<v-chip class="mx-2">ansiedad</v-chip>
								<v-chip class="mx-2">ansiedad</v-chip>
							</v-col>
							<v-col cols="12">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
								nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
								volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
								ullamcorper suscipit lobor
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
		<v-card class="mt-6">
			<v-card-text class="text-h4 primary--text font-weight-bold">Perfil</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col cols="3" class="subtitle-1 primary--text">EXPERIENCIA</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>tag 1 Lorem ipsum dolor sit amet</li>
							<li>tag 2</li>
							<li>tag 3</li>
							<li>tag 4</li>
							<li>tag 5</li>
							<li>tag 6</li>
							<li>tag 7</li>
							<li>tag 8</li>
						</ul>
					</v-col>
				</v-row>
				<v-divider></v-divider>
			</v-card-text>
			<v-card-text>
				<v-row>
					<v-col cols="3" class="subtitle-1 primary--text">ESPECIALIDADES</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>tag 1 Lorem ipsum dolor sit amet</li>
							<li>tag 2</li>
							<li>tag 3</li>
							<li>tag 4</li>
							<li>tag 5</li>
							<li>tag 6</li>
							<li>tag 7</li>
							<li>tag 8</li>
						</ul>
					</v-col>
				</v-row>
				<v-divider></v-divider>
			</v-card-text>
			<v-card-text>
				<v-row>
					<v-col cols="3" class="subtitle-1 primary--text">FORMACIÓN</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>tag 1 Lorem ipsum dolor sit amet</li>
							<li>tag 2</li>
							<li>tag 3</li>
							<li>tag 4</li>
							<li>tag 5</li>
							<li>tag 6</li>
							<li>tag 7</li>
							<li>tag 8</li>
						</ul>
					</v-col>
				</v-row>
				<v-divider></v-divider>
			</v-card-text>
			<v-card-text>
				<v-row>
					<v-col cols="3" class="subtitle-1 primary--text">DESCRIPCIÓN PERSONAL</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>tag 1 Lorem ipsum dolor sit amet</li>
							<li>tag 2</li>
							<li>tag 3</li>
							<li>tag 4</li>
							<li>tag 5</li>
							<li>tag 6</li>
							<li>tag 7</li>
							<li>tag 8</li>
						</ul>
					</v-col>
				</v-row>
				<v-divider></v-divider>
			</v-card-text>
			<v-card-text>
				<v-row>
					<v-col cols="3" class="subtitle-1 primary--text">DESCRIPCIÓN PERSONAL</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>tag 1 Lorem ipsum dolor sit amet</li>
							<li>tag 2</li>
							<li>tag 3</li>
							<li>tag 4</li>
							<li>tag 5</li>
							<li>tag 6</li>
							<li>tag 7</li>
							<li>tag 8</li>
						</ul>
					</v-col>
				</v-row>
				<v-divider></v-divider>
			</v-card-text>
			<v-card-text>
				<v-row>
					<v-col cols="3" class="subtitle-1 primary--text">REPROGRAMACIÓN</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>tag 1 Lorem ipsum dolor sit amet</li>
							<li>tag 2</li>
							<li>tag 3</li>
							<li>tag 4</li>
							<li>tag 5</li>
							<li>tag 6</li>
							<li>tag 7</li>
							<li>tag 8</li>
						</ul>
					</v-col>
				</v-row>
				<v-divider></v-divider>
			</v-card-text>
		</v-card>
		<v-btn color="primary" class="my-6" @click="() => $router.go(-1)">Regresar</v-btn>
	</v-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
