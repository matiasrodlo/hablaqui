<template>
	<div>
		<v-toolbar height="100px" color="white" class="shadow">
			<v-spacer></v-spacer>
			<a href="https://hablaqui.cl/">
				<v-img
					id="logo-drawer"
					tabindex="0"
					class="mx-auto my-5"
					style="max-width: 150px"
					:src="`https://cdn.hablaqui.cl/static/logo.png`"
					:lazy-src="`https://cdn.hablaqui.cl/static/logo.png`"
					alt="hablaqui Logo"
					accesskey="h"
				/>
			</a>
			<v-spacer></v-spacer>
		</v-toolbar>
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<v-container v-if="specialist" fluid style="height: 70vh; max-width: 1200px">
			<v-row v-if="ready" justify="center" align="center" style="overflow-y: auto">
				<v-col cols="12" sm="8" md="7" lg="6" class="text-center" style="color: #5c5c5c">
					<div>
						<v-img
							width="400"
							contain
							class="mx-auto"
							:src="`https://cdn.hablaqui.cl/static/start.png`"
							:lazy-src="`https://cdn.hablaqui.cl/static/start.png`"
						></v-img>
					</div>
					<div class="text-h4 text-md-h3 font-weight-bold">Hemos recibido tu opinión</div>
					<div
						class="my-6 text--secondary title mx-auto font-weight-regular"
						style="max-width: 800px"
					>
						Un moderador revisará tu evaluación en 7 días hábiles y te confirmaremos su
						aprobación
					</div>
					<div>
						<v-btn
							depressed
							class="mx-2"
							color="primary"
							rounded
							:to="{ name: 'dashboard-perfil' }"
						>
							Ir a mi cuenta
						</v-btn>
					</div>
				</v-col>
			</v-row>
			<v-row v-else justify="center" align="center" style="height: 100%; overflow-y: auto">
				<v-col cols="12" sm="8" md="7" lg="6" class="text-center" style="color: #5c5c5c">
					<div class="d-flex align-center mb-10">
						<avatar
							style="flex: 0"
							:url="avatar(specialist, true)"
							:name="specialist.name"
							:last-name="specialist.lastName ? specialist.lastName : ''"
							size="80"
							loading-color="white"
						></avatar>
						<div style="flex: 1" class="ml-4 text-left">
							<div class="font-weight-medium headline">
								{{ specialist.name }} {{ specialist.lastName }}
							</div>
							<div class="title font-weight-regular">Especialista</div>
						</div>
					</div>
					<v-window v-model="step">
						<v-window-item :value="1">
							<div
								class="text--secondary text-left d-flex align-center justify-space-between"
							>
								<div>
									<div class="font-weight-medium headline">
										1. ¿Cómo fue tu visita?
									</div>
									<div class="font-weight-regular title">Valorización global</div>
								</div>
								<div class="d-flex">
									<v-rating
										v-model="global"
										color="primary"
										half-increments
										hover
										background-color="primary"
										size="60"
									></v-rating>
								</div>
							</div>
						</v-window-item>

						<v-window-item :value="2">
							<div
								class="text--secondary text-left d-flex align-center justify-space-between"
							>
								<div>
									<div class="font-weight-medium headline">2. Puntualidad</div>
								</div>
								<div class="d-flex">
									<v-rating
										v-model="puntuality"
										color="primary"
										half-increments
										hover
										background-color="primary"
										size="60"
									></v-rating>
								</div>
							</div>
						</v-window-item>

						<v-window-item :value="3">
							<div
								class="text--secondary text-left d-flex align-center justify-space-between"
							>
								<div>
									<div class="font-weight-medium headline">3. Atención</div>
								</div>
								<div class="d-flex">
									<v-rating
										v-model="attention"
										color="primary"
										half-increments
										hover
										background-color="primary"
										size="60"
									></v-rating>
								</div>
							</div>
						</v-window-item>

						<v-window-item :value="4">
							<div
								class="text--secondary text-left d-flex align-center justify-space-between"
							>
								<div>
									<div class="font-weight-medium headline">4. Internet</div>
								</div>
								<div class="d-flex">
									<v-rating
										v-model="internet"
										color="primary"
										half-increments
										hover
										background-color="primary"
										size="60"
									></v-rating>
								</div>
							</div>
						</v-window-item>

						<v-window-item :value="5">
							<div class="text--secondary text-left">
								<div class="font-weight-medium headline">
									5. ¿Qué es lo que te gustó más de la visita?
								</div>
								<v-chip-group
									v-model="like"
									active-class="primary--text"
									class="mt-4"
									column
								>
									<v-chip
										v-for="tag in [
											'Dedicación',
											'Explicaciones claras',
											'Eficacia del proceso',
											'Otro',
										]"
										:key="tag"
										outlined
										:value="tag"
										large
										label
									>
										{{ tag }}
									</v-chip>
								</v-chip-group>
							</div>
						</v-window-item>

						<v-window-item :value="6">
							<div class="text--secondary text-left">
								<div class="font-weight-medium headline">
									6. ¿Qué es lo que el especialista necesita mejorar?
								</div>
								<v-chip-group
									v-model="improve"
									active-class="primary--text"
									class="mt-4"
									column
								>
									<v-chip
										v-for="tag in [
											'Falta de empatía',
											'Comunicación',
											'Retraso en la visita',
											'Otro',
										]"
										:key="tag"
										outlined
										:value="tag"
										large
										label
									>
										{{ tag }}
									</v-chip>
								</v-chip-group>
							</div>
						</v-window-item>

						<v-window-item :value="7">
							<div class="text--secondary text-left">
								<div class="font-weight-medium headline">7. Escribe tu opinión</div>
								<v-textarea
									v-model="comment"
									class="mt-4"
									placeholder="Tu comentario ayudará a otros consultantes"
									outlined
									counter
									no-resize
									maxlength="300"
								>
								</v-textarea>
							</div>
						</v-window-item>
					</v-window>
					<div v-if="step !== 7" class="d-flex justify-end mt-8">
						<v-btn class="ma-1" :disabled="step === 1" color="primary" @click="step--">
							<icon color="white" size="25" :icon="mdiChevronLeft" />
						</v-btn>
						<v-btn
							class="ma-1"
							:disabled="step === 7"
							color="primary"
							depressed
							@click="step++"
						>
							<icon color="white" size="25" :icon="mdiChevronRight" />
						</v-btn>
					</div>
					<div v-else class="d-flex justify-end mt-8">
						<v-btn class="ma-1" :disabled="step === 1" color="primary" @click="step--">
							<icon color="white" size="25" :icon="mdiChevronLeft" />
						</v-btn>
						<v-btn class="ma-1" color="primary" :loading="loading" @click="onSubmit">
							Enviar tu opinión
						</v-btn>
					</div>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
