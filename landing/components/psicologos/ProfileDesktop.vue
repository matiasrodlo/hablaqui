<template>
	<client-only>
		<v-container>
			<v-row>
				<v-col cols="8">
					<v-card>
						<v-card-text>
							<v-row align="center" justify="center">
								<v-col cols="12" md="3" class="text-center">
									<v-list-item-avatar
										:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
										class="ml-4"
									>
										<avatar
											:url="avatar(psychologist)"
											:name="psychologist.name"
											:last-name="
												psychologist.lastName ? psychologist.lastName : ''
											"
											:size="$vuetify.breakpoint.mdAndUp ? '180' : '100'"
											loading-color="white"
										></avatar>
									</v-list-item-avatar>
									<div
										v-if="$vuetify.breakpoint.mdAndUp && psychologist.code"
										class="caption text--secondary"
									>
										Código {{ psychologist.code }}
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
												class="
													text--secondary
													body-1
													text-md-h6
													font-weight-medium
													pa-2
												"
												style="color: #424242"
											>
												${{
													Math.ceil(
														psychologist.sessionPrices.video / 100
													) * 100
												}}
												/ 50 min
											</div>
										</v-col>
										<v-col
											cols="12"
											md="5"
											lg="4"
											class="text-center text-lg-right"
										>
											<dialog-agenda-cita-online
												:psy="psychologist"
												mode="3"
											/>
											<v-btn
												v-if="
													!$auth.$state.loggedIn ||
													$auth.$state.user.role === 'user'
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
					<v-card v-if="psychologist" class="mt-6 pb-10">
						<v-card-text class="text-h5 primary--text font-weight-bold"
							>Perfil</v-card-text
						>
						<v-card-text>
							<v-divider></v-divider>
						</v-card-text>
						<v-card-text>
							<v-row align="center">
								<v-col
									cols="12"
									md="3"
									class="align-self-start subtitle-1 primary--text"
								>
									Experiencia
								</v-col>
								<v-col class="body-1 text-left">
									<ul
										v-if="
											psychologist.experience &&
											psychologist.experience.length
										"
									>
										<li
											v-for="(experience, i) in psychologist.experience"
											:key="i"
										>
											{{ experience.title }} - {{ experience.place }}
											<span v-if="experience.start && experience.end"
												>({{ experience.start }},
												{{ experience.end }})</span
											>
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
								<v-col
									cols="12"
									md="3"
									class="align-self-start subtitle-1 primary--text"
								>
									Especialidades
								</v-col>
								<v-col
									v-if="
										psychologist.specialties && psychologist.specialties.length
									"
									class="body-1 text-left"
								>
									<ul>
										<li v-for="(item, i) in psychologist.specialties" :key="i">
											{{ item }}
										</li>
									</ul>
								</v-col>
								<v-col v-else class="body-1 text-left text-capitalize">
									Vacío
								</v-col>
							</v-row>
						</v-card-text>
						<v-card-text>
							<v-divider></v-divider>
						</v-card-text>
						<v-card-text>
							<v-row align="center">
								<v-col
									cols="12"
									md="3"
									class="align-self-start subtitle-1 primary--text"
								>
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
								<v-col
									cols="12"
									md="3"
									class="align-self-start subtitle-1 primary--text"
								>
									Formación
								</v-col>
								<v-col class="body-1 text-left">
									<ul
										v-if="
											psychologist.formation && psychologist.formation.length
										"
									>
										<li
											v-for="(formation, i) in psychologist.formation"
											:key="i"
										>
											{{ formation.formationType }} -
											{{ formation.description }}
											<span v-if="formation.start && formation.end">
												({{ formation.start }}, {{ formation.end }})
											</span>
										</li>
									</ul>
								</v-col>
							</v-row>
						</v-card-text>
						<v-card-text><v-divider></v-divider></v-card-text>
						<v-card-text>
							<v-row align="center">
								<v-col
									cols="12"
									md="3"
									class="align-self-start subtitle-1 primary--text"
								>
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
						<v-card-text>
							<v-row align="center">
								<v-col
									cols="12"
									md="3"
									class="align-self-start subtitle-1 primary--text"
								>
									Política de reprogramación
								</v-col>
								<v-col class="body-1 text-left">
									Puedes reprogramar tu sesión hasta
									{{ psychologist.preferences.minimumRescheduleSession }}hora(s)
									antes sin costo adicional.
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="4" style="position: relative">
					<v-sheet
						class="sticky shadowCalendar pb-2"
						:height="fullcard ? 'max-content' : '290px'"
					>
						<calendar-psychologist
							:id-psy="psychologist._id"
							:sessions="sessions"
							:set-date="date => null"
							:set-full-card="id => (fullcard = true)"
							:set-minimal-card="id => (fullcard = false)"
						/>
					</v-sheet>
				</v-col>
			</v-row>
		</v-container>
	</client-only>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Pusher from 'pusher-js';

