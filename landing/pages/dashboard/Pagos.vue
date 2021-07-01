<template>
	<v-container style="height: 100vh">
		<appbar title="Pagos" />
		<v-row>
			<v-col v-for="(card, i) in cards" :key="i" cols="3">
				<v-card dark color="primary" class="pa-4 rounded-lg">
					<v-list-item>
						<v-list-item-avatar size="50">
							<v-img :src="card.img" :lazy-src="card.img" :alt="card.title" />
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title class="headline font-weight-bold">
								{{
									$auth.$state.user._id == '60c26d38f12991000bca3bba'
										? card.value
										: '0'
								}}
							</v-list-item-title>
							<v-list-item-subtitle class="body-1">
								{{ card.title }}
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-card>
			</v-col>
		</v-row>
		<div style="height: calc(100vh - 300px); overflow-y: auto" class="d-flex">
			<v-col cols="12" class="px-0">
				<div class="grey darken-1 d-flex justify-space-around pa-4 mt-10 mb-2 rounded-lg">
					<span class="white--text body-1 text-center">Codigo</span>
					<span class="white--text body-1 text-center">Nombre</span>
					<span class="white--text body-1 text-center"> Planes contratados </span>
					<span class="white--text body-1 text-center">Pagado</span>
					<span class="white--text body-1 text-center">Deuda</span>
				</div>
				<v-expansion-panels v-if="$auth.$state.user._id == '60c26d38f12991000bca3bba'">
					<v-expansion-panel v-for="(item, i) in payments" :key="i">
						<v-expansion-panel-header>
							<div class="d-flex justify-space-around">
								<span class="body-1 text-center" style="width: 150px">
									{{ item.code }}
								</span>
								<span class="body-1 text-center" style="width: 150px">
									{{ item.name }}
								</span>
								<span class="body-1 text-center" style="width: 150px">
									{{ item.plan }}
								</span>
								<span class="body-1 text-center" style="width: 150px">
									{{ item.pay }}
								</span>
								<span class="body-1 text-center" style="width: 150px">
									{{ item.deuda }}
								</span>
							</div>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<div
								v-for="(detail, k) in item.details"
								:key="k"
								class="d-flex justify-space-around"
							>
								<span class="body-1 text-center" style="width: 150px"></span>
								<span class="body-1 text-center" style="width: 150px"></span>
								<span class="body-1 text-center" style="width: 150px">{{
									detail.plan
								}}</span>
								<span class="body-1 text-center" style="width: 150px">{{
									detail.pay
								}}</span>
								<span class="body-1 text-center" style="width: 150px">{{
									detail.deuda
								}}</span>
							</div>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
				<v-card v-if="$auth.$state.user._id != '60c26d38f12991000bca3bba'" flat>
					<v-card-text class="text-center">
						<div class="body-1 my-3 mx-auto">
							Paciencia. Aún nadie ha reservado una sesión
						</div>
					</v-card-text>
				</v-card>
			</v-col>
		</div>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: 'Pagos',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			cards: [
				{
					value: '128',
					title: 'Usuarios',
					subtitle: '',
					img: `${this.$config.LANDING_URL}/accoun.png`,
				},
				{
					value: '200',
					title: 'Planes contratados',
					subtitle: '',
					img: `${this.$config.LANDING_URL}/brain.png`,
				},
				{
					value: '$400.000',
					title: 'Pagado',
					subtitle: '',
					img: `${this.$config.LANDING_URL}/pay.png`,
				},
				{
					value: '$300.000',
					title: 'Por pagar',
					subtitle: '',
					img: `${this.$config.LANDING_URL}/pagos.png`,
				},
			],
			payments: [
				{
					code: '0923',
					name: 'Joaquín Mendoza',
					plan: '12',
					pay: '6/12 · $550.000',
					deuda: '6/12 · $550.000',
					details: [
						{ plan: '1', pay: '$91.600', deuda: 'Aprobado' },
						{ plan: '1', pay: '$91.600', deuda: 'Aprobado' },
						{ plan: '1', pay: '$91.600', deuda: 'Aprobado' },
						{ plan: '1', pay: '$91.600', deuda: 'En proceso' },
						{ plan: '1', pay: '$91.600', deuda: 'Pendiente' },
						{ plan: '1', pay: '$91.600', deuda: 'Pendiente' },
					],
				},
				{
					code: '0923',
					name: 'Josefa Hodges',
					plan: '8',
					pay: '6/12 · $550.000',
					deuda: '6/12 · $550.000',
					details: [
						{ plan: '1', pay: '$91.600', deuda: 'Aprobado' },
						{ plan: '1', pay: '$91.600', deuda: 'Aprobado' },
						{ plan: '1', pay: '$91.600', deuda: 'Aprobado' },
						{ plan: '1', pay: '$91.600', deuda: 'Aprobado' },
						{ plan: '1', pay: '$91.600', deuda: 'En proceso' },
						{ plan: '1', pay: '$91.600', deuda: 'Pendiente' },
					],
				},
				{
					code: '0923',
					name: 'Manuel Rosales',
					plan: '8',
					pay: '6/12 · $550.000',
					deuda: '6/12 · $550.000',
					details: [
						{ plan: '1', pay: '$91.600', deuda: 'Aprobado' },
						{ plan: '1', pay: '$91.600', deuda: 'En proceso' },
						{ plan: '1', pay: '$91.600', deuda: 'Pendiente' },
						{ plan: '1', pay: '$91.600', deuda: 'Pendiente' },
						{ plan: '1', pay: '$91.600', deuda: 'Pendiente' },
						{ plan: '1', pay: '$91.600', deuda: 'Pendiente' },
					],
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped></style>
