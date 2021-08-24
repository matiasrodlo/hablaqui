<template>
	<div>
		<v-img :src="`${$config.LANDING_URL}/especialistas.png`">
			<Appbar />
			<v-container tag="section" fluid style="height: calc(100% - 180px)">
				<v-row justify="center" align="center" style="height: 100%">
					<v-col cols="12" md="5">
						<h1
							class="
								text-center text-md-left
								white--text
								font-weight-bold
								text-h6 text-md-h4 text-lg-h3
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
								body-2
								text-md-h6 text-lg-h5
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
								<v-list-item-content class="body-2 text-md-h6 text-lg-h5">
									Oficina virtual práctica y segura.
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content class="body-2 text-md-h6 text-lg-h5">
									Acceso a clientes registrados.
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content class="body-2 text-md-h6 text-lg-h5">
									Crecimiento y desarrollo profesional.
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content class="body-2 text-md-h6 text-lg-h5">
									Tarifas accesibles y convenientes
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-col>
					<v-col cols="12" md="4">
						<v-form>
							<v-card flat class="rounded-lg">
								<v-card-title>
									<h3 class="primary--text text-h5">Únete a la red</h3>
								</v-card-title>
								<v-card-text class="text--disabled body-1">
									En solo unos pasos puedes unirte. Comienza creando tu cuenta.
								</v-card-text>
								<v-card-text>
									<v-text-field label="Ingresa rut" outlined></v-text-field>
								</v-card-text>
								<v-card-actions>
									<v-btn color="primary" class="ml-2 px-10">Ok</v-btn>
								</v-card-actions>
							</v-card>
						</v-form>
					</v-col>
				</v-row>
			</v-container>
		</v-img>
		<v-container>
			<v-row justify="center">
				<v-col cols="12">
					<div class="mt-16 text-center text-h4 text-lg-h3 font-weight-bold text-color">
						Tu consulta online personalizada
					</div>
					<div class="mt-3 mb-16 text-center text-h6 text-color">
						Cree su propia oficina en minutos con alta tecnología y facilidad
					</div>
				</v-col>
				<v-col v-for="item in items" :key="item.id" cols="12" md="4" class="my-16">
					<v-card tag="section" flat>
						<v-card-text class="text-center">
							<v-img
								height="113px"
								width="120px"
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
						<v-card-text class="text-center">
							<article class="body-1 mx-auto text-h6">
								{{ item.subtitle }}
							</article>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<v-img
			width="100%"
			height="auto"
			min-height="500"
			contain
			class="d-flex align-center"
			:src="`${$config.LANDING_URL}/beneficios-de-hablaqui.png`"
		>
			<v-row justify="center">
				<v-col offset="6" cols="6">
					<h2 class="font-weight-bold white--text text-h6 text-md-h4 text-lg-h3">
						Beneficios de Hablaquí Office
					</h2>
					<div class="mt-2 d-flex align-center">
						<img
							height="30"
							width="30"
							:src="`${$config.LANDING_URL}/check-especialistas.png`"
							alt="check"
						/>
						<span class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
							Videollamadas seguras y cómodas
						</span>
					</div>
					<div class="mt-5 d-flex align-center">
						<img
							height="25"
							width="25"
							:src="`${$config.LANDING_URL}/check-especialistas.png`"
							alt="check"
						/>
						<span class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
							Sistema de reservas
						</span>
					</div>
					<div class="mt-5 d-flex align-center">
						<img
							height="30"
							width="30"
							:src="`${$config.LANDING_URL}/check-especialistas.png`"
							alt="check"
						/>
						<span class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
							Sitio web especializado
						</span>
					</div>
					<div class="mt-5 d-flex align-center">
						<img
							height="30"
							width="30"
							:src="`${$config.LANDING_URL}/check-especialistas.png`"
							alt="check"
						/>
						<span class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
							Gestión de agenda, clientes y pagos
						</span>
					</div>
					<div class="mt-5 d-flex align-center">
						<img
							height="30"
							width="30"
							:src="`${$config.LANDING_URL}/check-especialistas.png`"
							alt="check"
						/>
						<span class="white--text ml-6 body-1 text-md-h6 font-weight-bold">
							Recordatorios y correo electrónico
						</span>
					</div>
				</v-col>
			</v-row>
		</v-img>
		<v-container>
			<v-row justify="center">
				<v-col cols="12">
					<div class="mt-16 text-center text-h4 text-lg-h3 font-weight-bold text-color">
						¿Por qué utilizar Office?
					</div>
					<div class="mt-3 mb-16 text-center text-h6 text-color">
						Diferénciate con una experiencia 360
					</div>
				</v-col>
				<v-col v-for="item in Office" :key="item.id" cols="12" md="4" class="my-16">
					<v-card tag="section" flat>
						<v-card-text class="text-center">
							<v-img
								height="113px"
								width="120px"
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
						<v-card-text class="text-center">
							<article class="body-1 mx-auto text-h6">
								{{ item.subtitle }}
							</article>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<v-img
			width="100%"
			height="auto"
			class="d-flex align-center"
			:src="`${$config.LANDING_URL}/descarga-nuestra-app.png`"
		>
			<v-row justify="center">
				<v-col offset="6" cols="6">
					<h2 class="text-center font-weight-bold white--text body-1 text-md-h4">
						Descargar nuestra app de chat
					</h2>
					<h3 class="text-center font-weight-bold white--text body-2 my-4 text-md-h6">
						Mantén contacto con tus consultantes vía Chat. <br />
						¡Descarga la aplicación ahora!
					</h3>
					<v-row justify="center">
						<v-col tag="aside" class="my-md-10 d-flex align-center justify-center">
							<v-img
								style="cursor: pointer; border-radius: 10px"
								height="50"
								max-width="160"
								class="ma-1"
								:src="`${$config.LANDING_URL}/google-play.png`"
								:lazy-src="`${$config.LANDING_URL}/google-play.png`"
								alt="descarcar nuestra aplicacion para android"
							/>
						</v-col>
						<v-col tag="aside" class="my-md-10 d-flex align-center justify-center">
							<v-img
								style="cursor: pointer; border-radius: 10px"
								height="50"
								max-width="160"
								class="ma-1"
								:src="`${$config.LANDING_URL}/ios.svg`"
								:lazy-src="`${$config.LANDING_URL}/ios.svg`"
								alt="descargar aplicacion para ios"
							/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-img>
		<v-container tag="footer">
			<Footer />
		</v-container>
		<div class="primary-color" style="height: 30px"></div>
	</div>
</template>

<script>
import { mdiCheck } from '@mdi/js';

export default {
	components: {
		Footer: () => import('@/components/Footer'),
		Icon: () => import('~/components/Icon'),
		Appbar: () => import('@/components/AppbarWhite'),
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
			title: 'Forma parte | Hablaquí',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: 'Tenga un consultorio sin salir de casa',
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped>
.text-color {
	color: #575757;
}
</style>
