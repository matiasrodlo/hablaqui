<template>
	<v-dialog
		v-model="dialog"
		:max-width="maxWidth"
		transition="dialog-top-transition"
		@click:outside="close"
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
				<v-btn
					icon
					v-if="step != 0"
					@click="
						() => {
							if (step == 3) step = 1;
							else step -= 1;
						}
					"
				>
					<v-icon color="white" x-large>mdi-chevron-left</v-icon>
				</v-btn>
				<v-spacer></v-spacer>
				<div v-if="step == 0" class="body-1 font-weight-bold">
					Agenda tu hora
				</div>
				<div v-if="step == 1" class="body-1 font-weight-bold">El mejor plan para ti</div>
				<div v-if="step == 2" class="body-1 font-weight-bold">
					{{ tab == 0 ? 'Iniciar sesión' : 'Registro' }}
				</div>
				<div v-if="step == 3" class="body-1 font-weight-bold">
					Detalles
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
				<v-tabs-items v-model="tab">
					<v-tab-item>
						<v-card flat max-width="500" class="mx-auto">
							<v-img
								width="80"
								height="80"
								class="mx-auto mt-8"
								src="/img/logo_tiny.png"
							></v-img>
							<v-card-text><signin :isDialog="true"/></v-card-text>
							<v-card-text class="pt-0">
								<div
									class="mb-2 text-center subtitle-1 font-weight-bold secondary--text"
								>
									<small>
										¿No eres parte de Hablaquí?
									</small>
								</div>
								<v-btn outlined block rounded color="primary" @click="tab = 1">
									Crea una cuenta
								</v-btn>
								<div class="text-center mt-10">
									<v-btn
										class="px-0"
										text
										color="primary"
										:href="`${landingUrl}/politicas`"
									>
										Aviso de privacidad
									</v-btn>
									<span class="primary--text mx-1">y</span>
									<v-btn
										class="px-0"
										text
										color="primary"
										:href="`${landingUrl}/condiciones`"
									>
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
								width="80"
								height="80"
								class="mx-auto mt-8"
								src="/img/logo_tiny.png"
							>
							</v-img>
							<v-card-text><signup :isDialog="true"/></v-card-text>
							<v-card-text class="pt-0">
								<div
									class="mb-2 text-center subtitle-1 font-weight-bold secondary--text"
								>
									<small>
										¿Ya tienes cuenta Hablaquí?
									</small>
								</div>
								<v-btn outlined block rounded color="primary" @click="tab = 0">
									Entrar
								</v-btn>
								<div class="text-center mt-10">
									<v-btn
										class="px-0"
										text
										color="primary"
										:href="`${landingUrl}/politicas`"
										>Aviso de privacidad</v-btn
									>
									<span class="primary--text mx-1">y</span>
									<v-btn
										class="px-0"
										text
										color="primary"
										:href="`${landingUrl}/condiciones`"
									>
										Términos y Condiciones</v-btn
									>
								</div>
								<div class="text-center font-weight-bold caption secondary--text">
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
import { landing } from '@/config';

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
		landingUrl() {
			return landing;
		},
		maxWidth() {
			if (this.step == 0) return '700';
			else if (this.step == 3) return '800';
			return '900';
		},
		...mapGetters({ loggedIn: 'User/loggedIn', resumeView: 'Psychologist/resumeView' }),
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