export default {
	components: {
		Avatar: () => import('@/components/Avatar'),
		CalendarPsychologist: () => import('~/components/CalendarPsychologist'),
		DialogAgendaCitaOnline: () => import('@/components/psicologos/DialogAgendaCitaOnline'),
	},
	props: {
		psychologist: {
			type: Object,
			required: true,
		},
		setPsychologist: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			loadingChat: false,
			dialog: false,
			tab: 1,
			pusher: null,
			channel: null,
			fullcard: false,
			loadingCalendar: false,
		};
	},
	computed: {
		...mapGetters({
			resumeView: 'Psychologist/resumeView',
			sessions: 'Psychologist/sessionsFormatted',
		}),
	},
	watch: {
		async resumeView(newValue) {
			if (newValue && this.dialog) {
				this.loadingChat = true;
				this.dialog = false;
				await this.startConversation(this.psychologist._id);
				this.loadingChat = false;
				this.setFloatingChat(true);
			}
		},
	},
	created() {
		this.setFloatingChat(false);
		// PUSHER
		this.pusher = new Pusher(this.$config.PUSHER_KEY, {
			cluster: this.$config.PUSHER_CLUSTER,
		});
		this.pusher.connection.bind('update', function (err) {
			console.error(err);
		});
		this.channel = this.pusher.subscribe('psychologist');
		this.channel.bind('update', data => this.$emit('updatePsychologist', data));
		this.$on('updatePsychologist', data => {
			if (data.username === this.psychologist.username) {
				this.getPsychologist(data);
			}
		});
	},
	async mounted() {
		this.loadingCalendar = true;
		await this.getFormattedSessions(this.psychologist._id);
		this.loadingCalendar = false;
	},
	methods: {
		async getPsychologist(data) {
			const { psychologist } = await this.$axios.$get(`/psychologists/one/${data.username}`);
			this.setPsychologist(psychologist);
		},
		toAuth(item) {
			localStorage.setItem('psi', JSON.stringify(item));
			if (this.$auth.$state.loggedIn) this.$router.push({ name: 'plan' });
			else this.$router.push({ path: '/auth/q=register' });
		},
		async goChat() {
			if (!this.$auth.$state.loggedIn) {
				this.dialog = true;
			} else {
				this.loadingChat = true;
				await this.startConversation(this.psychologist._id);
				this.loadingChat = false;
				this.setFloatingChat(true);
			}
		},
		avatar(psychologist) {
			if (!psychologist.approveAvatar) return '';
			if (psychologist.avatarThumbnail) return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		...mapActions({
			startConversation: 'Chat/startConversation',
			getFormattedSessions: 'Psychologist/getFormattedSessions',
		}),
		...mapMutations({
			setFloatingChat: 'Chat/setFloatingChat',
		}),
	},
};
</script>

<style lang="scss" scoped>
.sticky {
	position: -webkit-sticky !important;
	position: sticky !important;
	top: 0 !important;
}
.shadowCalendar {
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
