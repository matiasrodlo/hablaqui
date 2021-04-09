<template>
	<v-container>
		<v-row>
			<v-col>
				<v-list three-line style="border-radius:15px">
					<v-list-item style="position: relative">
						<v-btn
							absolute
							style="left: 120px; z-index: 1;"
							bottom
							color="primary"
							icon
							small
							outlined
						>
							<v-icon>mdi-plus</v-icon>
						</v-btn>
						<v-list-item-avatar size="150">
							<v-avatar size="150" color="#EEE">
								<img v-if="user.avatar" :src="user.avatar" alt="John" />
								<span v-else class="white--text text-h3 text-uppercase">
									{{ initials }}
								</span>
							</v-avatar>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title
								class="text-uppercase font-weight-bold text-h6 text-md-h5 text-lg-h4"
							>
								{{ user.name }}
							</v-list-item-title>
							<v-list-item-subtitle class="title">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem et
								cupiditate natus est odit Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Quidem et cupiditate natus est odit
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-col>
			<v-col cols="12">
				<v-card color="#EEE" flat style="border-radius:15px">
					<v-card-text>
						<v-row>
							<v-col cols="3" style="text-center">
								<v-btn
									block
									:color="sidebar === 0 ? 'primary' : 'transparent'"
									style="border-radius:10px"
									small
									depressed
									class="my-2"
									@click="sidebar = 0"
								>
									Información General
								</v-btn>
								<v-btn
									:color="sidebar === 1 ? 'primary' : 'transparent'"
									block
									style="border-radius:10px"
									small
									depressed
									class="my-2"
									@click="sidebar = 1"
								>
									Planes contratados
								</v-btn>
								<v-btn
									:color="sidebar === 2 ? 'primary' : 'transparent'"
									block
									style="border-radius:10px"
									small
									depressed
									class="my-2"
									@click="sidebar = 2"
								>
									Sesiones completadas
								</v-btn>
								<v-btn
									:color="sidebar === 3 ? 'primary' : 'transparent'"
									block
									style="border-radius:10px"
									small
									depressed
									class="my-2"
									@click="sidebar = 3"
								>
									Psicólogo
								</v-btn>
							</v-col>
							<v-col cols="9" style="border-left: 1px solid white;">
								<general-information v-if="sidebar == 0" />
								<my-plans v-if="sidebar == 1" />
								<my-sesions v-if="sidebar == 2" />
								<psicologo v-if="sidebar == 3" />
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	components: {
		GeneralInformation: () => import('@/components/my-space/General'),
		MyPlans: () => import('@/components/my-space/MyPlans'),
		MySesions: () => import('@/components/my-space/MySesions'),
		Psicologo: () => import('@/components/my-space/Psicologo'),
	},
	data() {
		return {
			sidebar: 0,
		};
	},
	computed: {
		initials() {
			if (this.user.name)
				return `${this.user.name.substr(0, 1)}${this.user.lastName &&
					this.user.lastName.substr(0, 1)}`;
			return 'nada';
		},
		...mapGetters({ user: 'User/user' }),
	},
};
</script>

<style lang="scss" scoped></style>
