<template>
	<div>
		<v-container fluid style="height: 100vh; max-width: 1200px">
			<appbar class="hidden-sm-and-down" title="Mi sesiones" />
			<v-row justify="center" style="height: calc(100vh - 110px)">
				<v-col cols="12" :md="$auth.$state.user.role === 'user' ? '10' : '12'">
					<div class="d-flex hidden-md-and-up justify-center">
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
							<div v-else class="text-center text--secondary font-weight-bold my-1">
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
								nuxt
								to="/psicologos"
								class="primary--text font-weight-bold body-1 pointer"
							>
								Adquirir
							</v-btn>
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
					<v-sheet :height="$vuetify.breakpoint.mdAndUp ? 'calc(100% - 110px)' : ''">
						<v-calendar
							ref="calendar"
							v-model="focus"
							:events="events"
							:now="today"
							:type="type"
							color="primary"
							locale="es"
							@click:event="showEvent"
							@click:more="viewDay"
							@click:day="addAppointment"
							@click:date="addAppointment"
						></v-calendar>
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
										<v-col class="text-right">
											<v-btn icon>
												<icon :icon="mdiPencil" color="grey lighten-1" />
											</v-btn>
											<v-btn icon>
												<icon :icon="mdiTrashCan" color="grey lighten-1" />
											</v-btn>
										</v-col>
									</v-row>
								</v-card-text>
								<v-card-text>
									<icon :icon="mdiClockOutline" color="grey lighten-1" left />
									<span>{{ setSubtitle(selectedEvent.start) }}</span>
								</v-card-text>
								<v-divider></v-divider>
								<v-card-actions>
									<v-btn
										:href="selectedEvent.url"
										target="_blank"
										color="primary"
										text
									>
										Ir a video llamada
									</v-btn>
									<v-spacer></v-spacer>
									<v-btn
										color="secondary"
										text
										@click="() => openDialog(selectedEvent)"
									>
										Reprogramar
									</v-btn>
								</v-card-actions>
								<v-dialog
									v-if="dialog"
									v-model="dialog"
									max-width="600"
									transition="dialog-top-transition"
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
											/>
										</v-card-text>
									</v-card>
								</v-dialog>
							</v-card>
						</v-menu>
						<v-dialog
							v-if="dialogAppointment"
							v-model="dialogAppointment"
							max-width="550"
							transition="dialog-top-transition"
							@click:outside="closeDialog"
						>
							<v-card min-height="300" width="550" rounded="lg">
								<v-card-text
									class="
										d-flex
										justify-space-between justify-center
										primary
										white--text
										text-h5
										py-3
									"
								>
									<div class="body-1 font-weight-bold pt-2">
										{{ dialogNewUser ? 'Consultante nuevo' : 'Agendar' }}
									</div>
									<v-btn icon @click="closeDialog">
										<icon :icon="mdiClose" color="white" />
									</v-btn>
								</v-card-text>
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
									<v-row justify="center">
										<v-col cols="6">
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
										<v-col cols="12">
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
											></v-select>
										</v-col>
										<v-col cols="6">
											<v-autocomplete
												v-model="client"
												:items="
													clients.map(item => ({
														...item,
														text: `${item.name} ${
															item.lastName ? item.lastName : ''
														}`,
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
																item.lastName ? item.lastName : ''
															}`
														}}
													</div>
												</template>
											</v-autocomplete>
										</v-col>
										<v-col class="d-flex align-center" cols="6">
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
										<v-col class="text-center py-2" cols="6">
											<v-select
												:items="hours"
												dense
												full-width
												hide-details
												label="Hora"
												outlined
											></v-select>
										</v-col>
									</v-row>
									<v-row justify="space-between">
										<v-col cols="5">
											<v-text-field
												label="Valor"
												dense
												hide-details
												outlined
												prefix="$"
											></v-text-field>
										</v-col>
										<v-col cols="6">
											<v-btn text @click="closeDialog"> Cancelar </v-btn>
											<v-btn rounded color="primary"> Agendar </v-btn>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>
						</v-dialog>
						<v-row class="text-md-right pt-4">
							<v-col cols="6" md="3" class="pointer">
								<v-btn
									color="primary"
									depressed
									fab
									style="width: 20px; height: 20px"
								>
									<icon small :icon="mdiCheck" color="white" />
								</v-btn>
								<span class="ml-1 caption">Sesiones online</span>
							</v-col>
							<v-col cols="6" md="3" class="pointer">
								<v-btn
									color="#00c6ea"
									depressed
									fab
									style="width: 20px; height: 20px"
								>
									<icon small :icon="mdiCheck" color="white" />
								</v-btn>
								<span class="ml-1 caption">Sesiones presenciales</span>
							</v-col>
							<v-col cols="6" md="3" class="pointer">
								<v-btn
									color="#efb908"
									depressed
									fab
									style="width: 20px; height: 20px"
								>
									<icon small :icon="mdiCheck" color="white" />
								</v-btn>
								<span class="ml-1 caption">Compromiso privado</span>
							</v-col>
							<v-col cols="6" md="3" class="pointer">
								<v-btn
									color="grey"
									depressed
									fab
									outlined
									style="width: 20px; height: 20px"
								>
									<icon small :icon="mdiCheck" color="grey" />
								</v-btn>
								<span class="ml-1 caption">Disponibilidad</span>
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
					<v-btn v-else text nuxt to="/psicologos">
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
							<v-col class="font-weight-medium pt-6 pb-0" cols="12">
								Tipo de evento
							</v-col>
							<v-col cols="12">
								<v-select
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
								></v-select>
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
				v-if="dialogWithoutSessions"
				v-model="dialogWithoutSessions"
				:max-width="maxWidth"
				transition="dialog-top-transition"
			>
				<v-card rounded="xl">
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
							:id-psy="session.psychologist"
							:set-date="e => setSchedule(e)"
							title-button="Continuar"
						/>
					</v-card-text>
					<v-card-text v-if="step == 1">
						<select-plan :set-plan="setPlan" :psychologist="psychologist" />
					</v-card-text>
					<v-card-text v-if="step == 2">
						<resume-plan
							:close="() => (dialogWithoutSessions = false)"
							:go-back="() => (step = 1)"
							:plan="plan"
							:psy="psychologist"
							:event="newEvent"
						/>
					</v-card-text>
				</v-card>
			</v-dialog>
		</v-container>
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
	</div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import {
	mdiCheck,
	mdiChevronLeft,
	mdiChevronRight,
	mdiClockOutline,
	mdiClose,
	mdiMenuDown,
	mdiPencil,
	mdiPlus,
	mdiTrashCan,
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
		overlay: false,
		form: null,
		loadingCreatedUser: false,
		typeSession: 'Sesión online',
		mdiCheck,
		mdiPencil,
		mdiTrashCan,
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
		loadingSession: false,
	}),
	computed: {
		// Filtramos que sea de usuarios con pagos success y no hayan expirado
		plan() {
			if (!this.$auth.$state.user) return null;
			// Obtenemos un array con todo los planes solamente
			const plans = this.$auth.$state.user.sessions.flatMap(item =>
				item.plan.map(plan => ({
					...plan,
					idSessions: item._id,
					psychologist: item.psychologist,
					user: item.user,
					// dias de diferencia entre el dia que expiró y hoy
					diff: moment(plan.expiration).diff(moment(), 'days'),
				}))
			);
			const max = Math.max(...plans.map(el => el.diff).filter(el => el <= 0));

			// retornamos el plan success y sin expirar
			let plan = plans.find(
				item => item.payment === 'success' && moment().isBefore(moment(item.expiration))
			);
			// retornamos el ultimo plan succes y que expiro
			if (!plan) plan = plans.find(item => item.diff === max);
			return plan;
		},
		nextSesion() {
			// Si no hay plan
			if (!this.plan) return '';
			// Obtenemos unarray solamente con las fechas de sesiones del plan
			const dates = this.plan.session.flatMap(session => session.date);
			// Encontramos la session siguiente
			const date = dates.find(item =>
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
		...mapGetters({ sessions: 'Psychologist/sessions', clients: 'Psychologist/clients' }),
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
	},
	created() {
		this.resetForm();
		this.dialogAppointment = this.$route.query.dialog ? !!this.$route.query.dialog : false;
		this.idClient = this.$route.query.client;
	},
	async mounted() {
		this.overlay = true;
		moment.locale('es');
		await this.initFetch();
		await this.successPayment();
		this.$refs.calendar?.checkChange();
		this.overlay = false;
	},
	methods: {
		async initFetch() {
			if (this.$auth.$state.user.role === 'user' && this.plan) {
				await this.getSessions({
					idPsychologist: this.plan.psychologist,
					idUser: this.plan.user,
				});
				this.events = this.sessions;
			}
			if (
				this.$auth.$state.user.role === 'psychologist' &&
				this.$auth.$state.user.sessions.length
			) {
				await this.getClients(this.$auth.$state.user.psychologist);
				await this.getSessions({
					idPsychologist: this.$auth.$state.user.psychologist,
				});
				this.events = this.sessions;
			}
		},
		async submitUser() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loadingCreatedUser = true;
				await this.registerUser(this.form);
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
			const newDate = { date: item.date, hour: item.start };
			const response = await this.setReschedule({
				sessionsId: this.selectedEvent.sessionsId,
				id: this.selectedEvent._id,
				newDate,
			});
			this.events = this.events.map(item => {
				if (item._id !== response._id) {
					// This isn't the item we care about - keep it as-is
					return item;
				}

				// Otherwise, this is the one we want - return an updated value
				return {
					...item,
					...response,
				};
			});
			this.event = null;
			this.dialog = false;
		},
		setSchedule(item) {
			this.newEvent = item;
			this.step = 1;
		},
		setPlan(plan) {
			this.plan = plan;
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
		addAppointment({ date }) {
			if (this.$auth.user.role === 'user') {
				// Sin psicologo - sin sesiones
				this.dialogSearchNow = !this.plan.psychologist;

				// con psicologo - con sesiones por agendar
				this.dialogHasSessions = this.plan.psychologist && this.plan.remainingSessions > 0;

				// con psicologo - sin sesiones por agendar
				this.dialogWithoutSessions =
					this.plan.psychologist && this.plan.remainingSessions < 1;
			} else if (this.$auth.user.role === 'psychologist') {
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
		setSubtitle(date) {
			return `Desde las ${moment(date).format('hh:mm')} hasta las ${moment(date)
				.add(60, 'minutes')
				.format('hh:mm')}`;
		},
		closeDialog() {
			if ('dialog' in this.$route.query) this.$router.replace({ query: null });
			this.dialogAppointment = false;
			this.dialogNewUser = false;
			this.date = null;
			this.client = null;
			this.idClient = null;
			this.goBack();
		},
		async newSession(event) {
			this.loadingSession = true;
			const payload = {
				date: `${event.date} ${event.start}`,
				sessionNumber: `${this.plan.totalSessions - this.plan.remainingSessions} / ${
					this.plan.totalSessions
				}`,
				remainingSessions: (this.plan.remainingSessions -= 1),
			};
			await this.addSession({ id: this.plan.idSessions, idPlan: this.plan._id, payload });
			this.loadingSession = false;
		},
		...mapActions({
			addSession: 'Psychologist/addSession',
			getClients: 'Psychologist/getClients',
			getPsychologist: 'Psychologist/getPsychologist',
			getSessions: 'Psychologist/getSessions',
			registerUser: 'User/registerUser',
			setReschedule: 'Psychologist/setReschedule',
			updateSession: 'Psychologist/updateSession',
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
