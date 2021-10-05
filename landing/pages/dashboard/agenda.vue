<template>
	<v-container fluid style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Mi sesiones" />
		<v-row justify="center" style="height: calc(100vh - 110px)">
			<v-col cols="12" md="10" class="heightCalendar">
				<v-sheet class="mt-4 mt-md-0">
					<v-toolbar flat>
						<v-btn class="mr-4" color="primary" depressed @click="setToday">
							Hoy
						</v-btn>
						<v-btn icon x-large @click="prev">
							<icon x-large color="grey lighten-1" :icon="mdiChevronLeft" />
						</v-btn>
						<v-btn icon x-large small @click="next">
							<icon x-large color="grey lighten-1" :icon="mdiChevronRight" />
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
								<v-btn outlined color="grey lighten-1" v-bind="attrs" v-on="on">
									<span>{{ typeToLabel[type] }}</span>
									<icon right color="grey lighten-1" :icon="mdiMenuDown" />
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="type = 'day'">
									<v-list-item-title class="text--secondary"
										>Dia</v-list-item-title
									>
								</v-list-item>
								<v-list-item @click="type = 'week'">
									<v-list-item-title class="text--secondary"
										>Semana</v-list-item-title
									>
								</v-list-item>
								<v-list-item @click="type = 'month'">
									<v-list-item-title class="text--secondary"
										>Mes</v-list-item-title
									>
								</v-list-item>
								<v-list-item @click="type = '4day'">
									<v-list-item-title class="text--secondary"
										>4 dias</v-list-item-title
									>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-toolbar>
				</v-sheet>
				<v-sheet height="calc(100% - 64px)">
					<v-calendar
						ref="calendar"
						v-model="focus"
						locale="es"
						color="primary"
						:now="today"
						:events="events"
						:type="type"
						@click:event="showEvent"
						@click:more="viewDay"
						@click:day="addAppointment"
						@click:date="addAppointment"
					></v-calendar>
					<v-menu
						v-model="selectedOpen"
						:close-on-content-click="false"
						:activator="selectedElement"
						offset-x
					>
						<v-card color="grey lighten-4" min-width="350px" flat>
							<v-card-text>
								<v-row justify="space-between">
									<v-col cols="7" class="body-1 secondary--text">
										{{ selectedEvent.name }}
									</v-col>
									<v-col class="text-right">
										<v-btn icon>
											<icon color="grey lighten-1" :icon="mdiPencil" />
										</v-btn>
										<v-btn icon>
											<icon color="grey lighten-1" :icon="mdiTrashCan" />
										</v-btn>
									</v-col>
								</v-row>
							</v-card-text>
							<v-card-text>
								<icon color="grey lighten-1" left :icon="mdiClockOutline" />
								<span>{{ setSubtitle(selectedEvent.start) }}</span>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-btn
									text
									color="primary"
									:to="`/video-llamada/${goToCall(selectedEvent)}`"
								>
									Ir a video llamada
								</v-btn>
								<v-spacer></v-spacer>
								<v-btn
									text
									color="secondary"
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
						v-if="newAppointment"
						v-model="newAppointment"
						max-width="600"
						transition="dialog-top-transition"
					>
						<v-card rounded="lg" min-height="300">
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
								<div class="body-1 font-weight-bold">Agendar</div>
								<v-btn icon @click="() => (newAppointment = false)">
									<icon color="white" :icon="mdiClose" />
								</v-btn>
							</v-card-text>
							<v-card-text class="pt-2 pl-2">
								<v-row>
									<v-col cols="12" class="font-weight-medium">
										Tipo de evento
									</v-col>
									<v-col cols="12">
										<v-select
											v-model="typeSession"
											dense
											hide-details
											outlined
											label="Seleccione"
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
										></v-select>
									</v-col>
									<v-col cols="6">
										<v-autocomplete
											v-model="client"
											dense
											hide-details
											outlined
											label="Nombre"
											:items="
												clients.map(item => ({
													...item,
													text: `${item.name} ${
														item.lastName ? item.lastName : ''
													}`,
												}))
											"
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
										</v-autocomplete>
									</v-col>
									<v-col cols="6">
										<v-btn
											fab
											depressed
											outlined
											color="primary"
											width="25"
											height="25"
										>
											<icon color="primary" :icon="mdiPlus" />
										</v-btn>
										<span class="primary--text">Consultante nuevo </span>
									</v-col>
									<v-col cols="6">
										<v-menu
											ref="menu"
											v-model="menu"
											:close-on-content-click="false"
											:return-value.sync="date"
											transition="scale-transition"
											offset-y
											min-width="auto"
										>
											<template #activator="{ on, attrs }">
												<v-text-field
													v-model="date"
													prepend-icon="mdi-calendar"
													readonly
													dense
													hide-details
													outlined
													v-bind="attrs"
													v-on="on"
												></v-text-field>
											</template>
											<v-date-picker v-model="date" no-title scrollable>
												<v-spacer></v-spacer>
												<v-btn text color="primary" @click="menu = false">
													Cancel
												</v-btn>
												<v-btn
													text
													color="primary"
													@click="$refs.menu.save(date)"
												>
													OK
												</v-btn>
											</v-date-picker>
										</v-menu>
									</v-col>
									<v-col cols="3" class="text-center py-2">
										<v-select
											full-width
											outlined
											dense
											hide-details
											:items="hours"
										></v-select>
									</v-col>
									<v-col cols="3" class="text-center py-2">
										<v-select
											:items="hours"
											full-width
											outlined
											dense
										></v-select>
									</v-col>
									<v-col cols="6" class="d-flex align-center">
										<v-btn text>
											<div class="primary rounded-circle">
												<icon small color="white" :icon="mdiPlus" />
											</div>
											<span class="ml-2">Consultante nuevo</span>
										</v-btn>
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>
					</v-dialog>
					<div class="text-right py-10">
						<span class="mx-3">
							<v-btn x-small fab depressed color="primary">
								<icon color="white" :icon="mdiCheck" />
							</v-btn>
							<span class="ml-1">Sesiones online</span>
						</span>
						<span class="mx-3">
							<v-btn x-small fab depressed color="#00c6ea">
								<icon color="white" :icon="mdiCheck" />
							</v-btn>
							<span class="ml-1">Sesiones online</span>
						</span>
						<span class="mx-3">
							<v-btn x-small fab depressed color="#efb908">
								<icon color="white" :icon="mdiCheck" />
							</v-btn>
							<span class="ml-1">Sesiones online</span>
						</span>
						<span class="mx-3">
							<v-btn x-small outlined fab depressed color="grey">
								<icon color="grey" :icon="mdiCheck" />
							</v-btn>
							<span class="ml-1">Sesiones online</span>
						</span>
					</div>
				</v-sheet>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

