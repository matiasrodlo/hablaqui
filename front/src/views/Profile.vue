<template>
	<div>
		<v-navigation-drawer mini-variant-width="110" mini-variant permanent app>
			<v-list-item style="height: 110px">
				<img style="width: 40px" src="@/assets/logo_tiny.png" />
			</v-list-item>

			<v-divider></v-divider>
			<v-list class="pt-0">
				<!-- home -->
				<v-list-item link :to="{ name: 'perfil-home' }">
					<v-list-item-icon>
						<v-icon color="primary" large>
							{{
								$route.name == 'perfil-home' ? 'mdi-account' : 'mdi-account-outline'
							}}
						</v-icon>
					</v-list-item-icon>

					<v-list-item-content class="primary--text">
						<v-list-item-title>Mi perfil</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<!-- agenda -->
				<v-list-item link :to="{ name: 'agenda' }">
					<v-list-item-icon>
						<v-icon color="primary" large>
							{{
								$route.name == 'agenda'
									? 'mdi-calendar-month'
									: 'mdi-calendar-month-outline'
							}}
						</v-icon>
					</v-list-item-icon>
					<v-list-item-content class="primary--text">
						<v-list-item-title>Mi agenda</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<!-- diario -->
				<v-list-item link :to="{ name: 'diario' }">
					<v-list-item-icon>
						<v-icon color="primary" large>
							{{
								$route.name == 'diario'
									? 'mdi-file-document-edit'
									: 'mdi-file-document-edit-outline'
							}}
						</v-icon>
					</v-list-item-icon>

					<v-list-item-content class="primary--text">
						<v-list-item-title>Agenda</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar app dark height="110" color="primary" style="border-radius: 0 0 0 25px">
			<div>
				<div class="title">Mi espacio</div>
				<small>
					lorem ipsum dolor sit amet, consectetuer adipis-cing elit, sed diam nonummy nibh
					euismo
				</small>
			</div>
			<v-spacer></v-spacer>
			<v-btn text>Expertos</v-btn>
			<v-btn text>Centro de ayuda</v-btn>
			<v-btn text>
				<img style="width: 30px" src="@/assets/logo_tiny_white.png" />
			</v-btn>
		</v-app-bar>
		<v-main>
			<router-view />
		</v-main>
	</div>
</template>
