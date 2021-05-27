<template>
	<div>
		<client-only>
			<div class="primary pb-16">
				<Appbar />
				<v-container>
					<v-row justify="center" no-gutters>
						<v-col
							cols="12"
							class="white--text text-center font-weight-bold text-h6 text-md-h5 text-lg-h3 py-10"
						>
							Bienvenido a nuestro portal de ayuda
							<div class="text-h6 text-md-h5 text-lg-h3 font-weight-bold">
								Estamos aquí para ayudar
							</div>
						</v-col>
						<v-col cols="12">
							<v-text-field
								v-model="search"
								class="white"
								label="Busca por tema o pregunta"
								outlined
								hide-details
							/>
						</v-col>
					</v-row>
				</v-container>
			</div>
		</client-only>
		<v-container v-if="items.length" class="mt-16">
			<v-row v-if="itemsFilter.length">
				<v-col cols="12">
					<div v-for="(item, g) in itemsFilter" :key="g">
						<div class="text-center text--secondary font-weight-bold title mt-10">
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
					<v-list flat>
						<v-list-item-group v-model="selectedItem" color="primary" mandatory>
							<v-list-item v-for="(q, i) in items" :key="i" :value="q">
								<v-list-item-content>
									<v-list-item-title v-text="q.title"></v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-col>
				<v-col v-if="selectedItem" cols="12" sm="9">
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
		<div style="background-color: #0f3860; margin-top: 120px">
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
			<v-row justify="center" align="center">
				<v-col cols="12" md="6" class="text-center text-sm-left">
					<div style="color: #bdbdbd">
						<v-btn text class="text--disabled" :to="{ name: 'politicas' }"
							>Aviso de privacidad</v-btn
						>
						y
						<v-btn text class="text--disabled" :to="{ name: 'condiciones' }"
							>Términos y Condiciones</v-btn
						>
					</div>
					<div class="text--secondary">
						© 2019 Terapify Network, S.A.P.I. de C.V. Todos los derechos reservados.
					</div>
				</v-col>
				<v-col cols="12" md="6" class="text-center text-sm-right text--secondary">
					<v-icon color="primary" size="60">mdi-whatsapp</v-icon>
					<v-icon color="primary" size="60">mdi-facebook</v-icon>
					<v-icon color="primary" size="60">mdi-instagram</v-icon>
					<div>Atención a clientes: clientes@hablaqui.com</div>
					<div>Soporte técnico: soporte@hablaaqui.com</div>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	components: {
		Appbar: () => import('@/components/AppbarWhite'),
	},
	data() {
		return {
			selectedItem: null,
			items: [],
			search: '',
		};
	},
	head() {
		return {
			title: 'Preguntas frecuentes',
			meta: [
				{
					hid: 'descripción',
					nombre: 'descripción',
					contenido: 'Preguntas frecuentes hablaqui',
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
	async mounted() {
		let response = await fetch(`${this.$config.LANDING_URL}/faq.json`);
		response = await response.json();
		this.selectedItem = response[0];
		this.items = response;
	},
};
</script>

<style lang="scss" scoped></style>
