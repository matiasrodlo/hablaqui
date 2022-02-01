<template>
	<v-app>
		<v-navigation-drawer
			v-model="drawer"
			mini-variant-width="60"
			:mini-variant.sync="isMini"
			color="primary"
			:expand-on-hover="$vuetify.breakpoint.mdAndUp"
			app
			mobile-breakpoint="960"
		>
			<v-sheet color="primary" class="pa-1">
				<v-img
					height="100"
					contain
					style="cursor: pointer"
					:src="`https://cdn.hablaqui.cl/static/logo_tiny_white.png`"
					:lazy-src="`https://cdn.hablaqui.cl/static/logo_tiny_white.png`"
					alt="logo hablaquí"
					class="mt-10"
					@click="() => $router.push({ name: 'psicologos' })"
				/>
			</v-sheet>
			<v-list style="flex: 2" dark color="primary" class="pt-0" left shaped top>
				<v-list-item v-if="false" class="my-4" link>
					<v-list-item-avatar size="35">
						<v-btn outlined fab color="white">
							<icon v-if="online" size="30" color="#8BC34A" :icon="mdiAccount" />
							<icon v-else size="30" color="red" :icon="mdiAccountOff" />
						</v-btn>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="font-weight-bold body-2">
							<v-switch v-model="online" dense>
								<template #prepend>
									<div class="pt-1 white--text">
										{{ online ? 'En linea' : 'Desconectado' }}
									</div>
								</template>
							</v-switch>
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<template v-for="(item, i) in links">
					<v-list-item v-if="item.visible" :key="i" class="my-4" link :to="item.link">
						<v-list-item-avatar size="35">
							<v-img
								height="35"
								width="35"
								:src="item.img"
								:lazy-src="item.img"
								:alt="item.name"
							/>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title class="font-weight-bold body-2">
								{{ item.name }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</template>
				<v-list-item
					v-if="$auth.$state.user.role === 'psychologist'"
					class="my-4 hidden-md-and-up"
					link
					href="https://calendly.com/daniel-hablaqui/30min"
				>
					<v-list-item-avatar size="30">
						<v-img
							height="30"
							width="30"
							src="https://cdn.hablaqui.cl/static/demo-w.png"
							alt="demo"
						/>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="font-weight-bold body-2">
							Agendar demo
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item
					v-if="$auth.user.role === 'psychologist'"
					class="my-4 hidden-md-and-up"
					link
					href="https://soporte.hablaqui.cl/hc"
				>
					<v-list-item-avatar size="30">
						<v-img
							height="30"
							width="30"
							src="https://cdn.hablaqui.cl/static/ayuda.png"
							alt="soporte"
						/>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="font-weight-bold body-2">
							Centro de ayuda
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item v-else class="my-4 hidden-md-and-up" link to="/faq">
					<v-list-item-avatar size="30">
						<v-img
							height="30"
							width="30"
							src="https://cdn.hablaqui.cl/static/ayuda.png"
							alt="soporte"
						/>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="font-weight-bold body-2">
							Centro de ayuda
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item class="my-4 hidden-md-and-up" link @click="logout">
					<v-list-item-avatar size="30">
						<v-img
							height="45"
							width="45"
							:src="`https://cdn.hablaqui.cl/static/cerrar_sesion.png`"
							alt="cerrar sesión"
						/>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="font-weight-bold body-2">
							Salir
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<template v-if="!isMini" #append>
				<div class="pa-2 caption white--text">
					<icon class="pb-2" size="20" color="white" :icon="mdiAlert" />
					Nuestra plataforma aún está en construcción. Si presentas algún problema, no
					dudes en contactarnos
				</div>
			</template>
		</v-navigation-drawer>
		<v-navigation-drawer
			v-if="$auth.$state.user.role === 'psychologist'"
			:value="onBoarding"
			width="400"
			class="elevation-6"
			disable-resize-watcher
			app
			right
		>
			<v-list-item style="height: 120px" class="primary" dark>
				<v-list-item-avatar size="35" @click="() => setOnBoarding()">
					<v-btn icon>
						<icon color="white" size="35" :icon="mdiChevronRight" />
					</v-btn>
				</v-list-item-avatar>
				<v-list-item-content>
					<v-list-item-title class="title text-left"> Inicio rápido </v-list-item-title>
					<v-list-item-subtitle class="mt-3 text-left font-weight-bold">
						Da tus primeros pasos en Hablaquí Office.
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
			<v-expansion-panels flat>
				<v-expansion-panel v-for="(step, i) in stepOnboarding" :key="i">
					<v-expansion-panel-header v-if="step.visible">
						<div class="text-left">
							<icon
								v-if="step.title === 'Explora las secciones'"
								size="35"
								:icon="mdiMapMarkerStar"
							/>
							<icon
								v-else-if="step.title === 'Configura tu cuenta'"
								size="35"
								:icon="mdiCog"
							/>
							<icon
								v-else-if="step.title === 'Añade a tus consultantes'"
								size="35"
								:icon="mdiAccountSupervisor"
							/>
							<icon
								v-else-if="step.title === 'Añade eventos o bloquea horas'"
								size="35"
								:icon="mdiCalendar"
							/>
							<icon v-else size="35" color="#bfbfbf" :icon="mdiCircle" />
							<span class="ml-2">
								{{ step.title }}
							</span>
						</div>
					</v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-list dense>
							<v-list-item-group v-model="onSelectedStep" color="primary">
								<v-list-item
									v-for="(item, key) in step.items"
									:key="key"
									:value="item"
									@click="$router.push({ name: item.route })"
								>
									<v-list-item-icon>
										<icon v-if="item.done" size="20" :icon="mdiCheckCircle" />
										<icon v-else size="20" color="#bfbfbf" :icon="mdiCircle" />
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title class="body-2 font-weight-regular">
											{{ item.title }}
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list-item-group>
						</v-list>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
			<template #append>
				<div class="pointer my-6 primary--text text-center">Completar tareas (saltar)</div>
			</template>
		</v-navigation-drawer>
		<v-app-bar absolute height="70" flat color="white" dark class="hidden-md-and-up">
			<v-btn v-if="goBack" icon @click="() => $router.go(-1)">
				<icon size="30" color="primary" :icon="mdiChevronLeft" />
			</v-btn>
			<h1 class="primary--text text-h5 font-weight-bold">{{ routeName }}</h1>
			<v-spacer></v-spacer>
			<v-btn id="menudrawer-appbar" accesskey="m" icon @click="drawer = !drawer">
				<icon size="30" color="primary" :icon="mdiMenu" />
			</v-btn>
		</v-app-bar>
		<v-main
			:class="$vuetify.breakpoint.mdAndUp ? 'primary' : 'white'"
			:style="{ 'padding-top': $vuetify.breakpoint.mdAndUp ? '' : '50px' }"
		>
			<!-- overlay onboarding -->
			<v-overlay
				v-if="selectedStep"
				:value="onBoarding"
				color="white"
				:opacity="0.7"
				z-index="2"
			></v-overlay>
			<!-- overlay loading -->
			<v-overlay :value="overlay" color="white" :opacity="0.8">
				<v-card light>
					<div class="text-right">
						<v-btn text @click="changeStateOnboarding">
							<span class="secondary--text"> x </span>
						</v-btn>
					</div>
					<v-card-text class="py-0 text-center body-1 px-6">
						Bienvenido a Hablaquí Office
					</v-card-text>
					<v-card-text class="text-center body-2 px-6">
						Agenda un tour por tu oficina y aclara todas tus dudas
					</v-card-text>
					<v-card-actions class="text-center body-2 px-6">
						<v-spacer></v-spacer>
						<v-btn
							rounded
							color="primary"
							href="https://calendly.com/daniel-hablaqui/30min"
							target="_blank"
							:loading="loadingOnboarding"
							@click="changeStateOnboarding"
							>Agendar demo
						</v-btn>
						<v-spacer></v-spacer>
					</v-card-actions>
				</v-card>
			</v-overlay>
			<div
				:class="$vuetify.breakpoint.mdAndUp ? 'border-desktop' : 'border-mobile'"
				class="white"
			>
				<snackbar />
				<nuxt />
			</div>
		</v-main>
	</v-app>
</template>

<script>
import {
	mdiMenu,
	mdiAccount,
	mdiAccountOff,
	mdiAlert,
	mdiChevronLeft,
	mdiCheckCircle,
	mdiChevronRight,
	mdiChevronDown,
	mdiCircle,
	mdiMapMarkerStar,
	mdiCog,
	mdiAccountSupervisor,
	mdiCalendar,
} from '@mdi/js';
import Snackbar from '@/components/Snackbar';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	components: {
		Snackbar,
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			overlay: false,
			loadingOnboarding: false,
			mdiAccountSupervisor,
			mdiCalendar,
			mdiCog,
			mdiChevronRight,
			mdiMapMarkerStar,
			mdiChevronLeft,
			mdiChevronDown,
			mdiAlert,
			mdiAccount,
			mdiAccountOff,
			mdiMenu,
			mdiCheckCircle,
			mdiCircle,
			drawer: true,
			online: true,
			isMini: true,
		};
	},
	computed: {
		expand() {
			return true;
		},
		onSelectedStep: {
			get() {
				return this.selectedStep;
			},
			set(value) {
				return this.setStep(value);
			},
		},
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
		links() {
			const visible =
				(this.$auth.$state.loggedIn && this.$auth.user.role === 'psychologist') ||
				(this.$auth.$state.loggedIn && this.$auth.user.role === 'user');
			return [
				{
					name: 'Chat',
					link: { name: 'dashboard-chat' },
					img: 'https://cdn.hablaqui.cl/static/chat.png',
					visible,
				},
				{
					name: 'Mis sesiones',
					link: { name: 'dashboard-agenda' },
					img: 'https://cdn.hablaqui.cl/static/sesiones.png',
					visible,
				},
				{
					name: 'Pagos',
					link: { name: 'dashboard-pagos' },
					img: 'https://cdn.hablaqui.cl/static/pay.png',
					visible:
						this.$auth.$state.loggedIn &&
						this.$auth.$state.user.role === 'psychologist',
				},
				{
					name: 'Consultantes',
					link: { name: 'dashboard-consultantes' },
					img: 'https://cdn.hablaqui.cl/static/icon-consultante.png',
					visible:
						this.$auth.$state.loggedIn &&
						this.$auth.$state.user.role === 'psychologist',
				},
				{
					name: 'Mi cuenta',
					link: { name: 'dashboard-perfil' },
					img: 'https://cdn.hablaqui.cl/static/home.png',
					visible,
				},
				{
					name: 'Mi plan premium',
					link: { name: 'dashboard-planes' },
					img: 'https://cdn.hablaqui.cl/static/diamante.png',
					visible:
						this.$vuetify.breakpoint.smAndDown &&
						this.$auth.$state.user.role === 'psychologist',
				},
				{
					name: 'Panel de control',
					link: { name: 'dashboard-panel' },
					img: 'https://cdn.hablaqui.cl/static/apps.png',
					visible: this.$auth.$state.user?.role === 'superuser',
				},
			];
		},
		routeName() {
			if (this.$route.name === 'dashboard-chat') return 'Mis Chats';
			if (this.$route.name === 'dashboard-planes') return 'Planes';
			if (this.$route.name === 'dashboard-agenda') return 'Mi Agenda';
			if (this.$route.name === 'dashboard-diario') return 'Mi diario';
			if (this.$route.name === 'dashboard-consultantes') return 'Consultantes';
			if (this.$route.name === 'dashboard-pagos') return 'Pagos';
			if (this.$route.name === 'dashboard-perfil') return 'Mi cuenta';
			if (this.$route.name === 'dashboard-perfil-configuracion-personal')
				return 'Configuración personal';
			if (this.$route.name === 'dashboard-perfil-datos-bancarios') return 'Datos bancarios';
			if (this.$route.name === 'dashboard-perfil-experiencia-formacion')
				return 'Experiencia y formación';
			if (this.$route.name === 'dashboard-perfil-informacion-general')
				return 'Informacion general';
			if (this.$route.name === 'dashboard-perfil-horario') return 'Horarios';
			if (this.$route.name === 'dashboard-perfil-services') return 'Servicios';
			if (this.$route.name === 'dashboard-consultantes-consultante-seleccionado')
				return 'Consultante';
			return '';
		},
		hasAvatar() {
			return this.psychologist && this.psychologist.avatar;
		},
		hasBankdata() {
			return (
				this.psychologist &&
				this.psychologist.paymentMethod &&
				this.psychologist.paymentMethod.bank &&
				this.psychologist.paymentMethod.accountType &&
				this.psychologist.paymentMethod.email &&
				this.psychologist.paymentMethod.rut &&
				this.psychologist.paymentMethod.name
			);
		},
		hasSchedule() {
			return (
				this.psychologist &&
				this.psychologist.schedule &&
				(this.psychologist.schedule.monday !== 'busy' ||
					this.psychologist.schedule.tuesday !== 'busy' ||
					this.psychologist.schedule.wednesday !== 'busy' ||
					this.psychologist.schedule.thursday !== 'busy' ||
					this.psychologist.schedule.friday !== 'busy' ||
					this.psychologist.schedule.saturday !== 'busy' ||
					this.psychologist.schedule.sunday !== 'busy')
			);
		},
		hasPreferences() {
			return (
				this.psychologist &&
				this.psychologist.preferences &&
				this.psychologist.preferences.minimumNewSession > 0 &&
				this.psychologist.preferences.minimumRescheduleSession > 0
			);
		},
		hasSessionPrice() {
			return (
				this.psychologist &&
				this.psychologist.sessionPrices &&
				this.psychologist.sessionPrices.video > 0
			);
		},
		hasConsultantes() {
			return this.consultantes.length;
		},
		hasEvents() {
			return this.$auth.user.sessions.length;
		},
		stepOnboarding() {
			return [
				{
					title: 'Configura tu cuenta',
					route: '/dashboard/perfil',
					items: [
						{
							title: 'Sube tu foto de perfil',
							tab: 0,
							card: {
								title: 'Editamos tu fotografía',
								description:
									'Aquí puedes subir tu foto para editarla, consulta el manual',
								link: 'https://calendly.com/daniel-hablaqui/30min',
							},
							route: 'dashboard-perfil',
							done: this.hasAvatar,
						},
						{
							title: 'Añade tus datos bancarios',
							tab: 0,
							card: {
								title: 'No te preocupes, cobramos por ti',
								description:
									'Ingresa tus datos bancarios para transferir el dinero a tu cuenta.',
							},
							done: this.hasBankdata,
							route: 'dashboard-perfil',
						},
						{
							title: 'Configura tus horarios',
							tab: 1,
							card: {
								title: 'Tu horario de trabajo diario',
								description:
									'Selecciona los horarios que tendrás disponible para atender.',
							},
							done: this.hasSchedule,
							route: 'dashboard-perfil',
						},
						{
							title: 'Intervalos en tu horario',
							tab: 1,
							card: {
								title: 'Agregar más intervalos de tiempo',
								description: 'Puedes añadir más bloques de horario para atender.',
							},
							done: this.hasSchedule,
							route: 'dashboard-perfil',
						},
						{
							title: 'Anticipación para agendar',
							tab: 2,
							card: {
								title: 'Ya no más sesiones muy encima',
								description:
									'Determina la anticipación horaria para que tus consultantes agenden una sesión',
							},
							done: this.hasPreferences,
							route: 'dashboard-perfil',
						},
						{
							title: 'Configura el tiempo de reprogramación y agenda',
							tab: 2,
							card: {
								title: 'No pierdas tu tiempo',
								description:
									'Determina el tiempo para que tus consultantes reprogramen una sesión.',
							},
							done: this.hasPreferences,
							route: 'dashboard-perfil',
						},
						{
							title: 'Añade el precio de tus sesiones',
							tab: 2,
							done: this.hasSessionPrice,
							route: 'dashboard-perfil',
						},
					],
					visible: true,
					done:
						this.hasSessionPrice &&
						this.hasPreferences &&
						this.hasSchedule &&
						this.hasBankdata &&
						this.hasAvatar,
				},
				{
					title: 'Añade a tus consultantes',
					route: '/dashboard/consultantes',
					items: [
						{
							title: 'Consultante nuevo',
							card: {
								title: 'Que no queden fuera tus consultantes',
								description:
									'Añade a todos tus pacientes para y no pagues comisión por ellos.',
								link: '',
							},
							route: 'dashboard-consultantes',
							done: this.hasConsultantes,
						},
					],
					visible:
						this.$auth.user.role === 'psychologist' && this.$auth.user.psychologist,
					done: false,
				},
				{
					title: 'Añade eventos o bloquea horas',
					route: '/dashboard/agenda',
					items: [
						{ title: 'Nuevo evento', done: this.hasEvents, route: 'dashboard-agenda' },
						{
							title: 'Agendar evento',
							done: this.hasEvents,
							route: 'dashboard-agenda',
						},
					],
					visible:
						this.$auth.user.role === 'psychologist' && this.$auth.user.psychologist,
					done: false,
				},
				{
					title: 'Explora las secciones',
					route: '/dashboard/chat',
					items: [
						{ title: 'Chat', route: 'dashboard-chat' },
						{ title: 'Mi agenda', route: 'dashboard-agenda' },
						{ title: 'Mis consultantes', route: 'dashboard-consultantes' },
						{ title: 'Mis pagos', route: 'dashboard-pagos' },
					],
					visible: true,
					done: true,
				},
			];
		},
		...mapGetters({
			listenerUserOnline: 'User/listenerUserOnline',
			onBoarding: 'User/onBoarding',
			selectedStep: 'User/step',
			psychologist: 'Psychologist/psychologist',
			plan: 'User/plan',
			consultantes: 'Psychologist/clients',
		}),
	},
	async mounted() {
		if (!this.$auth.$state.user.onboarding && this.$auth.$state.user.role === 'psychologist')
			this.overlay = true;

		if (this.$auth.$state.user.role === 'user') {
			if (this.$auth.$state.user.sessions.length) {
				if (this.plan.psychologist) {
					const { psychologist } = await this.$axios.$get(
						`/psychologists/one/${this.plan.psychologist}`
					);
					this.setPsychologist(psychologist);
				}
			} else {
				this.setPsychologist(null);
			}
		}
		if (this.$auth.$state.user.role === 'psychologist') {
			let psychologist;
			if (this.$auth.$state.user.psychologist) {
				await this.getClients(this.$auth.$state.user.psychologist);
				const res = await this.$axios.$get(
					`/psychologists/one/${this.$auth.$state.user.psychologist}`
				);
				psychologist = res.psychologist;
			} else {
				const res = await this.$axios.$get(`/recruitment/${this.$auth.user.email}`);
				psychologist = res.recruited;
			}
			if (!psychologist.formation.length) {
				psychologist.formation.push({
					formationType: '',
					description: '',
					start: '',
					end: '',
				});
			}
			if (!psychologist.experience.length) {
				psychologist.experience.push({ title: '', place: '', start: '', end: '' });
			}
			this.setPsychologist(psychologist);
		}
	},
	methods: {
		async logout() {
			await this.$auth.logout();
			this.$router.push('/auth');
		},
		async changeStateOnboarding() {
			this.loadingOnboarding = true;
			await this.updateOne({
				_id: this.$auth.$state.user._id,
				onboarding: true,
			});
			this.loadingOnboarding = false;
			this.overlay = false;
			this.$auth.fetchUser();
		},
		...mapMutations({
			setListenerUserOnline: 'User/setListenerUserOnline',
			setOnBoarding: 'User/setOnBoarding',
			setStep: 'User/setStep',
			setPsychologist: 'Psychologist/setPsychologist',
		}),
		...mapActions({
			getClients: 'Psychologist/getClients',
			updateOne: 'User/updateOne',
		}),
	},
};
</script>

<style scoped>
.border-desktop {
	border-radius: 50px 0 0 0;
}
.border-mobile {
	border-radius: 50px 50px 0 0;
}
</style>
