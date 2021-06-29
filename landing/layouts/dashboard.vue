<template>
	<v-app>
		<v-row class="primary" style="height: 100vh" no-gutters>
			<v-col cols="2" class="d-flex" style="flex-direction: column">
				<div style="flex: 1; height: 230px" class="d-flex align-center justify-center">
					<img
						style="width: 70px; cursor: pointer"
						:src="`${$config.LANDING_URL}/logo_tiny_white.png`"
						@click="() => $router.push({ name: 'psicologos' })"
					/>
				</div>
				<v-list style="flex: 2" dark color="primary" class="pt-0" left shaped top>
					<template v-for="(item, i) in links">
						<v-list-item v-if="item.visible" :key="i" class="my-4" link :to="item.link">
							<v-list-item-avatar size="35">
								<v-img :src="item.img" :alt="item.name" />
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="font-weight-bold body-2">
									{{ item.name }}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
				</v-list>
			</v-col>
			<v-col cols="10">
				<div style="border-radius: 50px 0 0 0" class="white">
					<nuxt />
				</div>
			</v-col>
		</v-row>
	</v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	computed: {
		links() {
			return [
				{
					name: 'Chat',
					link: 'chat',
					img: `${this.$config.LANDING_URL}/chat.png`,
					visible: true,
				},
				{
					name: 'Mis sesiones',
					link: 'agenda',
					img: `${this.$config.LANDING_URL}/sesiones.png`,
					visible: true,
				},
				{
					name: 'Diario de bienestar',
					link: 'diario',
					img: `${this.$config.LANDING_URL}/notas.png`,
					visible: false,
				},
				{
					name: 'Pagos',
					link: 'pagos',
					img: `${this.$config.LANDING_URL}/pagos.png`,
					visible: this.user.role === 'psychologist',
				},
				{
					name: 'Mi cuenta',
					link: 'perfil',
					img: `${this.$config.LANDING_URL}/home.png`,
					visible: true,
				},
			];
		},
		...mapGetters({ user: 'User/user' }),
	},
	methods: {
		logout() {
			this.resetUser();
			localStorage.removeItem('vuex');
			this.$router.push({ name: 'auth' });
		},
		...mapMutations({ resetUser: 'User/reset' }),
	},
};
</script>
