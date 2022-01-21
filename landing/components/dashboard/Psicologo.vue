<template>
	<v-card :loading="loading">
		<v-card-text v-if="loading">
			<v-row align="center" justify="center">
				<v-col cols="12" sm="3" class="text-center">
					<v-avatar size="200" color="grey lighten-1"></v-avatar>
				</v-col>
				<v-col cols="12" sm="9">
					<div class="body-2 mt-2 mr-4 text-center text-sm-left">
						<v-skeleton-loader max-width="300" type="heading"></v-skeleton-loader>
						<v-skeleton-loader class="mt-4" type="paragraph"></v-skeleton-loader>
						<v-skeleton-loader class="mt-2" type="heading"></v-skeleton-loader>
					</div>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-text v-if="psychologist && !loading">
			<v-row align="center" justify="center">
				<v-col cols="12" sm="3" class="text-center">
					<avatar
						:url="avatar(psychologist, true)"
						:name="psychologist.name"
						:last-name="psychologist.lastName ? psychologist.lastName : ''"
						size="130"
						loading-color="white"
					></avatar>
					<div class="text-center body-2 text--secondary mt-3 mb-2">
						Código {{ psychologist.code }}
					</div>
					<nuxt-link
						class="primary--text body-2 font-weight-bold"
						style="text-decoration: none"
						:to="{ path: `/${psychologist.username}` }"
					>
						Más información
					</nuxt-link>
				</v-col>
				<v-col cols="12" sm="9">
					<v-row justify-md="space-between" align="center">
						<v-col cols="12" sm="7" md="9" class="text-center text-sm-left">
							<nuxt-link
								style="text-decoration: none"
								:to="{
									path: `/${psychologist.username}`,
								}"
							>
								<span class="body-1 text-lg-h5 font-weight-bold text--secondary">
									{{ psychologist.name }}
									{{ psychologist.lastName && psychologist.lastName }}
								</span>
							</nuxt-link>
						</v-col>
						<v-col
							cols="12"
							sm="5"
							md="3"
							class="text-center text-sm-right mb-4 mb-sm-0"
						>
							<v-btn
								v-if="
									(plan &&
										plan.numberSessionSuccess &&
										plan.numberSessionSuccess >= 3) ||
									true
								"
								depressed
								block
								small
								color="primary"
								rounded
								class="ma-2"
								@click="goToReview"
							>
								Añadir evaluación
							</v-btn>
							<v-btn
								depressed
								block
								small
								text
								rounded
								class="ma-2"
								@click="changePsychologist"
							>
								Cambiar psicológo
							</v-btn>
						</v-col>
					</v-row>
					<v-chip-group v-model="specialties" show-arrows>
						<template v-for="(tag, i) in psychologist.specialties">
							<v-chip
								:key="i"
								:value="tag"
								class="ma-2"
								small
								:color="specialties == tag ? 'primary--text' : ''"
							>
								<span>
									{{ tag }}
								</span>
							</v-chip>
						</template>
					</v-chip-group>
					<div class="body-2 mt-2 mr-4 text-center text-sm-left">
						{{
							psychologist.professionalDescription.length > 345
								? psychologist.professionalDescription.slice(0, 345).concat('...')
								: psychologist.professionalDescription
						}}
					</div>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-text v-if="!psychologist && !loading" class="text-center">
			<div
				class="headline font-weight-bold primary--text my-5 mx-auto"
				style="max-width: 340px"
			>
				Agenda con un espacialista e inicia tu viaje hacia el bienestar
			</div>
			<div class="body-1 my-5 mx-auto" style="max-width: 280px">
				Orientación psicológica en cualquier momento y lugar. Comienza a mejorar tu vida
				hoy.
			</div>
			<v-btn rounded color="primary" :to="{ name: 'psicologos' }"> Buscar ahora </v-btn>
		</v-card-text>
	</v-card>
</template>

<script>
import moment from 'moment';
export default {
	props: {
		psychologist: {
			type: Object,
			default: null,
		},
		setPsychologist: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			loading: false,
			specialties: '',
		};
	},
	computed: {
		// Filtramos que sea de usuarios con pagos success y no hayan expirado
		plan() {
			if (!this.$auth.$state.user) return null;
			// Obtenemos un array con todo los planes solamente
			const plans = this.$auth.$state.user.sessions.flatMap(item =>
				item.plan.map(plan => ({
					...plan,
					idSessions: item._id,
					psychologist: item.psychologist,
					user: item.user,
					// dias de diferencia entre el dia que expiró y hoy
					diff: moment(plan.expiration).diff(moment(), 'days'),
				}))
			);
			const min = Math.max(...plans.map(el => el.diff).filter(el => el <= 0));
			const max = Math.max(...plans.map(el => el.diff).filter(el => el >= 0));

			// retornamos el plan success y sin expirar
			let plan = plans.find(
				item => item.payment === 'success' && moment().isBefore(moment(item.expiration))
			);
			// retornamos el ultimo plan succes y que expiro
			if (!plan) plan = plans.find(item => item.diff === min);
			// retornamos el siguiente plan pendiente
			if (!plan) plan = plans.find(item => item.diff === max);
			return plan;
		},
	},
	methods: {
		avatar(psychologist, thumbnail) {
			if (!psychologist.approveAvatar) return '';
			if (psychologist.avatarThumbnail && thumbnail) return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		changePsychologist() {
			return alert('Proximante podras cambiar tu psicologo desde aqui');
		},
		goToReview() {
			return this.$router.push(
				`/review?psychologist=${this.psychologist._id}&user=${this.$auth.user._id}`
			);
		},
	},
};
</script>
