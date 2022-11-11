<template>
	<v-container fluid style="max-width: 1080px">
		<v-row>
			<v-col cols="8">
				<v-card style="border-radius: 15px" class="shadowCard">
					<v-row align="center" justify="center">
						<v-col cols="4" class="text-center">
							<div class="text-center">
								<avatar
									:url="avatar(psychologist, true)"
									:name="psychologist.name"
									:last-name="psychologist.lastName ? psychologist.lastName : ''"
									size="160"
									loading-color="white"
								></avatar>
								<div
									class="text-capitalize py-4"
									style="color: #706f6f; font-size: 14px"
								>
									Código {{ psychologist.code ? psychologist.code : '' }}
								</div>
							</div>
						</v-col>
						<v-col cols="8">
							<div>
								<h1
									v-if="psychologist.gender == 'male'"
									class="text-left font-weight-bold"
									style="color: #3c3c3b; font-size: 28px"
								>
									Psicólogo {{ psychologist.name }}
									{{ psychologist.lastName && psychologist.lastName }}
								</h1>
								<h1
									v-else
									class="text-left font-weight-bold"
									style="color: #3c3c3b; font-size: 28px"
								>
									Psicóloga {{ psychologist.name }}
									{{ psychologist.lastName && psychologist.lastName }}
								</h1>
							</div>
							<div
								class="text-left font-weight-medium pa-2"
								style="color: #3c3c3b; font-size: 16px; flex: 1"
							>
								${{ Math.ceil(psychologist.sessionPrices.video / 100) * 100 }}
								/ 50 min
							</div>
							<div>
								<v-chip-group show-arrows>
									<template v-for="(tag, s) in psychologist.specialties">
										<v-chip :key="s" class="ma-2" small>
											{{ tag }}
										</v-chip>
									</template>
								</v-chip-group>
							</div>
							<div class="pr-4">
								<div class="text-left" style="color: #54565a; font-size: 14px">
									{{ psychologist.professionalDescription }}
								</div>
							</div>
							<div class="my-4 text-left">
								<v-btn
									v-if="
										!$auth.$state.loggedIn || $auth.$state.user.role === 'user'
									"
									small
									rounded
									color="#56b5fc"
									dark
									class="px-8 py-2"
									@click="goChat"
								>
									Enviar mensajes
								</v-btn>
							</div>
						</v-col>
					</v-row>
				</v-card>
				<v-card class="shadowCard mt-10 pb-10" style="border-radius: 15px">
					<v-card-text>
						<div class="text-left subtitle-1 primary--text">Especialidades</div>
						<div
							v-if="psychologist.specialties && psychologist.specialties.length"
							class="body-1 text-left mt-3"
						>
							<ul>
								<li
									v-for="(item, i) in psychologist.specialties"
									:key="i"
									class="my-1"
								>
									{{ item }}
								</li>
							</ul>
						</div>
						<div v-else class="body-1 text-left text-capitalize">Vacío</div>
					</v-card-text>
					<v-divider class="mx-4"></v-divider>
					<v-card-text>
						<div class="mb-4 text-left subtitle-1 primary--text">Experiencia</div>
						<h2 class="body-1 text-left">
							<ul v-if="psychologist.experience && psychologist.experience.length">
								<li
									v-for="(experience, i) in psychologist.experience"
									:key="i"
									class="my-1"
								>
									{{ experience.title }} - {{ experience.place }}
									<span v-if="experience.start && experience.end"
										>({{ experience.start }}, {{ experience.end }})</span
									>
								</li>
							</ul>
						</h2>
					</v-card-text>
					<v-divider class="mx-4"></v-divider>
					<v-card-text>
						<div class="mb-4 text-left subtitle-1 primary--text">Modelos</div>
						<div class="body-1 text-left">
							<ul v-if="psychologist.models && psychologist.models.length">
								<li v-for="(model, i) in psychologist.models" :key="i" class="my-1">
									{{ model }}
								</li>
							</ul>
							<div v-else>Vacío</div>
						</div>
					</v-card-text>
					<v-divider class="mx-4"></v-divider>
					<v-card-text>
						<div class="mb-4 text-left subtitle-1 primary--text">Formación</div>
						<div class="body-1 text-left">
							<ul v-if="psychologist.formation && psychologist.formation.length">
								<li
									v-for="(formation, i) in psychologist.formation.filter(
										el => el !== null
									)"
									:key="i"
									class="my-1"
								>
									{{ formation.formationType }}, {{ formation.description }},
									{{ formation.intitucion }}
									<span v-if="formation.start && formation.end">
										({{ formation.start }}, {{ formation.end }})
									</span>
								</li>
							</ul>
						</div>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-text>
						<div class="mb-4 text-left subtitle-1 primary--text">Descripción</div>
						<div class="body-1 text-left">
							{{
								psychologist.personalDescription
									? psychologist.personalDescription
									: 'Sin descripcion'
							}}
						</div>
					</v-card-text>
					<v-divider class="mx-4"></v-divider>
					<v-card-text>
						<div class="mb-4 text-left subtitle-1 primary--text">Reprogramación</div>
						<div class="body-1 text-left">
							Puede reprogramar hasta
							<strong>
								{{ psychologist.preferences.minimumRescheduleSession }} hora(s)
							</strong>
							antes sin costo adicional.
						</div>
					</v-card-text>
				</v-card>
				<v-card class="shadowCard mt-10 pb-10" style="border-radius: 15px">
					<v-card-title> Comentarios </v-card-title>
					<v-card-subtitle> Todas las opiniones son importantes </v-card-subtitle>

					<v-card-text>
						<v-divider />
						<v-row>
							<v-col cols="6" class="d-flex align-center justify-start">
								<v-card
									max-width="50"
									height="50"
									class="rounded-circle primary px-4 mt-3"
									elevation="5"
								>
									<h1 class="white--text text-center pt-3">5</h1>
								</v-card>
								<div class="text--secondary text-left align-center">
									<div>
										<v-rating
											v-model="psychologist.rating"
											readonly
											half-increments
										></v-rating>
									</div>
									<div class="mx-3">
										<h5>Valorización global</h5>
										<h5>{{ psychologist.totalEvaluations }} opiniones</h5>
									</div>
								</div>
							</v-col>
							<v-col cols="6">
								<div
									class="
										text--secondary text-left
										d-flex
										align-center
										justify-start
									"
								>
									<v-rating
										v-model="psychologist.puntualityRating"
										readonly
										half-increments
									></v-rating>
									<h4>Puntutalidad</h4>
								</div>
								<div
									class="
										text--secondary text-left
										d-flex
										align-center
										justify-start
									"
								>
									<v-rating
										v-model="psychologist.attentionRating"
										readonly
										half-increments
									></v-rating>
									<h4>Atención</h4>
								</div>

								<div
									class="
										text--secondary text-left
										d-flex
										align-center
										justify-start
									"
								>
									<v-rating
										v-model="psychologist.internetRating"
										readonly
										half-increments
									></v-rating>
									<h4>Internet</h4>
								</div>
							</v-col>
						</v-row>
						<template v-for="item in evaluations">
							<v-col :key="item._id" cols="12">
								<div class="mt-6">
									<v-row>
										<v-col cols="12">
											<div class="d-flex align-center justify-start">
												<avatar
													url=""
													:name="item.name"
													:last-name="item.lastName"
													size="40"
													loading-color="white"
												/>
												<h4 class="mx-2">
													{{ item.name }} {{ item.lastName }}
												</h4>
											</div>
											<div class="mx-12">
												<h4>
													{{ item.createdAt }}
												</h4>
												<p>{{ item.comment }}</p>
											</div>
											<v-divider />
										</v-col>
									</v-row>
								</div>
							</v-col>
						</template>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="4" style="position: relative" class="pt-0">
				<v-sheet
					class="sticky shadowCard pb-2"
					style="border-radius: 15px"
					:height="fullcard ? 'max-content' : '290px'"
				>
					<calendar-psychologist
						:id-psy="psychologist._id"
						:username="psychologist.username"
						:sessions="sessions"
						:callback="date => null"
						:set-full-card="id => (fullcard = true)"
						:set-minimal-card="id => (fullcard = false)"
					/>
				</v-sheet>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
	components: {
		Avatar: () => import('@/components/Avatar'),
		CalendarPsychologist: () => import('~/components/CalendarPsychologist'),
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
			channel: null,
			fullcard: false,
			loadingCalendar: false,
			evaluations: [],
			visibles: [],
		};
	},
	computed: {
		...mapGetters({
			sessions: 'Psychologist/sessionsFormatted',
		}),
	},
	async mounted() {},
	created() {
		this.initFetch();
		// this.socket = this.$nuxtSocket({
		// 	channel: '/liveData',
		// });
		// this.socket.on('getPsychologist', username => {
		// 	if (username === this.psychologist.username) {
		// 		this.getPsychologist(username);
		// 	}
		// });
	},
	methods: {
		async initFetch() {
			this.setFloatingChat(false);
			const data = await this.$axios.$get(
				`/psychologist/get-evaluations/${this.psychologist.username}`
			);
			this.evaluations = data.evaluations;
		},
		/* scroll(person) {
			window.onscroll = () => {
				const bottomOfWindow =
					document.documentElement.scrollTop + window.innerHeight ===
					document.documentElement.offsetHeight;
				if (bottomOfWindow) {
					this.
				}
			};
		}, */

		async getPsychologist(username) {
			const { psychologist } = await this.$axios.$get(`/psychologists/one/${username}`);
			this.setPsychologist(psychologist);
		},
		async goChat() {
			if (!this.$auth.$state.loggedIn) {
				this.$router.push({
					path: `/auth/?register=true&psychologist=${this.psychologist.username}`,
				});
			} else {
				if (!this.$route.query.chat)
					this.$router.replace(`/${this.$route.params.slug}/?chat=true`);
				this.loadingChat = true;
				await this.startConversation(this.psychologist._id);
				this.loadingChat = false;
				this.setFloatingChat(true);
			}
		},
		handleVisivility(isVisible, entry, idEvaluation) {
			if (isVisible && !this.visibles.includes(idEvaluation))
				this.visibles.push(idEvaluation);
		},
		avatar(psychologist) {
			if (!psychologist.approveAvatar) return '';
			if (psychologist.avatarThumbnail) return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		...mapActions({
			startConversation: 'Chat/startConversation',
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
.shadowCard {
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
