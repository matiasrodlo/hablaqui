<template>
	<div>
		<v-slide-group class="content" v-model="slide" center-active show-arrows>
			<template #prev>
				<div class="align-self-start mt-4">
					<v-icon>mdi-chevron-left</v-icon>
				</div>
			</template>
			<template #next>
				<div class="align-self-start mt-4">
					<v-icon>mdi-chevron-right</v-icon>
				</div>
			</template>
			<v-slide-item v-for="(item, k) in items" :key="k" v-slot="{ toggle }">
				<v-container class="pb-0" @click="toggle">
					<div class="text-center">
						<div class="primary--text font-weight-bold">{{ item.text }}</div>
						<div class="text--secondary">{{ item.day }}</div>
					</div>
					<div
						class="mt-3"
						style="overscroll-behavior: contain; max-height: 272px; overflow: hidden auto;"
					>
						<v-sheet
							rounded
							v-for="(n, r) in item.available"
							:key="r"
							@click.stop="
								selected = { date: item.date, start: n, end: item.available[r + 1] }
							"
							class="item text-center my-3 pa-2"
							style="width: 100%; height: fit-content; cursor: pointer;"
							:class="
								selected && selected.start == n && selected.date == item.date
									? 'itemSelected'
									: ''
							"
						>
							{{ n }}
						</v-sheet>
					</div>
				</v-container>
			</v-slide-item>
		</v-slide-group>
		<div class="text-center">
			<v-btn
				:disabled="!selected"
				color="primary"
				text
				class="mt-5"
				@click="setDate(selected)"
			>
				{{ titleButton }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
export default {
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
			slide: 0,
			today: moment(),
			selected: null,
			hours: [
				'00:00am',
				'1:00am',
				'2:00am',
				'3:00am',
				'4:00am',
				'5:00am',
				'6:00am',
				'7:00am',
				'8:00am',
				'9:00am',
				'10:00am',
				'11:00am',
				'12:00pm',
				'1:00pm',
				'2:00pm',
				'3:00pm',
				'4:00pm',
				'5:00pm',
				'6:00pm',
				'7:00pm',
				'8:00pm',
				'9:00pm',
				'10:00pm',
				'11:00pm',
			],
			items: [],
			length: Array.from(Array(90), (_, x) => x),
		};
	},
	created() {
		moment.locale('es');
		this.items = [
			{
				id: 1,
				text: moment().format('ddd'),
				day: moment().format('DD MMM'),
				date: moment().format('L'),
				available: this.hours,
			},
		];
	},
	mounted() {
		this.addDays();
	},
	methods: {
		addDays() {
			this.length.map(el => {
				const day = moment(this.items[-1]).add(el, 'days');
				if (el != 0)
					this.items = [
						...this.items,
						{
							id: el,
							text: day.format('ddd'),
							day: day.format('DD MMM'),
							date: day.format('L'),
							available: this.hours.filter(hour => {
								return !this.sessions.some(u => {
									return (
										u.start == hour && moment(u).format('L') == day.format('L')
									);
								});
							}),
						},
					];
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
