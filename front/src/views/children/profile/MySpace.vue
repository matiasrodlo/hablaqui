<template>
	<v-container>
		<v-row>
			<v-col>
				<v-list three-line>
					<v-list-item style="position: relative">
						<v-btn
							absolute
							style="left: 130px; z-index: 1;"
							bottom
							color="primary"
							icon
							outlined
						>
							<v-icon>mdi-plus</v-icon>
						</v-btn>
						<v-list-item-avatar size="150">
							<v-avatar size="150" color="#bdbdbd">
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
