<template>
	<div :class="step ? 'mt-10' : ''">
		<v-card
			class="hidden-sm-and-down mx-auto mb-16"
			:loading="!specialist"
			outlined
			:style="{ 'max-width': $vuetify.breakpoint.lgAndUp ? '840px' : '100%' }"
		>
			<v-card-text>
				<div class="px-6 d-flex justify-space-between align-center">
					<div>
						<div class="body-1 font-weight" style="color: #3c3c3b; line-height: 26.4px">
							En estos horarios podrán agendar con usted desde su perfil
						</div>
						<small v-if="hasOverlay" class="error--text">
							Existe un solapamiento de horas
						</small>
					</div>
					<div>
						<v-btn
							v-if="specialist"
							:disabled="hasChanges || hasOverlay"
							:loading="loading"
							color="primary"
							rounded
							depressed
							style="z-index: 2"
							@click="schedule"
						>
							Guardar
						</v-btn>
					</div>
				</div>
				<card-onboarding
					v-if="step && step.title === 'Horarios'"
					style="position: absolute; top: -7%; right: 20%; z-index: 3"
					arrow="arrow-bottom"
					:next="
						() => ({
							title: 'Disponibilidad',
							tab: 1,
							card: {
								title: 'Intervalos',
								description:
									'Establezca intervalos de disponibilidad para cada día.',
							},
							route: 'dashboard-perfil',
						})
					"
				/>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text
				v-for="(item, index) in items"
				:key="item.id"
				class="py-2 px-0"
				style="position: relative"
			>
				<card-onboarding
					v-if="index === 0 && step && step.title === 'Disponibilidad'"
					style="position: absolute; top: -140px; right: -40px; z-index: 3"
					arrow="arrow-bottom"
					:next="
						() => ({
							title: 'Agendamientos',
							tab: 2,
							card: {
								title: 'Agendamientos',
								description: 'Establezca la anticipación con que le pueden agendar',
							},
							route: 'dashboard-perfil',
						})
					"
				/>
				<v-row align="start" class="px-8">
					<v-col cols="3">
						<div class="primary--text text-h5 font-weight-medium">
							{{ item.titulo }}
						</div>
						<div class="body-1 font-weight-medium" style="color: #3c3c3b">
							{{ item.active ? 'Abierto' : 'Cerrado' }}
						</div>
					</v-col>
					<v-col cols="7">
						<v-row v-for="(intervals, i) in item.intervals" :key="i">
							<v-col cols="5" class="text-center py-2">
								<v-select
									v-model="intervals[0]"
									style="z-index: 2"
									:disabled="!item.active"
									full-width
									outlined
									dense
									hide-details
									:error="
										item.error &&
										item.error.start &&
										item.error.start.includes(i)
									"
									:items="hours"
									@change="e => validateInput(index, i, e, 'start')"
								></v-select>
							</v-col>
							<v-col cols="5" class="text-center py-2">
								<v-select
									v-model="intervals[1]"
									style="z-index: 2"
									:disabled="!item.active"
									full-width
									outlined
									dense
									:error="
										item.error && item.error.end && item.error.end.includes(i)
									"
									hide-details
									:items="hours"
									@change="e => validateInput(index, i, e, 'end')"
								></v-select>
							</v-col>
							<v-col v-if="i !== 0" align-self="center" cols="2">
								<v-btn
									fab
									depressed
									outlined
									color="error"
									width="25"
									height="25"
									style="z-index: 2"
									@click="rmInterval(index, i)"
								>
									<icon color="error" :icon="mdiMinus"
								/></v-btn>
							</v-col>
							<v-col v-if="i == 0" cols="2">
								<v-btn
									fab
									depressed
									outlined
									color="primary"
									width="25"
									height="25"
									style="z-index: 2"
									@click="addInterval(index)"
								>
									<icon color="primary" :icon="mdiPlus"
								/></v-btn>
							</v-col>
						</v-row>
					</v-col>
					<v-col cols="2" class="text-right" style="z-index: 2">
						<v-switch
							v-model="item.active"
							hide-details
							dense
							class="mt-0 pb-0 d-inline-block"
						></v-switch>
					</v-col>
				</v-row>
				<v-divider v-if="item.divider" class="mt-2"></v-divider>
			</v-card-text>
		</v-card>
		<div class="hidden-md-and-up">
			<template v-if="query.day">
				<template v-for="(item, index) in items">
					<v-card v-show="item.title == query.day" :key="item.id" class="py-2 px-0">
						<v-row align="start" class="px-8">
							<v-col cols="9">
								<div class="primary--text text-h5 font-weight-medium">
									{{ item.titulo }}
								</div>
								<div class="body-1 font-weight-medium" style="color: #3c3c3b">
									{{ item.active ? 'Abierto' : 'Cerrado' }}
								</div>
							</v-col>
							<v-col cols="3" class="text-right">
								<v-switch
									v-model="item.active"
									hide-details
									dense
									class="mt-0 pb-0 d-inline-block"
								></v-switch>
							</v-col>
							<v-col cols="12">
								<v-row v-for="(intervals, i) in item.intervals" :key="i">
									<v-col cols="5" class="text-center py-2">
										<v-select
											v-model="intervals[0]"
											:disabled="!item.active"
											full-width
											outlined
											dense
											hide-details
											:error="
												item.error &&
												item.error.start &&
												item.error.start.includes(i)
											"
											:items="hours"
											@change="e => validateInput(index, i, e, 'start')"
										></v-select>
									</v-col>
									<v-col cols="5" class="text-center py-2">
										<v-select
											v-model="intervals[1]"
											:disabled="!item.active"
											full-width
											outlined
											dense
											:error="
												item.error &&
												item.error.end &&
												item.error.end.includes(i)
											"
											hide-details
											:items="hours"
											@change="e => validateInput(index, i, e, 'end')"
										></v-select>
									</v-col>
									<v-col v-if="i !== 0" align-self="center" cols="2">
										<v-btn
											fab
											depressed
											outlined
											color="error"
											width="25"
											height="25"
											@click="rmInterval(index, i)"
										>
											<icon color="error" :icon="mdiMinus"
										/></v-btn>
									</v-col>
									<v-col v-if="i == 0" cols="2">
										<v-btn
											fab
											depressed
											outlined
											color="primary"
											width="25"
											height="25"
											@click="addInterval(index)"
										>
											<icon color="primary" :icon="mdiPlus"
										/></v-btn>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
						<v-card-actions class="mt-2">
							<v-spacer></v-spacer>
							<v-btn
								v-if="specialist"
								:disabled="hasChanges || hasOverlay"
								:loading="loading"
								color="primary"
								rounded
								depressed
								@click="schedule"
							>
								Guardar
							</v-btn>
							<v-spacer></v-spacer>
						</v-card-actions>
					</v-card>
				</template>
			</template>
			<template v-else>
				<v-card
					v-for="(item, i) in items"
					:key="i"
					class="my-3"
					elevation="6"
					:child-number="i + 1"
					@click.stop="() => $router.push(`perfil/horario?day=${item.title}`)"
				>
					<v-card-text class="d-flex justify-space-between">
						<div>
							<div class="primary--text font-weight-bold body-1">
								{{ item.titulo }}
							</div>
							<div class="secondary--text body-2">
								{{ item.active ? 'Abierto' : 'Cerrado' }}
							</div>
						</div>
						<v-switch
							v-model="item.active"
							hide-details
							dense
							class="mt-0 pb-0 d-inline-block"
							@click.stop="schedule"
						></v-switch>
					</v-card-text>
					<v-card-text>
						<div v-for="(intervals, e) in item.intervals" :key="e">
							<icon size="20" color="primary" :icon="mdiClockOutline" />
							<span class="ml-2 pt-2">{{ intervals[0] }} {{ intervals[1] }}</span>
						</div>
					</v-card-text>
				</v-card>
			</template>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';
