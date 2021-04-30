<template>
	<div>
		<!-- appbar -->
		<appbar />
		<!-- routing for child -->
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
import Appbar from '@/components/ui/Appbar.vue';
import { mapActions } from 'vuex';
export default {
	components: {
		Footer: () => import('@/components/footers/FooterExperts'),
		Appbar,
	},
	data() {
		return {
			loading: false,
		};
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
