<template>
	<div>
		<v-slide-group v-model="slide" class="content" center-active show-arrows>
			<template #prev>
				<div class="align-self-start mt-4">
					<icon :icon="mdiChevronLeft" />
				</div>
			</template>
			<template #next>
				<div class="align-self-start mt-4">
					<icon :icon="mdiChevronRight" />
				</div>
			</template>
			<v-slide-item v-for="(item, k) in items" :key="k" v-slot="{ toggle }">
				<v-container class="pb-0 px-2 px-sm-4">
					<div class="text-center" @click="toggle">
						<div class="primary--text font-weight-bold">{{ item.text }}</div>
						<div class="text--secondary">{{ item.day }}</div>
					</div>
					<div
						v-dragscroll
						class="mt-3"
						style="
							overscroll-behavior: contain;
							max-height: 272px;
							overflow: hidden auto;
						"
					>
						<v-sheet
							v-for="(n, r) in item.available"
							:key="r"
							rounded
							class="item text-center my-3 pa-2"
							style="width: 100%; height: fit-content"
							:class="
								selected && selected.start == n && selected.date == item.date
									? 'itemSelected'
									: ''
							"
							@click.stop="
								selected = { date: item.date, start: n, end: item.available[r + 1] }
							"
						>
							{{ n }}
						</v-sheet>
					</div>
				</v-container>
			</v-slide-item>
		</v-slide-group>
		<div
			style="max-width: 200px"
			:class="selected ? 'primary pointer' : 'blue-grey lighten-3'"
			class="px-3 py-2 mx-auto text-center body-1 mt-5 rounded-xl white--text"
			@click="
				() => {
					if (selected) setDate(selected);
				}
			"
		>
			{{ titleButton }}
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import { dragscroll } from 'vue-dragscroll';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

export default {
	directives: {
		dragscroll,
	},
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		sessions: {
			type: Array,
			default: () => [],
		},
		setDate: {
			type: Function,
			required: true,
		},
		titleButton: { type: String, default: 'Agendar una cita online' },
	},
	data() {
		return {
			mdiChevronLeft,
			mdiChevronRight,
			slide: 0,
			today: moment(),
			selected: null,
			hours: [
				'01:00',
				'02:00',
				'03:00',
				'04:00',
				'05:00',
				'06:00',
				'07:00',
				'08:00',
				'09:00',
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
				'00:00',
			],
			items: [],
			length: Array.from(Array(31), (_, x) => x),
		};
	},
	created() {
		moment.locale('es');
	},
	mounted() {
		this.addDays();
	},
	methods: {
		addDays() {
			const daySessions = this.sessions.map(session =>
				moment(session.date).format('YYYY-MM-DD HH:mm')
			);
			this.items = this.length.map(el => {
				const day = moment().add(el, 'days');
				return {
					id: el,
					text: day.format('ddd'),
					day: day.format('DD MMM'),
					date: day.format('L'),
					available: this.hours.filter(hour => {
						return !daySessions.some(
							date =>
								moment(date).format('L') === moment(day).format('L') &&
								hour === moment(date).format('HH:mm')
						);
					}),
				};
			});
		},
	},
};
</script>

<style lang="css" scoped>
.v-slide-group__next,
.v-slide-group__prev {
	align-self: start;
}

::-webkit-scrollbar {
	display: none;
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

.itemSelected {
	border: 1px solid #0085ff;
	box-shadow: rgb(0 133 255) 0px 0px 3px inset;
}

.content::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background-image: linear-gradient(to top, #fff, #ffffff80, #fff0);
	height: 32px;
}
</style>
