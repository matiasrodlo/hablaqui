<template>
	<div>
		<v-navigation-drawer mini-variant-width="110" mini-variant permanent app>
			<v-list-item style="height: 110px">
				<v-btn fab x-large text to="/">
					<img style="width: 40px" src="@/assets/logo_tiny.png" />
				</v-btn>
			</v-list-item>
			<v-divider></v-divider>
			<v-list class="pt-0">
				<!-- home -->
				<v-list-item class="my-4">
					<v-tooltip color="primary" right>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								link
								color="primary"
								fab
								text
								:to="{ name: 'espacio' }"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon x-large>
									{{
										$route.name == 'espacio'
											? 'mdi-account'
											: 'mdi-account-outline'
									}}
								</v-icon>
							</v-btn>
						</template>
						<span>Mi espacio</span>
					</v-tooltip>
				</v-list-item>
				<!-- agenda -->
				<v-list-item class="my-4">
					<v-tooltip color="primary" right>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								link
								color="primary"
								fab
								text
								:to="{ name: 'agenda' }"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon x-large>
									{{
										$route.name == 'agenda'
											? 'mdi-calendar-month'
											: 'mdi-calendar-month-outline'
									}}
								</v-icon>
							</v-btn>
						</template>
						<span>Mi agenda</span>
					</v-tooltip>
				</v-list-item>
				<!-- diario -->
				<v-list-item class="my-4">
					<v-tooltip color="primary" right>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								link
								color="primary"
								fab
								text
								:to="{ name: 'diario' }"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon x-large>
									{{
										$route.name == 'diario'
											? 'mdi-file-document-edit'
											: 'mdi-file-document-edit-outline'
									}}
								</v-icon>
							</v-btn>
						</template>
						<span>Mi diario</span>
					</v-tooltip>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar app dark height="110" color="primary" style="border-radius: 0 0 0 25px">
			<div>
				<div class="title">{{ $route.meta.title }}</div>
				<small>
					lorem ipsum dolor sit amet, consectetuer adipis-cing elit, sed diam nonummy nibh
					euismo
				</small>
			</div>
			<v-spacer></v-spacer>
			<v-tooltip color="white" bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn text :to="{ name: 'psicologos' }" v-bind="attrs" v-on="on">
						Expertos
					</v-btn>
				</template>
				<span class="secondary--text">Nuestros psicologos</span>
			</v-tooltip>
			<v-tooltip color="white" bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn text :to="{ name: 'faq' }" v-bind="attrs" v-on="on">
						Centro de ayuda
					</v-btn>
				</template>
				<span class="secondary--text">Centro de ayuda</span>
			</v-tooltip>
			<v-tooltip color="white" bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on" @click="logout">
						<v-icon>mdi-logout-variant</v-icon>
					</v-btn>
				</template>
				<span class="secondary--text">Salir</span>
			</v-tooltip>
		</v-app-bar>
		<router-view />
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
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
