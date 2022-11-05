<template>
	<v-container fluid style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down mb-16" title="Consultante" />
		<v-row v-if="selected">
			<v-col cols="12" class="d-flex algin-center px-0">
				<v-expansion-panels
					:flat="$vuetify.breakpoint.smAndDown"
					accordion
					class="rounded-xl"
				>
					<v-expansion-panel>
						<v-expansion-panel-header>
							<span style="flex: 2; align-self: center">
								<avatar
									size="40"
									:name="selected.name"
									:url="selected.avatarThumbnail"
								/>
								<span class="ml-4 secondary--text text-h6">
									{{ selected.name }}
									<span class="hidden-sm-and-down">
										{{ selected.lastName ? selected.lastName : '' }}
									</span>
								</span>
							</span>
							<span style="flex: 1" class="text-right">
								<v-tooltip bottom>
									<template #activator="{ on, attrs }">
										<v-btn
											v-bind="attrs"
											icon
											:to="`/dashboard/chat?client=${selected._id}`"
											v-on="on"
										>
											<icon
												size="30"
												:icon="mdiChatProcessingOutline"
												color="primary"
											></icon>
										</v-btn>
									</template>
									<span>Chatear con {{ selected.name }}</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template #activator="{ on, attrs }">
										<v-btn
											icon
											v-bind="attrs"
											:to="`/dashboard/agenda?dialog=${true}&client=${
												selected._id
											}`"
											v-on="on"
										>
											<icon
												size="30"
												:icon="mdiCalendarClockOutline"
												color="primary"
											></icon>
										</v-btn>
									</template>
									<span>Agregar sesión con {{ selected.name }}</span>
								</v-tooltip>
							</span>
							<template #actions>
								<v-btn icon>
									<icon size="30" :icon="mdiChevronDown" color="primary"></icon>
								</v-btn>
							</template>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-row>
								<v-col cols="12" sm="6">
									<v-text-field
										v-model="selected.name"
										disabled
										label="Nombre"
										dense
										filled
										outlined
									></v-text-field>
									<v-text-field
										v-model="selected.lastName"
										label="Apellido"
										dense
										filled
										outlined
									></v-text-field>
									<v-text-field
										v-model="selected.rut"
										label="Rut"
										dense
										filled
										outlined
									></v-text-field>
									<v-menu
										ref="menu"
										v-model="bmenu"
										:close-on-content-click="false"
										transition="scale-transition"
										offset-y
										min-width="auto"
									>
										<v-date-picker
											v-model="selected.birthDate"
											locale="es"
											:active-picker.sync="activePicker"
											:max="
												new Date(
													Date.now() -
														new Date().getTimezoneOffset() * 60000
												)
													.toISOString()
													.substr(0, 10)
											"
											min="1950-01-01"
											@change="save"
										></v-date-picker>
									</v-menu>
									<v-text-field
										:value="
											selected.birthDate ? getAge(selected.birthDate) : ''
										"
										label="Edad"
										disabled
										dense
										filled
										outlined
									></v-text-field>
									<v-text-field
										:value="selected.plan ? selected.plan.title : 'Sin plan'"
										label="Plan contratado"
										disabled
										dense
										filled
										outlined
									></v-text-field>
									<v-text-field
										:value="
											selected.plan
												? `$${selected.plan.sessionPrice}`
												: 'Sin plan'
										"
										label="Valor por sesión"
										disabled
										dense
										filled
										outlined
									></v-text-field>
								</v-col>
								<v-divider class="hidden-sm-and-down" vertical></v-divider>
								<v-col cols="12" sm="6">
									<v-textarea
										v-model="selected.observation"
										label="Observaciones"
										dense
										filled
										outlined
										no-resize
									></v-textarea>
								</v-col>
								<v-col cols="12" class="text-right">
									<v-btn small color="primary" rounded @click="onSubmit">
										Guardar
									</v-btn>
								</v-col>
							</v-row>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
			<v-col cols="12">
				<table-pagos
					:loading="loading"
					:items="payments.filter(item => item.user === selected._id)"
				></table-pagos>
			</v-col>
		</v-row>
		<v-overlay :value="loading">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import {
	mdiChatProcessingOutline,
	mdiCalendarClockOutline,
	mdiChevronDown,
	mdiChevronLeft,
} from '@mdi/js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		TablePagos: () => import('~/components/dashboard/TablePagos'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			selected: null,
			loading: false,
			mdiChatProcessingOutline,
			mdiCalendarClockOutline,
			mdiChevronDown,
			mdiChevronLeft,
			bmenu: false,
			activePicker: null,
		};
	},
	computed: {
		...mapGetters({ clients: 'Psychologist/clients', payments: 'Psychologist/payments' }),
	},
	watch: {
		bmenu(val) {
			val && setTimeout(() => (this.activePicker = 'YEAR'));
		},
		clients: {
			handler(newValue) {
				if (newValue) {
					this.selected = newValue.find(client => client._id === this.$route.query.id);
				}
			},
			immediate: true,
		},
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async onSubmit() {
			this.loading = true;
			await this.updateOne({
				_id: this.selected._id,
				lastName: this.selected.lastName,
				rut: this.selected.rut,
				direction: this.selected.direction,
				birthDate: this.selected.birthDate,
				phone: this.selected.phone,
			});
			await this.updateSessions({
				_id: this.selected.sessionsId,
				observation: this.selected.observation,
			});
			this.loading = false;
		},
		async initFetch() {
			this.loading = true;
			await this.getPayments();
			this.loading = false;
		},
		getAge(date) {
			return dayjs().diff(date, 'years');
		},
		save(date) {
			this.$refs.menu.save(date);
		},
		...mapActions({
			getPayments: 'Psychologist/getPayments',
			updateSessions: 'Psychologist/updateSessions',
			updateOne: 'User/updateOne',
		}),
	},
};
</script>
