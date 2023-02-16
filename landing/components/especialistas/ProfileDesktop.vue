<template>
	<v-container fluid style="max-width: 1080px">
		<v-row>
			<v-col cols="8">
				<v-card style="border-radius: 15px" class="shadowCard">
					<v-row align="center" justify="center">
						<v-col cols="4" class="text-center">
							<div class="text-center">
								<avatar
									:url="avatar(specialist, true)"
									:name="specialist.name"
									:last-name="specialist.lastName ? specialist.lastName : ''"
									size="160"
									loading-color="white"
								></avatar>
								<div
									class="text-capitalize py-4"
									style="color: #706f6f; font-size: 14px"
								>
									Código {{ specialist.code ? specialist.code : '' }}
								</div>
							</div>
						</v-col>
						<v-col cols="8">
							<div>
								<h1
									v-if="specialist.gender == 'male'"
									class="text-left font-weight-bold"
									style="color: #3c3c3b; font-size: 28px"
								>
									Especialista {{ specialist.name }}
									{{ specialist.lastName && specialist.lastName }}
								</h1>
								<h1
									v-else
									class="text-left font-weight-bold"
									style="color: #3c3c3b; font-size: 28px"
								>
									Especialista {{ specialist.name }}
									{{ specialist.lastName && specialist.lastName }}
								</h1>
							</div>
							<div
								class="text-left font-weight-medium pa-2"
								style="color: #3c3c3b; font-size: 16px; flex: 1"
							>
								${{ Math.ceil(specialist.sessionPrices.video / 100) * 100 }}
								/ 50 min
							</div>
							<div>
								<v-chip-group show-arrows>
									<template v-for="(tag, s) in specialist.specialties">
										<v-chip :key="s" class="ma-2" small>
											{{ tag }}
										</v-chip>
									</template>
								</v-chip-group>
							</div>
							<div class="pr-4">
								<div class="text-left" style="color: #54565a; font-size: 14px">
									{{ specialist.professionalDescription }}
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
							v-if="specialist.specialties && specialist.specialties.length"
							class="body-1 text-left mt-3"
						>
							<ul>
								<li
									v-for="(item, i) in specialist.specialties"
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
							<ul v-if="specialist.experience && specialist.experience.length">
								<li
									v-for="(experience, i) in specialist.experience"
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
								<li
									v-for="(formation, i) in specialist.formation.filter(
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
							<strong>
								{{ specialist.preferences.minimumRescheduleSession }} hora(s)
							</strong>
							antes sin costo adicional.
						</div>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="4" style="position: relative" class="pt-0">
				<v-sheet
					class="sticky shadowCard pb-2"
					style="border-radius: 15px"
					:height="fullcard ? 'max-content' : '290px'"
				>
					<calendar-specialist
						:id-spec="specialist._id"
						:username="specialist.username"
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
/**
 * perfil de especialista escritorio
 */
export default {
	components: {
		Avatar: () => import('@/components/Avatar'),
		CalendarSpecialist: () => import('~/components/CalendarSpecialist'),
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
			loadingChat: false,
			channel: null,
			fullcard: false,
			loadingCalendar: false,
		};
	},
	computed: {
		...mapGetters({
			sessions: 'Specialist/sessionsFormatted',
		}),
	},
	created() {
		// chat flotante a false al ingresar en la ruta
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
		/**
		 * obtenemos el especialista
		 */
		async getSpecialist(username) {
			const { specialist } = await this.$axios.$get(`/specialists/one/${username}`);
			this.setSpecialist(specialist);
		},
		/**
		 * Ir al chat si estamos logeados
		 */
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
		/**
		 * string url del avatar
		 */
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
