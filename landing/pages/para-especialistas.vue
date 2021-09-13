<template>
	<div>
		<v-img
			:src="`${$config.LANDING_URL}/especialistas.png`"
			:lazy-src="`${$config.LANDING_URL}/especialistas.png`"
			width="100%"
			height="auto"
			alt="Únete a la red de salud mental y bienestar"
		>
			<Appbar />
			<v-container id="form-psy" tag="section" fluid style="height: calc(100% - 180px)">
				<v-row justify="center" align="center" style="height: 100%">
					<v-col cols="12" md="7" xl="5">
						<h1
							class="
								text-center text-md-left
								white--text
								font-weight-bold
								text-h4 text-lg-h3
							"
						>
							Únete a la red de salud <br />
							mental y bienestar
						</h1>
						<h2
							class="
								mt-3
								text-center text-md-left
								white--text
								my-4
								text-h6 text-lg-h5
								font-weight-bold
							"
						>
							Descubre los beneficios de ser parte de Hablaquí y brinda terapia online
							desde cualquier lugar
						</h2>
						<v-list dark color="transparent" class="text-h5">
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content>
									<h3 class="text-h6 text-lg-h5">
										Oficina virtual práctica y segura.
									</h3>
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content>
									<h3 class="text-h6 text-lg-h5">
										Acceso a clientes registrados.
									</h3>
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content>
									<h3 class="text-h6 text-lg-h5">
										Crecimiento y desarrollo profesional.
									</h3>
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content>
									<h3 class="text-h6 text-lg-h5">
										Tarifas accesibles y convenientes
									</h3>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-col>
					<v-col class="hidden-sm-and-down" cols="12" md="5" lg="4" xl="3">
						<form-user-psy />
					</v-col>
				</v-row>
			</v-container>
		</v-img>
		<v-container class="mt-4 hidden-md-and-up">
			<v-row>
				<v-col>
					<form-user-psy />
				</v-col>
			</v-row>
		</v-container>
		<v-container style="max-width: 1400px">
			<v-row justify="center">
				<v-col cols="12">
					<h2 class="mt-8 text-center text-h4 text-lg-h3 font-weight-bold text-color">
						Tu consulta online personalizada
					</h2>
					<h3 class="mt-3 mb-8 text-center text-h6 text-color">
						Cree su propia oficina en minutos con alta tecnología y facilidad
					</h3>
				</v-col>
				<v-col v-for="item in items" :key="item.id" cols="12" md="4" class="my-md-4">
					<v-card tag="section" flat>
						<v-card-text class="text-center">
							<v-img
								height="78px"
								width="80px"
								contain
								class="mx-auto"
								:src="item.img"
								:lazy-src="item.img"
								:alt="item.title"
							/>
						</v-card-text>
						<v-card-text class="text-center pt-0">
							<h3 class="title font-weight-bold text-h5">
								{{ item.title }}
							</h3>
						</v-card-text>
						<v-card-text style="max-width: 400px" class="mx-auto text-center">
							<article class="body-1 mx-auto text-h6">
								{{ item.subtitle }}
							</article>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<!-- beneficios mobile -->
		<div class="hidden-md-and-up">
			<v-img
				width="100%"
				height="auto"
				:src="`${$config.LANDING_URL}/beneficios-responsive.png`"
			>
				<v-row justify="center" class="mt-16">
					<v-col cols="11" class="text-center mt-sm-16 pt-sm-16">
						<h2 class="font-weight-bold white--text text-h4 text-sm-h3">
							Beneficios de Hablaquí Office
						</h2>
					</v-col>
					<v-col cols="10" sm="8">
						<div class="mt-8 d-flex align-center">
							<img
								height="30"
								width="30"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 text-h6 text-sm-h5 font-weight-bold">
								Videollamadas seguras y cómodas
							</h3>
						</div>
						<div class="mt-5 d-flex align-center">
							<img
								height="25"
								width="25"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 text-h6 text-sm-h5 font-weight-bold">
								Sistema de reservas
							</h3>
						</div>
						<div class="mt-5 d-flex align-center">
							<img
								height="30"
								width="30"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 text-h6 text-sm-h5 font-weight-bold">
								Sitio web especializado
							</h3>
						</div>
						<div class="mt-5 d-flex align-center">
							<img
								height="30"
								width="30"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 text-h6 text-sm-h5 font-weight-bold">
								Gestión de agenda, clientes y pagos
							</h3>
						</div>
						<div class="mt-5 d-flex align-center">
							<img
								height="30"
								width="30"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 text-h6 text-sm-h5 font-weight-bold">
								Recordatorios y correo electrónico
							</h3>
						</div>
					</v-col>
				</v-row>
			</v-img>
		</div>
		<!-- beneficios desktop -->
		<div class="hidden-sm-and-down">
			<v-img
				width="100%"
				height="auto"
				class="d-flex align-center"
				:src="`${$config.LANDING_URL}/beneficios-de-hablaqui.png`"
			>
				<v-row justify="center">
					<v-col offset-md="6" cols="6" md="6">
						<h2 class="font-weight-bold white--text text-h6 text-md-h4 text-lg-h3">
							Beneficios de Hablaquí Office
						</h2>
						<div class="mt-8 d-flex align-center">
							<img
								height="30"
								width="30"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
								Videollamadas seguras y cómodas
							</h3>
						</div>
						<div class="mt-5 d-flex align-center">
							<img
								height="25"
								width="25"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
								Sistema de reservas
							</h3>
						</div>
						<div class="mt-5 d-flex align-center">
							<img
								height="30"
								width="30"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
								Sitio web especializado
							</h3>
						</div>
						<div class="mt-5 d-flex align-center">
							<img
								height="30"
								width="30"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
								Gestión de agenda, clientes y pagos
							</h3>
						</div>
						<div class="mt-5 d-flex align-center">
							<img
								height="30"
								width="30"
								:src="`${$config.LANDING_URL}/check-especialistas.png`"
								alt="check"
							/>
							<h3 class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
								Recordatorios y correo electrónico
							</h3>
						</div>
					</v-col>
				</v-row>
			</v-img>
		</div>
		<v-container style="max-width: 1400px">
			<v-row justify="center">
				<v-col cols="12">
					<h2 class="mt-8 text-center text-h4 text-lg-h3 font-weight-bold text-color">
						¿Por qué utilizar Office?
					</h2>
					<h3 class="mt-3 mb-8 text-center text-h6 text-color">
						Diferénciate con una experiencia 360
					</h3>
				</v-col>
				<v-col v-for="item in Office" :key="item.id" cols="12" md="4" class="my-4">
					<v-card tag="section" flat>
						<v-card-text class="text-center">
							<v-img
								height="76px"
								width="80px"
								contain
								class="mx-auto"
								:src="item.img"
								:lazy-src="item.img"
								:alt="item.title"
							/>
						</v-card-text>
						<v-card-text class="text-center pt-0">
							<h3 class="title font-weight-bold text-h5">
								{{ item.title }}
							</h3>
						</v-card-text>
						<v-card-text style="max-width: 400px" class="mx-auto text-center">
							<article class="body-1 mx-auto text-h6">
								{{ item.subtitle }}
							</article>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" class="text-center">
					<v-btn to="#form-psy" color="primary" x-large rounded>Regístrate ahora</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<div class="hidden-md-and-up">
			<v-img
				width="100vw"
				height="auto"
				style="background-image: linear-gradient(to top, #fff, #ffffff80, #fff0)"
				:src="`${$config.LANDING_URL}/descargar-app-small.png`"
			>
				<v-row justify-md="center">
					<v-col offset-md="6" cols="12" md="6" class="mt-0 mt-sm-16 mt-md-0">
						<h2
							class="
								pt-10 pt-sm-16
								text-center
								font-weight-bold
								white--text
								text-h5 text-sm-h4
							"
						>
							Descargar nuestra app de chat
						</h2>
						<h3 class="text-center font-weight-bold white--text body-2 my-4 text-sm-h6">
							Mantén contacto con tus consultantes vía Chat. <br />
							¡Descarga la aplicación ahora!
						</h3>
						<div class="d-flex justify-center pb-16">
							<v-img
								style="cursor: pointer; border-radius: 10px"
								hidden="30"
								max-width="120"
								class="ma-1"
								:src="`${$config.LANDING_URL}/google-play.png`"
								:lazy-src="`${$config.LANDING_URL}/google-play.png`"
								alt="descarcar nuestra aplicacion para android"
							/>
							<v-img
								style="cursor: pointer; border-radius: 10px"
								hidden="30"
								max-width="120"
								class="ma-1"
								:src="`${$config.LANDING_URL}/ios.svg`"
								:lazy-src="`${$config.LANDING_URL}/ios.svg`"
								alt="descargar aplicacion para ios"
							/>
						</div>
					</v-col>
				</v-row>
			</v-img>
		</div>
		<div class="hidden-sm-and-down">
			<v-img
				width="100vw"
				height="auto"
				style="background-image: linear-gradient(to top, #fff, #ffffff80, #fff0)"
				class="d-flex align-center"
				:src="`${$config.LANDING_URL}/descargar-app.png`"
			>
				<v-row justify-md="center">
					<v-col offset-md="6" cols="12" md="6" class="mt-0 mt-sm-16 mt-md-0">
						<h2
							class="
								pt-10 pt-sm-16
								text-center
								font-weight-bold
								white--text
								text-h5 text-sm-h4
							"
						>
							Descargar nuestra app de chat
						</h2>
						<h3 class="text-center font-weight-bold white--text body-2 my-4 text-sm-h6">
							Mantén contacto con tus consultantes vía Chat. <br />
							¡Descarga la aplicación ahora!
						</h3>
						<div class="d-flex justify-center pb-16">
							<v-img
								style="cursor: pointer; border-radius: 10px"
								hidden="40"
								max-width="140"
								class="ma-1"
								:src="`${$config.LANDING_URL}/google-play.png`"
								:lazy-src="`${$config.LANDING_URL}/google-play.png`"
								alt="descarcar nuestra aplicacion para android"
							/>
							<v-img
								style="cursor: pointer; border-radius: 10px"
								hidden="40"
								max-width="140"
								class="ma-1"
								:src="`${$config.LANDING_URL}/ios.svg`"
								:lazy-src="`${$config.LANDING_URL}/ios.svg`"
								alt="descargar aplicacion para ios"
							/>
						</div>
					</v-col>
				</v-row>
			</v-img>
		</div>
		<v-container fluid style="max-width: 1400px" tag="footer">
			<Footer />
		</v-container>
	</div>
