<template>
	<div>
		<v-card v-for="(el, j) in plans" :key="j" class="my-6">
			<div v-if="el.recommended" class="d-flex align-center justify-end">
				<span
					class="pa-2 primary white--text font-weight-bold"
					style="border-radius: 0 0 0 15px"
				>
					Recomendado
				</span>
			</div>
			<v-card-text>
				<v-row justify="space-between" align="center">
					<v-col cols="7" sm="8" md="9">
						<span class="text-h6 text-sm-h5 text-md-h4 font-weight-bold black--text">
							${{ el.price }}
						</span>
						<span class="text-h6 text--secondary"> /{{ el.mode }} </span>
						<div class="text-sm-h6 primary--text font-weight-bold">
							{{ el.title }}
						</div>
						<div class="my-2 font-weight-bold">
							{{ el.subtitle }}
						</div>
						<div class="mt-2">
							{{ el.description }}
						</div>
					</v-col>
					<v-col cols="5" sm="4" md="3" class="text-center mt-6 pl-0">
						<v-avatar color="grey" size="70">
							<v-img :src="el.image" :alt="el.title" width="100" height="100" />
						</v-avatar>
						<div class="mt-3">
							<v-btn
								class="pa-0"
								color="primary"
								text
								@click="() => (el.expandCard = !el.expandCard)"
							>
								Seleccionar plan
							</v-btn>
						</div>
					</v-col>
					<v-expand-transition>
						<v-col v-if="el.expandCard" cols="12" class="pa-0">
							<v-list-item-group flat v-model="selectedItem" color="primary">
								<v-list-item
									v-for="deal in el.deals"
									:key="deal.id"
									link
									:value="{ ...deal, plan: j }"
								>
									<v-list-item-content>
										<v-list-item-title class="font-weight-bold text--secondary">
											{{ deal.type }}
										</v-list-item-title>
										<v-list-item-subtitle>
											<span class="font-weight-bold text--secondary">
												${{ deal.price }}
											</span>
											<span class="primary--text">
												{{ deal.lapse }}
											</span>
										</v-list-item-subtitle>
									</v-list-item-content>
									<v-list-item-action>
										<v-btn
											fab
											class="mx-16"
											style="width:20px; height: 20px"
											depressed
											:color="
												deal.id == selectedItem.id ? 'primary' : '#E1F5FE'
											"
										>
										</v-btn>
									</v-list-item-action>
								</v-list-item>
							</v-list-item-group>
							<div
								v-if="el.deals.some(u => selectedItem.id === u.id)"
								class="text-center mb-2"
							>
								<v-btn
									small
									color="primary"
									@click="
										setPlan({
											title: plans[selectedItem.plan].title,
											subtitle: plans[selectedItem.plan].subtitle,
											description: plans[selectedItem.plan].description,
											price: plans[selectedItem.plan].price,
										})
									"
								>
									Continuar
								</v-btn>
							</div>
						</v-col>
					</v-expand-transition>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
export default {
	props: {
		setPlan: {
			type: Function,
			require: true,
		},
	},
	data() {
		return {
			selectedItem: '',
			plans: [
				{
					id: 1,
					deals: [
						{ id: 1, lapse: '/semana', price: '17.500', type: 'Pago semanal' },
						{
							id: 2,
							lapse: '/semana ($63.000 mensual)',
							price: '15.750',
							type: 'Pago mensual',
						},
						{
							id: 3,
							lapse: '/semana ($168.000 mensual)',
							price: '14.000',
							type: 'Pago cada tres meses',
						},
					],
					expandCard: false,
					recommended: false,
					price: '17.500',
					mode: 'Semana',
					title: 'Sesiones por videollamada',
					subtitle: '4 sesiones en vivo/mensuales (50 min)',
					image: '/img/planOne.png',
					description:
						'Habla con un psicólogo por videollamada, sin tener que desplazarte.',
				},
				{
					id: 2,
					deals: [
						{ id: 4, lapse: '/Semana', price: '14.000', type: 'Pago semanal' },
						{
							id: 5,
							lapse: '/semana ($50.400 mensual)',
							price: '12.600',
							type: 'Pago mensual',
						},
						{
							id: 6,
							lapse: '/semana ($134.400 trimestral)',
							price: '11.200',
							type: 'Pago cada tres meses',
						},
					],
					recommended: false,
					expandCard: false,
					price: '14.000',
					mode: 'Semana',
					title: 'Sesiones por mensajería',
					subtitle: 'Mensajes de texto y audio.',
					image: '/img/planTwo.png',
					description: 'Respuestas diarias garantizadas 5 días a la semana.',
				},
				{
					id: 3,
					deals: [
						{ id: 7, lapse: '/semana', price: '22.000', type: 'Pago semanal' },
						{
							id: 8,
							lapse: '/semana ($79.200 mensual)',
							price: '19.800',
							type: 'Pago mensual',
						},
						{
							id: 9,
							lapse: '/semana ($211.200 trimestral)',
							price: '17.600',
							type: 'Pago cada tres meses',
						},
					],
					recommended: true,
					expandCard: false,
					price: '22.000',
					mode: 'Semana',
					title: 'Mensajes de texto y audio',
					subtitle: 'Mensajería + Sesiones por videollamada (30min)',
					image: '/img/planThree.png',
					description: 'Respuestas diarias garantizadas 5 días a la semana.',
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped></style>
