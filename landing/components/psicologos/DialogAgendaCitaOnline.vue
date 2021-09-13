<template>
	<v-dialog
		v-model="dialog"
		:max-width="maxWidth"
		transition="dialog-top-transition"
		@click:outside="close"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				v-if="mode == '1'"
				dark
				v-bind="attrs"
				class="body-2 px-6"
				color="primary"
				depressed
				style="border-radius: 5px"
				v-on="on"
			>
				Agenda cita online
			</v-btn>
			<v-btn
				v-if="mode == '2'"
				dark
				v-bind="attrs"
				color="primary"
				rounded
				depressed
				v-on="on"
			>
				Agenda cita online
			</v-btn>
			<v-btn
				v-if="mode == '3'"
				dark
				v-bind="attrs"
				color="primary"
				rounded
				class="px-10 mx-1"
				v-on="on"
			>
				Agenda cita online
			</v-btn>
		</template>
		<v-card rounded="xl" min-height="400">
			<v-card-title class="primary white--text text-h5 py-3">
				<v-btn
					v-if="step != 0"
					icon
					@click="
						() => {
							if (step == 3) step = 1;
							else step -= 1;
						}
					"
				>
					<icon :icon="mdiChevronLeft" x-large color="white" />
				</v-btn>
				<v-spacer></v-spacer>
				<!-- plan -->
				<div v-if="step == 0" class="body-1 font-weight-bold">El mejor plan para ti</div>
				<!-- calendario -->
				<div v-if="step == 1" class="body-1 font-weight-bold">Agenda tu hora</div>
				<!-- auth -->
				<div v-if="step == 2" class="body-1 font-weight-bold">
					<div class="pr-11">
						{{ tab == 0 ? 'Iniciar sesión' : 'Registro' }}
					</div>
				</div>
				<!-- resumen -->
				<div v-if="step == 3" class="body-1 font-weight-bold">Revise su plan</div>
				<v-spacer></v-spacer>
			</v-card-title>
			<v-card-text v-if="step == 0">
				<select-plan :set-plan="plan => setPlan(plan)" />
			</v-card-text>
			<v-card-text v-if="step == 1" class="px-0 px-sm-2 px-md-4">
				<calendar
					:id-psy="psy._id"
					:set-date="date => setDate(date)"
					title-button="Agendar cita Online"
				/>
			</v-card-text>
			<v-card-text v-if="step == 2">
				<v-tabs-items v-model="tab">
					<v-tab-item>
						<v-card flat max-width="500" class="mx-auto">
							<v-img
								width="50"
								height="50"
								class="mx-auto mt-3"
								:src="`${$config.LANDING_URL}/logo_tiny.png`"
								:lazy-src="`${$config.LANDING_URL}/logo_tiny.png`"
							></v-img>
							<v-card-text><signin :is-dialog="true" /></v-card-text>
							<v-card-text class="pt-0">
								<div
									class="
										mb-2
										text-center
										subtitle-1
										font-weight-bold
										secondary--text
									"
								>
									<small> ¿No eres parte de Hablaquí? </small>
								</div>
								<v-btn outlined block rounded color="primary" @click="tab = 1">
									Crea una cuenta
								</v-btn>
								<div class="text-center mt-10">
									<v-btn class="px-0" text color="primary" nuxt to="/politicas">
										Aviso de privacidad
									</v-btn>
									<span class="primary--text mx-1">y</span>
									<v-btn class="px-0" text color="primary" nuxt to="/condiciones">
										Términos y Condiciones</v-btn
									>
								</div>
								<div class="text-center font-weight-bold caption secondary--text">
									2021 Hablaqui
								</div>
							</v-card-text>
						</v-card>
					</v-tab-item>
					<v-tab-item>
						<v-card flat max-width="500" class="mx-auto">
							<v-img
								width="50"
								height="50"
								class="mx-auto mt-3"
								:src="`${$config.LANDING_URL}/logo_tiny.png`"
								:lazy-src="`${$config.LANDING_URL}/logo_tiny.png`"
							>
							</v-img>
							<v-card-text><signup :is-dialog="true" /></v-card-text>
							<v-card-text class="pt-0">
								<div
									class="
										mb-2
										text-center
										subtitle-1
										font-weight-bold
										secondary--text
									"
								>
									<small> ¿Ya tienes cuenta Hablaquí? </small>
								</div>
								<v-btn outlined block rounded color="primary" @click="tab = 0">
									Entrar
								</v-btn>
								<div
									class="
										text-center
										font-weight-bold
										caption
										secondary--text
										pt-2
									"
								>
									2021 Hablaqui
								</div>
							</v-card-text>
						</v-card>
					</v-tab-item>
				</v-tabs-items>
			</v-card-text>
			<v-card-text v-if="step == 3">
				<resume-plan
					:close="() => (dialog = false)"
					:go-back="() => (step = 0)"
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
import { mdiChevronLeft } from '@mdi/js';

export default {
	components: {
		signin: () => import('~/components/auth/SignIn'),
		signup: () => import('~/components/auth/SignUp'),
		calendar: () => import('~/components/Calendar'),
		SelectPlan: () => import('~/components/plan/SelectPlan'),
		ResumePlan: () => import('~/components/plan/ResumePlan'),
		Icon: () => import('~/components/Icon'),
	},
	props: {
		mode: {
			type: String,
			default: '1',
		},
		psy: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			mdiChevronLeft,
			step: 0,
			tab: 1,
			dialog: false,
			plan: null,
			newEvent: null,
		};
	},
	computed: {
		maxWidth() {
			if (this.step === 1) return '700';
			if (this.step === 2) return '500';
			else if (this.step === 3) return '800';
			return '900';
		},
		...mapGetters({ resumeView: 'Psychologist/resumeView' }),
	},
	watch: {
		resumeView(newValue) {
			if (newValue) this.step = 3;
		},
	},
	methods: {
		close() {
			this.dialog = false;
			setTimeout(() => {
				this.step = 0;
				this.tab = 0;
				this.plan = null;
				this.newEvent = null;
			}, 300);
		},
		setDate(item) {
			this.newEvent = item;
			if (this.$auth.$state.loggedIn) this.step = 3;
			else this.step = 2;
		},
		setPlan(plan) {
			this.plan = plan;
			this.step = 1;
		},
	},
};
</script>

<style lang="scss" scoped>
.v-list-item {
	padding: 0 !important;
}
</style>
