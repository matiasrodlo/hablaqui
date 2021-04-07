<template>
	<v-container fluid>
		<v-card>
			<v-card-text>
				<v-row align="center" justify="center">
					<v-col cols="12" sm="3" lg="2" class="text-center">
						<v-list-item-avatar
							:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
							class="ml-4"
						>
							<v-btn
								color="#9D9D9C"
								class="elevation-0"
								fab
								:width="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
								:height="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
							></v-btn>
						</v-list-item-avatar>
						<div class="caption text--secondary">Cédula 12121212</div>
					</v-col>
					<v-col cols="12" sm="9" lg="10">
						<v-row justify="space-between">
							<v-col
								class="text-center text-sm-left font-weight-bold text-h3 text--secondary"
							>
								Fernanda Croffman
							</v-col>
							<v-col cols="12" sm="4" lg="3" class="text-right">
								<v-btn block color="primary" rounded>
									Agenda cita oline
								</v-btn>
							</v-col>
						</v-row>
						<v-chip v-for="el in [3, 1, 2]" :key="el" small class="my-4 mx-1">
							Ansiedad
						</v-chip>
						<div class="body-2 mt-2">
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
							nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
							volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
							ullamcorper suscipit lobor
						</div>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
		<v-card class="mt-6">
			<v-card-text class="text-h4 primary--text font-weight-bold">Perfil</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">EXPERIENCIA</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>Angústia</li>
							<li>Ansiedade</li>
							<li>Relacionamentos / Conflitos Amorosos / Ciúmes</li>
							<li>Relacionamentos / Conflitos Familiares</li>
							<li>Doenças Emocionais / Doenças Mentais</li>
							<li>Controle / Inteligência Emocional</li>
							<li>Estresse</li>
							<li>Autoconhecimento</li>
						</ul>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">ESPECIALIDADES</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>Angústia</li>
							<li>Ansiedade</li>
							<li>Relacionamentos / Conflitos Amorosos / Ciúmes</li>
							<li>Relacionamentos / Conflitos Familiares</li>
							<li>Doenças Emocionais / Doenças Mentais</li>
							<li>Controle / Inteligência Emocional</li>
							<li>Estresse</li>
							<li>Autoconhecimento</li>
						</ul>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">FORMACIÓN</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>Angústia</li>
							<li>Ansiedade</li>
							<li>Relacionamentos / Conflitos Amorosos / Ciúmes</li>
							<li>Relacionamentos / Conflitos Familiares</li>
							<li>Doenças Emocionais / Doenças Mentais</li>
							<li>Controle / Inteligência Emocional</li>
							<li>Estresse</li>
							<li>Autoconhecimento</li>
						</ul>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">DESCRIPCIÓN PERSONAL</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>Angústia</li>
							<li>Ansiedade</li>
							<li>Relacionamentos / Conflitos Amorosos / Ciúmes</li>
							<li>Relacionamentos / Conflitos Familiares</li>
							<li>Doenças Emocionais / Doenças Mentais</li>
							<li>Controle / Inteligência Emocional</li>
							<li>Estresse</li>
							<li>Autoconhecimento</li>
						</ul>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row align="center">
					<v-col cols="3" class="subtitle-1 primary--text">REPROGRAMACIÓN</v-col>
					<v-col class="body-1 text-left">
						<ul>
							<li>
								Remarcações podem ocorrer até 12 hora(s) antes sem custo adicional
							</li>
						</ul>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