</template>

<script>
import { mdiCheck } from '@mdi/js';

export default {
	components: {
		Footer: () => import('@/components/Footer'),
		Icon: () => import('~/components/Icon'),
		Appbar: () => import('@/components/AppbarWhite'),
		FormUserPsy: () => import('@/components/psicologos/FormUserPsy.vue'),
	},
	data() {
		return {
			mdiCheck,
			items: [
				{
					id: 1,
					title: 'Plataforma de video de sesión',
					subtitle: 'En su nueva oficina virtual, atienda a clientes de todo el mundo',
					img: `${this.$config.LANDING_URL}/videollamada.png`,
				},
				{
					id: 2,
					title: 'Autonomía y flexibilidad',
					subtitle:
						'Desde ahora organizar tu vida es más fácil. Gestiona tus horarios en tiempo real',
					img: `${this.$config.LANDING_URL}/agenda-cita.png`,
				},
				{
					id: 3,
					title: 'Atención a los clientes',
					subtitle:
						'Gestiona tus clientes fácilmente y ten tiempo para cuidar a tus consultantes',
					img: `${this.$config.LANDING_URL}/nuestros-especialistas.png`,
				},
				{
					id: 4,
					title: 'Usted define el valor',
					subtitle:
						'Nuestra membresía es simple y sin costo. Sin cuota mensual, solo comisión por sesión',
					img: `${this.$config.LANDING_URL}/pagos.png`,
				},
				{
					id: 5,
					title: 'Pagos directamente a su banco',
					subtitle: 'No se preocupe por los pagos, nosotros nos encargaremos de eso',
					img: `${this.$config.LANDING_URL}/banco.png`,
				},
				{
					id: 6,
					title: 'Soporte personalizado',
					subtitle: 'Hacemos tu día más fácil y rápido. Menos estrés, más bienestar',
					img: `${this.$config.LANDING_URL}/llamadas.png`,
				},
			],
			Office: [
				{
					id: 1,
					title: 'Brinda una experiencia increíble',
					subtitle:
						'Programar sesiones para sus consultantes actuales y futuros debe ser un proceso fluido',
					img: `${this.$config.LANDING_URL}/agenda.png`,
				},
				{
					id: 2,
					title: 'Haga crecer su base de clientes',
					subtitle: 'Disponible las 24 horas del día, los 7 días de la semana',
					img: `${this.$config.LANDING_URL}/pagos-usuarios.png`,
				},
				{
					id: 3,
					title: '¿Quieres formar parte de Hablaquí?',
					subtitle:
						'Invitamos a los mejores profesionales para atender a los clientes de Hablaquí',
					img: `${this.$config.LANDING_URL}/red-de-usuarios.png`,
				},
			],
		};
	},
	head() {
		return {
			title: 'Para especialistas | Hablaquí',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: 'Tenga un consultorio sin salir de casa',
				},
				{
					hid: 'twitter:url',
					name: 'twitter:url',
					content: `${process.env.VUE_APP_LANDING}/para-especialistas/`,
				},
				{
					hid: 'twitter:title',
					name: 'twitter:title',
					content: `Para especialistas | Hablaquí`,
				},
				{
					hid: 'twitter:description',
					name: 'twitter:description',
					content: 'Únete a la red de salud mental y bienestar',
				},
				{
					hid: 'og:url',
					property: 'og:url',
					content: `${process.env.VUE_APP_LANDING}/para-especialistas`,
				},
				{
					hid: 'og:title',
					property: 'og:title',
					content: `Para especialistas | Hablaquí`,
				},
				{
					hid: 'og:description',
					property: 'og:description',
					content: 'Únete a la red de salud mental y bienestar',
				},
			],
			link: [{ rel: 'canonical', href: `${this.$config.LANDING_URL}/para-especialistas/` }],
		};
	},
};
</script>

<style lang="scss" scoped>
.text-color {
	color: #575757;
}
</style>
