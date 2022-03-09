<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Mi cuenta" />
		<v-list
			two-line
			color="transparent"
			style="height: 150px"
			class="mt-16 pt-10 pt-md-0 mt-md-0"
		>
			<v-list-item
				id="itemAvatar"
				class="hidden-sm-and-down"
				style="position: relative"
				:style="step && step.title === 'Sube tu foto de perfil' ? 'z-index: 3' : ''"
			>
				<v-file-input
					id="upload"
					ref="avatar"
					class="d-none"
					dense
					filled
					hide-details
					accept="image/jpeg, image/png, image/gif, image/jpg"
					placeholder="Agrega un avatar"
					drop-placeholder="Arrastrar aqui..."
					@change="uploadAvatar"
				></v-file-input>
				<v-list-item-avatar size="150">
					<label for="upload" style="cursor: pointer; position: relative">
						<avatar
							:url="$auth.$state.user.avatarThumbnail"
							:name="$auth.$state.user.name"
							:last-name="
								$auth.$state.user.lastName ? $auth.$state.user.lastName : ''
							"
							size="100"
							:loading="loadingAvatar"
							loading-color="white"
						></avatar>
						<div
							v-if="!loadingAvatar"
							class="white rounded-circle elevation-1"
							style="position: absolute; right: 0px; bottom: 0px; padding: 4px"
						>
							<icon size="30" color="primary" :icon="mdiCamera" />
						</div>
					</label>
				</v-list-item-avatar>
				<v-list-item-content v-if="$auth.$state.user">
					<card-onboarding
						v-if="step && step.title === 'Sube tu foto de perfil'"
						style="position: absolute; top: 20%"
						arrow="arrow-left"
						:next="
							() => ({
								title: 'Añade tus datos bancarios',
								tab: 0,
								card: {
									title: 'No te preocupes, cobramos por ti',
									description:
										'Ingresa tus datos bancarios para transferir el dinero a tu cuenta.',
								},
								route: 'dashboard-perfil',
							})
						"
					/>
					<v-list-item-title class="text-capitalize font-weight-bold title">
						{{ $auth.$state.user.name }} {{ $auth.$state.user.lastName }}
					</v-list-item-title>
					<v-list-item-subtitle class="body-1">
						Bienvenido a Hablaquí
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
			<v-list-item class="hidden-md-and-up">
				<div
					style="position: absolute; top: -70px; left: 0; width: 100%"
					class="text-center mx-auto"
				>
					<label for="upload" style="cursor: pointer; position: relative">
						<avatar
							:url="$auth.$state.user.avatarThumbnail"
							:name="$auth.$state.user.name"
							size="100"
							:loading="loadingAvatar"
							loading-color="white"
						></avatar>
						<div
							v-if="!loadingAvatar"
							class="white rounded-circle elevation-1"
							style="position: absolute; right: 0; bottom: -40px; padding: 4px"
						>
							<icon size="30" color="primary" :icon="mdiCamera" />
						</div>
					</label>
				</div>
				<v-list-item-content v-if="$auth.$state.user" class="mt-10">
					<v-list-item-title class="text-capitalize font-weight-bold title text-center">
						{{ $auth.$state.user.name }} {{ $auth.$state.user.lastName }}
					</v-list-item-title>
					<v-list-item-subtitle class="body-1 text-center">
						Bienvenido a Hablaquí
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</v-list>
		<v-tabs v-model="tabs" class="hidden-sm-and-down" grow style="height: 100px">
			<v-tabs-slider></v-tabs-slider>
			<v-tab class="primary--text text-capitalize"> Información General </v-tab>

			<v-tab v-if="$auth.$state.user" class="primary--text text-capitalize">
				{{ $auth.$state.user.role == 'user' ? 'Mis planes' : 'Horario' }}
			</v-tab>

			<v-tab class="primary--text text-capitalize">
				{{ $auth.$state.user.role == 'user' ? 'Mi psicologo' : 'Servicios' }}
			</v-tab>
		</v-tabs>
		<v-row no-gutters>
			<v-col cols="12">
				<v-tabs-items v-model="tabs" class="hidden-sm-and-down">
					<v-tab-item :transition="false">
						<general-information
							v-if="tabs === 0"
							:psychologist="psychologist"
							:set-psychologist="setPsychologist"
						/>
					</v-tab-item>
					<v-tab-item :transition="false">
						<my-plans v-if="tabs === 1 && $auth.$state.user.role === 'user'" />
						<horario
							v-if="tabs === 1 && $auth.$state.user.role === 'psychologist'"
							:psychologist="psychologist"
							:set-psychologist="setPsychologist"
						/>
					</v-tab-item>
					<v-tab-item :transition="false">
						<psicologo
							v-if="tabs === 2 && $auth.$state.user.role === 'user'"
							:psychologist="psychologist"
							:set-psychologist="setPsychologist"
						/>
						<services
							v-if="tabs === 2 && $auth.$state.user.role === 'psychologist'"
							:psychologist="psychologist"
							:set-psychologist="setPsychologist"
						/>
					</v-tab-item>
				</v-tabs-items>
				<v-expansion-panels v-model="panels" flat multiple class="mb-4 hidden-md-and-up">
					<v-expansion-panel>
						<v-expansion-panel-header>
							<div>
								<div class="text-h6" style="color: #3c3c3b">
									Configuración personal
								</div>
								<div
									v-if="$auth.$state.user.role === 'psychologist'"
									class="text--secondary"
								>
									Datos bancarios, información profesional, etc
								</div>
								<div v-else class="text--secondary">Configura tu perfil</div>
							</div>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<general-information
								:psychologist="psychologist"
								:set-psychologist="setPsychologist"
							/>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel v-if="$auth.$state.user.role == 'user'">
						<v-expansion-panel-header>
							<div>
								<div class="text-h6" style="color: #3c3c3b">Mis planes</div>
								<div class="text--secondary">Tus planes contratados</div>
							</div>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<my-plans />
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel v-if="$auth.$state.user.role == 'user'">
						<v-expansion-panel-header>
							<div>
								<div class="text-h6" style="color: #3c3c3b">Mi psicologo</div>
								<div class="text--secondary">Psicólogo actual</div>
							</div>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<psicologo
								:psychologist="psychologist"
								:set-psychologist="setPsychologist"
							/>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel v-if="$auth.$state.user.role === 'psychologist'">
						<v-expansion-panel-header>
							<div>
								<div class="text-h6" style="color: #3c3c3b">Horarios</div>
								<div class="text--secondary">
									Configura tu disponibilidad de atención
								</div>
							</div>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<horario
								:psychologist="psychologist"
								:set-psychologist="setPsychologist"
							/>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel v-if="$auth.$state.user.role === 'psychologist'">
						<v-expansion-panel-header>
							<div>
								<div class="text-h6" style="color: #3c3c3b">Servicios</div>
								<div class="text--secondary">
									Establece tus precios y política de agendamiento
								</div>
							</div>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-card elevation="6" to="perfil/services">
								<v-card-title>
									<div class="my-6" style="width: 100%">
										<div class="text-h6" style="color: #3c3c3b">
											Configuración de servicios
										</div>
										<div class="text--secondary body-2">
											Configura los servicios ofrecidos por medio de Hablaquí
										</div>
									</div>
								</v-card-title>
							</v-card>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { mdiCamera } from '@mdi/js';
