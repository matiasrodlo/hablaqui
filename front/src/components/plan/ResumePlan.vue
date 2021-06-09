<template>
	<v-row align="center" justify="center">
		<v-col cols="12" md="7">
			<div class="my-3 subtitle-2">Aplicar un cupón</div>
			<v-text-field label="Introduzca el codigo" dense outlined hide-details>
				<template v-slot:append-outer>
					<v-btn small color="primary" class="px-10" style="border-radius: 10px">
						Solicitar
					</v-btn>
				</template>
			</v-text-field>
			<v-list-item class="px-0 mt-3 mb-2">
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
				<v-list-item-avatar size="70" class="ml-4">
					<v-img :src="psy.avatar"></v-img>
				</v-list-item-avatar>
			</v-list-item>
			<div class="caption">
				Suscripción -
				<v-btn text color="primary" class="px-0" small @click="goBack">Cambiar </v-btn>
			</div>
			<div class="subtitle-1 font-weight-bold">
				{{ plan.title }}
			</div>
			<div class="subtitle-1 my-2" style="max-width: 250px">
				{{ plan.subtitle }}
				{{ plan.description }}
			</div>
		</v-col>
		<v-col cols="12" md="5">
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
			<div class=" font-weight-bold">
				Resumen
			</div>
			<div>
				{{ plan.title }}
			</div>
			<v-divider class="my-4"></v-divider>
			<div class=" d-flex justify-space-between">
				<span class="font-weight-bold subtitle-1">Monto total</span>
				<span class="font-weight-bold text-h6 black--text">${{ plan.price }}</span>
			</div>
			<div class="caption my-4 text-left">
				Realiza el pago de tu suscripción con tarjeta de débito y crédito en cuotas.
			</div>
			<div class="d-flex justify-space-around">
				<v-img width="80" src="/img/planFour.png"></v-img>
				<v-img width="80" src="/img/planFive.png"></v-img>
				<v-img width="80" src="/img/planSix.png"></v-img>
			</div>
		</v-col>
	</v-row>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
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
			require: true,
		},
		close: {
			type: Function,
			require: true,
		},
	},
	data() {
		return {
			loading: false,
		};
	},
	computed: {
		...mapGetters({ user: 'User/user' }),
	},
	mounted() {
		this.setResumeView(false);
	},
	methods: {
		async payButton() {
			this.loading = true;
			let priceInt = Number(this.plan.price.split('.').join(''));
			const sessionPayload = {
				date: this.event.date,
				start: this.event.start,
				end: this.event.end,
				user: this.user,
				psychologist: this.psy,
			};
			const createdSession = await this.createSession(sessionPayload);
			const payload = {
				price: priceInt,
				title: this.plan.title,
				quantity: 1,
				sessionToUpdate: createdSession.id,
				userToUpdate: this.user._id,
				psychologistToUpdate: this.psy._id,
			};
			const preferenceData = await this.mercadopagoPay(payload);
			this.loading = false;
			window.location.href = preferenceData.body.init_point;
		},
		...mapActions({
			mercadopagoPay: 'Psychologist/mercadopagoPay',
			createSession: 'Psychologist/createSession',
		}),
		...mapMutations({ setResumeView: 'Psychologist/setResumeView' }),
	},
};
</script>

<style lang="scss" scoped></style>
