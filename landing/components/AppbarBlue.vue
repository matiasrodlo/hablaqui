<template>
	<div>
		<v-navigation-drawer v-if="!$vuetify.breakpoint.mdAndUp" v-model="drawer" app>
			<v-list-item>
				<img style="max-width: 150px" :src="`${$config.LANDING_URL}/logo.png`" />
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item link active-class="primary white--text">
					<v-list-item-content>
						<v-list-item-title>Nuestros especialistas</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-content>
						<v-list-item-title>Para empresas</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-content>
						<v-list-item-title>Para especialistas</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-content>
						<v-list-item-title>Entrar</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-content>
						<v-list-item-title>Comenzar</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar
			flat
			:height="height"
			:src="`${$config.LANDING_URL}/appbar_blue.png`"
			color="transparent"
		>
			<router-link to="/" exact>
				<img
					style="max-width: 180px"
					alt="habla aqui Logo"
					:src="`${$config.LANDING_URL}/logo_white.png`"
					contain
				/>
			</router-link>
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<v-spacer></v-spacer>
				<v-btn
					:href="`${$config.FRONTEND_URL}/`"
					x-large
					rounded
					class="mx-2 primary--text font-weight-bold"
					color="white"
					depressed
				>
					Comience su terapia ahora
				</v-btn>
				<v-icon x-large color="white" class="ma-2">mdi-magnify</v-icon>
				<v-icon x-large color="white" class="ma-2">mdi-menu</v-icon>
			</template>
			<template v-else>
				<v-spacer></v-spacer>
				<v-btn icon @click="drawer = !drawer">
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</template>
		</v-app-bar>
	</div>
</template>

<script>
export default {
	data() {
		return {
			drawer: false,
		};
	},
	computed: {
		height() {
			if (this.$vuetify.breakpoint.xlOnly) return '270px';
			if (this.$vuetify.breakpoint.lgAndUp) return '220px';
			if (this.$vuetify.breakpoint.mdAndUp) return '180px';
			if (this.$vuetify.breakpoint.smAndUp) return '150px';
			return '100px';
		},
	},
};
</script>
