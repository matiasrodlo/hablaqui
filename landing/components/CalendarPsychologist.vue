<template>
	<div :id="idPsy">
		<v-row
			v-if="!sessions.length"
			class="ma-0"
			style="height: 280px"
			align="center"
			justify="center"
		>
			<v-progress-circular indeterminate color="primary" />
		</v-row>
		<template v-else>
			<div :style="heighCalendar" style="overflow-y: clip">
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
							<div class="text-center" @click="toggle">
								<div
									class="body-2 font-weight-bold text-capitalize"
									style="color: #706f6f"
								>
									{{ item.text }}
								</div>
								<div class="caption text--secondary text-capitalize">
									{{ item.day }}
								</div>
							</div>
							<div class="mt-3">
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
									@click.stop="goPlans(item, n, r)"
								>
									{{ n }}
								</v-sheet>
							</div>
						</v-container>
					</v-slide-item>
				</v-slide-group>
			</div>
			<div class="text-center">
				<v-btn
					small
					text
					color="primary"
					class="mt-5"
					@click="
						() => {
							if (heighCalendar === 'max-height: 230px') {
								heighCalendar = 'max-height: 100%';
								setFullCard(idPsy);
							} else {
								heighCalendar = 'max-height: 230px';
								setMinimalCard();
							}
						}
					"
				>
					<span class="mr-2">
						{{ heighCalendar === 'max-height: 230px' ? 'Más horarios' : 'Ver menos' }}
					</span>
					<icon
						color="primary"
						:icon="
							heighCalendar === 'max-height: 230px' ? mdiChevronDown : mdiChevronUp
						"
					/>
				</v-btn>
			</div>
		</template>
	</div>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight, mdiChevronDown, mdiChevronUp } from '@mdi/js';
/**
 * calendario para psicologos
 */
export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		callback: {
			type: Function,
			required: true,
		},
		setFullCard: {
			type: Function,
			required: true,
		},
		setMinimalCard: {
			type: Function,
			required: true,
		},
		titleButton: { type: String, default: 'Agendar una cita online' },
		idPsy: { type: String, default: '' },
		username: { type: String, default: '' },
		loadingBtn: { type: Boolean, default: false },
		sessions: { type: Array, default: () => [] },
	},
	data() {
		return {
			heighCalendar: 'max-height: 230px',
			mdiChevronDown,
			mdiChevronUp,
			mdiChevronLeft,
			mdiChevronRight,
			slide: 0,
			selected: null,
		};
	},
	methods: {
		/**
		 * redirige si esta logeado a plans o auth si no esta logeado
		 */
		goPlans(item, hour, index) {
			if (!this.$auth.$state.loggedIn) {
				this.$router.push({
					path: `/auth/?psychologist=${this.username}&date=${
						item.date
					}&start=${hour}&end=${item.available[index + 1]}`,
				});
			} else if (
				this.$auth.$state.loggedIn &&
				this.$auth.$state.user.role !== 'psychologist'
			) {
				this.callback();
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

/* .content::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background-image: linear-gradient(to top, #fff, #ffffff80, #fff0);
	height: 32px;
} */
.sticky {
	position: -webkit-sticky !important;
	position: sticky !important;
	top: 0 !important;
}
</style>
