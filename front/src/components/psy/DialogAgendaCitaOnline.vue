<template>
	<v-dialog
		v-model="dialog"
		:max-width="step == 0 ? '700' : '900'"
		transition="dialog-top-transition"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				v-bind="attrs"
				v-on="on"
				v-if="mode == '1'"
				class="body-2 px-6"
				color="primary"
				depressed
				style="border-radius: 5px"
			>
				Agenda cita online
			</v-btn>
			<v-btn v-bind="attrs" v-on="on" v-if="mode == '2'" color="primary" rounded depressed>
				Agenda cita online
			</v-btn>
			<v-btn v-if="mode == '3'" v-bind="attrs" v-on="on" color="primary" rounded>
				Agenda cita online
			</v-btn>
		</template>
		<v-card rounded="xl">
			<v-card-title class="primary white--text text-h5 py-5">
				<v-btn icon v-if="step != 0 && step != 3" @click="() => (step -= 1)">
					<v-icon color="white" x-large>mdi-chevron-left</v-icon>
				</v-btn>
				<v-spacer></v-spacer>
				<div v-if="step == 0" class="body-1 font-weight-bold">
					Agenda tu hora
				</div>
				<div v-if="step == 1" class="body-1 font-weight-bold">El mejor plan para ti</div>
				<div v-if="step == 2" class="body-1 font-weight-bold">
					Para continuar
				</div>
				<div v-if="step == 3" class="body-1 font-weight-bold">
					Revisa tu plan
				</div>
				<v-spacer></v-spacer>
			</v-card-title>
			<v-card-text v-if="step == 0" class="px-0 px-sm-2 px-md-4">
				<calendar :setDate="date => setDate(date)" titleButton="Agendar cita Online" />
			</v-card-text>
			<v-card-text v-if="step == 1">
				<select-plan :setPlan="plan => setPlan(plan)" />
			</v-card-text>
			<v-card-text v-if="step == 2">
				<v-tabs v-model="tab">
					<v-tab>Ingresar</v-tab>
					<v-tab>Registrate</v-tab>
				</v-tabs>
				<v-tabs-items v-model="tab">
					<v-tab-item>
						<v-card flat>
							<v-card-text><signin /></v-card-text>
						</v-card>
					</v-tab-item>
					<v-tab-item>
						<v-card flat>
							<v-card-text><signup /></v-card-text>
						</v-card>
					</v-tab-item>
				</v-tabs-items>
			</v-card-text>
			<v-card-text v-if="step == 3">
				<resume-plan
					:close="() => (dialog = false)"
					:goBack="() => (step = 1)"
					:plan="plan"
					:psy="psy"
					:event="newEvent"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	props: {
		mode: {
			type: String,
			default: '1',
		},
		psy: {
			type: Object,
			require: true,
		},
	},
	components: {
		signin: () => import('@/components/auth/SignIn'),
		signup: () => import('@/components/auth/SignUp'),
		calendar: () => import('@/components/ui/Calendar'),
		SelectPlan: () => import('@/components/plan/SelectPlan'),
		ResumePlan: () => import('@/components/plan/ResumePlan'),
	},
	data() {
		return {
			step: 0,
			tab: 0,
			dialog: false,
			plan: null,
			newEvent: null,
		};
	},
	computed: {
		...mapGetters({ loggedIn: 'User/loggedIn', resumeView: 'Psychologist/resumeView' }),
	},
	methods: {
		setDate(item) {
			this.newEvent = item;
			this.step = 1;
		},
		setPlan(plan) {
			this.plan = plan;
			if (this.loggedIn) this.step = 3;
			else this.step = 2;
		},
	},
	watch: {
		resumeView(newValue) {
			if (newValue) this.step = 3;
		},
	},
};
</script>

<style lang="scss" scoped>
.v-list-item {
	padding: 0 !important;
}
</style>
