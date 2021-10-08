<template>
	<div style="background-color: #f0f8ff">
		<client-only>
			<div>
				<Appbar />
			</div>
			<v-container v-show="loading">
				<v-row>
					<v-col cols="12">
						<v-skeleton-loader
							class="mx-auto"
							type="card-heading, image, paragraph, paragraph, paragraph ,paragraph"
						></v-skeleton-loader>
					</v-col>
				</v-row>
			</v-container>
			<v-container v-if="article && !loading">
				<v-row>
					<v-col cols="12">
						<h1 class="text-h5 text-sm-h4 font-weight-bold">
							{{ article.title }}
						</h1>
						<div class="text-sm-h6">
							<span class="secondary--text">{{ dates(article.createdAt) }}</span>
							<span class="secondary--text">|</span>
							<span>
								<span class="secondary--text mr-2"> {{ rating }} </span>
								<v-rating
									v-model="rating"
									class="d-inline-block"
									:background-color="
										isYellow ? 'orange lighten-1' : 'grey lighten-2'
									"
									:color="isYellow ? 'orange lighten-1' : 'grey lighten-2'"
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
									<icon :icon="mdiChevronRight" />
								</template>
								<template #item="{ item }">
									<v-breadcrumbs-item
										exact
										exact-path
										nuxt
										link
										:to="item.to"
										replace
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
						<v-avatar
							class="my-3 d-block"
							:size="$vuetify.breakpoint.mdAndUp ? '70' : '40'"
						>
							<v-img :src="`${$config.LANDING_URL}/instagram.png`"></v-img>
						</v-avatar>
						<v-avatar
							class="my-3 d-block"
							:size="$vuetify.breakpoint.mdAndUp ? '70' : '40'"
						>
							<v-img :src="`${$config.LANDING_URL}/facebook.png`"></v-img>
						</v-avatar>
						<v-avatar
							class="my-3 d-block"
							:size="$vuetify.breakpoint.mdAndUp ? '70' : '40'"
						>
							<v-img :src="`${$config.LANDING_URL}/tiktop.png`"></v-img>
						</v-avatar>
					</v-col>
					<v-col cols="12" sm="11">
						<div class="font-weight-light" v-html="article.HTMLbody"></div>
					</v-col>
					<v-col cols="12" offset-sm="1" sm="11">
						<div
							v-if="article.notOriginal"
							cols="12"
							sm="11"
							class="text--secondary body-1"
						>
							Escrito por
							<span class="primary--text">{{ article.originalAuthor }}</span>
							<span v-if="article.originalLink">
								para
								<a :href="article.originalLink">
									{{ extractHostname(article.originalLink) }}
								</a>
							</span>
						</div>
					</v-col>
				</v-row>
				<v-row class="my-10" align="center">
					<v-col cols="12">
						<span class="d-flex align-center">
							<span class="title secondary--text">¿Este artículo fue útil?</span>
							<span class="title secondary--text ml-4"> {{ rating }} </span>
							<v-rating
								v-model="rating"
								class="ml-4"
								:background-color="isYellow ? 'orange lighten-1' : 'grey lighten-1'"
								:color="isYellow ? 'orange lighten-1' : 'grey lighten-1'"
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
									:src="article.authorAvatar"
									:lazy-src="article.authorAvatar"
									:alt="article.author"
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
							<v-col v-if="length > i" :key="i" cols="12" sm="6" lg="4">
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
												<v-btn
													text
													class="px-0 my-3 body-1"
													color="primary"
												>
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

			<img
				class="mt-16"
				:src="`${$config.LANDING_URL}/Blog-05-top.png`"
				style="width: 100%"
			/>
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
										<span class="px-5 px-md-10 text-h5">Enviar</span>
									</v-btn>
								</v-btn-toggle>
							</v-col>
							<v-col cols="12" md="5" class="text-center">
								<v-img
									contain
									class="mx-auto"
									alt="Recibe contenido exclusivo periódicamente"
									:src="`${$config.LANDING_URL}/suscribete.webp`"
									:lazy-src="`${$config.LANDING_URL}/suscribete.webp`"
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
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-container>
			<img :src="`${$config.LANDING_URL}/Blog-05-bottom.png`" style="width: 100%" />

			<v-container>
				<Footer />
			</v-container>
		</client-only>
	</div>
</template>

<script>
import moment from 'moment';
import { mapMutations } from 'vuex';
import { mdiChevronRight } from '@mdi/js';

