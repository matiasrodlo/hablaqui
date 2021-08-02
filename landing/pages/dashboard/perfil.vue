<template>
	<v-container style="height: 100vh">
		<appbar title="Mi cuenta" />
		<v-list two-line style="border-radius: 15px; height: 150px">
			<v-list-item style="position: relative">
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
					<v-avatar v-if="loadingAvatar" size="150" color="#EEE">
						<v-progress-circular indeterminate color="primary"></v-progress-circular
					></v-avatar>
					<label v-else for="upload" style="cursor: pointer">
						<v-avatar size="100" color="#EEE">
							<v-img
								v-if="$auth.$state.user && $auth.$state.user.avatar"
								:src="$auth.$state.user.avatar"
								:alt="$auth.$state.user.name"
								contain
							/>
							<v-icon v-else x-large>mdi-camera</v-icon>
						</v-avatar>
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
		</v-list>
		<v-tabs v-model="tabs" grow style="height: 100px">
			<v-tabs-slider></v-tabs-slider>
			<v-tab class="primary--text text-capitalize"> Información General </v-tab>

			<v-tab
				v-if="$auth.$state.user && $auth.$state.user.role == 'user'"
				class="primary--text text-capitalize"
			>
				Mis planes
			</v-tab>

			<v-tab
				v-if="$auth.$state.user && $auth.$state.user.role == 'user'"
				class="primary--text text-capitalize"
			>
				Mi psicologo
			</v-tab>
		</v-tabs>
		<v-row style="height: calc(100vh - 360px); overflow-y: auto">
			<v-col cols="12">
				<v-tabs-items v-model="tabs">
					<v-tab-item :transition="false">
						<general-information v-if="tabs == 0" />
					</v-tab-item>
					<v-tab-item :transition="false">
						<my-plans v-if="tabs == 1" />
					</v-tab-item>
					<v-tab-item :transition="false">
						<psicologo v-if="tabs == 2" />
					</v-tab-item>
				</v-tabs-items>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		GeneralInformation: () => import('~/components/dashboard/General'),
		MyPlans: () => import('~/components/dashboard/MyPlans'),
		Psicologo: () => import('~/components/dashboard/Psicologo'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			tabs: 0,
			loadingAvatar: false,
			sidebar: 0,
		};
	},
	methods: {
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
		...mapActions({ upateAvatar: 'User/upateAvatar' }),
	},
};
</script>

<style lang="scss" scoped></style>
