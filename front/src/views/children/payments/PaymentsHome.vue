<template>
	<div>
		<!-- appbar -->
		<appbar />
		<v-container>
			<v-row justify="center" align="center">
				<v-col cols="12">
					<div class="d-flex justify-center align-center">
						<v-btn
							:disabled="breakCrumbs == 0"
							icon
							color="primary"
							@click="() => (breakCrumbs -= 1)"
						>
							<v-icon size="48">mdi-chevron-left</v-icon>
						</v-btn>
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
						<v-btn
							icon
							:disabled="breakCrumbs == 3"
							color="primary"
							@click="() => (breakCrumbs += 1)"
						>
							<v-icon size="48">mdi-chevron-right</v-icon>
						</v-btn>
					</div>
				</v-col>
				<div v-if="breakCrumbs == 0" cols="12">
					<div class="text-center text-secondary mt-4 text-h4 font-weight-bold">
						Agenda la hora y día de tu consulta
					</div>
					<div class="text-center text-secondary text-h6 font-weight-bold">
						Agenda con total libertad cuando te resulte más conveniente.
					</div>
					<v-card
						class="mt-10"
						elevation="10"
						max-width="700"
						style="border-radius: 25px"
					>
						<v-card-text>
							<v-row>
								<v-col cols="6">
									<v-date-picker
										full-width
										v-model="picker"
										@change="() => resetEvent()"
										locale="es"
									></v-date-picker>
								</v-col>
								<v-col cols="6">
									<v-sheet height="400">
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
												<div
													:class="
														!event.disable ? 'v-event-draggable' : ''
													"
													v-html="eventSummary()"
												></div>
												<div
													:class="
														!event.disable ? 'v-event-drag-bottom' : ''
													"
													@mousedown.stop="extendBottom(event)"
												></div>
											</template>
										</v-calendar>
									</v-sheet>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</div>
				<v-col cols="12" v-if="breakCrumbs == 1">
					<v-row>
						<v-col
							cols="12"
							v-for="(el, j) in plans"
							:key="j"
							class="d-flex justify-center"
						>
							<v-card>
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
										<v-col>
											<span class="text-h3">{{ el.price }} $</span>
											<span class="text-h6 text--secondary"
												>/{{ el.mode }}</span
											>
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
											<v-avatar color="grey" size="100"> </v-avatar>
											<v-btn class="mt-3" color="primary" text>
												Seleccionar plan
											</v-btn>
										</v-col>
										<v-col cols="12">
											<v-btn
												text
												color="primary"
												@click="() => (el.expandCard = !el.expandCard)"
											>
												{{ el.expandCard ? 'Ver menos' : 'Ver más' }}
											</v-btn>
										</v-col>
										<v-expand-transition>
											<v-col v-if="el.expandCard" cols="12">
												<v-list three-line max-width="500">
													<v-list-item
														v-for="(deal, k) in el.deals"
														:key="k"
														class="elevation-1 ma-2"
													>
														<v-list-item-content>
															<v-list-item-title>
																{{ deal.lapse }} de terapia ({{
																	deal.time
																}}) + ${{ deal.price }}
															</v-list-item-title>
															<v-list-item-subtitle>
																Secondary line text Lorem ipsum
																dolor sit amet,
															</v-list-item-subtitle>
															<v-list-item-subtitle>
																consectetur adipiscing elit.
															</v-list-item-subtitle>
														</v-list-item-content>
														<v-list-item-action>
															<v-btn
																fab
																x-small
																depressed
																color="grey"
															>
															</v-btn>
														</v-list-item-action>
													</v-list-item>
												</v-list>
											</v-col>
										</v-expand-transition>
									</v-row>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
					<div class="d-flex justify-space-between">
						<v-btn x-large text color="primary" @click="breakCrumbs = 0">
							<v-icon left>mdi-chevron-left</v-icon>
							Atras
						</v-btn>
						<v-btn x-large text color="primary" @click="breakCrumbs = 2">
							Siguiente
							<v-icon right>mdi-chevron-right</v-icon>
						</v-btn>
					</div>
				</v-col>
				<!-- <v-col cols="12" v-for="(el, j) in plans" :key="j" class="d-flex justify-center">
					<v-card>
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
								<v-col>
									<span class="text-h3">{{ el.price }} $</span>
									<span class="text-h6 text--secondary">/{{ el.mode }}</span>
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
									<v-avatar color="grey" size="100"> </v-avatar>
									<v-btn class="mt-3" color="primary" text>
										Seleccionar plan
									</v-btn>
								</v-col>
								<v-col cols="12">
									<v-btn
										text
										color="primary"
										@click="() => (el.expandCard = !el.expandCard)"
									>
										{{ el.expandCard ? 'Ver menos' : 'Ver más' }}
									</v-btn>
								</v-col>
								<v-expand-transition>
									<v-col v-if="el.expandCard" cols="12">
										<v-list three-line max-width="500">
											<v-list-item
												v-for="(deal, k) in el.deals"
												:key="k"
												class="elevation-1 ma-2"
											>
												<v-list-item-content>
													<v-list-item-title>
														{{ deal.lapse }} de terapia ({{
															deal.time
														}}) + ${{ deal.price }}
													</v-list-item-title>
													<v-list-item-subtitle>
														Secondary line text Lorem ipsum dolor sit
														amet,
													</v-list-item-subtitle>
													<v-list-item-subtitle>
														consectetur adipiscing elit.
													</v-list-item-subtitle>
												</v-list-item-content>
												<v-list-item-action>
													<v-btn fab x-small depressed color="grey">
													</v-btn>
												</v-list-item-action>
											</v-list-item>
										</v-list>
									</v-col>
								</v-expand-transition>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" class="text-center">
					<v-btn color="primary" style="border-radius: 10px">Continuar con el pago</v-btn>
				</v-col>
			</v-row>
			<v-row justify="center">
				<v-col cols="5">
					<v-card>
						<v-card-text>
							<div class="my-3">Lorem ipsum dolor sit</div>
							<v-text-field label="Ingresar codigo" dense outlined hide-details>
								<template v-slot:append-outer>
									<v-btn small color="primary" class="px-10">
										Aplicar
									</v-btn>
								</template>
							</v-text-field>
						</v-card-text>
						<v-list>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title class="subtitle-2">
										Lorem ipsum <span class="primary--text">dolor sit</span>
									</v-list-item-title>
									<v-list-item-subtitle class="title font-weight-bold">
										Carolina Fettke
									</v-list-item-subtitle>
								</v-list-item-content>
								<v-list-item-avatar size="100" class="ml-4">
									<v-btn
										color="grey"
										class="elevation-0"
										fab
										width="100"
										height="100"
									></v-btn>
								</v-list-item-avatar>
							</v-list-item>
						</v-list>
						<v-card-text>
							<div class="caption">
								Lorem ipsum <span class="primary--text">dolor sit</span>
							</div>
							<div class="title font-weight-bold">
								Lorem ipsum dolor sit amet, con
							</div>
							<div class="subtitle-1 my-2">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
								nonummy nibh ipsum dolor sit amet, consec-tetuer adipiscing elit,
								sed diam nonummy nibh Lorem ipsum dolor sit amet, consectetuer
								adipiscing elit, sed diam nonummy nibh ipsum dolor
							</div>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="5">
					<v-card>
						<v-card-text>
							<v-btn color="primary" block style="border-radius: 10px">
								Continuar con el pago
							</v-btn>
							<div class="caption my-4 text-center">
								Lorem ipsum dolor sit amet, consectetuer
							</div>
							<div class=" font-weight-bold">
								Lorem ipsum dolor sit amet,
							</div>
							<div>
								Lorem ipsum dolor sit amet, consectetuer adipis
							</div>
						</v-card-text>
						<v-divider></v-divider>
						<v-list>
							<v-list-item>
								<v-list-item-content class="font-weight-bold headline">
									Lorem ipsum dolor sit
								</v-list-item-content>
								<v-list-item-avatar size="100" class="font-weight-bold headline">
									14$
								</v-list-item-avatar>
							</v-list-item>
						</v-list>
						<v-card-text>
							<div class="caption text-center">
								Lorem ipsum dolor sit amet, consectetuer adipis-cing elit, sed diam
								nonummy nibh ipsum dolor
							</div>
						</v-card-text>
						<v-card-text>
							<v-avatar color="grey" size="70" class="ma-2"></v-avatar>
							<v-avatar color="grey" size="70" class="ma-2"></v-avatar>
							<v-avatar color="grey" size="70" class="ma-2"></v-avatar>
							<v-avatar color="grey" size="70" class="ma-2"></v-avatar>
							<v-avatar color="grey" size="70" class="ma-2"></v-avatar>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
			<v-row justify="center">
				<v-col cols="12" sm="9" md="8" lg="6">
					<v-card>
						<v-card-text>
							<v-text-field dense outlined hide-details readonly value="Pago total">
								<template v-slot:append>
									<span class="font-weight-bold"> 312 $</span>
								</template>
							</v-text-field>
						</v-card-text>
						<v-card-text>
							<div class="font-weight-bold headline">Lorem ipsum dolor sit</div>
							<div class="body-1">
								Lorem ipsum <span class="primary--text">dolor sit</span>
							</div>
							<v-text-field
								class="my-6"
								outlined
								dense
								hide-details
								label="Número de tarjeta"
							>
								<template v-slot:append>
									<span class="text--secondary"> MM/AA CVC</span>
								</template>
							</v-text-field>
							<v-btn color="primary" block style="border-radius: 10px" class="my-4">
								Confirmar pago
							</v-btn>
							<div class="text-center body-1">
								Lorem ipsum <span class="primary--text">dolor sit</span>
							</div>
						</v-card-text>
						<v-card-text class="text-center">
							<v-avatar color="grey" size="70" class="ma-2"></v-avatar>
							<v-avatar color="grey" size="70" class="ma-2"></v-avatar>
							<v-avatar color="grey" size="70" class="ma-2"></v-avatar>
						</v-card-text>
					</v-card>
				</v-col> -->
			</v-row>
		</v-container>
	</div>