export default {
	components: {
		Appbar: () => import('@/components/AppbarBlue'),
		Footer: () => import('@/components/Footer'),
		Icon: () => import('~/components/Icon'),
	},
	async asyncData({ $axios, params, redirect }) {
		try {
			const { article } = await $axios.$get(`/blog/${params.slug}`);
			return {
				article,
			};
		} catch (e) {
			redirect('/psicologos');
		}
	},
	data() {
		return {
			mdiChevronRight,
			length: 3,
			rating: 0,
			breadcrumb: [],
			title: '',
			isYellow: false,
			loading: true,
			blogs: [],
		};
	},
	head() {
		return {
			title: `${this.title ? this.title : ''} | Hablaquí`,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: this.article ? this.strippedContent(this.article.HTMLbody) : '',
				},
				{
					hid: 'twitter:url',
					name: 'twitter:url',
					content: `${process.env.VUE_APP_LANDING}/blog/${this.$route.params.slug}`,
				},
				{
					hid: 'twitter:title',
					name: 'twitter:title',
					content: `${this.title} | Hablaquí`,
				},
				{
					hid: 'twitter:description',
					name: 'twitter:description',
					content: this.strippedContent(this.article.HTMLbody),
				},
				{
					hid: 'twitter:image',
					name: 'twitter:image',
					content: this.article.thumbnail,
				},
				{
					hid: 'og:url',
					property: 'og:url',
					content: `${process.env.VUE_APP_LANDING}/blog/${this.$route.params.slug}`,
				},
				{
					hid: 'og:title',
					property: 'og:title',
					content: `${this.title} | Hablaquí`,
				},
				{
					hid: 'og:description',
					property: 'og:description',
					content: this.strippedContent(this.article.HTMLbody),
				},
				{
					hid: 'og:image',
					property: 'og:image',
					content: this.article.thumbnail,
				},
				{
					hid: 'og:image:secure_url',
					property: 'og:image:secure_url',
					content: this.article.thumbnail,
				},
				{
					hid: 'og:image:alt',
					property: 'og:image:alt',
					content: this.title,
				},
			],
			link: [
				{
					rel: 'canonical',
					href: `${this.$config.LANDING_URL}/blog/${this.$route.params.slug}/`,
				},
			],
		};
	},
	jsonld() {
		return {
			'@context': 'http://schema.org',
			'@type': 'Article',
			author: this.article.author,
			datePublished: this.dates(this.article.createdAt),
			headline: this.article.title,
			image: {
				'@type': 'imageObject',
				url: this.article.thumbnail,
				height: '600',
				width: '800',
			},
			publisher: {
				'@type': 'Organization',
				name: this.article.originalAuthor,
				logo: {
					'@type': 'imageObject',
					url: this.article.authorAvatar,
				},
			},
		};
	},
	created() {
		this.setFloatingChat(false);
	},
	async mounted() {
		if (this.article) {
			this.title = this.article.title;
			if (this.article.rating.average)
				this.rating = parseFloat(this.article.rating.average.toFixed(1));
			this.breadcrumb = [
				{
					text: 'Inicio',
					disabled: false,
					to: '/blog',
				},
				{
					text: this.article.categories,
					disabled: true,
					to: '/blog/category',
				},
				{
					text: this.article.title,
					disabled: true,
					to: `/blog/${this.article.slug}`,
				},
			];
		}
		this.loading = false;
		const { articles } = await this.$axios.$get('/blog/all');
		this.blogs = articles;
	},
	methods: {
		extractHostname(url) {
			let hostname;

			// find & remove protocol (http, ftp, etc.) and get hostname
			if (url.includes('://')) {
				hostname = url.split('/')[2];
			} else {
				hostname = url.split('/')[0];
			}

			// find & remove port number
			hostname = hostname.split(':')[0];

			// find & remove "?"
			hostname = hostname.split('?')[0];

			return hostname;
		},
		async setRating() {
			const { data } = await this.$axios(
				`/blog/${this.$route.params.slug}/update-rating/${this.rating}`,
				{
					method: 'post',
				}
			);
			this.isYellow = true;
			this.rating = parseFloat(data.rating.average.toFixed(1));
		},
		dates(date) {
			return moment(date).format('DD MMMM YY');
		},
		strippedContent(text, long) {
			const regex = /(<([^>]+)>)/gi;
			return text.replace(regex, '').slice(0, long).concat('...');
		},
		...mapMutations({
			setFloatingChat: 'Chat/setFloatingChat',
		}),
	},
};
</script>
