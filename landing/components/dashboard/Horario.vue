<template>
	<div>
		<v-card v-if="psychologist" outlined style="max-width: 640px">
			<v-card-text>
				<div class="px-6 d-flex justify-space-between align-center">
					<div>
						<div
							class="text-h5 font-weight-medium my-4"
							style="color: #3c3c3b; line-height: 26.4px"
						>
							Configura tus horarios
						</div>
						<div class="text-h6" style="color: #3c3c3b; line-height: 26.4px">
							Si deseas agregar otro intervalo, puedes usar tu calendario de Google.
						</div>
					</div>
					<div>
						<v-btn
							:disabled="hasChanges"
							:loading="loading"
							color="primary"
							rounded
							depressed
							@click="schedule"
						>
							Guardar
						</v-btn>
					</div>
				</div>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text v-for="item in items" :key="item.id" class="py-2 px-0">
				<v-row align="center" class="px-8">
					<v-col cols="4">
						<div class="primary--text text-h5 font-weight-medium">
							{{ item.titulo }}
						</div>
						<div class="body-1 font-weight-medium" style="color: #3c3c3b">
							{{ item.active ? 'Abierto' : 'Cerrado' }}
						</div>
					</v-col>
					<v-col class="text-center">
						<v-select
							v-model="item.day[0]"
							:disabled="!item.active"
							full-width
							outlined
							dense
							hide-details
							:items="hours"
						></v-select>
					</v-col>
					<v-col class="text-center">
						<v-select
							v-model="item.day[1]"
							:disabled="!item.active"
							full-width
							outlined
							dense
							hide-details
							:items="hours"
						></v-select>
					</v-col>
					<v-col cols="2" class="text-right">
						<v-switch
							v-model="item.active"
							hide-details
							dense
							class="pb-4 d-inline-block"
							@change="item.day = ['9:00', '18:00']"
						></v-switch>
					</v-col>
				</v-row>
				<v-divider v-if="item.divider" class="mt-2"></v-divider>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

export default {
	data() {
		return {
			loading: false,
			psychologist: null,
			items: [
				{
					title: 'monday',
					titulo: 'Lunes',
					day: ['8:00', '18:00'],
					active: true,
					divider: true,
					id: 1,
				},
				{
					title: 'tuesday',
					titulo: 'Martes',
					day: ['8:00', '18:00'],
					active: true,
					divider: true,
					id: 2,
				},
				{
					title: 'wednesday',
					titulo: 'Miercoles',
					day: ['8:00', '18:00'],
					active: true,
					divider: true,
					id: 3,
				},
				{
					title: 'thursday',
					titulo: 'Jueves',
					day: ['8:00', '18:00'],
					active: true,
					divider: true,
					id: 4,
				},
				{
					title: 'friday',
					titulo: 'Viernes',
					day: ['8:00', '18:00'],
					active: true,
					divider: true,
					id: 5,
				},
				{
					title: 'saturday',
					titulo: 'Sabado',
					day: ['8:00', '18:00'],
					active: false,
					divider: true,
					id: 6,
				},
				{
					title: 'sunday',
					titulo: 'Domingo',
					day: ['8:00', '18:00'],
					active: false,
					divider: false,
					id: 7,
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
		};
	},
	computed: {
		hasChanges() {
			const days = {
				monday: this.items[0].day,
				tuesday: this.items[1].day,
				wednesday: this.items[2].day,
				thursday: this.items[3].day,
				friday: this.items[4].day,
				saturday: this.items[5].day,
				sunday: this.items[6].day,
			};
			return JSON.stringify(this.psychologist.schedule) === JSON.stringify(days);
		},
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			this.psychologist = await this.getPsychologist(this.$auth.$state.user.psychologist);
			this.setDay(cloneDeep(this.psychologist.schedule));
		},
		setDay(payload) {
			this.items = this.items.map((item, index) => {
				let day = ['00:00', '00:00'];
				let active = true;
				if (index === 0) {
					day = payload.monday === 'busy' ? ['9:00', '18:00'] : payload.monday;
					active = payload.monday !== 'busy';
				}
				if (index === 1) {
					day = payload.tuesday === 'busy' ? ['9:00', '18:00'] : payload.tuesday;
					active = payload.tuesday !== 'busy';
				}
				if (index === 2) {
					day = payload.wednesday === 'busy' ? ['9:00', '18:00'] : payload.wednesday;
					active = payload.wednesday !== 'busy';
				}
				if (index === 3) {
					day = payload.thursday === 'busy' ? ['9:00', '18:00'] : payload.thursday;
					active = payload.thursday !== 'busy';
				}
				if (index === 4) {
					day = payload.friday === 'busy' ? ['9:00', '18:00'] : payload.friday;
					active = payload.friday !== 'busy';
				}
				if (index === 5) {
					day = payload.saturday === 'busy' ? ['9:00', '18:00'] : payload.saturday;
					active = payload.saturday !== 'busy';
				}
				if (index === 6) {
					day = payload.sunday === 'busy' ? ['9:00', '18:00'] : payload.sunday;
					active = payload.sunday !== 'busy';
				}
				return { ...item, day, active };
			});
		},
		async schedule() {
			this.loading = true;
			const payload = {
				monday: this.items[0].active ? this.items[0].day : 'busy',
				tuesday: this.items[1].active ? this.items[1].day : 'busy',
				wednesday: this.items[2].active ? this.items[2].day : 'busy',
				thursday: this.items[3].active ? this.items[3].day : 'busy',
				friday: this.items[4].active ? this.items[4].day : 'busy',
				saturday: this.items[5].active ? this.items[5].day : 'busy',
				sunday: this.items[6].active ? this.items[6].day : 'busy',
			};
			this.psychologist = await this.setSchedule(payload);
			this.setDay(cloneDeep(this.psychologist.schedule));
			this.loading = false;
		},
		...mapActions({
			getPsychologist: 'Psychologist/getPsychologist',
			setSchedule: 'Psychologist/setSchedule',
		}),
	},
};
</script>
