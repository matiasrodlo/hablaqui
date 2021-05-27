<template>
	<div style="background-color: #ebf2f3">
		<client-only>
			<nav>
				<Appbar />
			</nav>
		</client-only>
		<v-container tag="section" fluid>
			<!-- title / search -->
			<v-row justify="center">
				<v-col
					tag="h1"
					cols="12"
					sm="10"
					xl="8"
					class="primary--text font-weight-bold text-h5 text-md-h3 text-center mt-md-16 mb-6"
				>
					Blog Hablaquí
				</v-col>
				<v-col cols="12" sm="8" md="10" xl="9">
					<v-expansion-panels
						flat
						style="border-radius: 25px"
						active-class="roundedExpand"
					>
						<v-expansion-panel>
							<v-expansion-panel-header>
								<div
									v-if="!combobox.length"
									class="title primary--text text-h6 my-1"
								>
									Seleccione un asunto
								</div>
								<div>
									<span
										v-for="item in combobox"
										:key="item"
										class="primary--text title mx-2"
									>
										{{ item }}
									</span>
								</div>
								<div
									v-if="$vuetify.breakpoint.mdAndUp"
									class="text-right primary--text title"
								>
									Editar filtros
								</div>
							</v-expansion-panel-header>
							<v-expansion-panel-content style="border-radius: 25px">
								<v-divider></v-divider>
								<v-row justify="center" style="min-height: 200px; margin-top: 16px">
									<v-col cols="12">
										<v-btn
											v-for="item in items"
											:key="item"
											rounded
											:outlined="!combobox.includes(item)"
											color="primary"
											class="ma-2 d-inline-block"
											x-large
											@click="addItemToCombobox(item)"
										>
											{{ item }}
											<v-icon right>
												{{
													combobox.includes(item)
														? 'mdi-close'
														: 'mdi-plus'
												}}
											</v-icon>
										</v-btn>
									</v-col>
									<v-col cols="12" class="text-center">
										<div
											class="text-center align-self-end justify-content-center"
										>
											<v-btn
												color="primary"
												text
												large
												@click="combobox = []"
											>
												Limpiar filtros
											</v-btn>
										</div>
									</v-col>
								</v-row>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-col>
			</v-row>
			<!-- blogs -->
			<v-row v-if="articles.length" id="blog" tag="section" justify="center" class="mb-16">
				<v-col tag="section" cols="12" sm="8" md="10" xl="9">
					<v-row tag="section">
						<template v-for="(article, i) in filterItems">
							<v-col
								v-if="length > i"
								:key="i"
								tag="section"
								cols="12"
								:md="i == 0 ? '12' : '6'"
								:lg="i == 0 ? '8' : '4'"
							>
								<v-hover v-slot="{ hover }">
									<v-card
										tag="section
                                    "
										nuxt
										:to="{ path: `/blog/${article.slug}` }"
										style="transition: transform 0.4s"
										:style="
											hover
												? 'transform: scale(1.02);'
												: 'text-transform: none !important;'
										"
										:class="hover ? 'elevation-4' : 'elevation-0'"
										:height="$vuetify.breakpoint.mdAndUp ? '500' : '600'"
										width="100%"
										flat
									>
										<template v-if="i == 0 && !$vuetify.breakpoint.smAndDown">
											<v-card-text>
												<v-row>
													<v-col
														cols="6"
														tag="section"
														style="
															height: 490px;
															display: flex;
															flex-direction: column !important;
														"
														class="justify-space-between"
													>
														<article>
															<h3 class="title black--text">
																{{ article.title }}
															</h3>
															<v-btn
																text
																class="px-0 my-3 text-h6"
																color="primary"
															>
																{{ article.categories }}
															</v-btn>
															<h4 class="text-h6 font-weight-light">
																{{
																	strippedContent(
																		article.HTMLbody,
																		200
																	)
																}}
															</h4>
														</article>
														<aside>
															<h3 class="title font-weight-bold">
																<span
																	v-if="
																		article.author ||
																		article.originalAuthor
																	"
																	class="primary--text"
																>
																	por
																	{{
																		article.author ||
																		article.originalAuthor
																	}}
																</span>
																<span
																	v-if="
																		article.author ||
																		article.originalAuthor
																	"
																	>|</span
																>
																<span class="text--disabled">
																	{{ dates(article.createdAt) }}
																</span>
															</h3>
														</aside>
													</v-col>
													<v-col tag="section" cols="6">
														<v-img
															style="border-radius: 10px"
															height="465"
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
												height="250"
												:src="article.thumbnail"
											>
											</v-img>
											<v-card-text
												class="d-flex justify-space-between"
												style="flex-direction: column"
												:style="
													$vuetify.breakpoint.mdAndUp
														? 'height: 250px'
														: 'height: 350px'
												"
											>
												<article>
													<v-btn
														text
														class="px-0 my-3 text-h6"
														color="primary"
													>
														{{ article.categories }}
													</v-btn>
													<h3 class="title black--text">
														{{ article.title }}
													</h3>
													<h4
														v-if="!$vuetify.breakpoint.mdAndUp"
														class="text-h6 font-weight-light"
													>
														{{ strippedContent(article.HTMLbody, 140) }}
													</h4>
												</article>
												<aside>
													<div class="title black--text">
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
												</aside>
											</v-card-text>
										</template>
									</v-card>
								</v-hover>
							</v-col>
						</template>
					</v-row>
				</v-col>
			</v-row>
			<template v-else>
				<v-row justify="center">
					<v-col cols="12" sm="6">
						<v-skeleton-loader
							light
							class="mx-auto"
							type="image, image"
						></v-skeleton-loader>
					</v-col>
					<v-col cols="12" sm="4">
						<v-skeleton-loader
							light
							class="mx-auto"
							type="image, image"
						></v-skeleton-loader>
					</v-col>
				</v-row>
				<v-row justify="center">
					<v-col cols="12" sm="3">
						<v-skeleton-loader
							light
							class="mx-auto"
							type="image, image"
						></v-skeleton-loader>
					</v-col>
					<v-col cols="12" sm="4">
						<v-skeleton-loader
							light
							class="mx-auto"
							type="image, image"
						></v-skeleton-loader>
					</v-col>
					<v-col cols="12" sm="3">
						<v-skeleton-loader
							light
							class="mx-auto"
							type="image, image"
						></v-skeleton-loader>
					</v-col>
				</v-row>
			</template>
			<v-row justify="center">
				<v-col cols="12" class="text-center">
					<v-hover v-slot="{ hover }">
						<v-btn
							v-if="length <= articles.length"
							class="px-10"
							x-large
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
		<img :src="`${$config.LANDING_URL}/wave-blue-1.png`" style="width: 100%" />
		<v-container fluid class="primary py-0">
			<v-row justify="center">
				<v-col tag="section" cols="12" class="py-16">
					<h2
						class="white--text font-weight-bold text-h5 text-md-h4 text-lg-h3 text-center"
					>
						Para empresas
					</h2>
					<h3 class="white--text text-h6 text-center">
						Liderazgo y salud mental en el mercado laboral
					</h3>
				</v-col>
				<v-col tag="section" cols="12" sm="8" md="10" xl="9">
					<v-row v-if="forCompanies.length" tag="section">
						<template v-for="(item, n) in forCompanies">
							<v-col :key="n" tag="section" cols="12" md="3">
								<v-hover v-slot="{ hover }">
									<v-card
										v-if="n < 4"
										style="transition: transform 0.5s"
										:style="
											hover
												? 'transform: translateY(1em)'
												: 'transform: translateY(0)'
										"
										flat
										height="500"
									>
										<v-img
											class="grey lighten-3"
											height="200"
											:src="item.thumbnail"
										>
										</v-img>
										<v-card-text
											style="height: 300px; flex-direction: column"
											class="d-flex justify-space-between"
										>
											<article>
												<h3
													class="subtitle-1 primary--text font-weight-bold"
												>
													{{ item.categories }}
												</h3>
												<h2 class="subtitle-1 font-weight-bold pb-0">
													{{ item.title }}
												</h2>
												<h4 class="subttitle-1 font-weight-light">
													{{ strippedContent(item.HTMLbody, 150) }}
												</h4>
											</article>
											<aside>
												<span
													class="caption primary--text font-weight-bold"
												>
													{{ item.originalAuthor }}
												</span>
												<span v-if="item.originalAuthor">|</span>
												<span class="caption text--disabled">
													{{ dates(item.createdAt) }}
												</span>
											</aside>
										</v-card-text>
									</v-card>
								</v-hover>
							</v-col>
						</template>
						<v-col cols="12" class="text-center">
							<v-hover v-slot="{ hover }">
								<v-btn
									v-if="length <= articles.length"
									x-large
									class="px-10"
									color="white"
									:outlined="!hover"
									rounded
									@click="length = length + 6"
									>Ver todos</v-btn
								>
							</v-hover>
						</v-col>
					</v-row>
					<v-row v-else>
						<v-col v-for="n in 4" :key="n" cols="3">
							<v-skeleton-loader
								light
								class="mx-auto"
								type="image, image"
							></v-skeleton-loader>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
		<img :src="`${$config.LANDING_URL}/wave-blue-2.png`" style="width: 100%" />
		<!-- Categorias -->
		<v-container fluid class="mb-16">
			<v-row align="center" justify="center">
				<v-col tag="section" cols="12" class="pb-8">
					<h2 class="primary--text font-weight-bold text-h5 text-md-h4 text-center">
						Categoria Populares
					</h2>
					<h3 class="text--disabled text-h6 text-center">
						Ver las categorías más visitadas
					</h3>
				</v-col>
				<v-col tag="section" cols="12" sm="8" md="10" xl="9">
					<v-row>
						<v-col v-for="(element, h) in categories" :key="h" cols="12" sm="6" md="3">
							<v-hover v-slot="{ hover }">
								<v-card
									style="transition: transform 0.5s"
									:style="
										hover
											? 'transform: scale(1.02);'
											: 'text-transform: none !important;'
									"
									:class="hover ? 'elevation-4' : 'elevation-0'"
									flat
								>
									<v-card-text class="text-center">
										<v-list-item-avatar size="120" class="ml-4">
											<v-img :src="element.img"></v-img>
										</v-list-item-avatar>
										<h2 class="text-center caption font-weight-bold">
											{{ element.title }}
										</h2>
									</v-card-text>
								</v-card>
							</v-hover>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
		<img class="mt-10" :src="`${$config.LANDING_URL}/wave-blue-1.png`" style="width: 100%" />
		<v-container fluid class="primary py-0">
			<v-row align="center" justify="center" class="py-16">
				<v-col cols="12" sm="8" md="10" xl="9">
					<v-row justify="space-between">
						<v-col cols="10" sm="5" class="white--text">
							<div>
								<h3 class="headline font-weight-bold mt-8">
									Recibe contenido exclusivo periódicamente
								</h3>
								<h3 class="subtitle-1 font-weight-bold mb-8">
									Suscríbete y alcanza tu mejor versión
								</h3>
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
									>
										Enviar
									</v-btn>
								</div>
							</div>
						</v-col>
						<v-col cols="12" sm="5" class="text-center">
							<v-img
								max-height="350"
								contain
								:src="`${$config.LANDING_URL}/recursos-11.png`"
							></v-img>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
		<img :src="`${$config.LANDING_URL}/wave-blue-2.png`" style="width: 100%" />
		<v-container fluid>
			<v-row justify="center">
				<v-col cols="12" sm="8" md="10" xl="9">
					<Footer />
				</v-col>
			</v-row>
		</v-container>
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
			items: [
				'Autoconocimiento',
				'Para empresas',
				'Familia y amigos',
				'Salud y bienestar',
				'Conocimiento de sí mismo',
				'Pareja y sexo',
			],
			combobox: [],
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
	head() {
		return {
			title: 'Blog - hablaqui',
			meta: [
				{
					hid: 'descripción',
					nombre: 'descripción',
					contenido: 'Los articulos más actualizados de nuestros psicologos',
				},
			],
		};
	},
	computed: {
		forCompanies() {
			// TODO: cambiar cuando tengamos mas de 4 articulos de empresas category
			// return this.articles.filter(item => item.categories === 'Para empresas');
			return this.articles;
		},
		filterItems() {
			if (!this.articles.length) return [];
			if (!this.combobox.length) return this.articles;
			const result = this.articles.filter(item => this.combobox.includes(item.categories));
			return !result.length ? this.articles : result;
		},
	},
	created() {
		moment.locale('es');
	},
	async mounted() {
		let response = await fetch(`${this.$config.API_URL}/blog/all`);
		response = await response.json();
		this.articles = response.articles;
	},
	methods: {
		strippedContent(text, long) {
			const regex = /(<([^>]+)>)/gi;
			return text.replace(regex, '').slice(0, long).concat('...');
		},
		dates(date) {
			return moment(date).format('DD MMMM YY');
		},
		addItemToCombobox(item) {
			if (this.combobox.includes(item)) {
				const i = this.combobox.findIndex(el => el === item);
				this.combobox.splice(i, 1);
			} else {
				this.combobox.push(item);
			}
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

.roundedExpand {
	border-radius: 25px !important;
}
</style>
