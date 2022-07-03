<template>
	<div style="background-color: #f0f8ff">
		<!-- appbar -->
		<appbar />
		<!-- geo psicologos -->
		<geoPsicologos :location="location" />
		<!-- desktop -->
		<psicologos-desktop
			:loading-psychologist="loadingPsychologist"
			:get-sessions-limit="getSessions"
			class="hidden-sm-and-down"
		/>
		<!-- mobile -->
		<psicologos-mobile
			:loading-psychologist="loadingPsychologist"
			:get-sessions-limit="getSessions"
			class="hidden-md-and-up"
		/>
		<!-- expand panels -->
		<v-container>
			<v-row>
				<v-col cols="12" class="text--secondary text-center font-weight-bold text-h6">
					Preguntas frecuentes sobre terapias desde {{ location.slug }}
				</v-col>
				<v-col tag="section" cols="12" class="text-left">
					<v-expansion-panels v-model="panel" tag="section" light multiple flat>
						<v-expansion-panel
							v-for="(item, i) in faq"
							:key="i"
							class="shadowBlue my-2 pa-0"
						>
							<v-expansion-panel-header class="py-3 pl-3" light>
								<h4 class="white--textfont-weight-bold">{{ item.title }}</h4>
							</v-expansion-panel-header>
							<v-expansion-panel-content class="white text--secondary pt-5">
								{{ item.desc }}
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
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
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		Footer: () => import('~/components/Footer'),
		Appbar: () => import('~/components/AppbarWhite'),
		geoPsicologos: () => import('~/components/psicologos/GeoPsicologos'),
		PsicologosDesktop: () =>
			import(
				/* webpackChunkName: "PsicologosDesktop" */ '~/components/psicologos/PsicologosDesktop'
			),
		PsicologosMobile: () =>
			import(
				/* webpackChunkName: "PsicologosMobile" */ '~/components/psicologos/PsicologosMobile'
			),
	},
	props: {
		location: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			panel: [],
			faq: [
				{
					id: 1,
					title: '¿A qué tipo de psicólogo online debo acudir?',
					desc: `Los psicólogos clínicos licenciados son profesionales de la salud mental más frecuentes en ${this.location.slug}. Estos
                        tienen la facultad de diagnosticar trastornos mentales y ofrecer terapia especializada.
                        La formación y certificaciones difieren en función del profesional. Siendo así que cada psicólogo puede
                        especializarse en un área concreta, como la depresión, el asesoramiento matrimonial o la ansiedad. `,
				},
				{
					id: 2,
					title: `¿Cómo puedo encontrar a un psicólogo en ${this.location.slug}?`,
					desc: `En Hablaquí nos enfocamos exclusivamente en proveer terapia en línea de modo que usted pueda acceder a
                        un psicólogo online estando en Localidad o en cualquier parte del mundo. Utilizando los filtros de esta página,
                        puede acotar su búsqueda y explorar numerosas categorías para encontrar un psicólogo online con la
                        experiencia y especialidad que necesita. Por ejemplo, es posible que desee limitar su búsqueda a un psicólogo
                        cognitivo conductual para atenderse en línea desde Localidad.`,
				},
				{
					id: 3,
					title: '¿Qué tipo de terapia en línea es el mejor para mí?',
					desc: `No existe una “forma correcta”. Cada tipo de orientación o tratamiento tiene el potencial de ayudar a una
                        amplia gama de condiciones. Los psicólogos online de Hablaquí le permiten aumentar sus niveles de bienestar
                        emocional estando en Localidad, para ello se especializan en diversas técnicas terapéuticas, como la
                        psicoanalítica, cognitivo-conductual o sistémica. `,
				},
			],
		};
	},
	computed: {
		...mapGetters({ loadingPsychologist: 'Psychologist/loadingPsychologist' }),
	},
	mounted() {
		window.scrollTo(0, 0);
		this.initialFetch();
	},
	methods: {
		async initialFetch() {
			await this.getAppointments();
		},
		getSessions(ids) {
			this.getSessionsLimit(ids);
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			getMarketplacePsychologists: 'Psychologist/getMarketplacePsychologists',
			getFormattedSessionsAll: 'Psychologist/getFormattedSessionsAll',
			getSessionsLimit: 'Psychologist/getSessionsLimit',
		}),
	},
};
</script>

<style lang="scss" scoped>
.shadowBlue {
	box-shadow: 0 3px 6px 0 rgba(26, 165, 216, 0.16) !important;
}
</style>
