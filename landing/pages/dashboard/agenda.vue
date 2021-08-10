<template>
	<v-container fluid style="height: 100vh">
		<appbar title="Mi sesiones" />
		<v-row justify="center" style="height: calc(100vh - 110px)">
			<v-col cols="12" md="10" class="heightCalendar">
				<v-sheet>
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
						@click:date="viewDay"
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
											:set-date="date => reschedule(date)"
											title-button="Reprogramar sesión"
										/>
									</v-card-text>
								</v-card>
							</v-dialog>
						</v-card>
					</v-menu>
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
	mdiTrashCan,
	mdiPencil,
} from '@mdi/js';

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Icon: () => import('~/components/Icon'),
		Calendar: () => import('../../components/Calendar.vue'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data: () => ({
		mdiPencil,
		mdiTrashCan,
		mdiClose,
		mdiChevronLeft,
		mdiChevronRight,
		mdiMenuDown,
		mdiClockOutline,
		dialog: false,
		date: '2018-03-02',
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
		myPsychologist: null,
	}),
	computed: {
		...mapGetters({ sessions: 'Psychologist/sessions' }),
	},
	async mounted() {
		await this.initFetch();
		moment.locale('es');
		this.successPayment();
		this.$refs.calendar.checkChange();
	},
	methods: {
		async initFetch() {
			let idPsychologist = null;
			if (this.$auth.$state.user.role === 'user') {
				const user = this.$auth.$state.user.plan.find(psi => psi.status === 'success');
				if (user) idPsychologist = user.psychologist;
			}
			if (this.$auth.$state.user.role === 'psychologist')
				idPsychologist = this.$auth.$state.user.psychologist;

			if (idPsychologist) {
				await this.getSessions(idPsychologist);
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
			if (val === '2021-06-25' || val === '2021-06-30') return false;
			return true;
		},
		viewDay({ date }) {
			this.focus = date;
			this.type = 'day';
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
		}),
	},
};
</script>

<style lang="scss" scoped>
.heightCalendar {
	height: calc(100vh - 110px);
}
</style>
