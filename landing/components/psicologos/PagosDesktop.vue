<template>
	<v-container fluid style="max-width: 1200px">
		<v-row>
			<v-col cols="6">
				<v-card class="shadowCard" style="border-radius: 15px">
					<v-card-title class="px-10 titleColor"> Seleccionar tipo de pago </v-card-title>
					<v-card-text
						v-for="item in itemsPlan"
						:key="item.id"
						class="px-10 pointer d-flex justify-space-between align-center"
						@click="planSelected = item"
					>
						<div>
							<div class="titleColor body-1 font-weight-bold">
								{{ item.title }}
							</div>
							<div class="titleColor body-2">
								{{ item.pricePerSession }}
								<span v-if="item.priceTotal" class="primary--text ml-4">
									{{ item.priceTotal }}
								</span>
							</div>
						</div>
						<div>
							<v-btn
								fab
								style="width: 20px; height: 20px"
								depressed
								:outlined="!planSelected || planSelected.id !== item.id"
								:color="
									planSelected && planSelected.id === item.id
										? 'primary'
										: '#969696'
								"
							>
							</v-btn>
						</div>
					</v-card-text>
				</v-card>
				<v-card class="shadowCard mt-6" style="border-radius: 15px">
					<v-card-title class="px-10 titleColor"> Cupón </v-card-title>
					<v-card-text class="px-10">
						<v-text-field
							v-model="coupon"
							outlined
							class="rounded-xl"
							fill
							hide-details
							placeholder="Introduzca el código"
						>
							<template #append>
								<v-btn
									small
									class="px-10"
									:disabled="!coupon"
									color="primary"
									rounded
									@click="setCoupon"
								>
									Aplicar
								</v-btn>
							</template>
						</v-text-field>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="6" class="px-2">
				<v-card
					:height="fullcard || showCalendar ? 'max-content' : '276px'"
					style="border-radius: 15px; transition: height 0.4s linear"
					class="shadowCard"
				>
					<v-card-text class="pt-6 px-10">
						<v-row align="start" justify="center">
							<v-col cols="4" class="text-center">
								<avatar
									:url="avatar(psychologist, true)"
									:name="psychologist.name"
									:last-name="psychologist.lastName ? psychologist.lastName : ''"
									size="100"
									loading-color="white"
								></avatar>
								<div
									class="text-capitalize py-4"
									style="color: #706f6f; font-size: 14px"
								>
									código {{ psychologist.code ? psychologist.code : '' }}
								</div>
							</v-col>
							<v-col cols="8">
								<nuxt-link
									style="text-decoration: none"
									:to="{
										path: `/${psychologist.username}`,
									}"
								>
									<div
										class="text-left font-weight-bold"
										style="color: #3c3c3b; font-size: 23px"
									>
										{{ psychologist.name }}
										{{ psychologist.lastName && psychologist.lastName }}
									</div>
								</nuxt-link>
								<div
									class="text-left font-weight-medium pa-2"
									style="color: #3c3c3b; font-size: 16px"
								>
									${{ Math.ceil(psychologist.sessionPrices.video / 100) * 100 }}
									/ 50 min
								</div>
								<div class="body-2 d-flex align-center">
									<icon size="20px" :icon="mdiCalendarOutline" />
									<span class="ml-3 pt-1">
										Fecha: {{ formatDate($route.query.date) }}
									</span>
								</div>
								<div class="my-3 body-2 d-flex align-center">
									<icon size="20px" :icon="mdiClockOutline" />
									<span class="ml-3 pt-1">Hora: {{ $route.query.start }}</span>
								</div>
								<div>
									<v-btn
										color="primary"
										text
										small
										class="px-0 py-0"
										@click="showCalendar = !showCalendar"
									>
										<span v-if="showCalendar">Ocultar agenda</span>
										<span v-else>Cambiar reserva</span>
									</v-btn>
								</div>
							</v-col>
							<v-expand-transition>
								<v-col v-if="showCalendar" cols="10">
									<calendar-psychologist
										:id-psy="psychologist._id"
										:set-date="changeDate"
										title-button="Seleccionar"
									/>
								</v-col>
							</v-expand-transition>
							<v-col cols="12">
								Sesiones por videollamada (50 min) Habla con un psicólogo por
								videollamada en cualquier momento, en cualquier lugar.
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
				<v-card class="shadowCard mt-6" style="border-radius: 15px">
					<v-card-title class="px-10 titleColor"> Resumen de pago </v-card-title>
					<v-card-text class="px-10">
						<div class="my-6 d-flex justify-space-between">
							<div class="body-1 font-weight-bold">Tipo de pago</div>
							<div v-if="planSelected" class="body-1">
								{{ planSelected.title }}
							</div>
						</div>
						<v-divider></v-divider>
						<div class="my-6 d-flex justify-space-between">
							<div class="body-1 font-weight-bold">Cantidad de sesiones</div>
							<div v-if="planSelected" class="body-1">x{{ planSelected.cant }}</div>
						</div>
						<v-divider></v-divider>
						<div class="my-6 d-flex justify-space-between">
							<div class="body-1 font-weight-bold">Valor por sesión</div>
							<div v-if="planSelected" class="body-1">
								{{ planSelected.valuePerSession }}
							</div>
						</div>
						<v-divider></v-divider>
						<div class="my-6 d-flex justify-space-between">
							<div class="body-1 font-weight-bold">Total</div>
							<div v-if="planSelected" class="body-1">${{ planSelected.price }}</div>
						</div>
						<div>
							<v-btn
								rounded
								block
								depressed
								color="rgba(26, 165, 216, 0.16)"
								@click="payButton"
							>
								<span class="primary--text">Continuar con el pago</span>
							</v-btn>
						</div>
						<div class="body-2 my-6 text-center">
							Este es un pago seguro con encriptado SSL
						</div>
						<div class="body-2 font-weight-bold">Paga seguro con</div>
						<div class="d-flex justify-space-around">
							<v-img
								width="50"
								contain
								:src="`https://cdn.hablaqui.cl/static/Visa_Logo.png`"
							></v-img>
							<v-img
								width="40"
								contain
								:src="`https://cdn.hablaqui.cl/static/logo-Mastercard.png`"
							></v-img>
							<v-img
								width="80"
								contain
								:src="`https://cdn.hablaqui.cl/static/surface.png`"
							></v-img>
							<v-img
								width="80"
								contain
								:src="`https://cdn.hablaqui.cl/static/american_express.png`"
							></v-img>
							<v-img
								width="80"
								contain
								:src="`https://cdn.hablaqui.cl/static/logo_webpay.png`"
							></v-img>
						</div>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mdiCalendarOutline, mdiClockOutline } from '@mdi/js';
