<template>
	<div>
		<card-onboarding
			v-if="stepOnboarding && stepOnboarding.title === 'Mi agenda'"
			style="position: absolute; top: 190px; left: 10px; z-index: 3"
			arrow="arrow-left"
			:next="
				() => {
					$router.push({ name: 'dashboard-pagos' });
					return {
						title: 'Mis pagos',
						card: {
							title: 'Gestiona tus pagos',
							description:
								'Aquí podrás conocer los ingresos, las transacciones y la cantidad de sesiones que has tenido en el mes.',
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
							title: 'Mis pagos',
							card: {
								title: 'Gestiona tus pagos',
								description:
									'Aquí podrás conocer los ingresos, las transacciones y la cantidad de sesiones que has tenido en el mes.',
								link: '',
								route: 'dashboard-chat',
							},
							route: 'dashboard-pagos',
						};
					}
				"
			/>
			<appbar class="hidden-sm-and-down" title="Mi sesiones" />
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
									{{ plan.session.length }}/{{ plan.totalSessions }}
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
											selectedEvent.status === 'pending' ||
											selectedEvent.status === 'upnext'
										"
										:href="selectedEvent.url"
										target="_blank"
										color="primary"
										text
									>
										Ir a video llamada
									</v-btn>
									<v-spacer></v-spacer>
									<v-btn
										v-if="
											selectedEvent.status === 'pending' ||
											selectedEvent.status === 'upnext'
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
									Pendiente por pago de consultante
									<v-spacer></v-spacer>
									<v-btn
										:loading="loadingPayPending"
										color="primary"
										depressed
										small
										@click="toPayPending(selectedEvent)"
									>
										Pagar
									</v-btn>
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
												:id-psy="selectedEvent.idPsychologist"
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
										{{ dialogNewUser ? 'Consultante nuevo' : 'Agendar' }}
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
											<v-col class="font-weight-medium" cols="12">
												Tipo de evento
											</v-col>
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
													label="Seleccione"
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
													v-model="valueSession"
													label="Valor"
													dense
													hide-details
													outlined
													suffix="CLP"
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
										:id-psy="$auth.user.psychologist"
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
										Hemos enviado un email al consultante. La fecha y hora
										estará disponible hasta que el consultante pague su sesión.
									</v-card-text>
								</template>
							</v-card>
						</v-dialog>
						<v-row justify="end" class="text-md-right pt-4">
							<v-col
								v-if="
									$auth.$state.user.role === 'psychologist' ||
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
									$auth.$state.user.role === 'psychologist' ||
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
								v-if="$auth.$state.user.role === 'psychologist'"
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
									$auth.$state.user.role === 'psychologist' ||
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
									<span class="ml-1 caption">
										Pendiente por pago del consultante
									</span>
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
						{{ plan.session.length }}/{{ plan.totalSessions }}
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
					<v-card-text class="text-center primary--text text-h5 py-3">
						<div class="body-1 font-weight-bold text-center">
							Comienza a hablar con nuestros psicólogos
						</div>
					</v-card-text>
					<v-card-text class="text-center">
						<small class="py-2 text--secondary">
							Orientación psicológica en cualquier momento y lugar. Comienza a mejorar
							tu vida hoy
						</small>
					</v-card-text>
					<v-card-text class="text-center">
						<v-btn color="primary" rounded to="/psicologos">Buscar ahora</v-btn>
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
									:value="`Sesión ${plan.session.length + 1}/${
										plan.totalSessions
									}`"
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
									:id-psy="plan.psychologist"
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
							v-if="psychologist"
							:id-psy="psychologist._id"
							:set-date="e => setSchedule(e)"
							title-button="Continuar"
						/>
					</v-card-text>
					<v-card-text v-if="step == 1">
						<select-plan
							v-if="psychologist"
							:set-plan="setNewPlan"
							:psychologist="psychologist"
						/>
					</v-card-text>
					<v-card-text v-if="step == 2">
						<resume-plan
							v-if="psychologist"
							:close="() => (dialogWithoutSessions = false)"
							:go-back="() => (step = 1)"
							:plan="newPlan"
							:psy="psychologist"
							:event="newEvent"
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
import moment from 'moment';
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

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Icon: () => import('~/components/Icon'),
		Calendar: () => import('~/components/Calendar.vue'),
		SelectPlan: () => import('~/components/plan/SelectPlan'),
		ResumePlan: () => import('~/components/plan/ResumePlan'),
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
			idPsychologist: '',
			idUser: '',
			name: '',
			paidToPsychologist: false,
			sessionNumber: '',
			sessionsId: '',
			start: '',
			status: '',
			url: '',
			_id: '',
		},
		selectedElement: null,
		selectedOpen: false,
		today: moment().format('YYYY-MM-DD'),
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
		psychologist: null,
		filterTypeSession: '',
		loadingSession: false,
		loagindReschedule: false,
		stepAddAppoinment: 0,
		loadingPayPending: false,
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
	}),
	computed: {
		nextSesion() {
			// Si no hay plan
			if (!this.plan) return '';
			// Obtenemos unarray solamente con las fechas de sesiones del plan
			const filterSessions = this.sessions.filter(
				session => session.idPlan === this.plan._id
			);
			const dates = filterSessions.flatMap(session => session.date);
			// Encontramos la session siguiente
			const allDates = dates.sort((a, b) => {
				return moment(a, 'MM/DD/YYYY HH:mm').diff(moment(b, 'MM/DD/YYYY HH:mm'));
			});
			const date = allDates.find(item =>
				moment(item, 'MM/DD/YYYY HH:mm').isSameOrAfter(moment())
			);
			if (date) {
				return moment(date, 'MM/DD/YYYY HH:mm').format('DD/MM/YY');
			}
			return '';
		},
		maxWidth() {
			if (this.step === 0) return '700';
			if (this.step === 1) return '900';
			else return '800';
		},
		emailErrors() {
			const errors = [];
			if (!this.$v.form.email.$dirty) return errors;
			!this.$v.form.email.required && errors.push('Se requiere correo electrónico');
			!this.$v.form.email.email && errors.push('Escriba un correo electrónico valido');
			return errors;
		},
		nameErrors() {
			const errors = [];
			if (!this.$v.form.name.$dirty) return errors;
			!this.$v.form.name.required && errors.push('Se requiere rut');
			return errors;
		},
		validatenewCustomSession() {
			if (this.typeSession === 'compromiso privado') return false;
			return !this.client || !this.typeSession || !this.valueSession;
		},
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
			allSessions: 'Psychologist/sessions',
			clients: 'Psychologist/clients',
			plan: 'User/plan',
			stepOnboarding: 'User/step',
		}),
	},
	watch: {
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
		sessions(newVal) {
			if (newVal.length) this.events = this.sessions;
		},
	},
	created() {
		this.resetForm();
		this.dialogAppointment = this.$route.query.dialog ? !!this.$route.query.dialog : false;
		this.idClient = this.$route.query.client;
	},
	async mounted() {
		await this.initFetch();
	},
	methods: {
		async initFetch() {
			if (
				this.$auth.$state.user.role === 'psychologist' &&
				!this.$auth.$state.user.psychologist
			)
				return null;
			this.overlay = true;
			moment.locale('es');
			await this.$auth.fetchUser();
			if (this.$auth.$state.user.role === 'user' && this.plan) {
				await this.getSessions({
					idPsychologist: this.plan.psychologist,
					idUser: this.plan.user,
				});
			}
			if (
				this.$auth.$state.user.role === 'psychologist' &&
				this.$auth.$state.user.sessions.length
			) {
				await this.getSessions({
					idPsychologist: this.$auth.$state.user.psychologist,
				});
			}
			await this.successPayment();
			this.$refs.calendar?.checkChange();
			this.overlay = false;
		},
		getEventColor(event) {
			if (event.statusPlan === 'pending') return 'blue-grey lighten-1';
			if (event.title === 'compromiso privado') return '#efb908';
			if (event.title === 'sesion presencial') return '#00c6ea';
			return 'primary';
		},
		getEventTextColor(event) {
			//	if (event.statusPlan === 'pending') return 'error';
			return 'white';
		},
		async submitUser() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loadingCreatedUser = true;
				await this.registerUser(this.form);
				await this.getClients(this.$auth.$state.user.psychologist);
				this.loadingCreatedUser = false;
				this.goBack();
			}
		},
		resetForm() {
			this.form = {
				name: '',
				rut: '',
				phone: '',
				email: '',
			};
		},
		goBack() {
			this.dialogNewUser = false;
			this.resetForm();
			this.$v.$reset();
		},
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
		setSchedule(item) {
			this.newEvent = item;
			this.step = 1;
		},
		setNewPlan(newPlan) {
			this.newPlan = newPlan;
			this.step = 2;
		},
		openDialog(item) {
			this.event = item;
			this.dialog = true;
		},
		viewDay({ date }) {
			this.focus = date;
			this.type = 'day';
		},
		setStepAddAppoinment() {
			if (this.validatenewCustomSession) return alert('Debe completar los campos');
			this.stepAddAppoinment = 1;
		},
		async addAppointment({ date }) {
			if (this.$auth.user.role === 'user') {
				// Sin psicologo - sin sesiones
				this.dialogSearchNow = !this.plan || (this.plan && !this.plan.psychologist);

				// con psicologo - con sesiones por agendar
				this.dialogHasSessions =
					this.plan && this.plan.psychologist && this.plan.remainingSessions > 0;
				// con psicologo - sin sesiones por agendar
				if (this.plan && this.plan.psychologist && this.plan.remainingSessions <= 0) {
					this.overlay = true;
					this.psychologist = await this.getPsychologist(this.plan.psychologist);
					this.overlay = false;
					this.dialogWithoutSessions = true;
				}
			} else if (this.$auth.user.role === 'psychologist' && this.$auth.user.psychologist) {
				this.date = date;
				this.dialogAppointment = true;
			}
		},
		setToday() {
			this.focus = moment().format('YYYY-MM-DD');
		},
		prev() {
			this.$refs.calendar.prev();
		},
		next() {
			this.$refs.calendar.next();
		},
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
		async successPayment() {
			if (
				this.$route.params.psyId &&
				this.$route.params.userId &&
				this.$route.params.sessionId
			) {
				const payload = {
					psyId: this.$route.params.psyId,
					userId: this.$route.params.userId,
					sessionId: this.$route.params.sessionId,
				};
				await this.updateSession(payload);
				//  clean query url from MercadoPago
				await this.$router.replace({ query: null });
				// clear Localstorage"match o psi"
				localStorage.removeItem('match');
				localStorage.removeItem('psi');
			}
		},
		setFilter(value) {
			if (this.filterTypeSession === value) this.filterTypeSession = '';
			else this.filterTypeSession = value;
		},
		setSubtitle(date) {
			return `Desde las ${moment(date).format('HH:mm')} hasta las ${moment(date)
				.add(60, 'minutes')
				.format('HH:mm')}`;
		},
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
			await this.$auth.fetchUser();
			this.loadingSession = false;
			this.dialogHasSessions = false;
		},
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
			if (this.plan && this.plan.psychologist) {
				this.addAppointment({ date: null });
			} else this.$router.push({ name: 'psicologos' });
		},
		async toPayPending(evt) {
			this.loadingPayPending = true;
			const sessions = await this.getFormattedSessions({
				id: evt.idPsychologist,
				type: 'schedule',
			});
			// console.log(sessions);
			// console.log(evt);
			const session = sessions.find(
				session =>
					session.date === moment(evt.date, 'MM/DD/YYYY HH:mm').format('MM/DD/YYYY')
			);
			const hour = moment(evt.date, 'MM/DD/YYYY HH:mm').format('HH:mm');

			const available = session.available.some(hourAvailable => hourAvailable === hour);
			this.loadingPayPending = false;
		},
		...mapMutations({
			setSessions: 'Psychologist/setSessions',
		}),
		...mapActions({
			addSession: 'Psychologist/addSession',
			cancelSession: 'Psychologist/cancelSession',
			createCustomSession: 'Psychologist/createCustomSession',
			getClients: 'Psychologist/getClients',
			getPsychologist: 'Psychologist/getPsychologist',
			getSessions: 'Psychologist/getSessions',
			registerUser: 'User/registerUser',
			setReschedule: 'Psychologist/setReschedule',
			updateSession: 'Psychologist/updateSession',
			getFormattedSessions: 'Psychologist/getFormattedSessions',
		}),
	},
	validations: {
		form: {
			email: {
				required,
				email,
			},
			name: {
				required,
			},
		},
	},
};
</script>
