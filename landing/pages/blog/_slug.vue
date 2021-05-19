<template>
	<div>
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
			article: null,
			rating: 5,
			breadcrumb: [],
		};
	},
	async mounted() {
		// eslint-disable-next-line no-console
		let response = await fetch(`${this.$config.API_URL}/blog/${this.$route.params.slug}`);
		response = await response.json();
		this.article = response.article;
		if (response.article.rating) this.rating = parseInt(response.article.rating);
		this.breadcrumb = [
			{
				text: 'Inicio',
				disabled: false,
				href: '/blog',
			},
			{
				text: response.article.categories[0],
				disabled: false,
				href: 'breadcrumbs_link_1',
			},
			{
				text: response.article.title,
				disabled: true,
				href: `/blog/${response.article.slug}`,
			},
		];
	},
	methods: {
		dates(date) {
			return moment(date).format('DD MMMM YY');
		},
	},
};
</script>