</template>

<script>
import Appbar from '@/components/ui/Appbar.vue';
import { mapGetters } from 'vuex';
export default {
	name: 'PaymentsHome',
	components: {
		Appbar,
	},
	data() {
		return {
			timePicker: '',
			picker: '',
			breakCrumbs: 0,
			plans: [
				{
					deals: [
						{ time: '30 min', lapse: '1 mes', price: 20 },
						{ time: '30 min', lapse: '2 meses', price: 40 },
						{ time: '30 min', lapse: '3 meses', price: 80 },
					],
					expandCard: false,
					recommended: true,
					mode: 'week',
					title: 'Lorem ipsum dolor sit amet, consec',
					subtitle: 'Lorem ipsum dolor sit amet, consecte',
					description:
						'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam no-nummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper ',
				},
				{
					deals: [
						{ time: '30 min', lapse: '1 mes', price: 20 },
						{ time: '30 min', lapse: '2 meses', price: 40 },
						{ time: '30 min', lapse: '3 meses', price: 80 },
					],
					recommended: false,
					expandCard: false,
					price: 9,
					mode: 'week',
					title: 'Lorem ipsum dolor sit amet, consec',
					subtitle: 'Lorem ipsum dolor sit amet, consecte',
					description:
						'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam no-nummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper ',
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
		};
	},
	computed: {
		...mapGetters({ user: 'User/user' }),
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
