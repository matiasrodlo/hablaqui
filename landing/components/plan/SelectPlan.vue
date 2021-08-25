<template>
	<div>
		<v-row class="my-6">
			<v-col v-for="(el, j) in plans" :key="j" cols="12" md="4">
				<v-sheet
					v-if="!el.expandCard"
					class="pa-y elevation-3"
					height="330"
					style="border-radius: 15px"
				>
					<div :style="el.expandCard ? '50%' : 'height: 80%'" class="text-center">
						<div
							style="max-width: 160px"
							class="pt-2 text-center body-1 mx-auto primary--text font-weight-bold"
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
						<div class="caption text--secondary mt-2 px-4">
							{{ el.description }}
						</div>
					</div>
					<div
						:style="el.expandCard ? 'height: 5%' : 'height: 15%'"
						class="mt-5 body-1 text-center primary--text font-weight-bold pointer"
						@click="() => (el.expandCard = !el.expandCard)"
					>
						Seleccionar plan
					</div>
				</v-sheet>
				<v-sheet
					v-if="el.expandCard"
					height="330"
					class="pa-y"
					style="border-radius: 15px"
					:class="selectedItem.plan == j ? 'shadow-selected' : 'shadow'"
				>
					<div style="position: relative" class="pt-4">
						<v-btn
							icon
							absolute
							style="top: 20px; left: 10px"
							@click="el.expandCard = false"
						>
							<icon :icon="mdiChevronLeft" />
						</v-btn>
						<div
							style="max-width: 160px"
							class="text-center body-1 mx-auto primary--text font-weight-bold"
						>
							{{ el.title }}
						</div>
					</div>
					<v-list-item-group v-model="selectedItem" flat color="primary" class="pt-4">
						<v-list-item
							v-for="deal in el.deals"
							:key="deal.id"
							link
							:value="{ ...deal, plan: j }"
						>
							<v-list-item-content>
								<v-list-item-title>
									<div class="d-flex justify-space-between">
										<div class="caption font-weight-bold secondary--text">
											{{ deal.type }}
										</div>
										<div>
											<v-btn
												fab
												style="width: 20px; height: 20px"
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
									<span class="caption font-weight-bold secondary--text">
										${{ deal.price }}
									</span>
									<span class="caption primary--text">
										{{ deal.lapse }}
									</span>
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
					<div class="text-center">
						<v-btn
							v-if="selectedItem.plan == j"
							rounded
							class="px-10 mt-2"
							color="primary"
							@click="
								setPlan({
									title: plans[selectedItem.plan].title,
									subtitle: plans[selectedItem.plan].subtitle,
									description: plans[selectedItem.plan].description,
									price: plans[selectedItem.plan].price,
									deal: selectedItem,
								})
							"
						>
							Continuar
						</v-btn>
					</div>
				</v-sheet>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { mdiChevronLeft } from '@mdi/js';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		setPlan: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			mdiChevronLeft,
			selectedItem: '',
			plans: [
				{
					id: 1,
					deals: [
						{
							id: 1,
							lapse: '/semana',
							total: '17.500',
							price: '17.500',
							type: 'Pago semanal',
						},
						{
							id: 2,
							lapse: '/semana ($63.000 mensual)',
							price: '15.750',
							type: 'Pago mensual',
							total: '63.000',
						},
						{
							id: 3,
							lapse: '/semana ($168.000 mensual)',
							price: '14.000',
							total: '168.000',
							type: 'Pago cada tres meses',
						},
					],
					expandCard: false,
					recommended: false,
					price: '17.500',
					mode: 'Semana',
					title: 'Sesiones por videollamada',
					subtitle: 'Sesiones por videollamada (50 min)',
					image: `${this.$config.LANDING_URL}/planOne.png`,
					description:
						'Habla con un psicólogo por videollamada en cualquier momento, en cualquier lugar.',
				},
				{
					id: 2,
					deals: [
						{
							id: 4,
							lapse: '/Semana',
							price: '14.000',
							total: '14.000',
							type: 'Pago semanal',
						},
						{
							id: 5,
							lapse: '/semana ($50.400 mensual)',
							total: '50.400',
							price: '12.600',
							type: 'Pago mensual',
						},
						{
							id: 6,
							lapse: '/semana ($134.400 trimestral)',
							total: '134.400',
							price: '11.200',
							type: 'Pago cada tres meses',
						},
					],
					recommended: false,
					expandCard: false,
					price: '14.000',
					mode: 'Semana',
					title: 'Acompañamiento vía mensajería',
					subtitle: 'Terapia vía mensajes de texto',
					image: `${this.$config.LANDING_URL}/planTwo.png`,
					description:
						'Chatea con un psicólogo. Respuestas vía texto garantizadas 5 días a la semana.',
				},
				{
					id: 3,
					deals: [
						{
							id: 7,
							lapse: '/semana',
							price: '22.000',
							total: '22.000',
							type: 'Pago semanal',
						},
						{
							id: 8,
							lapse: '/semana ($79.200 mensual)',
							total: '79.200',
							price: '19.800',
							type: 'Pago mensual',
						},
						{
							id: 9,
							lapse: '/semana ($211.200 trimestral)',
							total: '211.200',
							price: '17.600',
							type: 'Pago cada tres meses',
						},
					],
					recommended: true,
					expandCard: false,
					price: '22.000',
					mode: 'Semana',
					title: 'Mensajería y videollamada',
					subtitle: 'Mensajería + Videollamada (30min)',
					image: `${this.$config.LANDING_URL}/planThree.png`,
					description:
						'Chatea y habla por videollamada con un psicólogo. Respuestas vía texto garantizadas 5 días a la semana.',
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped>
.shadow {
	box-shadow: 0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%),
		0px 1px 8px 0px rgb(0 0 0 / 12%) !important;
}
.shadow-selected {
	box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 4px rgb(225 245 254 / 100%),
		0px 1px 18px 4px rgb(225 245 254 / 100%) !important;
}
</style>
