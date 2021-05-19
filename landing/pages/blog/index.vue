<template>
	<div style="background-color: #ebf2f3">
		<client-only>
			<Appbar />
		</client-only>
		<v-container>
			<!-- header -->
			<v-row>
				<v-col
					cols="12"
					class="primary--text font-weight-bold text-h5 text-md-h4 text-lg-h3 text-center py-16"
				>
					Blog Hablaquí
				</v-col>
				<v-col cols="12">
					<v-select
						flat
						solo
						hide-details
						:items="['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis']"
						no-data-text="Vacio"
					>
						<template #label>
							<span class="primary--text font-weight-bold">Seleccione un asunto</span>
						</template>
						<template #append>
							<span class="primary--text subtitle-2">
								Editar filtros
								<v-icon color="primary">mdi-chevron-down</v-icon>
							</span>
						</template>
						<template #selection="{ item }">
							<span class="primary--text">{{ item }}</span>
						</template>
					</v-select>
				</v-col>
			</v-row>
			<!-- blogs -->
			<v-row justify="center" class="mb-16">
				<v-col v-for="(article, i) in articles" :key="i" cols="12" :sm="i == 0 ? '8' : '4'">
					<template v-if="length > i">
						<v-hover v-slot="{ hover }">
							<v-card
								:to="{ path: `/blog/${article.slug}` }"
								style="transition: transform 0.4s"
								:style="
									hover
										? 'transform: scale(1.02);'
										: 'text-transform: none !important;'
								"
								:class="hover ? 'elevation-4' : 'elevation-0'"
								height="400"
								width="100%"
								flat
							>
								<template v-if="i == 0">
									<v-card-text>
										<v-row>
											<v-col
												cols="6"
												style="
													height: 390px;
													display: flex;
													flex-direction: column !important;
												"
												class="justify-space-between"
											>
												<div>
													<div class="title black--text font-weight-bold">
														{{ article.title }}
													</div>
													<div
														class="my-2 title primary--text font-weight-bold"
													>
														categoria
													</div>
													<div
														class="subtitle-1"
														v-html="
															article.HTMLbody.toString()
																.slice(0, 250)
																.concat('...')
														"
													/>
												</div>
												<div>
													<div class="title font-weight-bold">
														<span
															v-if="article.originalAuthor"
															class="primary--text"
														>
															por {{ article.originalAuthor }}
														</span>
														<span v-if="article.originalAuthor">|</span>
														<span class="text--disabled">
															{{ dates(article.createdAt) }}
														</span>
													</div>
												</div>
											</v-col>
											<v-col cols="6">
												<v-img
													style="border-radius: 10px"
													height="365"
													class="grey lighten-3"
													:src="article.thumbnail"
												>
												</v-img>
											</v-col>
										</v-row>
									</v-card-text>
								</template>
								<template v-else>
									<v-img
										class="grey lighten-3"
										height="200"
										:src="article.thumbnail"
									>
									</v-img>
									<v-card-text
										class="d-flex justify-space-between"
										style="flex-direction: column; height: 200px"
									>
										<div>
											<div
												class="my-2 subtitle-1 primary--text font-weight-bold"
											>
												categoria
											</div>
											<div class="subtitle-1 black--text font-weight-bold">
												{{ article.title }}
											</div>
										</div>
										<div>
											<div class="subtitle-1 font-weight-bold">
												<span
													v-if="article.originalAuthor"
													class="primary--text"
												>
													por {{ article.originalAuthor }}
												</span>
												<span v-if="article.originalAuthor">|</span>
												<span class="text--disabled">
													{{ dates(article.createdAt) }}
												</span>
											</div>
										</div>
									</v-card-text>
								</template>
							</v-card>
						</v-hover>
					</template>
				</v-col>
			</v-row>
			<v-row justify="center">
				<v-col cols="3">
					<v-hover v-slot="{ hover }">
						<v-btn
							v-if="length <= articles.length"
							block
							color="primary"
							:outlined="!hover"
							rounded
							@click="length = length + 6"
							>Ver todos</v-btn
						>
					</v-hover>
				</v-col>
			</v-row>
		</v-container>
		<!-- for companies -->
		<v-img :src="`${$config.LANDING_URL}/container-blue.png`">
			<v-container class="my-16">
				<v-row justify="center">
					<v-col cols="12" class="py-16">
						<div
							class="white--text font-weight-bold text-h5 text-md-h4 text-lg-h3 text-center"
						>
							Para empresas
						</div>
						<div class="white--text text-h6 text-center">
							Liderazgo y salud mental en el mercado laboral
						</div>
					</v-col>
					<v-col v-for="n in 4" :key="n" cols="12" sm="6" md="3">
						<v-card flat>
							<v-img height="200" style="background-color: gray" />
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
		<!-- Categorias -->
		<v-container class="my-16">
			<v-row align="center" justify="center">
				<v-col cols="12" class="py-8">
					<div class="primary--text font-weight-bold text-h5 text-md-h4 text-center">
						Categoria Populares
					</div>
					<div class="text--disabled text-h6 text-center">
						Ver las categorías más visitadas
					</div>
				</v-col>
				<v-col v-for="(element, h) in categories" :key="h" cols="12" sm="6" md="3">
					<v-card flat>
						<v-card-text class="text-center">
							<v-list-item-avatar size="120" class="ml-4">
								<v-img :src="element.img"></v-img>
							</v-list-item-avatar>
							<div class="text-center caption font-weight-bold">
								{{ element.title }}
							</div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<div style="position: relative">
			<img
				:src="`${$config.LANDING_URL}/container-blue.png`"
				style="height: 600px; width: 100%"
			/>
			<div style="position: absolute; top: 0; width: 100%">
				<v-container>
					<v-row align="center" style="height: 600px">
						<v-col cols="12" sm="6" class="white--text d-flex align-center">
							<div>
								<div class="title font-weight-bold mt-8">
									Recibe contenido exclusivo periódicamente
								</div>
								<div class="subtitle-1 font-weight-bold mb-8">
									Suscríbete y alcanza tu mejor versión
								</div>
								<div style="position: relative">
									<v-text-field
										solo
										flat
										placeholder="Introduzca su correo electrónico aquí"
										class="white pr-4"
										hide-details
									>
									</v-text-field>
									<v-btn
										depressed
										absolute
										style="
											height: 100%;
											right: -60px;
											top: 0;
											border-radius: 0 25px 25px 0;
										"
										color="info"
										>Enviar</v-btn
									>
								</div>
							</div>
						</v-col>
						<v-col cols="12" sm="6">
							<v-img
								max-height="350"
								contain
								:src="`${$config.LANDING_URL}/recursos-11.png`"
							></v-img>
						</v-col>
					</v-row>
				</v-container>
			</div>
		</div>
		<Footer />
	</div>
