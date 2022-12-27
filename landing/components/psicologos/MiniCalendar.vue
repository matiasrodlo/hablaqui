<template>
	<div class="my-3">
		<div class="d-flex mb-2">
			<icon size="24px" color="#3c3c3b" :icon="mdiCalendarOutline" />
			<span class="pt-1 ml-2 body-2 font-weight-medium" style="color: #3c3c3b">
				Próxima fecha:
				<span v-if="sessionsAvailable" class="text-capitalize">
					{{ formatDate(sessionsAvailable.date) }}
				</span>
			</span>
		</div>
		<div v-if="sessionsAvailable" class="d-flex">
			<template v-for="(n, r) in sessionsAvailable.available">
				<span
					v-if="r < 3"
					:key="r"
					rounded
					class="item text-center my-3 pa-1 mr-4"
					style="width: 60px; height: fit-content; border-radius: 4px"
					:class="
						selected && selected.start == n && selected.date == item.date
							? 'itemSelected'
							: ''
					"
					@click.stop="goPlans(sessionsAvailable, n, r)"
				>
					{{ n }}
				</span>
			</template>
			<span
				rounded
				class="text-center my-3 pa-1 primary--text font-weight-medium caption"
				style="
					width: 100px;
					border-radius: 4px;
					height: fit-content;
					background-color: rgba(26, 165, 216, 0.16);
				"
				@click="dialog = true"
			>
				Ver más
				<icon size="16px" :icon="mdiChevronRight" />
			</span>
			<v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
				<v-card style="height: fit-content; display: flex; flex-direction: column">
					<v-card-title style="flex: 0" class="titleColor d-flex justify-space-between">
						<div>Calendario</div>
						<v-btn icon @click="dialog = false">
							<icon size="30px" color="#717171" :icon="mdiCloseCircle" />
						</v-btn>
					</v-card-title>
					<v-card-text style="flex: 1" class="pa-0">
						<calendar
							:id-psy="idPsy"
							:username="username"
							:sessions="sessions"
							:callback="date => null"
							:set-full-card="id => fullcard.push(id)"
							:set-minimal-card="id => fullcard.filter(id => idPsy !== id)"
						/>
					</v-card-text>
					<v-card-actions style="flex: 0">
						<v-btn
							color="primary"
							block
							rounded
							@click="
								() => {
									if ($route.name === 'psicologos') $router.push(`/${username}`);
									else dialog = false;
								}
							"
						>
							Mostrar perfil
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</div>
		<div v-if="$route.name === 'slug'">
			<v-btn
				block
				small
				rounded
				color="#2680eb"
				dark
				class="my-6 px-8 py-2"
				@click="dialog = true"
			>
				Agendar cita online
			</v-btn>
		</div>
	</div>
</template>

<script>
import { mdiCalendarOutline, mdiChevronRight, mdiCloseCircle } from '@mdi/js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

/**
 * mini calendario
 */
export default {
	components: {
		Icon: () => import('~/components/Icon'),
		Calendar: () => import('~/components/CalendarPsychologist'),
	},
	props: {
		idPsy: { type: String, default: '' },
		username: { type: String, default: '' },
		sessions: { type: Array, default: () => [] },
	},
	data() {
		return {
			fullcard: [],
			mdiCalendarOutline,
			mdiChevronRight,
			mdiCloseCircle,
			selected: null,
			dialog: false,
		};
	},
	computed: {
		/**
		 * sesiones disponible
		 */
		sessionsAvailable() {
			const sessions = [...this.sessions];
			const items = sessions.filter(item => item.available.length > 2);
			return items[0];
		},
	},
	methods: {
		/**
		 * formatea la fecha
		 */
		formatDate(item) {
			return dayjs.tz(dayjs(item, 'MM/DD/YYYY')).format('dddd DD MMMM YYYY');
		},
		/**
		 * ir a planes
		 */
		goPlans(item, hour, index) {
			if (!this.$auth.$state.loggedIn) {
				this.$router.push({
					path: `/auth/?psychologist=${this.username}&date=${
						item.date
					}&start=${hour}&end=${item.available[index + 1]}`,
				});
			} else {
				this.$router.push(
					`/psicologos/pagos/?username=${this.username}&date=${
						item.date
					}&start=${hour}&end=${item.available[index + 1]}`
				);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.itemSelected {
	border: 1px solid #0085ff;
	box-shadow: rgb(0 133 255) 0px 0px 3px inset;
}
.item {
	white-space: nowrap;
	transition: transform 0.3s ease 0s, border 0.2s ease 0s, box-shadow 0.2s ease 0s;
	text-align: center;
	cursor: pointer;
	font-size: 12px;
	line-height: 16px;
	color: #565656;
	padding: 8px 5px;
	border: 1px solid #0085ff80;
	box-sizing: border-box;
	border-radius: 2px;
}
</style>
