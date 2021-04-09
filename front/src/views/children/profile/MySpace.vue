<template>
	<v-container>
		<v-row>
			<v-col>
				<v-list three-line>
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
							<v-avatar size="150" color="#E0E0E0">
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
				<v-card color="#E0E0E0" flat>
					<v-card-text>
						<v-row>
							<v-col cols="3" style="text-center">
								<v-btn
									block
									color="primary"
									style="border-radius:10px"
									small
									depressed
									class="my-2"
								>
									Información General
								</v-btn>
								<v-btn
									block
									style="border-radius:10px"
									small
									text
									depressed
									class="my-2"
								>
									Planes contratados
								</v-btn>
								<v-btn
									block
									style="border-radius:10px"
									small
									text
									depressed
									class="my-2"
								>
									Sesiones completadas
								</v-btn>
								<v-btn
									block
									style="border-radius:10px"
									small
									text
									depressed
									class="my-2"
								>
									Psicólogo
								</v-btn>
							</v-col>
							<v-col cols="9" style="border-left: 1px solid white;">
								Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique
								iure voluptate mollitia dolore quidem quam inventore eligendi.
								Voluptatem enim, sunt assumenda quasi hic, commodi possimus at
								aliquam aperiam magnam doloribus! Lorem, ipsum dolor sit amet
								consectetur adipisicing elit. Similique iure voluptate mollitia
								dolore quidem quam inventore eligendi. Voluptatem enim, sunt
								assumenda quasi hic, commodi possimus at aliquam aperiam magnam
								doloribus! Lorem, ipsum dolor sit amet consectetur adipisicing elit.
								Similique iure voluptate mollitia dolore quidem quam inventore
								eligendi. Voluptatem enim, sunt assumenda quasi hic, commodi
								possimus at aliquam aperiam magnam doloribus! Lorem, ipsum dolor sit
								amet consectetur adipisicing elit. Similique iure voluptate mollitia
								dolore quidem quam inventore eligendi. Voluptatem enim, sunt
								assumenda quasi hic, commodi possimus at aliquam aperiam magnam
								doloribus!
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
