<template>
	<div>
		<v-navigation-drawer v-if="!$vuetify.breakpoint.mdAndUp" v-model="drawer">
			<v-list-item>
				<v-img
					style="max-width: 150px"
					:src="`${$config.LANDING_URL}/logo.png`"
					alt="hablaqui Logo"
				/>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense>
				<v-list-item
					link
					active-class="primary white--text"
					:href="`${$config.FRONTEND_URL}/psicologos/todos`"
				>
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
			:src="`${$config.LANDING_URL}/appbar.png`"
			color="transparent"
		>
			<router-link to="/" exact>
				<img
					style="max-width: 180px"
					alt="hablaqui Logo"
					:src="`${$config.LANDING_URL}/logo.png`"
					contain
				/>
			</router-link>
			<template v-if="$vuetify.breakpoint.mdAndUp">
				<v-btn
					:href="`${$config.FRONTEND_URL}/psicologos/todos`"
					light
					rounded
					text
					active-class="info--text"
					class="ml-4"
				>
					Nuestros especialistas
				</v-btn>
				<v-btn light rounded text active-class="info--text"> Para empresas </v-btn>
				<v-btn light rounded text active-class="info--text"> Para especialistas </v-btn>
				<v-spacer></v-spacer>
				<v-btn color="primary" rounded text :href="`${$config.FRONTEND_URL}`">
					Entrar
				</v-btn>
				<v-btn
					rounded
					class="mx-2"
					color="primary"
					depressed
					:href="`${$config.FRONTEND_URL}/auth`"
				>
					Comenzar
				</v-btn>
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
