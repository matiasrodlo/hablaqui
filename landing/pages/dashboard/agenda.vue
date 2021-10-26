<template>
	<v-container fluid style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Mi sesiones" />
		<v-row justify="center" style="height: calc(100vh - 110px)">
			<v-col cols="12" md="10">
				<div class="hidden-md-and-up text-center">
					<div class="text-center text--secondary">Nº de Sesiones</div>
					<div class="text-center text--secondary font-weight-bold my-1">0/0</div>
					<v-btn
						text
						nuxt
						to="/psicologos"
						class="primary--text font-weight-bold body-1 pointer"
					>
						Adquirir
					</v-btn>
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
				<v-sheet :height="$vuetify.breakpoint.mdAndUp ? '80%' : ''">
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
											:id-psy="idPsychologist"
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
										<v-btn :disabled="loadingCreatedUser" text @click="goBack">
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
												{ text: 'Sesión online', value: 'sesion online' },
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
																item.lastName ? item.lastName : ''
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
											<span class="primary--text ml-2">
												Consultante nuevo
											</span>
										</span>
									</v-col>
									<v-col cols="6">
										<v-menu
											ref="menu"
											v-model="menu"
											:close-on-content-click="false"
											:return-value.sync="date"
											min-width="auto"
											offset-y
											transition="scale-transition"
										>
											<template #activator="{ on, attrs }">
												<v-text-field
													v-model="date"
													dense
													hide-details
													outlined
													:append-icon="mdiCalendar"
													readonly
													v-bind="attrs"
													v-on="on"
												></v-text-field>
											</template>
											<v-date-picker v-model="date" no-title scrollable>
												<v-spacer></v-spacer>
												<v-btn color="primary" text @click="menu = false">
													Cancelar
												</v-btn>
												<v-btn
													color="primary"
													text
													@click="$refs.menu.save(date)"
												>
													Ok
												</v-btn>
											</v-date-picker>
										</v-menu>
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
							<v-btn color="primary" depressed fab style="width: 20px; height: 20px">
								<icon small :icon="mdiCheck" color="white" />
							</v-btn>
							<span class="ml-1 caption">Sesiones online</span>
						</v-col>
						<v-col cols="6" md="3" class="pointer">
							<v-btn color="#00c6ea" depressed fab style="width: 20px; height: 20px">
								<icon small :icon="mdiCheck" color="white" />
							</v-btn>
							<span class="ml-1 caption">Sesiones presenciales</span>
						</v-col>
						<v-col cols="6" md="3" class="pointer">
							<v-btn color="#efb908" depressed fab style="width: 20px; height: 20px">
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
			<v-col md="2" class="mt-16 hidden-sm-and-down text-center">
				<div class="body-2 text-center text--secondary font-weight-bold">
					Nº de Sesiones
				</div>
				<div class="headline text-center text--secondary font-weight-bold my-1">0/0</div>
				<div class="body-2 text-center text--secondary font-weight-bold mt-16">
					Siguiente sesión
				</div>
				<v-btn text nuxt to="/psicologos">
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
						Orientación psicológica en cualquier momento y lugar. Comienza a mejorar tu
						vida hoy
					</small>
				</v-card-text>
				<v-card-text class="text-center">
					<v-btn color="primary" rounded to="/psicologos">Buscar ahora</v-btn>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
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
	mdiCalendar,
} from '@mdi/js';

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
		form: null,
		loadingCreatedUser: false,
		menu: false,
		date: null,
		typeSession: '',
		mdiCalendar,
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
			start: '',
			name: '',
			idUser: '',
			sessionId: '',
			idPsychologist: '',
		},
		selectedElement: null,
		selectedOpen: false,
		today: moment().format('YYYY-MM-DD'),
		events: [],
		names: ['Sescion con', 'ocupado'],
		event: null,
		idPsychologist: '',
		dialogAppointment: false,
		dialogNewUser: false,
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
		idClient: null,
		dialogSearchNow: false,
	}),
	computed: {
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
		moment.locale('es');
		await this.initFetch();
		await this.successPayment();
		this.$refs.calendar?.checkChange();
	},
	methods: {
		async initFetch() {
			if (this.$auth.$state.user.role === 'user') {
				const user = this.$auth.$state.user.plan.find(psi => psi.status === 'success');
				if (user) this.idPsychologist = user.psychologist;
			}
			if (this.$auth.$state.user.role === 'psychologist')
				this.idPsychologist = this.$auth.$state.user.psychologist;

			if (this.idPsychologist) {
				await this.getClients(this.idPsychologist);
				await this.getSessions(this.idPsychologist);
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
			this.events = await this.setReschedule({
				sessionId: this.event.sessionId,
				newDate,
			});

			this.event = null;
			this.dialog = false;
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
			// TODO: without psychologist
			const withoutPsychologist = true;
			if (withoutPsychologist) this.dialogSearchNow = true;
			else {
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
		...mapActions({
			updateSession: 'Psychologist/updateSession',
			getSessions: 'Psychologist/getSessions',
			setReschedule: 'Psychologist/setReschedule',
			getClients: 'Psychologist/getClients',
			registerUser: 'User/registerUser',
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
