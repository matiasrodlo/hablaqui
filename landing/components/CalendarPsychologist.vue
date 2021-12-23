<template>
	<div :id="idPsy">
		<v-row
			v-if="!sessions.length"
			class="ma-0"
			style="height: 300px"
			align="center"
			justify="center"
		>
			<v-progress-circular indeterminate color="primary" />
		</v-row>
		<template v-else>
			<div style="max-height: 280px; overflow-y: auto">
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
					<v-slide-item v-for="(item, k) in sessions" :key="k" v-slot="{ toggle }">
						<v-container class="pb-0 px-4">
							<div class="sticky text-center" @click="toggle">
								<div class="body-2 primary--text font-weight-bold">
									{{ item.text }}
								</div>
								<div class="caption text--secondary">{{ item.day }}</div>
							</div>
							<div class="mt-3" style="">
								<template v-if="item.available.length">
									<v-sheet
										v-for="(n, r) in item.available"
										:key="r"
										rounded
										class="item text-center my-3 pa-1"
										style="width: 100%; height: fit-content"
										:class="
											selected &&
											selected.start == n &&
											selected.date == item.date
												? 'itemSelected'
												: ''
										"
										@click.stop="
											selected = {
												date: item.date,
												start: n,
												end: item.available[r + 1],
											}
										"
									>
										{{ n }}
									</v-sheet>
								</template>
								<template v-else> </template>
							</div>
						</v-container>
					</v-slide-item>
				</v-slide-group>
			</div>
			<div class="text-center">
				<v-btn
					:loading="loadingBtn"
					:disabled="!selected"
					color="primary"
					text
					style="width: 200px"
					class="mt-5"
					@click="
						() => {
							if (selected) setDate(selected);
						}
					"
				>
					<span class="mr-4">Mas horarios</span> <icon :icon="mdiChevronDown" />
				</v-btn>
			</div>
		</template>
	</div>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight, mdiChevronDown } from '@mdi/js';
export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		setDate: {
			type: Function,
			required: true,
		},
		titleButton: { type: String, default: 'Agendar una cita online' },
		idPsy: { type: String, default: '' },
		loadingBtn: { type: Boolean, default: false },
		sessions: { type: Array, default: () => [] },
	},
	data() {
		return {
			mdiChevronDown,
			mdiChevronLeft,
			mdiChevronRight,
			slide: 0,
			selected: null,
		};
	},
};
</script>

<style lang="css" scoped>
.v-slide-group__next,
.v-slide-group__prev {
	align-self: start;
}

/* ::-webkit-scrollbar {
	display: none;
} */

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

.busy {
	font-size: 12px;
	border-radius: 2px;
	border: 1px solid #d6828280;
	background-color: #daa4a480;
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
.sticky {
	position: -webkit-sticky !important;
	position: sticky !important;
	top: 0 !important;
}
</style>
