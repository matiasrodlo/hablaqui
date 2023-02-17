<template>
	<div>
		<card-onboarding
			v-if="stepOnboarding && stepOnboarding.title === 'Sesiones'"
			style="position: absolute; top: 190px; left: 10px; z-index: 3"
			arrow="arrow-left"
			:next="
				() => {
					setStepLinks(1);
					$router.push({ name: 'dashboard-pagos' });
					return {
						title: 'Pagos',
						card: {
							title: 'Pagos',
							description:
								'Lleve el historial de sus ingresos en piloto automático. Todo organizado y al día',
							link: '',
							route: 'dashboard-chat',
						},
						route: 'dashboard-pagos',
					};
				}
			"
		/>
		<v-container fluid style="height: 100vh; max-width: 1200px; position: relative">
			<card-onboarding
				v-if="stepOnboarding && stepOnboarding.title === 'Nuevo evento'"
				arrow="arrow-right"
				style="z-index: 3; position: absolute; top: 40%; left: 2%"
				:next="
					() => {
						$router.push({ name: 'dashboard-pagos' });
						return {
							title: 'Pagos',
							card: {
								title: 'Pagos',
								description:
									'Lleve el historial de sus ingresos en piloto automático. Todo organizado y al día',
								link: '',
								route: 'dashboard-chat',
							},
							route: 'dashboard-pagos',
						};
					}
				"
			/>
			<appbar class="hidden-sm-and-down" title="Sesiones" />
			<v-row justify="center" style="height: calc(100vh - 110px)">
				<v-col
					cols="12"
					:md="$auth.$state.user.role === 'user' ? '10' : '12'"
					:style="
						stepOnboarding && stepOnboarding.title === 'Nuevo evento'
							? 'z-index: 2'
							: ''
					"
				>
					<div
						v-if="$auth.$state.user.role === 'user'"
						class="hidden-md-and-up"
						style="margin-top: 10px"
					>
						<div class="d-flex justify-center">
							<div>
								<div class="body-2 text-center text--secondary font-weight-bold">
									Nº de Sesiones
								</div>
								<div
									v-if="plan"
									class="text-center text--secondary font-weight-bold my-1"
								>
									{{ appoinmentSessions }}/{{ totalSessions }}
								</div>
								<div
									v-else
									class="text-center text--secondary font-weight-bold my-1"
								>
									0/0
								</div>
							</div>
							<v-divider vertical class="mx-8"></v-divider>
							<div>
								<div class="body-2 text-center text--secondary font-weight-bold">
									Próxima sesión
								</div>
								<div
									v-if="nextSesion"
									class="text-center text--secondary font-weight-bold my-1"
								>
									{{ nextSesion }}
								</div>
								<v-btn
									v-else
									text
									class="primary--text font-weight-bold body-1 pointer"
									@click="acquire"
								>
									Adquirir
								</v-btn>
							</div>
						</div>
					</div>
					<v-sheet class="mt-4 mt-md-0">
						<v-toolbar flat>
							<v-btn class="mr-4" color="primary" depressed @click="setToday">
								Hoy
							</v-btn>
							<v-btn icon x-large @click="prev">
								<icon :icon="mdiChevronLeft" color="grey lighten-1" x-large />
							</v-btn>
							<v-btn icon small x-large @click="next">
								<icon :icon="mdiChevronRight" color="grey lighten-1" x-large />
							</v-btn>
							<v-toolbar-title
								v-if="$refs.calendar"
								class="text--secondary text-capitalize"
							>
								{{ $refs.calendar.title }}
							</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-menu bottom right>
								<template #activator="{ on, attrs }">
									<v-btn color="grey lighten-1" outlined v-bind="attrs" v-on="on">
										<span>{{ typeToLabel[type] }}</span>
										<icon :icon="mdiMenuDown" color="grey lighten-1" right />
									</v-btn>
								</template>
								<v-list>
									<v-list-item @click="type = 'day'">
										<v-list-item-title class="text--secondary"
											>Dia
										</v-list-item-title>
									</v-list-item>
									<v-list-item @click="type = 'week'">
										<v-list-item-title class="text--secondary"
											>Semana
										</v-list-item-title>
									</v-list-item>
									<v-list-item @click="type = 'month'">
										<v-list-item-title class="text--secondary"
											>Mes
										</v-list-item-title>
									</v-list-item>
									<v-list-item @click="type = '4day'">
										<v-list-item-title class="text--secondary"
											>4 dias
										</v-list-item-title>
									</v-list-item>
								</v-list>
							</v-menu>
						</v-toolbar>
					</v-sheet>
					<v-sheet height="600px">
						<v-calendar
							id="calendar-agenda"
							ref="calendar"
							v-model="focus"
							:events="events"
							:now="today"
							:type="type"
							color="primary"
							locale="es"
							:event-color="getEventColor"
							:event-text-color="getEventTextColor"
							@click:event="showEvent"
							@click:more="viewDay"
							@click:day="addAppointment"
							@click:date="addAppointment"
						>
						</v-calendar>
						<v-menu
							v-model="selectedOpen"
							:activator="selectedElement"
							:close-on-content-click="false"
							offset-x
						>
							<v-card color="grey lighten-4" flat min-width="350px">
								<v-card-text>
									<v-row justify="space-between">
										<v-col class="body-1 secondary--text" cols="7">
											{{ selectedEvent.name }}
										</v-col>
									</v-row>
								</v-card-text>
								<v-card-text>
									<icon :icon="mdiClockOutline" color="grey lighten-1" left />
									<span>{{ setSubtitle(selectedEvent.start) }}</span>
								</v-card-text>
								<v-divider></v-divider>
								<v-card-actions
									v-if="
										selectedEvent.title !== 'compromiso privado' &&
										selectedEvent.statusPlan !== 'pending'
									"
								>
									<v-btn
										v-if="
											selectedEvent.status === 'pending'
											// || selectedEvent.status === 'upnext'
										"
										:href="selectedEvent.url"
										target="_blank"
										color="primary"
										text
									>
										Ir a videollamada
									</v-btn>
									<v-spacer></v-spacer>
									<v-btn
										v-if="
											selectedEvent.status === 'pending'
											// || selectedEvent.status === 'upnext'
										"
										text
										@click="() => openDialog(selectedEvent)"
									>
										Reprogramar
									</v-btn>
									<v-chip
										v-if="selectedEvent.status === 'success'"
										color="success"
										>Completado</v-chip
									>
									<v-chip
										v-if="selectedEvent.status === 'canceled'"
										color="error"
									>
										Cancelado
									</v-chip>
								</v-card-actions>
								<v-card-actions
									v-if="selectedEvent.statusPlan === 'pending'"
									class="text--secondary body-2"
								>
									Pendiente de pago
								</v-card-actions>
								<v-card-actions
									v-if="selectedEvent.title === 'compromiso privado'"
									class="text--secondary body-2"
								>
									<v-spacer></v-spacer>
									<v-btn text @click="() => cancelOneSession(selectedEvent)">
										Quitar
									</v-btn>
								</v-card-actions>
								<v-dialog
									v-if="dialog"
									v-model="dialog"
									max-width="600"
									transition="dialog-top-transition"
									@click:outside="selectedOpen = false"
								>
									<v-card rounded="xl">
										<v-card-text
											class="text-center primary white--text text-h5 py-3"
										>
											<div class="body-1 font-weight-bold text-center">
												Reprogramar tu sesion
											</div>
										</v-card-text>
										<v-card-text class="px-0 px-sm-2 px-md-4">
											<calendar
												:id-spec="selectedEvent.idSpecialist"
												:set-date="e => reschedule(e)"
												title-button="Reprogramar sesión"
												type="reschedule"
												:loading-btn="loagindReschedule"
											/>
										</v-card-text>
									</v-card>
								</v-dialog>
							</v-card>
						</v-menu>
						<v-dialog
							v-if="dialogAppointment"
							v-model="dialogAppointment"
							max-width="650"
							class="rounded-xl"
							transition="dialog-top-transition"
							@click:outside="closeDialog"
						>
							<v-card width="650" rounded="xl">
								<v-card-text
									class="d-flex text-center primary white--text text-h5 py-3"
								>
									<v-btn
										v-if="stepAddAppoinment != 0"
										style="flex: 0"
										icon
										@click="() => (stepAddAppoinment -= 1)"
									>
										<icon :icon="mdiChevronLeft" x-large color="white" />
									</v-btn>
									<div style="flex: 1" class="body-1 font-weight-bold pt-2">
										{{ dialogNewUser ? 'Nuevo Consultante' : 'Agendar' }}
									</div>
									<v-btn style="flex: 0" icon @click="closeDialog">
										<icon :icon="mdiClose" color="white" />
									</v-btn>
								</v-card-text>
								<template v-if="stepAddAppoinment == 0">
									<v-card-text v-if="dialogNewUser" class="pt-3">
										<v-row>
											<v-col cols="6">
												<v-text-field
													v-model="form.name"
													type="text"
													dense
													outlined
													label="Nombre"
													hide-details="auto"
													:error-messages="nameErrors"
												>
												</v-text-field>
											</v-col>
											<v-col cols="6">
												<v-text-field
													v-model="form.lastName"
													type="text"
													dense
													outlined
													label="Apellido"
													hide-details="auto"
													:error-messages="lastNameErrors"
												>
												</v-text-field>
											</v-col>
											<v-col cols="6">
												<v-text-field
													v-model="form.rut"
													hide-details="auto"
													type="text"
													dense
													outlined
													label="Rut"
												>
												</v-text-field>
											</v-col>
											<v-col cols="6">
												<v-text-field
													v-model="form.email"
													type="email"
													dense
													hide-details="auto"
													outlined
													label="email"
													:error-messages="emailErrors"
												>
												</v-text-field>
											</v-col>
											<v-col cols="6">
												<v-text-field
													v-model="form.phone"
													type="text"
													dense
													hide-details="auto"
													outlined
													prefix="+56"
													label="Teléfono"
												>
												</v-text-field>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" class="text-center">
												<v-btn
													:disabled="loadingCreatedUser"
													text
													@click="goBack"
												>
													Atras
												</v-btn>
												<v-btn
													:loading="loadingCreatedUser"
													rounded
													color="primary"
													@click="submitUser"
												>
													Agregar
												</v-btn>
											</v-col>
										</v-row>
									</v-card-text>
									<v-card-text v-else class="pt-2">
										<v-row>
											<v-col cols="6">
												<v-select
													v-model="typeSession"
													:items="[
														{
															text: 'Sesión online',
															value: 'sesion online',
														},
														{
															text: 'Sesión presencial',
															value: 'sesion presencial',
														},
														{
															text: 'Compromiso privado',
															value: 'compromiso privado',
														},
													]"
													dense
													hide-details
													label="Tipo de agendamiento"
													outlined
													@change="
														() => {
															valueSession = null;
															client = null;
														}
													"
												></v-select>
											</v-col>
											<v-col
												v-show="typeSession !== 'compromiso privado'"
												cols="6"
											>
												<v-text-field
													:value="valueSession"
													label="Valor"
													dense
													hide-details
													outlined
													type="number"
													suffix="CLP"
													@input="setPrice"
												></v-text-field>
											</v-col>
											<v-col
												v-show="typeSession !== 'compromiso privado'"
												cols="6"
											>
												<v-autocomplete
													v-model="client"
													:items="
														clients.map(item => ({
															...item,
															text: `${item.name} ${
																item.lastName ? item.lastName : ''
															}`,
															value: item._id,
														}))
													"
													dense
													hide-details
													label="Nombre"
													outlined
												>
													<template #item="{ item }">
														<div class="my-2">
															<div class="body-2">
																{{
																	`${item.name} ${
																		item.lastName
																			? item.lastName
																			: ''
																	}`
																}}
															</div>
															<div style="font-size: 10px">
																{{ item.email }}
															</div>
														</div>
													</template>
													<template #selection="{ item }">
														<div class="body-2">
															{{
																`${item.name} ${
																	item.lastName
																		? item.lastName
																		: ''
																}`
															}}
														</div>
													</template>
												</v-autocomplete>
											</v-col>
											<v-col
												v-if="typeSession !== 'compromiso privado'"
												class="d-flex align-center"
												cols="6"
											>
												<span class="pointer" @click="dialogNewUser = true">
													<v-btn
														fab
														depressed
														color="primary"
														style="width: 20px; height: 20px"
													>
														<icon :icon="mdiPlus" color="white" small />
													</v-btn>
												</span>
											</v-col>
											<v-col class="text-center py-2" cols="12">
												<v-btn
													:disabled="validatenewCustomSession"
													depressed
													color="primary"
													rounded
													@click="setStepAddAppoinment"
												>
													Continuar
												</v-btn>
											</v-col>
										</v-row>
									</v-card-text>
								</template>
								<template v-if="stepAddAppoinment == 1">
									<calendar
										:id-spec="$auth.user.specialist"
										:set-date="e => newCustomSession(e)"
										title-button="Agendar"
										:loading-btn="loadingSession"
										class="pb-4"
									/>
								</template>
								<template v-if="stepAddAppoinment == 2">
									<v-card-text
										class="text-center py-16 primary--text font-weight-medium"
									>
										Notificamos vía correo electronico al consultate sobre el
										agendamiento y adjuntamos un enlace de pago
									</v-card-text>
								</template>
							</v-card>
						</v-dialog>
						<v-row justify="end" class="text-md-right pt-4">
							<v-col
								v-if="
									$auth.$state.user.role === 'specialist' ||
									$auth.$state.user.role === 'user'
								"
								cols="12"
								sm="6"
								md="3"
							>
								<v-btn text @click="() => setFilter('sesion online')">
									<v-avatar size="20" color="primary">
										<icon small :icon="mdiCheck" color="white" />
									</v-avatar>
									<span class="ml-1 caption">Sesiones online</span>
								</v-btn>
							</v-col>
							<v-col
								v-if="
									$auth.$state.user.role === 'specialist' ||
									$auth.$state.user.role === 'user'
								"
								cols="12"
								sm="6"
								md="3"
							>
								<v-btn text depressed @click="() => setFilter('sesion presencial')">
									<v-avatar color="#00c6ea" size="20">
										<icon small :icon="mdiCheck" color="white" />
									</v-avatar>
									<span class="ml-1 caption">Sesiones presenciales</span>
								</v-btn>
							</v-col>
							<v-col
								v-if="$auth.$state.user.role === 'specialist'"
								cols="12"
								sm="6"
								md="3"
							>
								<v-btn text @click="() => setFilter('compromiso privado')">
									<v-avatar color="#efb908" size="20">
										<icon small :icon="mdiCheck" color="white" />
									</v-avatar>
									<span class="ml-1 caption">Compromiso privado</span>
								</v-btn>
							</v-col>
							<v-col
								v-if="
									$auth.$state.user.role === 'specialist' ||
									$auth.$state.user.role === 'user'
								"
								cols="12"
								sm="6"
								md="3"
							>
								<v-btn text @click="() => setFilter('pending')">
									<v-avatar color="#78909C" size="20">
										<icon small :icon="mdiCheck" color="white" />
									</v-avatar>
									<span class="ml-1 caption"> Pendiente de pago </span>
								</v-btn>
							</v-col>
						</v-row>
					</v-sheet>
				</v-col>
				<v-col
					v-if="$auth.$state.user.role === 'user'"
					md="2"
					class="mt-16 hidden-sm-and-down text-center"
				>
					<div class="body-2 text-center text--secondary font-weight-bold">
						Nº de Sesiones
					</div>
					<div
						v-if="plan"
						class="headline text-center text--secondary font-weight-bold my-1"
					>
						{{ appoinmentSessions }}/{{ totalSessions }}
					</div>
					<div v-else class="headline text-center text--secondary font-weight-bold my-1">
						0/0
					</div>
					<div class="body-2 text-center text--secondary font-weight-bold mt-16">
						Próxima sesión
					</div>
					<div
						v-if="nextSesion"
						class="headline text-center text--secondary font-weight-bold my-1"
					>
						{{ nextSesion }}
					</div>
					<v-btn v-else text @click="acquire">
						<span class="body-1 primary--text font-weight-bold">Adquirir</span>
					</v-btn>
				</v-col>
			</v-row>
			<v-dialog
				v-if="dialogSearchNow"
				v-model="dialogSearchNow"
				max-width="300"
				class="rounded-xl"
				transition="dialog-top-transition"
			>
				<v-card rounded="xl">
					<v-card-text class="text-center">
						<small class="py-2 text--secondary"> Bienestar en cualquier momento </small>
					</v-card-text>
					<v-card-text class="text-center">
						<v-btn color="primary" rounded to="/evaluacion/">Comenzar</v-btn>
					</v-card-text>
				</v-card>
			</v-dialog>
			<v-dialog
				v-if="dialogHasSessions"
				v-model="dialogHasSessions"
				max-width="600"
				class="rounded-xl"
				transition="dialog-top-transition"
			>
				<v-card rounded="xl">
					<v-card-text class="d-flex text-center primary white--text pt-2 pb-0">
						<div class="body-1 font-weight-bold text-center" style="flex: 1">
							Agendar
						</div>
						<v-btn style="flex: 0" icon @click="() => (dialogHasSessions = false)">
							<icon :icon="mdiClose" color="white" />
						</v-btn>
					</v-card-text>
					<v-card-text>
						<v-row>
							<!-- <v-col class="font-weight-medium pt-6 pb-0" cols="12">
								Tipo de evento
							</v-col> -->
							<v-col cols="12">
								<!-- <v-select
									v-model="typeSession"
									solo
									flat
									:items="[
										'Sesión online',
										'Sesión presencial',
										'Compromiso privado',
									]"
									dense
									hide-details
									label="Seleccione"
								></v-select> -->
								<v-text-field
									readonly
									disabled
									:value="`Sesión ${appoinmentSessions + 1}/${totalSessions}`"
									hide-details="auto"
									type="text"
									class="mt-2"
									dense
									outlined
								>
								</v-text-field>
							</v-col>
							<v-col>
								<calendar
									:id-spec="plan.specialist"
									:set-date="e => newSession(e)"
									title-button="Agendar"
									:loading-btn="loadingSession"
								/>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-dialog>
			<v-dialog
				v-if="dialogWithoutSessions && !overlay"
				v-model="dialogWithoutSessions"
				:max-width="maxWidth"
				transition="dialog-top-transition"
			>
				<v-card rounded="xl" min-height="200">
					<v-card-text class="d-flex text-center primary white--text text-h5 py-3">
						<v-btn v-if="step != 0" style="flex: 0" icon @click="() => (step -= 1)">
							<icon :icon="mdiChevronLeft" x-large color="white" />
						</v-btn>
						<div style="flex: 1" class="body-1 font-weight-bold text-center">
							Agenda la hora y el día de tu consulta
						</div>
					</v-card-text>
					<v-card-text v-if="step == 0" class="px-0 px-sm-2 px-md-4">
						<calendar
							v-if="specialist"
							:id-spec="specialist._id"
							:set-date="e => setSchedule(e)"
							title-button="Continuar"
						/>
					</v-card-text>
				</v-card>
			</v-dialog>
		</v-container>
		<v-overlay z-index="1" :value="overlay">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
	</div>
