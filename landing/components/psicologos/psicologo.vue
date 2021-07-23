<template>
	<v-container>
		<client-only>
			<template v-if="!psychologist">
				<v-col cols="12">
					<v-skeleton-loader type="image" />
				</v-col>
				<v-col cols="12">
					<v-skeleton-loader type="image, image, image" height="600" />
				</v-col>
			</template>
			<v-card v-else>
				<v-card-text>
					<v-row align="center" justify="center">
						<v-col cols="12" md="3" class="text-center">
							<v-list-item-avatar
								:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
								:color="psychologist.avatar ? 'trasnparent' : 'primary'"
								class="ml-4"
							>
								<v-img
									v-if="psychologist.avatar"
									:lazy-src="psychologist.avatar"
									:src="psychologist.avatar"
								>
									<template #placeholder>
										<v-row
											class="fill-height ma-0"
											align="center"
											justify="center"
										>
											<v-progress-circular indeterminate color="primary" />
										</v-row>
									</template>
								</v-img>
								<span v-else class="white--text text-h2 font-weight-bold">
									{{ psychologist.name.substr(0, 1) }}
								</span>
							</v-list-item-avatar>
							<div
								v-if="$vuetify.breakpoint.mdAndUp && psychologist.code"
								class="caption text--secondary"
							>
								Codigo {{ psychologist.code }}
							</div>
						</v-col>
						<v-col cols="12" md="9">
							<v-row justify="space-between">
								<v-col
									class="
										text-center text-md-left
										font-weight-bold
										text-h6 text-md-h4 text-xl-h3 text--secondary
									"
								>
									{{ psychologist.name }}
									{{ psychologist.lastName && psychologist.lastName }}
									<div
										v-if="!$vuetify.breakpoint.mdAndUp && psychologist.code"
										class="caption text--secondary"
									>
										Codigo {{ psychologist.code }}
									</div>
								</v-col>
								<v-col cols="12" md="5" lg="4" class="text-center text-lg-right">
									<dialog-agenda-cita-online :psy="psychologist" mode="3" />
									<v-btn
										v-if="
											!$auth.$state.loggedIn ||
											$auth.$state.user.role == 'user'
										"
										:loading="loadingChat"
										rounded
										class="info mx-1 my-2"
										@click="goChat"
									>
										Chatear con especialista
									</v-btn>
								</v-col>
							</v-row>
							<template v-for="(tag, i) in psychologist.specialties">
								<v-chip v-if="i < 4" :key="i" class="ma-2" small>
									{{ tag }}
								</v-chip>
							</template>
							<div class="body-2 mt-2">
								{{ psychologist.professionalDescription }}
							</div>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
			<v-card v-if="psychologist" class="mt-6">
				<v-card-text class="text-h5 primary--text font-weight-bold">Perfil</v-card-text>
				<v-card-text>
					<v-divider></v-divider>
				</v-card-text>
				<v-card-text>
					<v-row align="center">
						<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
							Experiencia
						</v-col>
						<v-col class="body-1 text-left">
							<ul v-if="psychologist.experience && psychologist.experience.length">
								<li v-for="(experience, i) in psychologist.experience" :key="i">
									{{ experience }}
								</li>
							</ul>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-text>
					<v-divider></v-divider>
				</v-card-text>
				<v-card-text>
					<v-row align="center">
						<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
							Especialidades
						</v-col>
						<v-col
							v-if="psychologist.specialties && psychologist.specialties.length"
							class="body-1 text-left"
						>
							<ul>
								<li v-for="(item, i) in psychologist.specialties" :key="i">
									{{ item }}
								</li>
							</ul>
						</v-col>
						<v-col v-else class="body-1 text-left text-capitalize"> Vacío </v-col>
					</v-row>
				</v-card-text>
				<v-card-text>
					<v-divider></v-divider>
				</v-card-text>
				<v-card-text>
					<v-row align="center">
						<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
							Modelos de trabajo terapéutico
						</v-col>
						<v-col class="body-1 text-left">
							<ul v-if="psychologist.models && psychologist.models.length">
								<li v-for="(model, i) in psychologist.models" :key="i">
									{{ model }}
								</li>
							</ul>
							<div v-else>Vacío</div>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-text>
					<v-divider></v-divider>
				</v-card-text>
				<v-card-text>
					<v-row align="center">
						<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
							Formación
						</v-col>
						<v-col class="body-1 text-left">
							<ul v-if="psychologist.formation && psychologist.formation.length">
								<li v-for="(formation, i) in psychologist.formation" :key="i">
									{{ formation }}
								</li>
							</ul>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-text><v-divider></v-divider></v-card-text>
				<v-card-text>
					<v-row align="center">
						<v-col cols="12" md="3" class="align-self-start subtitle-1 primary--text">
							Descripción personal
						</v-col>
						<v-col class="body-1 text-left">
							{{
								psychologist.personalDescription
									? psychologist.personalDescription
									: 'Sin descripcion'
							}}
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
			<v-dialog v-model="dialog" transition="dialog-top-transition" width="450">
				<v-card rounded="xl">
					<v-card-text>
						<v-tabs-items v-model="tab">
							<v-tab-item>
								<v-card flat max-width="500" class="mx-auto">
									<v-img
										width="80"
										height="80"
										class="mx-auto mt-8"
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
										<v-btn
											outlined
											block
											rounded
											color="primary"
											@click="tab = 1"
										>
											Crea una cuenta
										</v-btn>
										<div class="text-center mt-10">
											<v-btn
												class="px-0"
												text
												color="primary"
												to="/politicas"
											>
												Aviso de privacidad
											</v-btn>
											<span class="primary--text mx-1">y</span>
											<v-btn
												class="px-0"
												text
												color="primary"
												to="/condiciones"
											>
												Términos y Condiciones</v-btn
											>
										</div>
										<div
											class="
												text-center
												font-weight-bold
												caption
												secondary--text
											"
										>
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
										<v-btn
											outlined
											block
											rounded
											color="primary"
											@click="tab = 0"
										>
											Entrar
										</v-btn>
										<div class="text-center mt-2">
											<v-btn class="pa-0" text color="primary" to="/politicas"
												>Aviso de privacidad</v-btn
											>
											<span class="primary--text mx-1">y</span>
											<v-btn
												class="pa-0"
												text
												color="primary"
												to="/condicione`"
											>
												Términos y Condiciones</v-btn
											>
										</div>
										<div
											class="
												text-center
												font-weight-bold
												caption
												secondary--text
											"
										>
											2021 Hablaqui
										</div>
									</v-card-text>
								</v-card>
							</v-tab-item>
						</v-tabs-items>
					</v-card-text>
				</v-card>
			</v-dialog>
		</client-only>
	</v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	components: {
		signin: () => import('@/components/auth/SignIn'),
		signup: () => import('@/components/auth/SignUp'),
		DialogAgendaCitaOnline: () => import('@/components/psicologos/DialogAgendaCitaOnline'),
	},
	props: {
		psychologist: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			loadingChat: false,
			dialog: false,
			tab: 1,
		};
	},
	computed: {
		...mapGetters({
			resumeView: 'Psychologist/resumeView',
		}),
	},
	watch: {
		resumeView(newValue) {
			if (newValue && this.dialog) {
				this.dialog = false;
				this.setFloatingChat(true);
			}
		},
	},
	created() {
		this.setFloatingChat(false);
	},
	methods: {
		toAuth(item) {
			localStorage.setItem('psi', JSON.stringify(item));
			if (this.$auth.$state.loggedIn) this.$router.push({ name: 'plan' });
			else this.$router.push({ path: '/auth/q=register' });
		},
		goChat() {
			if (!this.$auth.$state.loggedIn) {
				this.dialog = true;
			} else {
				this.setFloatingChat(true);
			}
		},
		...mapMutations({
			setFloatingChat: 'Chat/setFloatingChat',
		}),
	},
};
</script>
