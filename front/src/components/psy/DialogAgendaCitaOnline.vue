<template>
	<v-dialog v-model="dialog" max-width="700">
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
				Agenda cita oline
			</v-btn>
			<v-btn v-bind="attrs" v-on="on" v-if="mode == '2'" color="primary" rounded depressed>
				Agenda cita oline
			</v-btn>
		</template>
		<v-card rounded="xl">
			<v-card-title class="text-h5">
				<v-btn icon v-if="step != 0" @click="() => (step -= 1)">
					<v-icon x-large>mdi-chevron-left</v-icon>
				</v-btn>
				<v-spacer></v-spacer>
				<div v-if="step == 0" class="body-1 font-weight-bold">Elige un horario</div>
				<div v-if="step == 1" class="body-1 font-weight-bold">Elige un plan</div>
				<div v-if="step == 2" class="body-1 font-weight-bold">
					Para continuar
				</div>
				<div v-if="step == 3" class="body-1 font-weight-bold">
					Revisa tu plan
				</div>
			</v-card-title>
			<v-card-text v-if="step == 0">
				<calendar :setDate="date => setDate(date)" />
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

<style lang="scss" scoped></style>