</template>

<script>
import dayjs from 'dayjs';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import {
	mdiCheck,
	mdiChevronLeft,
	mdiChevronRight,
	mdiClockOutline,
	mdiClose,
	mdiMenuDown,
	mdiPlus,
} from '@mdi/js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import badMutable from 'dayjs/plugin/badMutable';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es';
dayjs.extend(customParseFormat);
dayjs.extend(badMutable);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.tz.setDefault('America/Santiago');

/** * Pagina de agenda */

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Icon: () => import('~/components/Icon'),
		Calendar: () => import('~/components/Calendar.vue'),
	},
	mixins: [validationMixin],
	layout: 'dashboard',
	middleware: ['auth'],
	data: () => ({
		step: 0,
		valueSession: 0,
		overlay: false,
		form: null,
		loadingCreatedUser: false,
		typeSession: 'Sesión online',
		mdiCheck,
		mdiPlus,
		mdiClose,
		mdiChevronLeft,
		mdiChevronRight,
		mdiMenuDown,
		mdiClockOutline,
		client: null,
		dialog: false,
		focus: '',
		type: 'month',
		typeToLabel: {
			month: 'Mes',
			week: 'Semana',
			day: 'Dia',
			'4day': '4 dias',
		},
		selectedEvent: {
			details: '',
			end: '',
			idSpecialist: '',
			idUser: '',
			name: '',
			paidToSpecialist: false,
			sessionNumber: '',
			sessionsId: '',
			start: '',
			status: '',
			url: '',
			_id: '',
		},
		selectedElement: null,
		selectedOpen: false,
		today: dayjs.tz().format('YYYY-MM-DD'),
		events: [],
		names: ['Sescion con', 'ocupado'],
		event: null,
		dialogAppointment: false,
		dialogNewUser: false,
		idClient: null,
		dialogSearchNow: false,
		dialogHasSessions: false,
		dialogWithoutSessions: false,
		newEvent: null,
		specialist: null,
		filterTypeSession: '',
		loadingSession: false,
		loagindReschedule: false,
		stepAddAppoinment: 0,
		hours: [
			'00:00',
			'1:00',
			'2:00',
			'3:00',
			'4:00',
			'5:00',
			'6:00',
			'7:00',
			'8:00',
			'9:00',
			'10:00',
			'11:00',
			'12:00',
			'13:00',
			'14:00',
			'15:00',
			'16:00',
			'17:00',
			'18:00',
			'19:00',
			'20:00',
			'21:00',
			'22:00',
			'23:00',
		],
		plan: null,
		appoinmentSessions: 0,
		totalSessions: 0,
	}),
	computed: {
		/**
		 * Retorna la proxima sesion
		 */
		nextSesion() {
			// Obtenemos unarray solamente con las fechas de sesiones del plan
			const dates = this.events.flatMap(session => session.date);
			// Encontramos la session siguiente
			const allDates = dates.sort((a, b) => {
				return dayjs
					.tz(dayjs(a, 'MM/DD/YYYY HH:mm'))
					.diff(dayjs.tz(dayjs(b, 'MM/DD/YYYY HH:mm')));
			});
			const date = allDates.find(item =>
				dayjs(item, 'MM/DD/YYYY HH:mm').isSameOrAfter(dayjs())
			);
			if (date) {
				return dayjs(date, 'MM/DD/YYYY HH:mm').format('DD/MM/YY');
			}
			return '';
		},
		/**
		 * Ancho maximo de la caja
		 */
		maxWidth() {
			if (this.step === 0) return '700';
			if (this.step === 1) return '900';
			else return '800';
		},
		/**
		 * validacion de email
		 */
		emailErrors() {
			const errors = [];
			if (!this.$v.form.email.$dirty) return errors;
			!this.$v.form.email.required && errors.push('Se requiere correo electrónico');
			!this.$v.form.email.email && errors.push('Escriba un correo electrónico valido');
			return errors;
		},
		/**
		 * Validacion de nombre
		 */
		nameErrors() {
			const errors = [];
			if (!this.$v.form.name.$dirty) return errors;
			!this.$v.form.name.required && errors.push('Se requiere nombre');
			return errors;
		},
		/**
		 * Validacion de apellido
		 */
		lastNameErrors() {
			const errors = [];
			if (!this.$v.form.lastName.$dirty) return errors;
			!this.$v.form.lastName.required && errors.push('Se requiere apellido');
			return errors;
		},
		/**
		 * Validacion de la nueva sesion personalizada
		 */
		validatenewCustomSession() {
			if (this.typeSession === 'compromiso privado') return false;
			return !this.client || !this.typeSession || !this.valueSession;
		},
		/**
		 * Array de sesiones filtradas
		 */
		sessions() {
			const copyArray = [...this.allSessions];
			if (this.filterTypeSession)
				return copyArray.filter(
					sesion =>
						sesion.title === this.filterTypeSession ||
						sesion.statusPlan === this.filterTypeSession
				);
			else return copyArray;
		},
		...mapGetters({
			allSessions: 'Specialist/sessions',
			clients: 'Specialist/clients',
			plans: 'User/plan',
			stepOnboarding: 'User/step',
		}),
	},
	watch: {
		/**
		 * listeer de clientes
		 */
		clients() {
			if (this.idClient) {
				this.idClient = null;
				this.client = this.clients
					.map(item => ({
						...item,
						text: `${item.name} ${item.lastName ? item.lastName : ''}`,
					}))
					.find(item => item._id === this.$route.query.client);
			}
		},
		/**
		 * listener de sesiones
		 */
		sessions(newVal) {
			if (newVal.length) this.events = this.sessions;
		},
	},
	created() {
		// resetea el formulario
		this.resetForm();
		this.dialogAppointment = this.$route.query.dialog ? !!this.$route.query.dialog : false;
		this.idClient = this.$route.query.client;
	},
	async mounted() {
		// Inicial fetch
		await this.initFetch();
	},
	methods: {
		/**
		 * Obtienes los datos pricipales necesarios para la vista
		 */
		async initFetch() {
			if (this.plans) {
				this.plan = this.plans.sortedPlans.length > 0 ? this.plans.sortedPlans[0] : null;
				this.totalSessions = this.plans.totalSessions;
				this.appoinmentSessions = this.plans.appoinmentSessions;
			}
			if (this.$auth.$state.user.role === 'specialist' && !this.$auth.$state.user.specialist)
				return null;
			this.overlay = true;
			dayjs.locale('es');
			await this.$auth.fetchUser();
			if (this.$auth.$state.user.role === 'user' && this.plan) {
				await this.getSessions({
					idUser: this.plan.user,
				});
			}
			if (
				this.$auth.$state.user.role === 'specialist' &&
				this.$auth.$state.user.sessions.length
			) {
				await this.getSessions({
					idUser: this.$auth.$state.user.specialist,
				});
			}
			await this.successPayment();
			this.$refs.calendar?.checkChange();
			this.overlay = false;
		},
		/**
		 * Retorna string con un color del evento
		 */
		getEventColor(event) {
			if (event.statusPlan === 'pending') return 'blue-grey lighten-1';
			if (event.title === 'compromiso privado') return '#efb908';
			if (event.title === 'sesion presencial') return '#00c6ea';
			return 'primary';
		},
		/**
		 * Retorna string para el color de texto
		 */
		getEventTextColor(event) {
			//	if (event.statusPlan === 'pending') return 'error';
			return 'white';
		},
		/**
		 * Registra un nuevo usuario y obtiene la lsta de clientes actualizada
		 */
		async submitUser() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loadingCreatedUser = true;
				await this.registerUser(this.form);
				await this.getClients(this.$auth.$state.user.specialist);
				this.loadingCreatedUser = false;
				this.goBack();
			}
		},
		/**
		 * reinicio del formulario
		 */
		resetForm() {
			this.form = {
				name: '',
				lastName: '',
				rut: '',
				phone: '',
				email: '',
			};
		},
		/**
		 * Regresa atras, router
		 */
		goBack() {
			this.dialogNewUser = false;
			this.resetForm();
			this.$v.$reset();
		},
		/**
		 * Reagendar evento
		 */
		async reschedule(item) {
			this.loagindReschedule = true;
			const newDate = { date: item.date, hour: item.start };
			await this.setReschedule({
				sessionsId: this.selectedEvent.sessionsId,
				id: this.selectedEvent._id,
				newDate,
			});

			this.event = null;
			this.selectedOpen = false;
			this.loagindReschedule = false;
			this.dialog = false;
		},
		/**
		 * Establecer evento
		 */
		setSchedule(item) {
			this.newEvent = item;
			this.$router.push(
				`/especialistas/pagos/?username=${this.specialist.username}&date=${item.date}&start=${item.start}&end=${item.end}`
			);
		},
		/**
		 * Establecer nuevo plan
		 */
		setNewPlan(newPlan) {
			this.newPlan = newPlan;
			this.step = 2;
		},
		/**
		 * Abrir modal
		 */
		openDialog(item) {
			this.event = item;
			this.dialog = true;
		},
		/**
		 * Vista del tipo diario
		 */
		viewDay({ date }) {
			this.focus = date;
			this.type = 'day';
		},
		/** pasos onboarding */
		setStepAddAppoinment() {
			if (this.validatenewCustomSession) return alert('Debe completar los campos');
			this.stepAddAppoinment = 1;
		},
		/**
		 * Agregar nuevo appointment
		 */
		async addAppointment({ date }) {
			if (this.$auth.user.role === 'user') {
				// Sin especialista - sin sesiones
				this.dialogSearchNow = !this.plan || (this.plan && !this.plan.specialist);

				// con especialista - con sesiones por agendar
				this.dialogHasSessions =
					this.plan && this.plan.specialist && this.plan.remainingSessions > 0;
				// con especialista - sin sesiones por agendar
				if (this.plan && this.plan.specialist && this.plan.remainingSessions <= 0) {
					this.overlay = true;
					this.specialist = await this.getSpecialist(this.plan.specialist);
					this.overlay = false;
					this.dialogWithoutSessions = true;
				}
			} else if (this.$auth.user.role === 'specialist' && this.$auth.user.specialist) {
				this.date = date;
				this.dialogAppointment = true;
			}
		},
		/**
		 * Establece el focus en el dia de hoy
		 */
		setToday() {
			this.focus = dayjs.tz().format('YYYY-MM-DD');
		},
		/** arrow previo */
		prev() {
			this.$refs.calendar.prev();
		},
		/** arrow siguiente */
		next() {
			this.$refs.calendar.next();
		},
		/**
		 * Mostrar evento
		 */
		showEvent({ nativeEvent, event }) {
			const open = () => {
				this.selectedEvent = event;
				this.selectedElement = nativeEvent.target;
				setTimeout(() => {
					this.selectedOpen = true;
				}, 10);
			};

			if (this.selectedOpen) {
				this.selectedOpen = false;
				setTimeout(open, 10);
			} else {
				open();
			}

			nativeEvent.stopPropagation();
		},
		/**
		 * Pago success
		 */
		async successPayment() {
			if (
				this.$route.params.specId &&
				this.$route.params.userId &&
				this.$route.params.sessionId
			) {
				const payload = {
					specId: this.$route.params.specId,
					userId: this.$route.params.userId,
					sessionId: this.$route.params.sessionId,
				};
				await this.updateSession(payload);
				//  clean query url from MercadoPago
				await this.$router.replace({ query: null });
				// clear Localstorage"match o spec"
				localStorage.removeItem('match');
				localStorage.removeItem('spec');
			}
		},
		/** establece el tipo de filtro */
		setFilter(value) {
			if (this.filterTypeSession === value) this.filterTypeSession = '';
			else this.filterTypeSession = value;
		},
		/** subtitle segun la fecha */
		setSubtitle(date) {
			return `Desde las ${dayjs(date).format('HH:mm')} hasta las ${dayjs(date)
				.add(50, 'minutes')
				.format('HH:mm')}`;
		},
		/** cierra el modal */
		closeDialog() {
			if ('dialog' in this.$route.query) this.$router.replace({ query: null });
			this.dialogAppointment = false;
			this.stepAddAppoinment = 0;
			this.dialogNewUser = false;
			this.date = null;
			this.client = null;
			this.typeSession = 'Sesión online';
			this.valueSession = 0;
			this.idClient = null;
			this.goBack();
		},
		/**
		 * Nueva sesion personalizada
		 */
		async newCustomSession(item) {
			if (this.validatenewCustomSession) return alert('Debe completar los campos');
			this.loadingSession = true;
			await this.createCustomSession({
				user: this.client,
				date: `${item.date} ${item.start}`,
				type: this.typeSession,
				price: this.valueSession,
			});
			this.loadingSession = false;
			if (this.typeSession !== 'compromiso privado') this.stepAddAppoinment = 2;
			if (this.typeSession === 'compromiso privado') this.closeDialog();
		},
		/**
		 * Nueva sesion
		 */
		async newSession(event) {
			this.loadingSession = true;
			const payload = {
				date: `${event.date} ${event.start}`,
				sessionNumber: this.plan.session.length + 1,
				remainingSessions: (this.plan.remainingSessions -= 1),
			};
			await this.addSession({
				id: this.plan.idSessions,
				idPlan: this.plan._id,
				payload,
			});
			this.appoinmentSessions += 1;
			await this.$auth.fetchUser();
			if (payload.remainingSessions <= 0) {
				this.plans.sortedPlans = this.plans.sortedPlans.splice(0, 1);
				if (this.plans.sortedPlans.length > 0) this.plan = this.plans.sortedPlans[0];
			}
			this.loadingSession = false;
			this.dialogHasSessions = false;
		},
		/**
		 * Cancelar sesion
		 */
		async cancelOneSession(item) {
			this.overlay = true;
			await this.cancelSession({
				sessionsId: item.sessionsId,
				id: item._id,
				planId: item.idPlan,
			});
			this.overlay = false;
		},
		acquire() {
			if (this.plan && this.plan.specialist) {
				this.addAppointment({ date: null });
			} else this.$router.push({ name: 'especialistas' });
		},
		/**
		 * Establece los precios
		 */
		setPrice(e) {
			if (this.verifyOnlyNumbers(e)) {
				this.valueSession = Number(e);
			} else {
				this.valueSession = Number(e.split('.').join(''));
			}
		},
		/**
		 * Validacion de que sea solo numeros
		 */
		verifyOnlyNumbers(value) {
			const regex = /^[0-9]*$/;
			return regex.test(value.toString());
		},
		...mapMutations({
			setSessions: 'Specialist/setSessions',
			setStepLinks: 'User/setStepLinks',
		}),
		...mapActions({
			addSession: 'Specialist/addSession',
			cancelSession: 'Specialist/cancelSession',
			createCustomSession: 'Specialist/createCustomSession',
			getClients: 'Specialist/getClients',
			getSpecialist: 'Specialist/getSpecialist',
			getSessions: 'Specialist/getSessions',
			registerUser: 'User/registerUser',
			setReschedule: 'Specialist/setReschedule',
			updateSession: 'Specialist/updateSession',
		}),
	},
	/**
	 * Validaciones
	 */
	validations: {
		form: {
			email: {
				required,
				email,
			},
			name: {
				required,
			},
			lastName: {
				required,
			},
		},
	},
};
</script>