import { mdiPlus, mdiMinus, mdiAlert, mdiClockOutline } from '@mdi/js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.tz.setDefault('America/Santiago');

export default {
	name: 'Horario',
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		specialist: {
			type: Object,
			default: null,
		},
		setSpecialist: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			loading: false,
			items: [
				{
					title: 'monday',
					titulo: 'Lunes',
					intervals: [['8:00', '18:00']],
					active: true,
					divider: true,
					id: 1,
					error: { start: [], end: [] },
				},
				{
					title: 'tuesday',
					titulo: 'Martes',
					intervals: [['8:00', '18:00']],
					active: true,
					divider: true,
					id: 2,
					error: { start: [], end: [] },
				},
				{
					title: 'wednesday',
					titulo: 'Miércoles',
					intervals: [['8:00', '18:00']],
					active: true,
					divider: true,
					id: 3,
					error: { start: [], end: [] },
				},
				{
					title: 'thursday',
					titulo: 'Jueves',
					intervals: ['8:00', '18:00'],
					active: true,
					divider: true,
					id: 4,
					error: { start: [], end: [] },
				},
				{
					title: 'friday',
					titulo: 'Viernes',
					intervals: [['8:00', '18:00']],
					active: true,
					divider: true,
					id: 5,
					error: { start: [], end: [] },
				},
				{
					title: 'saturday',
					titulo: 'Sábado',
					intervals: [['8:00', '18:00']],
					active: false,
					divider: true,
					id: 6,
					error: { start: [], end: [] },
				},
				{
					title: 'sunday',
					titulo: 'Domingo',
					intervals: [['8:00', '18:00']],
					active: false,
					divider: false,
					id: 7,
					error: { start: [], end: [] },
				},
			],
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
			mdiPlus,
			mdiMinus,
			mdiAlert,
			mdiClockOutline,
			query: null,
			daySelected: null,
		};
	},
	computed: {
		hasOverlay() {
			return this.items.some(
				item => item.error && (item.error.start.length || item.error.end.length)
			);
		},
		hasChanges() {
			const days = {
				monday: this.items[0].active ? this.items[0].intervals : 'busy',
				tuesday: this.items[1].active ? this.items[1].intervals : 'busy',
				wednesday: this.items[2].active ? this.items[2].intervals : 'busy',
				thursday: this.items[3].active ? this.items[3].intervals : 'busy',
				friday: this.items[4].active ? this.items[4].intervals : 'busy',
				saturday: this.items[5].active ? this.items[5].intervals : 'busy',
				sunday: this.items[6].active ? this.items[6].intervals : 'busy',
			};
			return JSON.stringify(this.specialist.schedule) === JSON.stringify(days);
		},
		...mapGetters({ step: 'User/step' }),
	},
	created() {
		this.query = this.$route.query;
	},
	mounted() {
		this.setDay(cloneDeep(this.specialist.schedule));
	},
	methods: {
		setDay(payload) {
			let intervals;
			this.items = this.items.map((item, index) => {
				let active = true;
				if (index === 0) {
					intervals =
						payload.monday === 'busy' ||
						payload.monday.some(interval => !Array.isArray(interval))
							? [['9:00', '18:00']]
							: payload.monday;
					active = payload.monday !== 'busy';
				}
				if (index === 1) {
					intervals =
						payload.tuesday === 'busy' ||
						payload.tuesday.some(interval => !Array.isArray(interval))
							? [['9:00', '18:00']]
							: payload.tuesday;
					active = payload.tuesday !== 'busy';
				}
				if (index === 2) {
					intervals =
						payload.wednesday === 'busy' ||
						payload.wednesday.some(interval => !Array.isArray(interval))
							? [['9:00', '18:00']]
							: payload.wednesday;
					active = payload.wednesday !== 'busy';
				}
				if (index === 3) {
					intervals =
						payload.thursday === 'busy' ||
						payload.thursday.some(interval => !Array.isArray(interval))
							? [['9:00', '18:00']]
							: payload.thursday;
					active = payload.thursday !== 'busy';
				}
				if (index === 4) {
					intervals =
						payload.friday === 'busy' ||
						payload.friday.some(interval => !Array.isArray(interval))
							? [['9:00', '18:00']]
							: payload.friday;
					active = payload.friday !== 'busy';
				}
				if (index === 5) {
					intervals =
						payload.saturday === 'busy' ||
						payload.saturday.some(interval => !Array.isArray(interval))
							? [['9:00', '18:00']]
							: payload.saturday;
					active = payload.saturday !== 'busy';
				}
				if (index === 6) {
					intervals =
						payload.sunday === 'busy' ||
						payload.sunday.some(interval => !Array.isArray(interval))
							? [['9:00', '18:00']]
							: payload.sunday;
					active = payload.sunday !== 'busy';
				}
				return { ...item, intervals, active };
			});
		},
		addInterval(indexDay) {
			this.items[indexDay].intervals.push(['', '']);
		},
		rmInterval(indexDay, indexInterval) {
			this.items[indexDay].intervals = this.items[indexDay].intervals.filter(
				(el, index) => index !== indexInterval
			);
		},
		async schedule() {
			this.loading = true;

			// Sort and remove empty
			this.items = this.items.map(item => ({
				...item,
				intervals: item.intervals
					.filter(
						el =>
							el[0] !== '' ||
							el[1] !== '' ||
							dayjs(el[0], 'HH:mm').isSame(dayjs(el[1], 'HH:mm'))
					)
					.map(el => {
						if (dayjs(el[0], 'HH:mm').isBefore(dayjs(el[1], 'HH:mm')))
							return [el[0], el[1]];
						else return [el[1], el[0]];
					})
					.filter(el => !dayjs(el[0], 'HH:mm').isSame(dayjs(el[1], 'HH:mm'))),
			}));

			const payload = {
				monday: this.items[0].active ? this.items[0].intervals : 'busy',
				tuesday: this.items[1].active ? this.items[1].intervals : 'busy',
				wednesday: this.items[2].active ? this.items[2].intervals : 'busy',
				thursday: this.items[3].active ? this.items[3].intervals : 'busy',
				friday: this.items[4].active ? this.items[4].intervals : 'busy',
				saturday: this.items[5].active ? this.items[5].intervals : 'busy',
				sunday: this.items[6].active ? this.items[6].intervals : 'busy',
				specialist: this.specialist._id,
			};
			const specialist = await this.setSchedule(payload);
			this.setSpecialist(specialist);
			this.setDay(cloneDeep(specialist.schedule));
			this.loading = false;
			this.snackBar({ content: 'Cambios realizados', color: 'success' });
		},
		// Validation
		validateInput(indexDay, indexInterval, value, type) {
			const result = this.items[indexDay].intervals.some((item, i) => {
				if (indexInterval !== i)
					return dayjs(value, 'HH:mm').isBetween(
						dayjs(item[0], 'HH:mm'),
						dayjs(item[1], 'HH:mm'),
						undefined,
						[]
					);
				else if (item[0] === item[1]) return true;
				else return false;
			});
			if (!result) {
				if (type === 'start') {
					this.items[indexDay].error.start = this.items[indexDay].error.start.filter(
						el => el !== indexInterval
					);
				}
				if (type === 'end') {
					this.items[indexDay].error.end = this.items[indexDay].error.end.filter(
						el => el !== indexInterval
					);
				}
			} else {
				if (type === 'start') this.items[indexDay].error.start.push(indexInterval);
				if (type === 'end') this.items[indexDay].error.end.push(indexInterval);
			}
		},
		...mapActions({
			setSchedule: 'Specialist/setSchedule',
		}),
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
};
</script>
