<template>
	<div style="background-color: #ebf2f3">
		<client-only>
			<div>
				<Appbar />
			</div>
		</client-only>
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
						:src="article.thumbnail"
					></v-img>
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
				<v-col cols="12" class="my-10">
					<v-list-item>
						<v-list-item-avatar size="120">
							<v-img size="120" :src="article.authorAvatar"></v-img>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title class="title">
								Transcrito y revisado clínicamente por:
								<span class="primary--text">
									{{ article.author || article.originalAuthor }}
								</span>
							</v-list-item-title>
							<div class="font-weight-light body-1">
								{{ article.authorDescription }}
							</div>
						</v-list-item-content>
					</v-list-item>
				</v-col>
				<v-col cols="12" class="text-center">
					<v-btn x-large color="primary" text exact :to="{ name: 'blog' }">
						<span class="headline font-weight-bold">Ver más</span>
					</v-btn>
				</v-col>
				<!-- blogs -->
				<template v-if="blogs.length">
					<template v-for="(item, i) in blogs">
						<v-col v-if="length > i" :key="i" cols="12" md="3" class="mt-16">
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
									height="500"
									width="100%"
									flat
								>
									<v-img
										class="grey lighten-3"
										height="250"
										:src="item.thumbnail"
									>
									</v-img>
									<v-card-text
										class="d-flex justify-space-between"
										style="flex-direction: column; height: 250px"
									>
										<div>
											<v-btn text class="px-0 my-3 text-h6" color="primary">
												{{ item.categories }}
											</v-btn>
											<h3 class="title black--text">
												{{ item.title }}
											</h3>
										</div>
										<div>
											<div class="title black--text">
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
		<v-img class="mt-10" :src="`${$config.LANDING_URL}/wave-blue-1.png`" />
		<v-container fluid class="primary">
			<v-row align="center" justify="center" class="py-16">
				<v-col cols="12" sm="8" md="10" xl="9">
					<v-row justify="space-between">
						<v-col cols="10" sm="5" class="white--text">
							<div>
								<div class="headline font-weight-bold mt-8">
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
		<v-img :src="`${$config.LANDING_URL}/wave-blue-2.png`" />
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
			length: 4,
			article: null,
			blogs: [],
			rating: 0,
			breadcrumb: [],
		};
	},
	async mounted() {
		// eslint-disable-next-line no-console
		let response = await fetch(`${this.$config.API_URL}/blog/${this.$route.params.slug}`);
		response = await response.json();
		this.article = response.article;
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