</template>
<script>
import moment from 'moment';

export default {
	components: {
		Appbar: () => import('@/components/AppbarBlue'),
		Footer: () => import('@/components/Footer'),
	},
	data() {
		return {
			length: 5,
			articles: [],
			categories: [
				{ title: 'Pareja y sexo', img: `${this.$config.LANDING_URL}/recursos-12.png` },
				{
					title: 'Conocimiento de sí mismo',
					img: `${this.$config.LANDING_URL}/recursos-13.png`,
				},
				{ title: 'Salud y bienestar', img: `${this.$config.LANDING_URL}/recursos-14.png` },
				{ title: 'Familia y amigos', img: `${this.$config.LANDING_URL}/recursos-15.png` },
			],
		};
	},
	created() {
		moment.locale('es');
	},
	async mounted() {
		let response = await fetch(`${this.$config.API_URL}/blog/all`);
		response = await response.json();
		this.articles = response.articles;
		// eslint-disable-next-line no-console
		console.log(this.articles);
	},
	methods: {
		dates(date) {
			return moment(date).format('DD MMMM YY');
		},
	},
};
</script>
<style lang="scss" scoped>
.v-text-field.v-text-field--enclosed,
.v-sheet.v-card {
	border-radius: 25px !important;
}

.input-group {
	display: table;
	border-collapse: collapse;
	border-radius: 25px;
	width: 100%;
}
.input-group > div {
	display: table-cell;
	vertical-align: middle; /* needed for Safari */
}
.input-group-icon {
	border-radius: 25px;
	background: blue;
	color: #777;
	padding: 0 12px;
}
.input-group-area {
	width: 100%;
}
.input-group input {
	border: 0;
	display: block;
	width: 100%;
	padding: 8px;
}
</style>
