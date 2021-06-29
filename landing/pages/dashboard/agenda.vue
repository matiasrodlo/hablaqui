<template>
	<v-container fluid style="height: 100vh">
		<appbar />
		<v-row justify="center" style="height: calc(100vh - 110px)">
			<v-col cols="12" sm="3" md="4" lg="3">
				<div class="text-center">
					<v-date-picker
						v-model="today"
						locale="es"
						full-width
						no-title
						:allowed-dates="allowedDates"
						min="2021-06-01"
						@change="
							e => {
								focus = e;
								type = 'day';
							}
						"
					/>
				</div>
				<v-card v-if="user.role != 'user' && user._id != '60c26d38f12991000bca3bba'" flat>
					<v-card-text class="text-center">
						<div
							class="mt-10 text-h6 font-weight-bold primary--text mx-auto"
							style="max-width: 340px"
						>
							Próximas sesiones
						</div>
						<div class="body-1 my-6 mx-auto" style="max-width: 280px">
							Paciencia. Aún nadie ha reservado una sesión
						</div>
					</v-card-text>
				</v-card>
				<v-card v-if="user.role == 'user' && user._id != '60a0e168fd8c0f000ace3b71'" flat>
					<v-card-text class="text-center">
						<div
							class="text-h6 font-weight-bold primary--text mx-auto"
							style="max-width: 340px"
						>
							Agenda con un especialista
						</div>
						<div class="body-1 my-6 mx-auto" style="max-width: 280px">
							Orientación psicológica en cualquier momento y lugar. Comienza a mejorar
							tu vida hoy.
						</div>
						<v-btn rounded color="primary" :to="{ name: 'psicologos' }">
							Buscar ahora
						</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" sm="9" md="8" lg="8" class="heightCalendar">
				<v-sheet>
					<v-toolbar flat>
						<v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
							Hoy
						</v-btn>
						<v-btn fab text small color="grey darken-2" @click="prev">
							<v-icon small> mdi-chevron-left </v-icon>
						</v-btn>
						<v-btn fab text small color="grey darken-2" @click="next">
							<v-icon small> mdi-chevron-right </v-icon>
						</v-btn>
						<v-toolbar-title v-if="$refs.calendar">
							{{ $refs.calendar.title }}
						</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-menu bottom right>
							<template #activator="{ on, attrs }">
								<v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
									<span>{{ typeToLabel[type] }}</span>
									<v-icon right> mdi-menu-down </v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="type = 'day'">
									<v-list-item-title>Dia</v-list-item-title>
								</v-list-item>
								<v-list-item @click="type = 'week'">
									<v-list-item-title>Semana</v-list-item-title>
								</v-list-item>
								<v-list-item @click="type = 'month'">
									<v-list-item-title>Mes</v-list-item-title>
								</v-list-item>
								<v-list-item @click="type = '4day'">
									<v-list-item-title>4 dias</v-list-item-title>
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
						@change="updateRange"
					></v-calendar>
					<v-menu
						v-model="selectedOpen"
						:close-on-content-click="false"
						:activator="selectedElement"
						offset-x
					>
						<v-card color="grey lighten-4" min-width="350px" flat>
							<v-toolbar flat>
								<v-toolbar-title
									class="secondary--text"
									v-html="selectedEvent.name"
								></v-toolbar-title>
							</v-toolbar>
							<v-card-text>
								<v-icon left>mdi-clock-outline</v-icon>
								<span>{{ setSubtitle(selectedEvent.start) }}</span>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-btn text color="primary" @click="selectedOpen = false">
									Reprogramar
								</v-btn>
								<v-spacer></v-spacer>
								<v-btn text color="secondary" @click="selectedOpen = false">
									Cancelar sesion
								</v-btn>
							</v-card-actions>
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

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data: () => ({
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
	}),
	computed: {
		...mapGetters({ user: 'User/user' }),
	},
	mounted() {
		moment.locale('es');
		this.successPayment();
		this.$refs.calendar.checkChange();
	},
	methods: {
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
		updateRange() {
			if (this.user._id === '60a0e168fd8c0f000ace3b71')
				this.events = [
					{
						name: 'Sesion con Joaquin',
						start: '2021-06-24 09:00',
						end: '2021-06-24 10:00',
						details: 'Sesion con Joaquin',
					},

					{
						name: 'Sesion con Joaquin',
						start: '2021-06-28 09:00',
						end: '2021-06-28 10:00',
						details: 'Sesion con Joaquin',
					},
					{
						name: 'Sesion con Joaquin',
						start: '2021-07-04 10:00',
						end: '2021-07-04 11:00',
						details: 'Sesion con Joaquin',
					},
				];
			if (this.user._id === '60c26d38f12991000bca3bba') {
				this.events = [
					{
						name: 'Sesion con Matias',
						start: '2021-06-24 09:00',
						end: '2021-06-24 10:00',
						details: 'Sesion con Matias',
					},
					{
						name: 'Sesion con Carlos',
						start: '2021-06-24 10:00',
						end: '2021-06-24 11:00',
						details: 'Sesion con Carlos',
					},
					{
						name: 'Sesion con Daniel',
						start: '2021-06-24 12:00',
						end: '2021-06-24 13:00',
						details: 'Sesion con Daniel',
					},
					{
						name: 'Sesion con Matias',
						start: '2021-06-28 09:00',
						end: '2021-06-28 10:00',
						details: 'Sesion con Matias',
					},
					{
						name: 'Sesion con Carlos',
						start: '2021-06-28 10:00',
						end: '2021-06-28 11:00',
						details: 'Sesion con Carlos',
					},
					{
						name: 'Sesion con Daniel',
						start: '2021-06-28 12:00',
						end: '2021-06-28 13:00',
						details: 'Sesion con Daniel',
					},
					{
						name: 'Sesion con Matias',
						start: '2021-07-01 10:00',
						end: '2021-07-01 11:00',
						details: 'Sesion con Matias',
					},
					{
						name: 'Sesion con Carlos',
						start: '2021-07-01 10:00',
						end: '2021-07-01 11:00',
						details: 'Sesion con Carlos',
					},
					{
						name: 'Sesion con Daniel',
						start: '2021-07-01 10:00',
						end: '2021-07-01 11:00',
						details: 'Sesion con Daniel',
					},
					{
						name: 'Sesion con Matias',
						start: '2021-07-05 10:00',
						end: '2021-07-05 11:00',
						details: 'Sesion con Matias',
					},
					{
						name: 'Sesion con Carlos',
						start: '2021-07-05 10:00',
						end: '2021-07-05 11:00',
						details: 'Sesion con Carlos',
					},
					{
						name: 'Sesion con Daniel',
						start: '2021-07-05 10:00',
						end: '2021-07-05 11:00',
						details: 'Sesion con Daniel',
					},
					{
						name: 'Sesion con Matias',
						start: '2021-07-08 10:00',
						end: '2021-07-08 11:00',
						details: 'Sesion con Matias',
					},
					{
						name: 'Sesion con Carlos',
						start: '2021-07-08 10:00',
						end: '2021-07-08 11:00',
						details: 'Sesion con Carlos',
					},
					{
						name: 'Sesion con Daniel',
						start: '2021-07-08 10:00',
						end: '2021-07-08 11:00',
						details: 'Sesion con Daniel',
					},
				];
			}
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
			return moment(date).format('LLL');
		},
		...mapActions({
			updateSession: 'Psychologist/updateSession',
		}),
	},
};
</script>

<style lang="scss" scoped>
.heightCalendar {
	height: calc(100vh - 110px);
}
</style>
