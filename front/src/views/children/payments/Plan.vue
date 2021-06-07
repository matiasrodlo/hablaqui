<template>
	<div style="background-color: #FFF">
		<!-- appbar -->
		<appbar />
		<v-container>
			<v-row justify="center" align="center">
				<v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12">
					<div class="d-flex justify-center align-center">
						<ul id="breadcrumb">
							<li
								:class="breakCrumbs == 0 ? 'child-selected' : 'child-un-selected'"
								@click="breakCrumbs = 0"
								style="cursor: pointer"
							>
								<span>Agendar</span>
							</li>
							<li
								@click="
									() => {
										if (newEvent && breakCrumbs != 1) breakCrumbs = 1;
									}
								"
								:style="newEvent && 'cursor: pointer'"
							>
								<span
									:class="
										breakCrumbs == 1 ? 'child-selected' : 'child-un-selected'
									"
								>
									Escoger Plan
								</span>
							</li>
							<li
								@click="
									() => {
										if (selectedItem && breakCrumbs != 2) breakCrumbs = 2;
									}
								"
								:style="selectedItem && 'cursor: pointer'"
								:class="breakCrumbs == 2 ? 'child-selected' : 'child-un-selected'"
							>
								<span>Detalles</span>
							</li>
							<li :class="breakCrumbs == 3 ? 'child-selected' : 'child-un-selected'">
								<span>Pago</span>
							</li>
						</ul>
					</div>
				</v-col>
				<v-col v-else cols="12">
					<v-btn
						icon
						x-large
						color="primary"
						v-if="breakCrumbs !== 0"
						@click="breakCrumbs = breakCrumbs - 1"
					>
						<v-icon size="64">mdi-chevron-left</v-icon>
					</v-btn>
				</v-col>
				<v-col cols="12" sm="10" md="9" lg="7" v-if="breakCrumbs == 0">
					<div
						class="text--secondary text-center text-md-left font-weight-bold text-h5 text-sm-h4"
					>
						Agenda la hora y día de tu consulta
					</div>
					<div class="text--secondary text-center text-md-left text-h6">
						Agenda con total libertad cuando te resulte más conveniente.
					</div>
					<v-card
						max-width="600"
						min-height="272"
						class="my-16 mx-auto"
						elevation="10"
						style="border-radius: 25px"
					>
						<v-card-text>
							<Calendar
								:setDate="
									item => {
										newEvent = item;
										breakCrumbs = 1;
									}
								"
								titleButton="Seleccionar fecha"
							/>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" sm="10" md="9" lg="7" v-if="breakCrumbs == 1">
					<div
						class="text--secondary text-center text-md-left font-weight-bold text-h5 text-md-h4 mt-4"
					>
						El mejor plan para ti
					</div>
					<div
						class="text--secondary text-center text-md-left mb-6 font-weight-bold mt-2"
					>
						Puedes cambiar de plan o cancelar tu suscripción cuando desees.
					</div>
					<SelectPlan :setPlan="item => setPlan(item)" />
				</v-col>
				<v-col cols="12" sm="10" md="9" lg="8" v-if="breakCrumbs == 2">
					<div
						class="mt-3 text--secondary text-center text-md-left font-weight-bold text-h5 text-md-h4"
					>
						Revisa tu plan
					</div>
					<div class="text--secondary text-center text-md-left text-h6 mb-3">
						¡Es momento de comenzar la terapia!
					</div>
					<v-card flat>
						<v-card-text>
							<v-row align="center" justify="center">
								<v-col cols="12" md="7">
									<div class="my-3 subtitle-2">Aplicar un cupón</div>
									<v-text-field
										label="Introduzca el codigo"
										dense
										outlined
										hide-details
									>
										<template v-slot:append-outer>
											<v-btn
												small
												color="primary"
												class="px-10"
												style="border-radius: 10px"
											>
												Solicitar
											</v-btn>
										</template>
									</v-text-field>
									<v-list-item class="px-0 mt-3 mb-2">
										<v-list-item-content>
											<v-list-item-title>
												<span class="caption font-weight-light"
													>Psicólogo -
												</span>
												<v-btn
													text
													class="px-0"
													small
													color="primary"
													:to="{ name: 'all-psicologos' }"
													>Cambiar
												</v-btn>
											</v-list-item-title>
											<v-list-item-subtitle class="title font-weight-bold">
												{{ psi.name }} {{ psi.lastName && psi.lastName }}
											</v-list-item-subtitle>
										</v-list-item-content>
										<v-list-item-avatar size="70" class="ml-4">
											<v-img :src="psi.avatar"></v-img>
										</v-list-item-avatar>
									</v-list-item>
									<div class="caption">
										Suscripción -
										<v-btn
											text
											color="primary"
											class="px-0"
											small
											@click="() => (breakCrumbs = 1)"
											>Cambiar
										</v-btn>
									</div>
									<div class="subtitle-1 font-weight-bold">
										{{ selectedItem.title }}
									</div>
									<div class="subtitle-1 my-2" style="max-width: 250px">
										{{ selectedItem.subtitle }}
										{{ selectedItem.description }}
									</div>
								</v-col>
								<v-col cols="12" md="5">
									<v-btn
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
										{{ selectedItem.title }}
									</div>
									<v-divider class="my-4"></v-divider>
									<div class=" d-flex justify-space-between">
										<span class="font-weight-bold subtitle-1">Monto total</span>
										<span class="font-weight-bold text-h6 black--text"
											>${{ selectedItem.price }}</span
										>
									</div>
									<div class="caption my-4 text-left">
										Realiza el pago de tu suscripción con tarjeta de débito y
										crédito en cuotas.
									</div>
									<div class="d-flex justify-space-around">
										<v-img width="80" src="/img/planFour.png"></v-img>
										<v-img width="80" src="/img/planFive.png"></v-img>
										<v-img width="80" src="/img/planSix.png"></v-img>
									</div>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col v-if="breakCrumbs == 3">
					<v-row justify="center" align="center" style="height: 60vh">
						<v-col class="text-center">
							<v-alert type="info">
								Los robots estan haciendo su trabajo, no te vayas...
							</v-alert>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>
