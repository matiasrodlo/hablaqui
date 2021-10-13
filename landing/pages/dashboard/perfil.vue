<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Mi cuenta" />
		<v-list two-line color="transparent" style="height: 150px">
			<v-list-item class="hidden-sm-and-down" style="position: relative">
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
							:url="$auth.$state.user.avatar"
							:name="$auth.$state.user.name"
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
							:url="$auth.$state.user.avatar"
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
		<v-tabs v-model="tabs" grow style="height: 100px">
			<v-tabs-slider></v-tabs-slider>
			<v-tab class="primary--text text-capitalize"> Información General </v-tab>

			<v-tab v-if="$auth.$state.user" class="primary--text text-capitalize">
				{{ $auth.$state.user.role == 'user' ? 'Mis planes' : 'Horario' }}
			</v-tab>

			<v-tab class="primary--text text-capitalize">
				{{ $auth.$state.user.role == 'user' ? 'Mi psicologo' : 'Servicios' }}
			</v-tab>
		</v-tabs>
		<v-row>
			<v-col cols="12">
				<v-tabs-items v-model="tabs">
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
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { mdiCamera } from '@mdi/js';

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
	async asyncData({ $axios, $auth }) {
		if ($auth.$state.user.role === 'user') {
			if ($auth.$state.user.plan.length) {
				const item = $auth.$state.user.plan.find(el => el.status === 'success');
				if (item) {
					const { psychologist } = await $axios.$get(
						`/psychologists/one/${item.psychologist}`
					);
					return { psychologist };
				}
			}
			return { psychologist: null };
		} else {
			const { psychologist } = await $axios.$get(
				`/psychologists/one/${$auth.$state.user.psychologist}`
			);
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
			return { psychologist };
		}
	},
	data() {
		return {
			mdiCamera,
			tabs: 0,
			loadingAvatar: false,
			sidebar: 0,
		};
	},
	methods: {
		setPsychologist(value) {
			this.psychologist = value;
		},
		async uploadAvatar(file) {
			this.loadingAvatar = true;
			const user = await this.upateAvatar(this.setAvatarObject(file));
			this.$auth.setUser(user);
			this.loadingAvatar = false;
		},
		setAvatarObject(file) {
			const avatar = new FormData();
			avatar.append('avatar', file);
			return avatar;
		},
		...mapActions({
			upateAvatar: 'User/upateAvatar',
		}),
	},
};
</script>
