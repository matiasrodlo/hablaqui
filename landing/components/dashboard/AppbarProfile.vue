<template>
	<v-app-bar style="border-radius: 50px" color="white" light height="110" flat>
		<v-btn v-if="goBack" icon @click="() => $router.go(-1)">
			<icon size="30" color="primary" :icon="mdiChevronLeft" />
		</v-btn>
		<h1 class="primary--text">{{ title }}</h1>
		<v-spacer></v-spacer>
		<div class="mx-5 body-1 primary--text">
			<router-link
				v-if="$auth.$state.user && $auth.$state.user.role == 'user'"
				style="text-decoration: none"
				:to="{ name: 'evaluacion' }"
			>
				Psicólogos
			</router-link>
		</div>
		<div v-if="$auth.$state.user.role === 'user'" class="mx-5 body-1 primary--text">
			<a
				style="text-decoration: none"
				href="https://api.whatsapp.com/message/RZPJ4H5ZTDNWB1"
				target="_blank"
			>
				<div class="d-flex align-center">
					<v-img
						src="https://cdn.hablaqui.cl/static/demo.png"
						contain
						height="30"
						width="30"
						class="mx-2"
					></v-img>
					Atención al cliente
				</div>
			</a>
		</div>
		<div v-if="$auth.user.role === 'user'" class="mx-5 body-1 primary--text">
			<a
				style="text-decoration: none"
				href="https://hablaqui.cl/preguntas-frecuentes/"
				target="_blank"
			>
				<div class="d-flex align-center">
					<v-img
						src="https://cdn.hablaqui.cl/static/demo.png"
						contain
						height="30"
						width="30"
						class="mx-2"
					></v-img>
					Preguntas frecuentes
				</div>
			</a>
		</div>
		<div v-if="$auth.$state.user.role === 'psychologist'" class="mx-5 body-1 primary--text">
			<a
				style="text-decoration: none"
				href="https://api.whatsapp.com/message/RZPJ4H5ZTDNWB1"
				target="_blank"
			>
				<div class="d-flex align-center">
					<v-img
						src="https://cdn.hablaqui.cl/static/demo.png"
						contain
						height="30"
						width="30"
						class="mx-2"
					></v-img>
					Atención al cliente
				</div>
			</a>
		</div>
		<div v-if="$auth.user.role === 'psychologist'" class="mx-5 body-1 primary--text">
			<a
				style="text-decoration: none"
				href="https://hablaqui.cl/para-especialistas/preguntas-frecuentes/"
				target="_blank"
			>
				<div class="d-flex align-center">
					<v-img
						src="https://cdn.hablaqui.cl/static/demo.png"
						contain
						height="30"
						width="30"
						class="mx-2"
					></v-img>
					Preguntas frecuentes
				</div>
			</a>
		</div>
		<div v-if="$auth.$state.user.role == 'psychologist'" class="mx-5 body-1 primary--text">
			<nuxt-link style="text-decoration: none" to="/dashboard/planes">
				<div class="d-flex align-center">
					<v-img
						src="https://cdn.hablaqui.cl/static/diamond.png"
						contain
						height="30"
						width="30"
						class="mx-2"
					></v-img>
					Premium
				</div>
			</nuxt-link>
		</div>
		<v-btn
			v-if="$auth.user.role === 'psychologist' && $vuetify.breakpoint.mdAndUp && psychologist"
			class="mx-2"
			small
			elevation="1"
			fab
			color="white"
			@click="() => setOnBoarding()"
		>
			<v-img
				src="https://cdn.hablaqui.cl/static/flag.png"
				contain
				height="25"
				width="25"
				class="mx-2"
			></v-img>
		</v-btn>
		<v-btn class="ml-2" small elevation="1" fab color="white" @click="logout">
			<icon :icon="mdiLogout" />
		</v-btn>
	</v-app-bar>
</template>

<script>
import { mdiLogout, mdiChevronLeft, mdiFlag } from '@mdi/js';
import { mapMutations, mapGetters } from 'vuex';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		title: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			mdiChevronLeft,
			mdiLogout,
			mdiFlag,
		};
	},
	computed: {
		goBack() {
			return (
				this.$route.name === 'dashboard-perfil-configuracion-personal' ||
				this.$route.name === 'dashboard-perfil-datos-bancarios' ||
				this.$route.name === 'dashboard-perfil-experiencia-formacion' ||
				this.$route.name === 'dashboard-perfil-informacion-general' ||
				this.$route.name === 'dashboard-perfil-horario' ||
				this.$route.name === 'dashboard-perfil-services' ||
				this.$route.name === 'dashboard-consultantes-consultante-seleccionado'
			);
		},
		...mapGetters({
			psychologist: 'Psychologist/psychologist',
		}),
	},
	methods: {
		async logout() {
			await this.$auth.logout();
			this.$router.push('/auth');
		},
		...mapMutations({ setOnBoarding: 'User/setOnBoarding' }),
	},
};
</script>
