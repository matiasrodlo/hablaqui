<template>
	<v-container fluid style="max-width: 600px">
		<v-card style="border-radius: 15px" class="shadowCard pt-6">
			<v-card-text class="px-6">
				<v-row no-gutters>
					<v-col cols="4" sm="3" class="pb-4 d-flex align-start justify-center">
						<nuxt-link
							style="text-decoration: none"
							:to="{
								path: `/${specialist.username}`,
							}"
						>
							<avatar
								:url="avatar(specialist, true)"
								:name="specialist.name"
								:last-name="specialist.lastName ? specialist.lastName : ''"
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
									path: `/${specialist.username}`,
								}"
							>
								<div
									class="text-left font-weight-bold body-2"
									style="color: #3c3c3b"
								>
									{{ specialist.name }}
									{{ specialist.lastName && specialist.lastName }}
								</div>
							</nuxt-link>
						</div>
						<div
							class="text-capitalize text-left mt-1 mb-2"
							style="color: #706f6f; font-size: 12px"
						>
							código {{ specialist.code ? specialist.code : '' }}
						</div>
						<div class="text-left font-weight-medium body-2" style="color: #3c3c3b">
							${{ Math.ceil(specialist.sessionPrices.video / 100) * 100 }}
							/ 50 min
						</div>
					</v-col>
					<v-col cols="12">
						<div>
							<v-chip-group :show-arrows="false">
								<template v-for="(tag, s) in specialist.specialties">
									<v-chip :key="s" :value="tag" class="ma-1" x-small>
										<span>
											{{ tag }}
										</span>
									</v-chip>
								</template>
							</v-chip-group>
						</div>
						<div class="mt-3 text-left" style="color: #54565a; font-size: 14px">
							{{ specialist.professionalDescription }}
						</div>
						<mini-calendar
							:id-spec="specialist._id"
							:username="specialist.username"
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
					v-if="specialist.specialties && specialist.specialties.length"
					class="body-1 text-left mt-3"
				>
					<ul>
						<li v-for="(item, i) in specialist.specialties" :key="i" class="my-1">
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
					<ul v-if="specialist.experience && specialist.experience.length">
						<li v-for="(experience, i) in specialist.experience" :key="i" class="my-1">
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
					<ul v-if="specialist.models && specialist.models.length">
						<li v-for="(model, i) in specialist.models" :key="i" class="my-1">
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
					<ul v-if="specialist.formation && specialist.formation.length">
						<li v-for="(formation, i) in specialist.formation" :key="i" class="my-1">
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
						specialist.personalDescription
							? specialist.personalDescription
							: 'Sin descripcion'
					}}
				</div>
			</v-card-text>
			<v-divider class="mx-4"></v-divider>
			<v-card-text>
				<div class="mb-4 text-left subtitle-1 primary--text">Reprogramación</div>
				<div class="body-1 text-left">
					Puede reprogramar hasta
					<strong> {{ specialist.preferences.minimumRescheduleSession }} hora(s) </strong>
					antes sin costo adicional.
				</div>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
	components: {
		Avatar: () => import('@/components/Avatar'),
		MiniCalendar: () => import('~/components/especialistas/MiniCalendar'),
	},
	props: {
		specialist: {
			type: Object,
			required: true,
		},
		setSpecialist: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			channel: null,
			fullcard: false,
		};
	},
	computed: {
		...mapGetters({
			sessions: 'Specialist/sessionsFormatted',
		}),
	},
	created() {
		this.setFloatingChat(false);
		// this.socket = this.$nuxtSocket({
		// 	channel: '/liveData',
		// });
		// this.socket.on('getSpecialist', username => {
		// 	if (username === this.specialist.username) {
		// 		this.getSpecialist(username);
		// 	}
		// });
	},
	methods: {
		async getSpecialist(data) {
			const { specialist } = await this.$axios.$get(`/specialists/one/${data.username}`);
			this.setSpecialist(specialist);
		},
		async goChat() {
			if (!this.$auth.$state.loggedIn) {
				this.$router.push({
					path: `/auth/?register=true&specialist=${this.specialist.username}`,
				});
			} else {
				if (!this.$route.query.chat)
					this.$router.replace(`/${this.$route.params.slug}/?chat=true`);
				this.loadingChat = true;
				await this.startConversation(this.specialist._id);
				this.loadingChat = false;
				this.setFloatingChat(true);
			}
		},
		avatar(specialist) {
			if (!specialist.approveAvatar) return '';
			if (specialist.avatarThumbnail) return specialist.avatarThumbnail;
			if (specialist.avatar) return specialist.avatar;
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
