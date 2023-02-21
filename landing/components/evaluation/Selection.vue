<template>
	<v-container fluid style="max-width: 1200px">
		<v-row align="center" justify="center">
			<v-col cols="12" style="padding: 30px">
				<div class="text-h6 text-md-h5 font-weight-bold text-center">
					Especialistas recomendados
				</div>
				<div class="text-center" style="padding: 10px">
					Hemos seleccionado aquellos que mejor encajan con sus preferencias
				</div>
			</v-col>
		</v-row>
		<v-row class="hidden-sm-and-down">
			<template v-for="item in match">
				<v-col :key="item._id" cols="12">
					<v-card
						style="border-radius: 15px"
						:height="fullcard.includes(item._id) ? '100%' : '300px'"
						class="item text-center mt-6"
					>
						<div style="position: absolute; top: 0; left: 0">
							<div
								style="background-color: #3093ff; font-size: 20px"
								class="white--text rounded-br-xl rounded-tl-lg pl-4 pr-6"
							>
								{{ item.type }}
							</div>
						</div>
						<v-row>
							<v-col
								cols="3"
								class="d-flex align-center justify-center"
								style="height: 300px"
							>
								<div class="text-center">
									<avatar
										:url="avatar(item, true)"
										:name="item.name"
										:last-name="item.lastName ? item.lastName : ''"
										size="130"
										loading-color="white"
									></avatar>
									<div
										class="text-capitalize py-4"
										style="color: #706f6f; font-size: 14px"
									>
										código {{ item.code ? item.code : '' }}
									</div>
								</div>
							</v-col>
							<v-col
								cols="5"
								style="display: flex; flex-direction: column; height: 300px"
							>
								<div style="flex: 1">
									<nuxt-link
										style="text-decoration: none"
										:to="{
											path: `/${item.username}`,
										}"
									>
										<div
											class="text-left font-weight-bold"
											style="color: #3c3c3b; font-size: 28px"
										>
											{{ item.name }}
											{{ item.lastName && item.lastName }}
										</div>
									</nuxt-link>
								</div>
								<div
									class="text-left font-weight-medium pa-2"
									style="color: #3c3c3b; font-size: 16px; flex: 1"
								>
									${{ Math.ceil(item.sessionPrices.video / 100) * 100 }}
									/ 50 min
								</div>
								<div style="flex: 1">
									<v-chip-group show-arrows>
										<template v-for="(tag, s) in item.specialties">
											<v-chip :key="s" :value="tag" class="ma-2" small>
												<span>
													{{ tag }}
												</span>
											</v-chip>
										</template>
									</v-chip-group>
								</div>
								<div style="flex: 5">
									<div class="text-left" style="color: #54565a; font-size: 14px">
										{{
											item.professionalDescription.length > 210
												? item.professionalDescription
														.slice(0, 210)
														.concat('...')
												: item.professionalDescription
										}}
									</div>
								</div>
								<div style="flex: 2" class="text-left">
									<v-btn
										small
										rounded
										color="primary"
										class="px-8 py-2"
										:to="{ path: `/${item.username}` }"
									>
										Quiero saber más
									</v-btn>
								</div>
							</v-col>
							<v-divider vertical class="my-4"></v-divider>
							<v-col cols="4">
								<calendar-psychologist
									:id-psy="item._id"
									:username="item.username"
									:sessions="getSessions(item._id)"
									:callback="date => null"
									:set-full-card="id => fullcard.push(id)"
									:set-minimal-card="id => fullcard.filter(id => item._id != id)"
								/>
							</v-col>
						</v-row>
					</v-card>
				</v-col>
			</template>
		</v-row>

		<v-row class="hidden-md-and-up">
			<template v-for="item in match">
				<v-col :key="item._id" cols="12">
					<v-card style="border-radius: 15px" class="item text-center mt-6">
						<v-card-text>
							<div style="position: absolute; top: 0; right: 0">
								<div
									style="background-color: #3093ff; font-size: 18px"
									class="white--text rounded-bl-xl rounded-tr-lg pr-4 pl-6"
								>
									{{ item.type }}
								</div>
							</div>
							<v-row>
								<v-col cols="3" sm="2" class="d-flex align-start justify-center">
									<div class="text-center">
										<nuxt-link
											style="text-decoration: none"
											:to="{
												path: `/${item.username}`,
											}"
										>
											<avatar
												:url="avatar(item, true)"
												:name="item.name"
												:last-name="item.lastName ? item.lastName : ''"
												size="70"
												loading-color="white"
											></avatar>
										</nuxt-link>
									</div>
								</v-col>
								<v-col cols="9" sm="10">
									<div>
										<nuxt-link
											style="text-decoration: none"
											:to="{
												path: `/${item.username}`,
											}"
										>
											<div
												class="text-left font-weight-bold body-1"
												style="color: #3c3c3b"
											>
												{{ item.name }}
												{{ item.lastName && item.lastName }}
											</div>
										</nuxt-link>
									</div>
									<div
										class="text-capitalize text-left mt-1 mb-2"
										style="color: #706f6f; font-size: 12px"
									>
										código {{ item.code ? item.code : '' }}
									</div>
									<div
										class="text-left font-weight-medium body-2"
										style="color: #3c3c3b"
									>
										${{ Math.ceil(item.sessionPrices.video / 100) * 100 }}
										/ 50 min
									</div>
								</v-col>
								<v-col cols="12">
									<div>
										<v-chip-group :show-arrows="false">
											<template v-for="(tag, s) in item.specialties">
												<v-chip :key="s" :value="tag" class="ma-1" x-small>
													<span>
														{{ tag }}
													</span>
												</v-chip>
											</template>
										</v-chip-group>
									</div>
									<div
										class="mt-3 text-left"
										style="color: #54565a; font-size: 14px"
									>
										{{
											item.professionalDescription.length > 110
												? item.professionalDescription
														.slice(0, 110)
														.concat('...')
												: item.professionalDescription
										}}
									</div>
									<mini-calendar
										:id-psy="item._id"
										:username="item.username"
										:sessions="getSessions(item._id)"
									/>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</template>
		</v-row>
		<v-row>
			<v-col cols="12" class="font-weight-regular mt-4 mb-10 text-center">
				¿Desea cambiar sus preferencias?
				<v-btn text class="primary--text px-0 mx-1" @click="resetMatch">
					Realizar evaluación
				</v-btn>
				<div>Puede no encontrar nuevamente estos especialista si realiza la evaluación</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	components: {
		MiniCalendar: () => import('~/components/especialistas/MiniCalendar'),
		CalendarPsychologist: () => import('~/components/CalendarPsychologist'),
	},
	props: {
		match: {
			type: Array,
			default: () => [],
		},
		resetMatch: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			fullcard: [],
		};
	},
	computed: {
		...mapGetters({
			sessions: 'Psychologist/sessionsFormattedAll',
		}),
	},
	methods: {
		avatar(psychologist, thumbnail) {
			if (!psychologist.approveAvatar) return '';
			if (psychologist.avatarThumbnail && thumbnail) return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		getSessions(id) {
			const temp = this.sessions.find(element => element.psychologist === id);
			if (!temp) {
				return [];
			}
			return temp.sessions;
		},
	},
};
</script>
<style lang="scss" scoped>
.item {
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
	transition: transform 0.6s !important;
}

.item:hover {
	box-shadow: 0 8px 16px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