import { mapActions, mapMutations } from 'vuex';
import moment from 'moment-timezone';
moment.tz.setDefault('America/Santiago');

export default {
	components: {
		Avatar: () => import('@/components/Avatar'),
		Icon: () => import('~/components/Icon'),
		CalendarPsychologist: () => import('~/components/Calendar'),
	},
	props: {
		psychologist: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			showCalendar: false,
			fullcard: false,
			mdiClockOutline,
			mdiCalendarOutline,
			PriceWithCoupon: null,
			loading: false,
			coupon: '',
			itemsPlan: [
				{
					id: 1,
					title: 'Pago semanal',
					pricePerSession: '$50.000 / por sesión',
					valuePerSession: '$50.000',
					priceTotal: '',
					cant: 1,
					price: 50000,
				},
				{
					id: 2,
					title: 'Pago mensual',
					pricePerSession: '$45.000 / por sesión',
					valuePerSession: '$45.000',
					priceTotal: '($180000)',
					cant: 4,
					price: 180000,
				},
				{
					id: 3,
					title: 'Pago trimestral',
					pricePerSession: '$40.000 / por sesión',
					valuePerSession: '$40.000',
					priceTotal: '($480000)',
					cant: 12,
					price: 480000,
				},
			],
			planSelected: null,
		};
	},
	mounted() {
		this.setPrices();
		this.planSelected = this.itemsPlan[1];
	},
	methods: {
		async setCoupon() {
			try {
				const { coupon } = await this.$axios.$post('/coupons/check-coupon', {
					coupon: this.coupon,
				});
				if (coupon.discountType === 'percentage') {
					const totalValue = this.planSelected.price * ((100 - coupon.discount) / 100);
					this.PriceWithCoupon = totalValue.toFixed(0);
				}
				if (coupon.discountType === 'static') {
					this.PriceWithCoupon = this.planSelected.price - coupon.discountType;
				}
			} catch (error) {
				this.PriceWithCoupon = null;
				this.snackBar({ content: error.response.data.message, color: 'error' });
			}
		},
		setPrices() {
			this.itemsPlan = this.itemsPlan.map(item => {
				let priceWithDiscount = '';
				let pricePerSession = '';
				let price = '';

				if (item.id === 1) {
					priceWithDiscount = 0;
					pricePerSession = Math.ceil(this.psychologist.sessionPrices.video / 100) * 100;
					price = Math.ceil(this.psychologist.sessionPrices.video / 100) * 100;
				}
				if (item.id === 2) {
					priceWithDiscount =
						this.psychologist.sessionPrices.video * 4 -
						this.psychologist.sessionPrices.video * 4 * 0.1;
					pricePerSession = priceWithDiscount / 4;
					pricePerSession = Math.ceil(pricePerSession / 100) * 100;
					price = pricePerSession * 4;
				}
				if (item.id === 3) {
					priceWithDiscount =
						this.psychologist.sessionPrices.video * 12 -
						this.psychologist.sessionPrices.video * 12 * 0.2;
					pricePerSession = priceWithDiscount / 12;
					pricePerSession = Math.ceil(pricePerSession / 100) * 100;
					price = pricePerSession * 12;
				}

				return {
					...item,
					pricePerSession: `$${pricePerSession} / por sesión`,
					valuePerSession: `$${pricePerSession}`,
					priceTotal: `($${price})`,
					price,
				};
			});
		},
		avatar(psychologist) {
			if (!psychologist.approveAvatar) return '';
			if (psychologist.avatarThumbnail) return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		async payButton() {
			this.loading = true;
			const planPayload = {
				date: this.$route.query.date,
				start: this.$route.query.start,
				end: this.$route.query.end,
				user: this.$auth.$state.user,
				psychologist: this.psychologist._id,
				paymentPeriod: this.planSelected.title,
				title: `${this.planSelected.cant} Sesión(es) por videollamada - ${this.planSelected.title} `,
				price: this.PriceWithCoupon ? this.PriceWithCoupon : this.planSelected.price,
				coupon: this.PriceWithCoupon ? this.coupon : '',
			};
			const createdPlan = await this.createSession(planPayload);
			if (createdPlan) {
				const mercadopagoPayload = {
					psychologist: this.psychologist.username,
					price: this.PriceWithCoupon ? this.PriceWithCoupon : this.planSelected.price,
					description: `${this.planSelected.cant} Sesión(es) por videollamada - ${this.planSelected.title}`,
					quantity: 1,
					plan: createdPlan.plan._id,
				};
				const res = await this.mercadopagoPay(mercadopagoPayload);
				window.location.href = res.init_point;
			}
			this.loading = false;
		},
		changeDate(item) {
			this.$router.push(
				`/psicologos/pagos/?username=${this.psychologist.username}&date=${item.date}&start=${item.start}&end=${item.end}`
			);
			this.showCalendar = !this.showCalendar;
		},
		formatDate(date) {
			return moment(date, 'MM/DD/YYYY').format('DD/MM/YYYY');
		},
		...mapActions({
			mercadopagoPay: 'Psychologist/mercadopagoPay',
			createSession: 'Psychologist/createSession',
		}),
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
};
</script>
<style lang="scss" scoped>
.shadowCard {
	border-radius: 15px;
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
.titleColor {
	color: #525252;
}
</style>