import moment from 'moment-timezone';
moment.tz.setDefault('America/Santiago');

export default {
	components: {
		Appbar: () => import('~/components/dashboard/AppbarProfile'),
		Avatar: () => import('~/components/Avatar'),
		GeneralInformation: () => import('~/components/dashboard/General'),
		Horario: () => import('~/components/dashboard/Horario'),
		Icon: () => import('~/components/Icon'),
		MyPlans: () => import('~/components/dashboard/MyPlans'),
		Psicologo: () => import('~/components/dashboard/Psicologo'),
		Services: () => import('~/components/dashboard/Services'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			mdiCamera,
			tabs: 0,
			panels: [],
			loadingAvatar: false,
			sidebar: 0,
		};
	},
	computed: {
		psychologist: {
			get() {
				return this.item;
			},
			set(value) {
				this.setPsychologist(value);
			},
		},
		...mapGetters({ item: 'Psychologist/psychologist', step: 'User/step' }),
	},
	watch: {
		step(newValue) {
			if (newValue) this.tabs = newValue.tab;
		},
	},
	methods: {
		setPsychologist(value) {
			this.psychologist = value;
		},
		async uploadAvatar(file) {
			if (!file) return false;
			this.loadingAvatar = true;
			const { user } = await this.upateAvatar(this.setAvatarObject(file));
			this.$auth.setUser(user);
			this.loadingAvatar = false;
			if (this.$auth.user.role === 'psychologist' && this.$auth.user.psychologist)
				alert('Tu avatar estara disponible publicamente despues de que lo aprobemos');
		},
		setAvatarObject(file) {
			const avatar = new FormData();
			avatar.append('avatar', file);
			avatar.append('_id', this.$auth.$state.user._id);
			avatar.append('name', this.$auth.$state.user.name);
			avatar.append('lastName', this.$auth.$state.user.lastName);
			avatar.append('idPsychologist', this.$auth.$state.user.psychologist);
			avatar.append('role', this.$auth.$state.user.role);
			avatar.append('oldAvatar', this.$auth.$state.user.avatar);
			avatar.append(
				'oldAvatarThumbnail',
				this.$auth.$state.user.avatarThumbnail ? this.$auth.$state.user.avatarThumbnail : ''
			);
			return avatar;
		},
		...mapMutations({
			setPsychologist: 'Psychologist/setPsychologist',
		}),
		...mapActions({
			upateAvatar: 'User/upateAvatar',
		}),
	},
};
</script>
