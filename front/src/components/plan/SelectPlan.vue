<template>
	<div>
		<v-row class="my-6">
			<v-col cols="12" md="4" v-for="(el, j) in plans" :key="j">
				<v-sheet
					class="pa-y elevation-3"
					:height="el.expandCard ? '550' : '330'"
					style="border-radius: 15px"
				>
					<div :style="el.expandCard ? '50%' : 'height: 80%'">
						<div
							style="max-width: 160px"
							class="text-center body-1 mx-auto primary--text font-weight-bold"
						>
							{{ el.title }}
						</div>
						<v-img
							:src="el.image"
							:alt="el.title"
							class="mx-auto mt-3"
							width="60"
							height="60"
						/>
						<div class="text-center mt-3 mb-2">
							<span class="body-1 font-weight-bold black--text">
								${{ el.price }}
							</span>
							<span class="body-2 text--secondary font-weight-bold">
								/{{ el.mode }}
							</span>
						</div>
						<v-divider></v-divider>
						<div class="caption text--secondary font-weight-bold mt-4 px-4">
							{{ el.subtitle }}
						</div>
						<div class="caption text--secondary mt-4 px-4">
							{{ el.description }}
						</div>
					</div>
					<div
						:style="el.expandCard ? 'height: 5%' : 'height: 10%'"
						class="mt-4 body-1 text-center primary--text font-weight-bold"
						@click="() => (el.expandCard = !el.expandCard)"
					>
						Seleccionar plan
					</div>
					<v-expand-transition>
						<template v-if="el.expandCard">
							<v-list-item-group flat v-model="selectedItem" color="primary">
								<v-list-item
									v-for="deal in el.deals"
									:key="deal.id"
									link
									:value="{ ...deal, plan: j }"
								>
									<v-list-item-content>
										<v-list-item-title>
											<div class="d-flex justify-space-between">
												<div
													class="caption font-weight-bold secondary--text"
												>
													{{ deal.type }}
												</div>
												<div>
													<v-btn
														fab
														style="width:20px; height: 20px"
														depressed
														:color="
															deal.id == selectedItem.id
																? 'primary'
																: '#E1F5FE'
														"
													>
													</v-btn>
												</div>
											</div>
										</v-list-item-title>
										<v-list-item-subtitle>
											<span class=" caption font-weight-bold secondary--text">
												${{ deal.price }}
											</span>
											<span class=" caption primary--text">
												{{ deal.lapse }}
											</span>
										</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-list-item-group>
						</template>
					</v-expand-transition>
				</v-sheet>
			</v-col>
		</v-row>
		<div class="text-center">
			<v-btn
				rounded
				class="px-10
                "
				v-show="selectedItem"
				color="primary"
				@click="
					setPlan({
						title: plans[selectedItem.plan].title,
						subtitle: plans[selectedItem.plan].subtitle,
						description: plans[selectedItem.plan].description,
						price: plans[selectedItem.plan].price,
					})
				"
				>Continuar</v-btn
			>
		</div>
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
