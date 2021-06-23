<template>
	<div>
		<template v-if="user._id == '60a0e168fd8c0f000ace3b71'">
			<v-card flat>
				<v-card-text>
					<div>
						<span class="text-h4 font-weight-bold">14 $</span>
						<span class="text-h6 text--secondary">/week</span>
					</div>
					<div class="primary--text text-h6 font-weight-bold">
						Lorem ipsum dolor sit amet
					</div>
					<div class="body-1">
						Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
						nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
					</div>
					<div class="font-weight-bold body-1 mt-3">
						<span>1 mes de terapia (30 min) +</span>
						<span class="primary--text">$20</span>
					</div>
				</v-card-text>
			</v-card>
			<v-card flat>
				<v-card-text>
					<div>
						<span class="text-h4 font-weight-bold">14 $</span>
						<span class="text-h6 text--secondary">/week</span>
					</div>
					<div class="primary--text text-h6 font-weight-bold">
						Lorem ipsum dolor sit amet
					</div>
					<div class="body-1">
						Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
						nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
					</div>
					<div class="font-weight-bold body-1 mt-3">
						<span>1 mes de terapia (30 min) +</span>
						<span class="primary--text">$20</span>
					</div>
				</v-card-text>
			</v-card>
		</template>
		<template v-else>
			<v-card>
				<v-card-text class="text-center">
					<div
						class="headline font-weight-bold primary--text my-10 mx-auto"
						style="max-width: 295px"
					>
						Adquiere nuestros planes y agenda con un espacialista
					</div>
					<div class="body-1 my-10 mx-auto" style="max-width: 280px">
						Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
						nibh eu- ismod tincidunt ut laoreet dolore magna
					</div>
					<v-btn rounded color="primary" :to="{ name: 'all-psicologos' }">
						Buscar ahora
					</v-btn>
				</v-card-text>
			</v-card>
		</template>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters({ user: 'User/user' }),
	},
};
</script>

<style lang="scss" scoped></style>
