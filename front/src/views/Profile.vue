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
					<v-btn link color="primary" fab text :to="{ name: 'perfil-home' }">
						<v-icon x-large>
							{{
								$route.name == 'perfil-home' ? 'mdi-account' : 'mdi-account-outline'
							}}
						</v-icon>
					</v-btn>
				</v-list-item>
				<!-- agenda -->
				<v-list-item class="my-4">
					<v-btn link color="primary" fab text :to="{ name: 'agenda' }">
						<v-icon x-large>
							{{
								$route.name == 'agenda'
									? 'mdi-calendar-month'
									: 'mdi-calendar-month-outline'
							}}
						</v-icon>
					</v-btn>
				</v-list-item>
				<!-- diario -->
				<v-list-item class="my-4">
					<v-btn link color="primary" fab text :to="{ name: 'diario' }">
						<v-icon x-large>
							{{
								$route.name == 'diario'
									? 'mdi-file-document-edit'
									: 'mdi-file-document-edit-outline'
							}}
						</v-icon>
					</v-btn>
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
			<v-btn text :to="{ name: 'psicologos' }">Expertos</v-btn>
			<v-btn text :to="{ name: 'faq' }">Centro de ayuda</v-btn>
			<v-btn text to="/">
				<img style="width: 30px" src="@/assets/logo_tiny_white.png" />
			</v-btn>
		</v-app-bar>
		<v-main>
			<router-view />
		</v-main>
	</div>
</template>
