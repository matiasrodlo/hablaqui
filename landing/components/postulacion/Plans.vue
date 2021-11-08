<template>
	<v-container fluid style="max-width: 1200px">
		<v-row justify="center">
			<v-col cols="12" class="text-center mb-10">
				<div class="primary--text">¡Lleva tu consulta al máximo!</div>
				<div class="my-2 primary--text headline text-md-h4 font-weight-bold">
					Revisa nuestros planes
				</div>
				<div class="text--secondary mx-auto" style="max-width: 400px">
					Impulsa tu carrera profesional destacando y teniendo acceso a muchas funciones
					exclusivas que harán tu vida más fácil.
				</div>
			</v-col>
			<v-col cols="12" md="6" lg="5">
				<v-card class="rounded-xl">
					<div class="primary" style="height: 10px"></div>
					<v-card-text>
						<div class="primary--text text-center body-1 d-block">La mejor opción</div>
						<div class="headline font-weight-bold text-center d-block">
							Plan premium
						</div>
						<div class="text-center text--secondary d-block">
							Para profesionales que buscan visibilidad, clientes y ganancias
						</div>
					</v-card-text>
					<v-card-text>
						<v-divider class="primary"></v-divider>
						<v-divider class="primary"></v-divider>
					</v-card-text>
					<v-card-text>
						<v-list>
							<v-list-item v-for="item in itemsPremiun" :key="item">
								<v-list-item-icon>
									<v-btn x-small fab outlined color="primary">
										<icon :icon="mdiCheck" />
									</v-btn>
								</v-list-item-icon>
								<v-list-item-content
									class="text--secondary font-weight-bold body-2"
								>
									{{ item }}
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>
				<v-radio-group v-model="period" hide-details>
					<v-card class="my-2 rounded-xl">
						<v-card-text class="py-1">
							<v-radio value="mensual">
								<template #label>
									<div style="width: 100%" class="d-flex justify-space-between">
										<div class="body-2 text--secondary">Mensual</div>
										<div class="body-2 text--secondary">$39.990</div>
									</div>
								</template>
							</v-radio>
						</v-card-text>
					</v-card>
					<v-card class="my-2 rounded-xl">
						<div class="primary caption text-center white--text" style="height: 20px">
							Ahorra 20%
						</div>
						<v-card-text class="py-1">
							<v-radio value="anual">
								<template #label>
									<div style="width: 100%" class="d-flex justify-space-between">
										<div class="body-2 text--secondary">Anual</div>
										<div class="body-2 text--secondary">$31.920</div>
									</div>
								</template>
							</v-radio>
						</v-card-text>
					</v-card>
					<v-btn class="mt-4" color="primary" rounded block @click="goMercadoPago()"
						>Suscríbete al plan premium
					</v-btn>
				</v-radio-group>
			</v-col>
			<v-col cols="12" md="6" lg="5">
				<v-card class="rounded-xl">
					<div style="height: 10px; background-color: #0000001f"></div>
					<v-card-text>
						<div class="text--secondary text-center body-1 d-block">Tu plan actual</div>
						<div class="headline font-weight-bold text-center d-block">Plan básico</div>
						<div class="text-center text--secondary d-block">
							Para profesionales que quieren servir en una plataforma segura
						</div>
					</v-card-text>
					<v-card-text>
						<v-divider></v-divider>
						<v-divider></v-divider>
					</v-card-text>
					<v-card-text>
						<v-list>
							<v-list-item v-for="item in itemsBasico" :key="item">
								<v-list-item-icon>
									<v-btn x-small fab outlined color="primary">
										<icon :icon="mdiCheck" />
									</v-btn>
								</v-list-item-icon>
								<v-list-item-content
									class="text--secondary font-weight-bold body-2"
								>
									{{ item }}
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>
				<v-btn class="mt-4 white--text" color="grey darken-1" rounded block @click="next">
					Continuar con plan básico
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mdiCheck } from '@mdi/js';
import { mapActions } from 'vuex';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		next: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			mdiCheck,
			period: null,
			itemsPremiun: [
				'Prioridad Nº1 en la activación del perfil',
				'Acceso a Hablaquí Office',
				'Videollamada cifrada',
				'Hasta 3,99% por sesión',
				'0% de comisión por sesión',
				'Pagos por sesiones con clientes ',
				'Consultoría de perfil y mejor posicionamiento en los resultados de búsqueda.',
				'Participación en eventos, talleres y sesiones de formación.',
				'Presencia en proyectos de marketing y visibilidad en empresas.',
				'Soporte diferenciado',
			],
			itemsBasico: [
				'Lista de espera',
				'Incluido en la comisión',
				'20% de comisión por sesión',
			],
		};
	},
	methods: {
		async goMercadoPago() {
			const preference = {
				price: this.period === 'mensual' ? 39990 : 31920,
				period: this.period === 'mensual' ? this.period : 'anual',
				title: 'Plan Premium',
				quantity: 1,
				psychologist: this.$auth.$state.user.psychologist,
			};
			const response = await this.mercadopagoPsychologistPay(preference);
			window.location.href = response.body.init_point;
		},
		...mapActions({
			mercadopagoPsychologistPay: 'Psychologist/mercadopagoPsychologistPay',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