import {
	mdiChevronLeft,
	mdiChevronRight,
	mdiMenuDown,
	mdiClockOutline,
	mdiClose,
	mdiPlus,
	mdiTrashCan,
	mdiPencil,
	mdiCheck,
} from '@mdi/js';

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Icon: () => import('~/components/Icon'),
		Calendar: () => import('~/components/Calendar.vue'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data: () => ({
		menu: false,
		date: null,
		typeSession: '',
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
		selectedEvent: {},
		selectedElement: null,
		selectedOpen: false,
		today: moment().format('YYYY-MM-DD'),
		events: [],
		names: ['Sescion con', 'ocupado'],
		event: null,
		idPsychologist: '',
		dateSelected: null,
		newAppointment: false,
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
		...mapGetters({ sessions: 'Psychologist/sessions', clients: 'Psychologist/clients' }),
	},
	async mounted() {
		moment.locale('es');
		await this.initFetch();
		this.successPayment();
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
		allowedDates(val) {
			return val === '2021-06-25' || val === '2021-06-30';
		},
		viewDay({ date }) {
			this.focus = date;
			this.type = 'day';
		},
		addAppointment({ date }) {
			console.log(date);
			this.newAppointment = true;
			this.dateSelected = date;
		},
		getEventColor(event) {
			return event.color;
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
		rnd(a, b) {
			return Math.floor((b - a + 1) * Math.random()) + a;
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
				//  Limpia la query url cuando viene desde mercadopago
				this.$router.replace({ query: null });
				// limpiamos el LC "match o psi"
				localStorage.removeItem('match');
				localStorage.removeItem('psi');
			}
		},
		setSubtitle(date) {
			return `Desde las ${moment(date).format('hh:mm')} hasta las ${moment(date)
				.add(60, 'minutes')
				.format('hh:mm')}`;
		},
		goToCall(selectedEvent) {
			return selectedEvent.idPsychologist + selectedEvent.idUser;
		},
		...mapActions({
			updateSession: 'Psychologist/updateSession',
			getSessions: 'Psychologist/getSessions',
			setReschedule: 'Psychologist/setReschedule',
			getClients: 'Psychologist/getClients',
		}),
	},
};
</script>

<style lang="scss" scoped>
.heightCalendar {
	height: calc(100vh - 110px);
}
</style>
