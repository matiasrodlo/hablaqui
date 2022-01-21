<template>
	<div>
		<v-toolbar height="100px" color="white" class="shadow">
			<v-spacer></v-spacer>
			<nuxt-link to="/">
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
			</nuxt-link>
			<v-spacer></v-spacer>
		</v-toolbar>
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<v-container v-if="psychologist" fluid style="height: 70vh; max-width: 1200px">
			<v-row justify="center" align="center" style="height: 100%; overflow-y: auto">
				<v-col cols="12" sm="8" md="6" xl="5" class="text-center" style="color: #5c5c5c">
					<div class="d-flex align-center mb-10">
						<avatar
							style="flex: 0"
							:url="avatar(psychologist, true)"
							:name="psychologist.name"
							:last-name="psychologist.lastName ? psychologist.lastName : ''"
							size="80"
							loading-color="white"
						></avatar>
						<div style="flex: 1" class="ml-4 text-left">
							<div class="font-weight-medium headline">
								{{ psychologist.name }} {{ psychologist.lastName }}
							</div>
							<div class="title font-weight-regular">Psicólogo</div>
						</div>
					</div>
					<div class="text--secondary text-left">
						<div class="font-weight-medium headline">1. ¿Cómo fue tu visita?</div>
						<div class="font-weight-regular title">Valorización global</div>
					</div>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'ReviewPsychologist',
	layout: 'simple',
	data() {
		return {
			idPsychologist: '',
			token: '',
			overlay: true,
			psychologist: null,
		};
	},
	created() {
		if (this.$route.query.psychologist) {
			this.idPsychologist = this.$route.query.psychologist;
			this.token = this.$route.query.token;
			// this.$router.replace({ query: null });
		}
	},
	async mounted() {
		if (!this.idPsychologist) {
			this.overlay = false;
			return this.$router.push('/');
		}

		if (this.token) {
			await this.$auth.setUserToken(this.token);
		}

		this.psychologist = await this.getPsychologist(this.idPsychologist);
		this.overlay = false;
	},
	methods: {
		avatar(psychologist, thumbnail) {
			if (!psychologist.approveAvatar) return '';
			if (psychologist.avatarThumbnail && thumbnail) return psychologist.avatarThumbnail;
			if (psychologist.avatar) return psychologist.avatar;
			return '';
		},
		...mapActions({
			getPsychologist: 'Psychologist/getPsychologist',
		}),
	},
};
</script>

<style lang="scss" scoped>
.shadow {
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
