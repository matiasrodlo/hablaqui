<template>
	<div>
		<v-card outlined style="max-width: 640px">
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

export default {
	data() {
		return {
			loading: false,
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
	mounted() {
		console.log(this.$auth);
	},
	methods: {
		async schedule() {
			this.loading = true;
			const payload = {
				monday: this.items[0].day,
				tuesday: this.items[1].day,
				wednesday: this.items[2].day,
				thursday: this.items[3].day,
				friday: this.items[4].day,
				saturday: this.items[5].day,
				sunday: this.items[6].day,
			};
			await this.setSchedule(payload);
			this.loading = false;
		},
		...mapActions({ setSchedule: 'Psychologist/setSchedule' }),
	},
};
</script>
