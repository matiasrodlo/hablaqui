<template>
	<v-row align="start" justify="space-around" class="my-5">
		<v-col cols="12" md="6" class="elevation-2 px-4">
			<div class="my-3 subtitle-2">Aplicar un cupón</div>
			<div class="d-flex">
				<v-text-field v-model="coupon" dense outlined hide-details>
					<template #label>
						<span class="caption py-0">Introduzca el código</span>
					</template>
				</v-text-field>
				<button
					type="button"
					class="primary px-10"
					style="border-radius: 10px; width: 45%; height: 40px"
					@click="setCoupon"
				>
					<span class="white--text">Solicitar</span>
				</button>
			</div>
			<v-list dense two-line>
				<v-list-item class="px-0">
					<v-list-item-avatar size="100">
						<v-img contain :src="psy.avatar"></v-img>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title>
							<span class="caption font-weight-light">Psicólogo - </span>
							<v-btn text class="px-0" small color="primary" @click="close">
								Cambiar
							</v-btn>
						</v-list-item-title>
						<v-list-item-subtitle class="title font-weight-bold">
							{{ psy.name }} {{ psy.lastName && psy.lastName }}
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<div class="secondary--text subtitle-1 font-weight-bold">
				{{ plan.title }}
			</div>
			<div class="caption">
				Suscripción -
				<v-btn text color="primary" class="px-0" small @click="goBack">Cambiar </v-btn>
			</div>
			<div class="caption my-2" style="max-width: 320px">
				{{ plan.subtitle }}
				{{ plan.description }}
			</div>
		</v-col>
		<v-col cols="12" md="5" class="pa-0">
			<div class="elevation-2 pa-4">
				<v-btn
					:loading="loading"
					color="primary"
					block
					style="border-radius: 10px"
					@click="payButton"
				>
					Continuar al pago
				</v-btn>
				<div class="caption my-4 text-center">
					Este es un pago seguro con encriptado SSL.
				</div>
				<div class="font-weight-bold">Resumen</div>
				<div class="caption">
					{{ plan.title }} {{ plan.deal.weekPrice }} {{ plan.deal.lapse }}<br />
					{{ plan.deal.type }}
				</div>
				<v-divider class="my-4"></v-divider>
				<div class="d-flex justify-space-between">
					<span class="font-weight-bold subtitle-1">Monto total</span>
					<span class="font-weight-bold black--text">
						<span :class="pay ? 'text-decoration-line-through caption' : 'text-h6'">
							${{ priceInt }}
						</span>
						<span v-if="pay" class="text-h6">{{ pay ? pay : priceInt }}</span>
					</span>
				</div>
				<div class="caption my-4 text-left">
					Realiza el pago de tu suscripción con tarjeta de débito y crédito en cuotas.
				</div>
			</div>
			<div class="mt-6 d-flex justify-space-around">
				<v-img width="80" :src="`https://cdn.hablaqui.cl/static/planFour.png`"></v-img>
				<v-img width="80" :src="`https://cdn.hablaqui.cl/static/planFive.png`"></v-img>
				<v-img width="80" :src="`https://cdn.hablaqui.cl/static/planSix.png`"></v-img>
			</div>
		</v-col>
	</v-row>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
	props: {
		psy: {
			type: Object,
			required: true,
		},
		plan: {
			type: Object,
			required: true,
		},
		event: {
			type: Object,
			required: true,
		},
		goBack: {
			type: Function,
			required: true,
		},
		close: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			coupon: null,
			pay: null,
			loading: false,
			priceInt: 0,
		};
	},
	created() {
		if (this.verifyOnlyNumbers(this.plan.deal.price)) {
			this.priceInt = Number(this.plan.deal.price);
		} else {
			this.priceInt = Number(this.plan.deal.price.split('.').join(''));
		}
	},
	mounted() {
		this.setResumeView(false);
	},
	methods: {
		verifyOnlyNumbers(value) {
			const regex = /^[0-9]*$/;
			return regex.test(value.toString());
		},
		async setCoupon() {
			try {
				const { coupon } = await this.$axios.$post('/coupons/check-coupon', {
					coupon: this.coupon,
				});
				if (coupon.discountType === 'percentage') {
					const totalValue = this.priceInt * ((100 - coupon.discount) / 100);
					this.pay = totalValue.toFixed(0);
				}
				if (coupon.discountType === 'static') {
					this.pay = this.priceInt - coupon.discountType;
				}
			} catch (error) {
				this.pay = null;
				this.snackBar({ content: error.response.data.message, color: 'error' });
			}
		},
		async payButton() {
			this.loading = true;
			const planPayload = {
				date: this.event.date,
				start: this.event.start,
				end: this.event.end,
				user: this.$auth.$state.user,
				psychologist: this.psy._id,
				paymentPeriod: this.plan.deal.type,
				title: this.plan.title,
				price: this.pay ? this.pay : this.priceInt,
				coupon: this.pay ? this.coupon : '',
			};
			const createdPlan = await this.createSession(planPayload);
			if (createdPlan) {
				const mercadopagoPayload = {
					price: this.pay ? this.pay : this.priceInt,
					description: this.plan.title,
					quantity: 1,
					plan: createdPlan.plan._id,
				};
				const res = await this.mercadopagoPay(mercadopagoPayload);
				window.location.href = res.init_point;
			}
			this.loading = false;
		},
		...mapActions({
			mercadopagoPay: 'Psychologist/mercadopagoPay',
			createSession: 'Psychologist/createSession',
		}),
		...mapMutations({
			setResumeView: 'Psychologist/setResumeView',
			snackBar: 'Snackbar/showMessage',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
