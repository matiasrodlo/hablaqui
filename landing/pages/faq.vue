<template>
	<div>
		<div class="primary-color pb-16">
			<Appbar />
			<v-container>
				<v-row justify="center" no-gutters>
					<v-col cols="12" class="white--text text-center py-10">
						<span class="font-weight-bold my-5 text-h6 text-md-h6">
							Bienvenido a nuestro portal de ayuda
						</span>
						<div class="font-weight-bold text-h5 text-md-h2">
							Estamos aquí para ayudar
						</div>
					</v-col>
					<v-col cols="12">
						<v-text-field
							v-model="search"
							class="white"
							placeholder="Busca por tema o pregunta"
							outlined
							hide-details
						/>
					</v-col>
				</v-row>
			</v-container>
		</div>
		<v-container v-if="items.length" class="mt-16">
			<v-row v-if="itemsFilter.length">
				<v-col cols="12">
					<div v-for="(item, g) in itemsFilter" :key="g">
						<div class="text-left text--secondary font-weight-bold title mt-10">
							{{ item.title }}
						</div>
						<div class="caption">
							{{ item.description }}
							<div v-for="(d, p) in item.detail" :key="p">
								<div class="text--secondary font-weight-bold body-1 mt-4">
									{{ d.title }}
								</div>
								<div class="caption">
									{{ d.description }}
								</div>
							</div>
						</div>
					</div>
				</v-col>
			</v-row>
			<v-row v-else>
				<v-col cols="12" sm="3">
					<v-list flat dense>
						<v-list-item-group v-model="selectedItem" mandatory>
							<v-list-item v-for="(q, i) in items" :key="i" :value="q">
								<v-list-item-content>
									<v-list-item-title
										class="body-2"
										:class="
											selectedItem.id == q.id
												? 'primary--text'
												: 'text--secondary'
										"
										v-text="q.title"
									></v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-col>
				<v-col v-if="selectedItem" cols="12" sm="9" class="pt-6">
					<div class="primary--text headline font-weight-bold">
						{{ selectedItem.title }}
					</div>
					<v-expansion-panels flat>
						<v-expansion-panel v-for="(el, i) in selectedItem.faq" :key="i">
							<v-expansion-panel-header
								disable-icon-rotate
								class="body-1 font-weight-bold text--secondary"
							>
								{{ el.title }}
								<template #actions>
									<v-icon color="info"> mdi-chevron-right </v-icon>
								</template>
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								<div>
									{{ el.description }}
								</div>
								<template v-if="el.detail">
									<div v-for="(detail, a) in el.detail" :key="a">
										<div class="text--secondary font-weight-bold body-1 mt-4">
											{{ detail.title }}
										</div>
										<div class="caption">
											{{ detail.description }}
										</div>
									</div>
								</template>
							</v-expansion-panel-content>
							<v-divider style="border-width: 1px"></v-divider>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-col>
			</v-row>
		</v-container>
		<v-container v-else style="height: 200px">
			<v-row class="fill-height ma-0" align="center" justify="center">
				<v-progress-circular
					width="6"
					size="50"
					indeterminate
					color="primary"
				></v-progress-circular>
			</v-row>
		</v-container>
		<div style="background-color: #0f3860; margin-top: 120px; margin-bottom: 100px">
			<v-container class="white--text py-16">
				<v-row>
					<v-col>
						Importante: Los servicios disponibles a través de Hablaquí son
						proporcionados de forma independiente por profesionales en salud mental
						certificados. Hablaquí no proporciona ningún servicio de salud mental u
						otros de atención médica. Los profesionales en salud mental no pre-escriben
						medicamentos a través de Hablaquí. Si estás experimentando una crisis o
						emergencia, por favor comunícate a los servicios de emergencia más cercanos
						a tu localidad.
					</v-col>
				</v-row>
			</v-container>
		</div>
		<v-container>
			<v-row justify="center" align="center" class="mb-8">
				<v-col cols="12" md="6" class="text-center text-md-left">
					<div style="color: #bdbdbd">
						<nuxt-link
							text
							class="text--disabled"
							style="text-decoration: none"
							:to="{ name: 'politicas' }"
							>Aviso de privacidad
						</nuxt-link>
						y
						<nuxt-link
							text
							class="text--disabled"
							style="text-decoration: none"
							:to="{ name: 'condiciones' }"
						>
							Términos y Condiciones
						</nuxt-link>
					</div>
					<div class="text--secondary">
						© 2021 Hablaquí · Todos los derechos reservados
					</div>
				</v-col>
				<v-col cols="12" md="6" class="text-center text-md-right text--secondary">
					<img
						style="height: 40px"
						:src="`${$config.LANDING_URL}/redes_sociales.png`"
						alt="redes sociales"
					/>
					<div>Atención a clientes: c@hablaqui.com</div>
					<div>Horario de atención: 09:00 am - 18:30 pm</div>
				</v-col>
			</v-row>
		</v-container>
		<FloatingChat v-if="$auth.$state.loggedIn && $auth.$state.user.role == 'user'" />
	</div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	components: {
		Appbar: () => import('@/components/AppbarWhite'),
		FloatingChat: () => import('@/components/dashboard/FloatingChat'),
	},
	data() {
		return {
			selectedItem: null,
			items: [],
			search: '',
			loading: false,
		};
	},
	head() {
		return {
			title: 'Preguntas frecuentes | Hablaquí',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: 'Preguntas frecuentes Hablaquí',
				},
			],
		};
	},
	computed: {
		itemsFilter() {
			if (this.search.length) {
				let result = [];
				this.items.map(el => {
					const filtering = el.faq.filter(f => {
						return (
							f.title.toLowerCase().includes(this.search.toLowerCase()) ||
							f.description.toLowerCase().includes(this.search.toLowerCase())
						);
					});
					if (filtering.length) result = [...result, ...filtering];
					return result;
				});
				return result;
			}
			return [];
		},
	},
	created() {
		this.setFloatingChat(false);
	},
	async mounted() {
		this.loading = true;
		let response = await fetch(`${this.$config.LANDING_URL}/faq.json`);
		response = await response.json();
		this.selectedItem = response[0];
		this.items = response;
		this.loading = false;
	},
	methods: {
		...mapMutations({
			setFloatingChat: 'Chat/setFloatingChat',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