<script>
import Appbar from '@/components/ui/Appbar.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'PaymentsHome',
	components: {
		Appbar,
		Calendar: () => import('@/components/ui/Calendar'),
		SelectPlan: () => import('@/components/plan/SelectPlan'),
	},
	data() {
		return {
			selectedItem: '',
			breakCrumbs: 0,
			newEvent: null,
			psi: null,
		};
	},
	computed: {
		...mapGetters({ user: 'User/user' }),
	},
	beforeRouteEnter(to, from, next) {
		const psi = JSON.parse(localStorage.getItem('psi'));
		if (psi) {
			next();
		} else {
			next({ name: 'evaluacion' });
		}
	},
	created() {
		this.psi = JSON.parse(localStorage.getItem('psi'));
	},
	methods: {
		setPlan(item) {
			this.selectedItem = item;
			this.breakCrumbs = 2;
		},
		async payButton() {
			this.breakCrumbs = 3;
			let priceInt = Number(this.selectedItem.price.split('.').join(''));
			const sessionPayload = {
				start: this.newEvent.start,
				end: this.newEvent.end,
				user: this.user,
				psychologist: this.psi,
			};
			const createdSession = await this.createSession(sessionPayload);
			const payload = {
				price: priceInt,
				title: this.selectedItem.title,
				quantity: 1,
				sessionToUpdate: createdSession.id,
				userToUpdate: this.user._id,
				psychologistToUpdate: this.psi._id,
			};
			const preferenceData = await this.mercadopagoPay(payload);
			window.location.href = preferenceData.body.init_point;
		},
		...mapActions({
			mercadopagoPay: 'Psychologist/mercadopagoPay',
			createSession: 'Psychologist/createSession',
		}),
	},
};
</script>

<style lang="scss" scoped>
$info: #5eb3e4;
$primary: #2070e5;

.spinner {
	height: 115px;
	width: 115px;
	background-color: #bdbdbd;
	border-radius: 70px;
}

#breadcrumb {
	list-style: none;
	display: inline-block;

	li {
		float: left;
		&:first-child {
			padding-left: 50px;
			border-radius: 15px 0 0 15px;
			&:before {
				border: none;
			}
		}
		&:last-child {
			padding-right: 50px;
			border-radius: 0 15px 15px 0;
			&:after {
				border: none;
			}
		}
	}
}

.child-selected {
	font-weight: 500;
	color: white;
	display: block;
	background: $primary;
	text-decoration: none;
	position: relative;
	height: 40px;
	line-height: 40px;
	padding: 0 50px 0 50px;
	text-align: center;
	margin-right: 23px;
	&:before,
	&:after {
		content: '';
		position: absolute;
		top: 0;
		border: 0 solid $primary;
		border-width: 20px 10px;
		width: 0;
		height: 0;
	}
	&:before {
		left: -15px;
		border-left-color: transparent;
	}
	&:after {
		left: 100%;
		border-color: transparent;
		border-left-color: $primary;
	}
}

.child-un-selected {
	font-weight: 500;
	color: $primary;
	display: block;
	background: $info;
	text-decoration: none;
	position: relative;
	height: 40px;
	line-height: 40px;
	padding: 0 50px 0 50px;
	text-align: center;
	margin-right: 23px;
	&:before,
	&:after {
		content: '';
		position: absolute;
		top: 0;
		border: 0 solid $info;
		border-width: 20px 10px;
		width: 0;
		height: 0;
	}
	&:before {
		left: -15px;
		border-left-color: transparent;
	}
	&:after {
		left: 100%;
		border-color: transparent;
		border-left-color: $info;
	}
}

.v-event-draggable {
	padding-left: 6px;
}

.v-event-timed {
	user-select: none;
	-webkit-user-select: none;
}

.v-event-drag-bottom {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 4px;
	height: 4px;
	cursor: ns-resize;

	&::after {
		display: none;
		position: absolute;
		left: 50%;
		height: 4px;
		border-top: 1px solid white;
		border-bottom: 1px solid white;
		width: 16px;
		margin-left: -8px;
		opacity: 0.8;
		content: '';
	}

	&:hover::after {
		display: block;
	}
}
</style>
