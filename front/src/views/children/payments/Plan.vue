<template>
	<div>
		<!-- appbar -->
		<appbar />
		<v-container>
			<v-row justify="center" align="center">
				<v-col cols="12">
					<div class="d-flex justify-center align-center">
						<ul id="breadcrumb">
							<li :class="breakCrumbs == 0 ? 'child-selected' : 'child-un-selected'">
								<span>Agendar</span>
							</li>
							<li>
								<span
									:class="
										breakCrumbs == 1 ? 'child-selected' : 'child-un-selected'
									"
								>
									Escoger Plan
								</span>
							</li>
							<li :class="breakCrumbs == 2 ? 'child-selected' : 'child-un-selected'">
								<span>Detalles</span>
							</li>
							<li :class="breakCrumbs == 3 ? 'child-selected' : 'child-un-selected'">
								<span>Pago</span>
							</li>
						</ul>
					</div>
				</v-col>
				<div v-if="breakCrumbs == 0">
					<div class="text--secondary text-left font-weight-bold text-h4">
						Agenda la hora y día de tu consulta
					</div>
					<div class="text--secondary text-left text-h6">
						Agenda con total libertad cuando te resulte más conveniente.
					</div>
					<v-card
						class="my-16"
						elevation="10"
						max-width="700"
						style="border-radius: 25px"
					>
						<v-card-text>
							<v-row>
								<v-col cols="6">
									<v-date-picker
										full-width
										@change="changePicker"
										:value="picker"
										locale="es"
									></v-date-picker>
								</v-col>
								<v-col cols="6">
									<v-card flat height="400">
										<v-calendar
											ref="calendar"
											v-model="picker"
											type="day"
											hide-header
											:events="events"
											:event-ripple="false"
											@mousedown:event="startDrag"
											@mousedown:time="startTime"
											@mousemove:time="mouseMove"
											@mouseup:time="endDrag"
											@mouseleave.native="cancelDrag"
										>
											<template v-slot:event="{ event, eventSummary }">
												<div class="d-flex justify-space-between">
													<div
														:class="
															!event.disable
																? 'v-event-draggable'
																: ''
														"
														v-html="eventSummary()"
													></div>
													<v-btn
														v-if="!event.disable"
														@click="resetEvent"
														x-small
														icon
														color="error"
													>
														<v-icon>mdi-close</v-icon>
													</v-btn>
												</div>
												<div
													:class="
														!event.disable ? 'v-event-drag-bottom' : ''
													"
													@mousedown.stop="extendBottom(event)"
												></div>
											</template>
										</v-calendar>
										<v-overlay absolute :value="!picker">
											<div
												class="title px-6 py-3"
												style="border-radius: 10px; border: 1px solid white"
											>
												Seleccione un día primero
											</div>
										</v-overlay>
									</v-card>
								</v-col>
							</v-row>
						</v-card-text>
						<v-card-actions>
							<div
								v-if="newEvent && picker"
								class="primary--text font-weight-bold subtitle-1"
							>
								{{ viewDate }}
							</div>
							<div v-else>Seleccione un dia y la hora para continuar</div>
							<v-spacer></v-spacer>
							<v-btn
								v-if="newEvent && picker"
								x-large
								text
								color="primary"
								@click="breakCrumbs = 1"
							>
								Continuar
							</v-btn>
						</v-card-actions>
					</v-card>
				</div>
				<div v-if="breakCrumbs == 1">
					<div class="text--secondary text-left font-weight-bold text-h4">
						El mejor plan para ti
					</div>
					<div class="text--secondary text-left text-h6 mb-6">
						Puedes cambiar de plan o cancelar tu suscripción cuando desees.
					</div>
					<v-card max-width="700" v-for="(el, j) in plans" :key="j" class="my-6">
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
								<v-col cols="9">
									<span class="text-h4 font-weight-bold"> ${{ el.price }} </span>
									<span class="text-h6 text--secondary"> /{{ el.mode }} </span>
									<div class="text-h6 primary--text font-weight-bold">
										{{ el.title }}
									</div>
									<div class="my-2 font-weight-bold">
										{{ el.subtitle }}
									</div>
									<div class="body-1 mt-2">
										{{ el.description }}
									</div>
								</v-col>
								<v-col cols="3" class="text-center mt-6">
									<v-avatar color="grey" size="100">
										<v-img
											:src="el.image"
											:alt="el.title"
											width="140"
											height="140"
										/>
									</v-avatar>
									<v-btn
										class="mt-3"
										color="primary"
										text
										@click="() => (el.expandCard = !el.expandCard)"
									>
										Seleccionar plan
									</v-btn>
								</v-col>
								<v-expand-transition>
									<v-col v-if="el.expandCard" cols="12">
										<v-list-item-group
											flat
											style="max-width: 500px"
											v-model="selectedItem"
											color="primary"
										>
											<v-list-item
												v-for="deal in el.deals"
												:key="deal.id"
												class="ma-2"
												link
												:value="{ ...deal, plan: j }"
											>
												<v-list-item-content>
													<v-list-item-title
														class="font-weight-bold text--secondary"
													>
														{{ deal.type }}
													</v-list-item-title>
													<v-list-item-subtitle>
														<span
															class="font-weight-bold text--secondary"
														>
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
														x-small
														depressed
														:color="
															deal.id == selectedItem.id
																? 'primary'
																: '#E1F5FE'
														"
													>
													</v-btn>
												</v-list-item-action>
											</v-list-item>
										</v-list-item-group>
										<div
											v-if="el.deals.some(u => selectedItem.id === u.id)"
											class="text-center"
										>
											<v-btn
												small
												color="primary"
												@click="() => (breakCrumbs = 2)"
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
				<div v-if="breakCrumbs == 2">
					<div class="text--secondary text-left font-weight-bold text-h3">
						Revisa tu plan
					</div>
					<div class="text--secondary text-left text-h6">
						¡Es momento de comenzar la terapia!
					</div>
					<v-card max-width="700" flat>
						<v-card-text>
							<v-row align="center" justify="center">
								<v-col cols="7">
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
									<v-list-item class="px-0 my-10">
										<v-list-item-content>
											<v-list-item-title class="subtitle-2">
												Psicólogo
												<v-btn
													text
													color="primary"
													:to="{ name: 'all-psicologos' }"
												>
													Cambiar
												</v-btn>
											</v-list-item-title>
											<v-list-item-subtitle class="title font-weight-bold">
												{{ psi.name }}
											</v-list-item-subtitle>
										</v-list-item-content>
										<v-list-item-avatar size="70" class="ml-4">
											<v-img :src="psi.avatar"></v-img>
										</v-list-item-avatar>
									</v-list-item>
									<div class="caption">
										Suscripción
										<v-btn
											text
											color="primary"
											small
											@click="() => (breakCrumbs = 1)"
										>
											Cambiar
										</v-btn>
									</div>
									<div class="title font-weight-bold">
										{{ plans[selectedItem.plan].title }}
									</div>
									<div class="subtitle-1 my-2">
										{{ plans[selectedItem.plan].subtitle }}
										{{ plans[selectedItem.plan].description }}
									</div>
								</v-col>
								<v-col cols="5">
									<v-btn
										color="primary"
										block
										style="border-radius: 10px"
										@click="() => (breakCrumbs = 3)"
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
										{{ plans[selectedItem.plan].title }}
									</div>
									<div
										class="font-weight-bold text-h6 d-flex justify-space-between"
									>
										<span>Monto total</span>
										<span>${{ plans[selectedItem.plan].price }}</span>
									</div>
									<div class="caption my-4 text-left">
										Realiza el pago de tu suscripción con tarjeta de débito y
										crédito en cuotas.
									</div>
									<div class="d-flex justify-space-around">
										<v-img width="80" src="/img/venta-de-plan-19.png"></v-img>
										<v-img width="80" src="/img/venta-de-plan-20.png"></v-img>
										<v-img width="80" src="/img/venta-de-plan-21.png"></v-img>
									</div>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</div>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import Appbar from '@/components/ui/Appbar.vue';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
	name: 'PaymentsHome',
	components: {
		Appbar,
	},
	data() {
		return {
			selectedItem: '',
			picker: '',
			breakCrumbs: 0,
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
					image: '/img/venta-de-plan-15.png',
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
					image: '/img/venta-de-plan-16.png',
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
					image: '/img/venta-de-plan-17.png',
					description: 'Respuestas diarias garantizadas 5 días a la semana.',
				},
			],
			events: [
				{
					name: 'Jose',
					start: 1620715500000,
					end: 1620715500000,
					timed: true,
					disable: true,
				},
			],
			dragEvent: null,
			dragStart: null,
			createEvent: null,
			createStart: null,
			extendOriginal: null,
			newEvent: null,
			psi: null,
		};
	},
	computed: {
		viewDate() {
			if (this.newEvent && this.picker)
				return `Seleccionaste el dia
					${moment(this.picker).format('ll')} 
					desde las
					${moment(this.newEvent.start).format('LT')}
					a las 
					${moment(this.newEvent.end).format('LT')}`;
			else return '';
		},
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
		startDrag({ event, timed }) {
			if (event && timed && !event.disable) {
				this.dragEvent = event;
				this.dragTime = null;
				this.extendOriginal = null;
			}
		},
		startTime(tms) {
			const mouse = this.toTime(tms);

			if (this.dragEvent && this.dragTime === null) {
				const start = this.dragEvent.start;

				this.dragTime = mouse - start;
			} else {
				this.createStart = this.roundTime(mouse);
				this.createEvent = {
					name: `Yo - ${this.user.name}`,
					color: 'success',
					start: this.createStart,
					end: this.createStart + 1800000,
					timed: true,
					disable: false,
				};
				if (!this.newEvent) {
					this.events.push(this.createEvent);
					this.newEvent = this.createEvent;
				}
			}
		},
		extendBottom(event) {
			if (event.disable) return;
			this.createEvent = event;
			this.createStart = event.start;
			this.extendOriginal = event.end;
		},
		mouseMove(tms) {
			const mouse = this.toTime(tms);

			if (this.dragEvent && this.dragTime !== null) {
				const start = this.dragEvent.start;
				const end = this.dragEvent.end;
				const duration = end - start;
				const newStartTime = mouse - this.dragTime;
				const newStart = this.roundTime(newStartTime);
				const newEnd = newStart + duration;

				this.dragEvent.start = newStart;
				this.dragEvent.end = newEnd;
			} else if (this.createEvent && this.createStart !== null) {
				const mouseRounded = this.roundTime(mouse, false);
				const min = Math.min(mouseRounded, this.createStart);
				const max = Math.max(mouseRounded, this.createStart);

				this.createEvent.start = min;
				this.createEvent.end = max;
			}
		},
		endDrag() {
			this.dragTime = null;
			this.dragEvent = null;
			this.createEvent = null;
			this.createStart = null;
			this.extendOriginal = null;
		},
		cancelDrag() {
			if (this.createEvent) {
				if (this.extendOriginal) {
					this.createEvent.end = this.extendOriginal;
				} else {
					const i = this.events.indexOf(this.createEvent);
					if (i !== -1) {
						this.events.splice(i, 1);
					}
				}
			}

			this.createEvent = null;
			this.createStart = null;
			this.dragTime = null;
			this.dragEvent = null;
		},
		roundTime(time, down = true) {
			const roundTo = 15; // minutes
			const roundDownTime = roundTo * 60 * 1000;

			return down
				? time - (time % roundDownTime)
				: time + (roundDownTime - (time % roundDownTime));
		},
		toTime(tms) {
			return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime();
		},
		changePicker(e) {
			if (e !== this.picker) this.resetEvent();
			this.picker = e;
		},
		resetEvent() {
			this.newEvent = null;
			this.events = [
				{
					name: 'Jose',
					start: 1620715500000,
					end: 1620715500000,
					timed: true,
					disable: true,
				},
			];
		},
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
