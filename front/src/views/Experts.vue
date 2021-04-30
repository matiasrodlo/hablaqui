<template>
	<div>
		<!-- appbar -->
		<appbar />
		<!-- routing for child -->
		<router-view :loading="loading" />
		<!-- footer -->
		<div class="primary">
			<v-container class="white--text py-16">
				<v-row>
					<v-col>
						Importante: Los servicios disponibles a través de Hablaquí son
						proporcionados de forma independiente por profesionales en salud mental
						certificados. Hablaquí no proporciona ningún servicio de salud mental u
						otros de atención médica. Los profesionales en salud mental no pre-escriben
						medicamentos a través de Hablaquí. Si estás experimentando una crisis o
						emergencia, por favor comunícate a los servicios de emergencia más cercanos
						a tu localidad.
					</v-col>
				</v-row>
			</v-container>
		</div>
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
