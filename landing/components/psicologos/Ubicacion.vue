<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<appbar />
		<geoPsicologos :location="location" />
		<!-- routing for child -->
		<psicologos />
		<v-container>
			<v-row>
				<v-col cols="12" offset-md="3" md="9">
					<v-breadcrumbs
						:items="[
							{
								text: 'Página de inicio',
								disabled: false,
								href: '/',
							},
							{
								text: 'Psicólogos',
								disabled: false,
								href: '/psicologos',
							},
							{
								text: location ? location.name : '',
								disabled: true,
								href: `/psicologos/${location.slug}`,
							},
						]"
					>
						<template #item="{ item }">
							<v-breadcrumbs-item :href="item.href" :disabled="item.disabled">
								<span class="body-1 font-weight-medium">{{ item.text }}</span>
							</v-breadcrumbs-item>
						</template>
					</v-breadcrumbs>
				</v-col>
			</v-row>
		</v-container>
		<!-- footer -->
		<div style="background-color: #0f3860" class="mt-16">
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
export default {
	components: {
		Footer: () => import('~/components/Footer'),
		Appbar: () => import('~/components/AppbarWhite'),
		psicologos: () => import('~/components/psicologos/psicologos'),
		geoPsicologos: () => import('~/components/psicologos/GeoPsicologos'),
	},
	props: {
		location: {
			type: Object,
			default: null,
		},
	},
};
</script>
