<template>
	<div>
		<router-view :loading="loading" />
		<!-- footer -->
		<v-container fluid class="primary white--text py-16">
			<v-row>
				<v-col>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat, harum
					dolorem! A qui quaerat eius unde beatae adipisci ex culpa. Quod, adipisci esse
					voluptas nisi omnis nihil animi similique natus. Lorem ipsum dolor sit amet,
					consectetur adipisicing elit. Placeat, harum dolorem! A qui quaerat eius unde
					beatae adipisci ex culpa. Quod, adipisci esse voluptas nisi omnis nihil animi
					similique natus. Lorem ipsum dolor sit ame.
				</v-col>
			</v-row>
		</v-container>
		<Footer />
	</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	data() {
		return {
			loading: false,
		};
	},
	components: {
		Footer: () => import('@/components/footers/FooterExperts'),
	},
	async mounted() {
		this.loading = true;
		await this.getPsychologists();
		await this.getAppointments();
		this.loading = false;
	},
	methods: {
		...mapActions({
			getPsychologists: 'Psychologist/getPsychologists',
			getAppointments: 'Appointments/getAppointments',
		}),
	},
};
</script>