/**
 * Pagina de review
 */
export default {
	name: 'ReviewSpecialist',
	components: {
		Icon: () => import('~/components/Icon'),
	},
	layout: 'simple',
	data() {
		return {
			mdiChevronLeft,
			mdiChevronRight,
			step: 1,
			idSpecialist: '',
			token: '',
			overlay: true,
			specialist: null,
			global: 0,
			puntuality: 0,
			attention: 0,
			internet: 0,
			like: '',
			improve: '',
			comment: '',
			loading: false,
			ready: false,
		};
	},
	created() {
		// obtenemos el psicologo desde la query url
		if (this.$route.query.specialist) {
			this.idSpecialist = this.$route.query.specialist;
			this.token = this.$route.query.token;
			// this.$router.replace({ query: null });
		}
	},
	async mounted() {
		// si no hay id psicologo
		if (!this.idSpecialist) {
			this.overlay = false;
			return this.$router.push('/');
		}
		// establece el token proveniente de la url si existe
		if (this.token) {
			await this.$auth.setUserToken(this.token);
		}
		// finalmente se obtiene el especialista
		this.specialist = await this.getSpecialist(this.idSpecialist);
		this.overlay = false;
	},
	methods: {
		/**
		 * Retorna string con url del avatar
		 */
		avatar(specialist, thumbnail) {
			if (!specialist.approveAvatar) return '';
			if (specialist.avatarThumbnail && thumbnail) return specialist.avatarThumbnail;
			if (specialist.avatar) return specialist.avatar;
			return '';
		},
		/**
		 * Registra el cambio en el rating del psicologo
		 */
		async onSubmit() {
			this.loading = true;
			await this.ratingSpecialist({
				id: this.specialist._id,
				payload: {
					comment: this.comment,
					global: this.global,
					puntuality: this.puntuality,
					attention: this.attention,
					internet: this.internet,
					like: this.like,
					improve: this.improve,
				},
			});
			this.loading = false;
			this.ready = true;
		},
		...mapActions({
			getSpecialist: 'Specialist/getSpecialist',
			ratingSpecialist: 'Specialist/ratingSpecialist',
		}),
	},
};
</script>

<style lang="scss" scoped>
.shadow {
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
