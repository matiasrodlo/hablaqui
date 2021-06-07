<template>
	<div style="background-color: #ebf2f3">
		<div>
			<Appbar />
		</div>
		<v-container v-if="article">
			<v-row>
				<v-col cols="12">
					<div class="text-h5 text-sm-h4 text-md-h3 font-weight-bold">
						{{ article.title }}
					</div>
					<div class="text-sm-h6">
						<span class="text--secondary">{{ dates(article.createdAt) }}</span>
						<span class="text-disabled">|</span>
						<span>
							<span class="text--secondary mr-2"> {{ rating }} </span>
							<v-rating
								v-model="rating"
								class="d-inline-block"
								background-color="grey lighten-1"
								color="grey lighten-1"
								dense
								half-increments
								hover
								:size="$vuetify.breakpoint.mdAndUp ? '30' : '20'"
								@input="setRating"
							></v-rating>
						</span>
					</div>
					<div>
						<v-breadcrumbs class="px-0 font-weight-light" :items="breadcrumb" large>
							<template #divider>
								<v-icon>mdi-chevron-right</v-icon>
							</template>
							<template #item="{ item }">
								<v-breadcrumbs-item
									nuxt
									:href="item.href"
									:disabled="item.disabled"
								>
									{{ item.text }}
								</v-breadcrumbs-item>
							</template>
						</v-breadcrumbs>
					</div>
				</v-col>
				<v-col cols="12">
					<v-img
						style="border-radius: 5px"
						max-height="600"
						:alt="article.title"
						:src="article.thumbnail"
						:lazy-src="article.thumbnail"
					>
						<template #placeholder>
							<v-row class="fill-height ma-0" align="center" justify="center">
								<v-progress-circular
									indeterminate
									color="grey lighten-5"
								></v-progress-circular>
							</v-row>
						</template>
					</v-img>
				</v-col>
				<v-col class="text-center" cols="12" sm="1">
					<v-icon :size="$vuetify.breakpoint.mdAndUp ? '90' : '40'" color="primary"
						>mdi-facebook</v-icon
					>
					<v-icon :size="$vuetify.breakpoint.mdAndUp ? '90' : '40'" color="primary"
						>mdi-instagram</v-icon
					>
					<v-icon :size="$vuetify.breakpoint.mdAndUp ? '90' : '40'" color="primary"
						>mdi-whatsapp</v-icon
					>
				</v-col>
				<v-col cols="12" sm="11" class="body-2">
					<div class="font-weight-light text-h6" v-html="article.HTMLbody"></div>
				</v-col>
			</v-row>
			<v-row class="my-10">
				<v-col cols="12">
					<span>
						<span class="title black--text">¿Este artículo fue útil?</span>
						<span class="title text--secondary mr-2"> {{ rating }} </span>
						<v-rating
							v-model="rating"
							class="d-inline-block"
							background-color="grey lighten-1"
							color="grey lighten-1"
							dense
							half-increments
							hover
							:size="$vuetify.breakpoint.mdAndUp ? '30' : '20'"
							@input="setRating"
						></v-rating>
					</span>
				</v-col>
			</v-row>
			<v-divider></v-divider>
			<v-row>
				<v-col cols="12" class="mt-5 mt-md-10 mb-10">
					<v-list-item>
						<v-list-item-avatar :size="$vuetify.breakpoint.mdAndUp ? '120' : '50'">
							<v-img
								:size="$vuetify.breakpoint.mdAndUp ? '120' : '50'"
								:src="article.article"
								:lazy-src="article.article"
								:alt="article.author"
							>
								<template #placeholder>
									<v-row class="fill-height ma-0" align="center" justify="center">
										<v-progress-circular
											indeterminate
											color="grey lighten-5"
										></v-progress-circular>
									</v-row>
								</template>
							</v-img>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title class="caption text-sm-h6 text--secondary">
								Transcrito y revisado clínicamente por:
								<span class="primary--text">
									{{ article.author || article.originalAuthor }}
								</span>
							</v-list-item-title>
							<div
								v-if="$vuetify.breakpoint.mdAndUp"
								class="font-weight-light body-1"
							>
								{{ article.authorDescription }}
							</div>
						</v-list-item-content>
					</v-list-item>
					<div v-if="!$vuetify.breakpoint.mdAndUp" class="font-weight-light body-1">
						{{ article.authorDescription }}
					</div>
				</v-col>
				<v-col cols="12" class="text-center">
					<v-btn x-large color="primary" text exact :to="{ name: 'blog' }">
						<span class="headline font-weight-bold">Ver más</span>
					</v-btn>
				</v-col>
				<!-- blogs -->
				<template v-if="blogs.length">
					<template v-for="(item, i) in blogs">
						<v-col v-if="length > i" :key="i" cols="12" sm="6" lg="4" class="mt-16">
							<v-hover v-slot="{ hover }">
								<v-card
									nuxt
									:to="{ path: `/blog/${item.slug}` }"
									style="transition: transform 0.4s"
									:style="
										hover
											? 'transform: scale(1.02);'
											: 'text-transform: none !important;'
									"
									:class="hover ? 'elevation-4' : 'elevation-0'"
									height="450"
									width="100%"
									flat
								>
									<v-img
										class="grey lighten-3"
										height="250"
										:src="item.thumbnail"
										:lazy-src="item.thumbnail"
										:alt="item.title"
									>
										<template #placeholder>
											<v-row
												class="fill-height ma-0"
												align="center"
												justify="center"
											>
												<v-progress-circular
													indeterminate
													color="grey lighten-5"
												></v-progress-circular>
											</v-row>
										</template>
									</v-img>
									<v-card-text
										class="d-flex justify-space-between"
										style="flex-direction: column; height: 200px"
									>
										<div>
											<v-btn text class="px-0 my-3 body-1" color="primary">
												{{ item.categories }}
											</v-btn>
											<h3 class="body-1 font-weight-bold black--text">
												{{ item.title }}
											</h3>
										</div>
										<div>
											<div class="body-1 black--text">
												<span
													v-if="item.originalAuthor"
													class="primary--text"
												>
													por {{ item.originalAuthor }}
												</span>
												<span v-if="item.originalAuthor">|</span>
												<span class="text--disabled">
													{{ dates(item.createdAt) }}
												</span>
											</div>
										</div>
									</v-card-text>
								</v-card>
							</v-hover>
						</v-col>
					</template>
				</template>
			</v-row>
		</v-container>
		<img class="mt-10" :src="`${$config.LANDING_URL}/wave-blue-1.png`" style="width: 100%" />
		<v-container fluid class="primary py-0">
			<v-row align="center" justify="center">
				<v-col cols="12" sm="8" md="10" xl="9">
					<v-row justify="center" align="center">
						<v-col cols="10" md="7" class="white--text">
							<h3 class="headline font-weight-bold">
								Recibe contenido exclusivo periódicamente
							</h3>
							<h3 class="body-1 font-weight-bold mb-8 mt-2">
								Suscríbete y alcanza tu mejor versión
							</h3>

							<v-btn-toggle rounded class="mb-10 mb-md-0">
								<v-text-field
									solo
									flat
									style="width: 400px"
									placeholder="Introduzca su correo electrónico aquí"
									class="white"
									hide-details
									dense
								/>
								<v-btn depressed color="info">
									<span class="px-5 px-md-10">Enviar</span>
								</v-btn>
							</v-btn-toggle>
						</v-col>
						<v-col cols="12" md="5" class="text-center">
							<v-img
								contain
								alt="Recibe contenido exclusivo periódicamente"
								class="mx-auto"
								:src="`${$config.LANDING_URL}/suscribete.png`"
								:lazy-src="`${$config.LANDING_URL}/suscribete.png`"
							>
								<template #placeholder>
									<v-row class="fill-height ma-0" align="center" justify="center">
										<v-progress-circular
											indeterminate
											color="grey lighten-5"
										></v-progress-circular>
									</v-row>
								</template>
							</v-img>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
		<img :src="`${$config.LANDING_URL}/wave-blue-2.png`" style="width: 100%" />
		<v-container>
			<Footer />
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
			length: 3,
			article: null,
			blogs: [],
			rating: 0,
			breadcrumb: [],
			title: '',
		};
	},
	head() {
		return {
			title: `${this.title} | Hablaquí`,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: 'Los articulos más actualizados de nuestros psicologos',
				},
			],
		};
	},
	async mounted() {
		// eslint-disable-next-line no-console
		let response = await fetch(`${this.$config.API_URL}/blog/${this.$route.params.slug}`);
		response = await response.json();
		this.article = response.article;
		this.title = this.article.title;
		if (response.article.rating.average)
			this.rating = parseFloat(response.article.rating.average.toFixed(1));
		this.breadcrumb = [
			{
				text: 'Inicio',
				disabled: false,
				href: '/blog',
			},
			{
				text: response.article.categories,
				disabled: true,
				href: 'breadcrumbs_link_1',
			},
			{
				text: response.article.title,
				disabled: true,
				href: `/blog/${response.article.slug}`,
			},
		];
		let res = await fetch(`${this.$config.API_URL}/blog/all`);
		res = await res.json();
		this.blogs = res.articles;
	},
	methods: {
		async setRating() {
			let response = await fetch(
				`${this.$config.API_URL}/blog/${this.$route.params.slug}/update-rating/${this.rating}`,
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'post',
				}
			);
			response = await response.json();
			this.rating = parseFloat(response.rating.average.toFixed(1));
		},
		dates(date) {
			return moment(date).format('DD MMMM YY');
		},
		strippedContent(text, long) {
			const regex = /(<([^>]+)>)/gi;
			return text.replace(regex, '').slice(0, long).concat('...');
		},
	},
};
</script>
