<template>
	<v-container fluid style="max-width: 600px">
		<v-card style="border-radius: 15px" class="shadowCard pt-6">
			<v-card-text class="px-6">
				<v-row no-gutters>
					<v-col cols="4" sm="3" class="pb-4 d-flex align-start justify-center">
						<nuxt-link
							style="text-decoration: none"
							:to="{
								path: `/${psychologist.username}`,
							}"
						>
							<avatar
								:url="avatar(psychologist, true)"
								:name="psychologist.name"
								:last-name="psychologist.lastName ? psychologist.lastName : ''"
								size="110"
								loading-color="white"
							></avatar>
						</nuxt-link>
					</v-col>
					<v-col cols="8" sm="9" class="pb-s pl-4 pt-5">
						<div>
							<nuxt-link
								style="text-decoration: none"
								:to="{
									path: `/${psychologist.username}`,
								}"
							>
								<div
									class="text-left font-weight-bold body-2"
									style="color: #3c3c3b"
								>
									{{ psychologist.name }}
									{{ psychologist.lastName && psychologist.lastName }}
								</div>
							</nuxt-link>
						</div>
						<div
							class="text-capitalize text-left mt-1 mb-2"
							style="color: #706f6f; font-size: 12px"
						>
							código {{ psychologist.code ? psychologist.code : '' }}
						</div>
						<div class="text-left font-weight-medium body-2" style="color: #3c3c3b">
							${{ Math.ceil(psychologist.sessionPrices.video / 100) * 100 }}
							/ 50 min
						</div>
					</v-col>
					<v-col cols="12">
						<div>
							<v-chip-group :show-arrows="false">
								<template v-for="(tag, s) in psychologist.specialties">
									<v-chip :key="s" :value="tag" class="ma-1" x-small>
										<span>
											{{ tag }}
										</span>
									</v-chip>
								</template>
							</v-chip-group>
						</div>
						<div class="mt-3 text-left" style="color: #54565a; font-size: 14px">
							{{ psychologist.professionalDescription }}
						</div>
						<mini-calendar
							:id-psy="psychologist._id"
							:username="psychologist.username"
							:sessions="sessions"
						/>
						<div class="mt-2 mb-6 text-left">
							<v-btn
								v-if="!$auth.$state.loggedIn || $auth.$state.user.role === 'user'"
								block
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
			</v-card-text>
		</v-card>
		<v-card class="shadowCard mt-10 pb-10" style="border-radius: 15px">
			<v-card-text>
				<div class="text-left subtitle-1 primary--text">Especialidades</div>
				<div
					v-if="psychologist.specialties && psychologist.specialties.length"
					class="body-1 text-left mt-3"
				>
					<ul>
						<li v-for="(item, i) in psychologist.specialties" :key="i" class="my-1">
							{{ item }}
						</li>
					</ul>
				</div>
				<div v-else class="body-1 text-left text-capitalize">Vacío</div>
			</v-card-text>
			<v-divider class="mx-4"></v-divider>
			<v-card-text>
				<div class="mb-4 text-left subtitle-1 primary--text">Experiencia</div>
				<div class="body-1 text-left">
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
				</div>
			</v-card-text>
			<v-divider class="mx-4"></v-divider>
			<v-card-text>
				<div class="mb-4 text-left subtitle-1 primary--text">
					Modelos de trabajo terapéutico
				</div>
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
						<li v-for="(formation, i) in psychologist.formation" :key="i" class="my-1">
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
				<div class="mb-4 text-left subtitle-1 primary--text">Descripción personal</div>
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
		<v-card class="shadowCard mt-10 pb-5" style="border-radius: 15px">
			<v-card-title> Comentarios </v-card-title>
			<v-card-subtitle> Todas las opiniones son importantes </v-card-subtitle>

			<v-card-text>
				<v-divider />
				<v-row>
					<v-col cols="12" class="d-flex align-center justify-start">
						<v-card
							width="50"
							max-width="50"
							height="50"
							class="rounded-circle primary mt-3"
							elevation="5"
						>
							<h1 class="white--text text-center pt-3">{{ rating }}</h1>
						</v-card>
						<v-spacer />
						<div class="text--secondary text-left align-center">
							<div>
								<v-rating v-model="rating" readonly half-increments></v-rating>
							</div>
							<div class="mx-3">
								<h5>Valorización global</h5>
								<h5>{{ psychologist.totalEvaluations }} opiniones</h5>
							</div>
						</div>
					</v-col>
					<v-col cols="12">
						<div
							class="
								text--secondary text-left
								d-flex
								align-center
								justify-space-between
							"
						>
							<h4>Puntutalidad</h4>
							<v-rating v-model="puntuality" readonly half-increments></v-rating>
						</div>
						<div
							class="
								text--secondary text-left
								d-flex
								align-center
								justify-space-between
							"
						>
							<h4>Atención</h4>
							<v-rating v-model="attention" readonly half-increments></v-rating>
						</div>

						<div
							class="
								text--secondary text-left
								d-flex
								align-center
								justify-space-between
							"
						>
							<h4>Internet</h4>
							<v-rating v-model="internet" readonly half-increments></v-rating>
						</div>
					</v-col>
				</v-row>
				<template v-for="(item, index) in evaluations">
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
										<h4 class="mx-2">{{ item.name }} {{ item.lastName }}</h4>
									</div>
									<div class="mx-12">
										<h4>
											{{ item.createdAt }}
										</h4>
										<p>{{ item.comment }}</p>
									</div>
									<v-divider v-if="index > 0" />
									<div v-if="isLastComment">
										<h4 class="text-center">No hay más comentarios</h4>
									</div>
									<div v-else>
										<h4 class="text-center">Más comentarios</h4>
									</div>
									<div class="text-center">
										<v-progress-circular
											v-if="loadingComments"
											indeterminate
											color="primary"
										/>
									</div>
								</v-col>
							</v-row>
						</div>
					</v-col>
				</template>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
	components: {
		Avatar: () => import('@/components/Avatar'),
		MiniCalendar: () => import('~/components/psicologos/MiniCalendar'),
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
			channel: null,
			fullcard: false,
			evaluations: [],
			rating: 0,
			internet: 0,
			puntuality: 0,
			attention: 0,
			page: 1,
			isLastComment: false,
			loadingComments: false,
		};
	},
	computed: {
		...mapGetters({
			sessions: 'Psychologist/sessionsFormatted',
		}),
	},
	mounted() {
		this.scroll();
	},
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
			this.rating = this.psychologist.rating;
			this.internet = this.psychologist.internetRating;
			this.puntuality = this.psychologist.puntualityRating;
			this.attention = this.psychologist.attentionRating;
			await this.loadComments();
		},
		scroll() {
			window.onscroll = () => {
				const bottomOfWindow =
					document.documentElement.scrollTop + window.innerHeight >=
					document.documentElement.offsetHeight - 400;
				if (bottomOfWindow && !this.isLastComment && !this.loadingComments)
					this.loadComments();
			};
		},
		async loadComments() {
			this.loadingComments = true;
			const data = await this.$axios.$get(
				`/psychologist/get-evaluations/${this.psychologist.username}/${this.page}`
			);
			if (data.evaluations) {
				this.evaluations = this.evaluations.concat(data.evaluations);
				this.page += 1;
			} else this.isLastComment = true;
			this.loadingComments = false;
		},
		async getPsychologist(data) {
			const { psychologist } = await this.$axios.$get(`/psychologists/one/${data.username}`);
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
