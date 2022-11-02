<template>
	<div>
		<nav class="primary-color" style="margin-bottom: 93px">
			<Appbar />
		</nav>
		<!-- SECTION 1 / heading -->
		<section class="primary-color">
			<v-container fluid style="max-width: 1080px" class="white--text py-0">
				<v-row
					tag="section"
					justify="center"
					:align="$vuetify.breakpoint.mdAndUp ? 'center' : 'start'"
				>
					<v-col
						tag="section"
						cols="12"
						md="6"
						class="primary-color text-center text-md-left"
					>
						<h1 class="text-lg-h2 text-md-h3 text-h5 font-weight-bold my-10">
							Tu psicólogo Online
						</h1>
						<div class="title mt-10 mb-7">
							Demos juntos el primer paso hacia el bienestar emocional. Habla de forma
							segura y privada con un psicólogo online cuando lo necesites.
						</div>
						<v-btn
							id="quiero-comenzar-1"
							style="border-radius: 15px"
							color="white"
							x-large
							class="ml-2 py-8 px-10"
							nuxt
							to="/psicologos/"
						>
							<span class="text-capitalize body-1 text--secondary font-weight-bold">
								Quiero empezar
							</span>
						</v-btn>
						<div class="body-1 font-weight-bold mt-7">Desde $15.500CLP a la semana</div>
						<h3 class="body-1 mt-3">Convenios con Isapres y Fonasa.</h3>
					</v-col>
					<v-col class="hidden-sm-and-down" tag="section" cols="12" md="6">
						<v-img
							:style="$vuetify.breakpoint.lgAndUp ? 'height: 750px' : 'height: 600px'"
							contain
							:lazy-src="`https://cdn.hablaqui.cl/static/phone.webp`"
							:src="`https://cdn.hablaqui.cl/static/phone.webp`"
							alt="habla aqui videollamada"
						>
							<template #placeholder>
								<v-row class="fill-height ma-0" align="center" justify="center">
									<v-progress-circular
										indeterminate
										color="grey lighten-5"
									></v-progress-circular>
								</v-row> </template
						></v-img>
					</v-col>
				</v-row>
			</v-container>
		</section>
		<v-img
			class="hidden-sm-and-down"
			src="https://cdn.hablaqui.cl/static/wave1.png"
			lazy-src="https://cdn.hablaqui.cl/static/wave1.png"
			style="width: 100%; height: auto"
			alt="Tu psicólogo Online"
		/>
		<v-img
			class="hidden-md-and-up"
			:lazy-src="`https://cdn.hablaqui.cl/static/phone_mobile.webp`"
			:src="`https://cdn.hablaqui.cl/static/phone_mobile.webp`"
			style="width: 100%; height: auto"
			alt="Tu psicólogo Online"
		/>
		<!-- SECTION 2 / como funciona -->
		<v-container tag="section" class="pt-md-10" fluid style="max-width: 1080px">
			<v-row tag="section" justify="center">
				<v-col
					tag="h2"
					cols="12"
					class="text-center text-h4 text-md-h3 text--secondary font-weight-bold my-2"
				>
					Cómo funciona
				</v-col>
				<v-col
					tag="h3"
					cols="12"
					class="body-1 mb-6 font-weight-bold text--secondary text-center"
				>
					Es fácil y seguro realizar terapia con un psicólogo online y continuar con tu
					estilo de vida con Hablaquí.
				</v-col>
			</v-row>
			<v-row tag="section" justify="center">
				<v-col v-for="item in firstbox" :key="item.id" tag="section" cols="12" md="4">
					<v-card tag="section" flat>
						<v-card-text class="text-center">
							<v-btn
								:id="item.id"
								style="border: 8px solid #2070e5; cursor: initial"
								depressed
								fab
								width="100"
								height="100"
							>
								<v-avatar
									color="white"
									size="96"
									class="primary--text text-h3 font-weight-bold"
								>
									{{ item.id }}
								</v-avatar>
							</v-btn>
						</v-card-text>
						<v-card-text class="text-center">
							<h3
								class="title font-weight-bold mx-auto"
								style="max-width: 220px; line-height: 1.2"
							>
								{{ item.title }}
							</h3>
							<article class="body-1 mt-8 mx-auto" style="max-width: 250px">
								{{ item.desc }}
							</article>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col
					cols="12"
					tag="section"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold my-10"
				>
					<v-btn
						id="psi-quiero-comenzar-index"
						color="primary"
						style="border-radius: 15px"
						x-large
						class="font-weight-bold pa-8"
						nuxt
						to="/psicologos/"
					>
						Quiero empezar
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 3 / Nuestros psicólogos -->
		<v-img
			v-if="$vuetify.breakpoint.mdAndUp"
			class="mt-10"
			:src="`https://cdn.hablaqui.cl/static/wave-blue-1.png`"
			:lazy-src="`https://cdn.hablaqui.cl/static/wave-blue-1.png`"
			style="width: 100%; height: auto"
		/>
		<v-img
			v-else
			class="mt-10"
			:src="`https://cdn.hablaqui.cl/static/responsive_1.png`"
			:lazy-src="`https://cdn.hablaqui.cl/static/responsive_1.png`"
			style="width: 100%; height: auto"
		/>
		<section class="primary-color">
			<v-container tag="section" class="white--text py-0">
				<v-row tag="section" justify="space-between" align="center">
					<v-col tag="section" cols="12" md="6" class="text-center text-md-left">
						<h2 class="text-md-h3 text-h4 font-weight-bold my-16">
							Nuestros psicólogos
						</h2>
						<article class="my-10 body-1">
							Contamos con un amplio equipo de psicólogos enfocados a potenciar el
							área que busques desarrollar. Todos nuestros profesionales son
							rigurosamente seleccionados, certificados, y cuentan con un alto nivel
							de formación y experiencia. Te garantizamos una atención efectiva y
							experta, pero también cálida y humana.
						</article>
						<v-btn
							id="ver-mas-psi-index"
							style="border-radius: 15px"
							color="white"
							x-large
							class="hidden-sm-and-down py-8 px-10 ml-md-16 mt-10 mb-5"
							to="/psicologos/"
							accesskey="p"
						>
							<span class="body-1 text--secondary font-weight-bold">
								Ver más psicólogos
							</span>
						</v-btn>
					</v-col>
					<v-col tag="section" cols="12" md="6" class="d-flex justify-center">
						<section style="box-shadow: 22px 22px 0px 0px #b2eceb; border-radius: 25px">
							<v-carousel
								cycle
								hide-delimiter-background
								hide-delimiters
								:show-arrows="false"
								reverse-transition="fade-transition"
								transition="fade-transition"
								:height="$vuetify.breakpoint.mdAndUp ? '375' : '285'"
								style="box-shadow: 12px 12px 0px 0px #03dfd8; border-radius: 25px"
							>
								<v-carousel-item v-for="item in corousel" :key="item.id">
									<v-img
										:src="item.image"
										:alt="item.name"
										:lazy-src="item.image"
										contain
										:max-width="$vuetify.breakpoint.mdAndUp ? '340' : '250'"
										class="d-flex justify-end"
									>
										<template #placeholder>
											<v-row
												class="fill-height ma-0"
												align="center"
												justify="center"
											>
												<v-progress-circular
													indeterminate
													color="grey lighten-5"
												></v-progress-circular>
											</v-row>
										</template>
										<aside style="position: absolute; bottom: 0; width: 100%">
											<v-img
												:src="`https://cdn.hablaqui.cl/static/nuestros_psicologos.png`"
												:lazy-src="`https://cdn.hablaqui.cl/static/nuestros_psicologos.png`"
											>
												<h4
													class="body-1 white--text pt-1 pl-4 font-weight-regular white--text"
												>
													{{ item.title }}
												</h4>
												<h2
													class="body-2 pl-4 pt-3 pb-2 font-weight-bold white--text"
												>
													{{ item.name }}
												</h2>
												<div>
													<v-row>
														<v-col cols="1" class="ml-4">
															<icon
																color="primary"
																:icon="mdiCheck"
															/>
														</v-col>
														<v-col
															style="font-size: 14px"
															class="pl-3 white--text"
														>
															{{ item.subtitle }}
														</v-col>
													</v-row>
												</div>
											</v-img>
										</aside>
									</v-img>
								</v-carousel-item>
							</v-carousel>
						</section>
					</v-col>
					<v-col tag="section" cols="12" class="hidden-md-and-up my-10 text-center">
						<v-btn
							id="ver-mar-2"
							style="border-radius: 15px"
							color="white"
							x-large
							class="pa-4"
							to="/psicologos/"
						>
							<span class="body-1 text--secondary font-weight-bold">
								Ver más psicólogos
							</span>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</section>
		<v-img
			class="hidden-sm-and-down"
			:src="`https://cdn.hablaqui.cl/static/wave-blue-2.png`"
			:lazy-src="`https://cdn.hablaqui.cl/static/wave-blue-2.png`"
			style="width: 100%; height: auto"
		/>
		<v-img
			class="hidden-md-and-up"
			:src="`https://cdn.hablaqui.cl/static/responsive_2.png`"
			:lazy-src="`https://cdn.hablaqui.cl/static/responsive_2.png`"
			style="width: 100%; height: auto"
		/>
		<!-- SECTION 4 / VENTAJAS  -->
		<v-container tag="section" class="pt-10">
			<v-row tag="section" justify="center">
				<v-col
					tag="h2"
					cols="12"
					class="text-center text-h4 text-md-h3 text--secondary font-weight-bold mt-10"
				>
					Ventajas
				</v-col>
			</v-row>
			<v-row tag="section">
				<v-col
					v-for="item in ventajas"
					:key="item.id"
					tag="section"
					cols="12"
					md="4"
					class="mt-16 mb-10"
				>
					<v-card tag="section" flat>
						<v-card-text class="text-center">
							<v-img
								height="80px"
								width="80px"
								contain
								class="mx-auto"
								:src="item.img"
								:lazy-src="item.img"
								:alt="item.title"
							/>
						</v-card-text>
						<v-card-text class="text-center pt-0">
							<h3 class="title font-weight-bold">{{ item.title }}</h3>
						</v-card-text>
						<v-card-text class="text-center">
							<article class="body-1 mx-auto" :style="`max-width: ${item.maxWidth}`">
								{{ item.desc }}
							</article>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col
					tag="section"
					cols="12"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold mb-10"
				>
					<v-btn
						id="comenzar-3"
						style="border-radius: 15px"
						color="primary"
						x-large
						class="font-weight-bold pa-8"
						nuxt
						to="/psicologos/"
					>
						Quiero empezar
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 5 / Efectividad -->
		<v-img
			v-if="$vuetify.breakpoint.mdAndUp"
			class="mt-10"
			:src="`https://cdn.hablaqui.cl/static/wave-part1.png`"
			:lazy-src="`https://cdn.hablaqui.cl/static/wave-part1.png`"
			style="width: 100%; height: auto"
		/>
		<v-img
			v-else
			:src="`https://cdn.hablaqui.cl/static/efectividad_wave_1.png`"
			:lazy-src="`https://cdn.hablaqui.cl/static/efectividad_wave_1.png`"
			style="width: 100%; height: auto"
		/>
		<section style="position: relative" class="mb-2 primary-color">
			<aside style="position: absolute; top: -100px; left: -20px; z-index: 0">
				<v-img
					width="200"
					:src="`https://cdn.hablaqui.cl/static/plus.png`"
					:lazy-src="`https://cdn.hablaqui.cl/static/plus.png`"
				></v-img>
			</aside>
			<v-container tag="aside" class="py-0">
				<v-row tag="aside">
					<v-col
						tag="section"
						cols="10"
						offset="2"
						md="12"
						offset-md="0"
						class="white--text py-16 text-center text-md-left"
					>
						<h2
							style="position: absolute; top: 30px; z-index: 0"
							class="text-md-h3 text-h4 font-weight-bold"
						>
							Efectividad
						</h2>
					</v-col>
				</v-row>
			</v-container>
			<v-container tag="section" class="white--text py-0">
				<v-row tag="section" justify="center" align="center">
					<v-col tag="section" cols="12">
						<v-carousel
							v-if="$vuetify.breakpoint.mdAndUp"
							tag="article"
							:show-arrows="false"
							reverse-transition="fade-transition"
							transition="fade-transition"
							hide-delimiter-background
							height="400"
						>
							<v-carousel-item
								v-for="(item, i) in efectividad"
								:key="i"
								tag="section"
							>
								<section class="text-center d-flex justify-center align-center">
									<v-card
										v-for="el in item"
										:key="el.id"
										tag="section"
										:height="$vuetify.breakpoint.lgAndUp ? '300' : '330'"
										width="350"
										class="mx-4 d-inline-block"
										style="border-radius: 25px"
										light
										flat
									>
										<v-card-text class="mt-3">
											<v-img
												height="60px"
												width="120px"
												contain
												class="mx-auto"
												:src="el.img"
												:lazy-src="el.img"
												:alt="el.text"
											/>
										</v-card-text>
										<v-card-text
											style="flex-direction: column"
											:style="
												$vuetify.breakpoint.lgAndUp
													? 'height: 180px'
													: 'height: 210px'
											"
											class="d-flex justify-space-between"
										>
											<article
												style="overflow-y: auto"
												:style="
													$vuetify.breakpoint.lgAndUp
														? 'height: 120px'
														: 'height: 150px'
												"
												class="body-2"
											>
												{{ el.text }}
											</article>
											<h3>
												<a
													class="primary--text caption font-weight-bold"
													style="text-decoration: none"
													:href="el.href"
													>Leer estudio completo</a
												>
											</h3>
										</v-card-text>
									</v-card>
								</section>
							</v-carousel-item>
						</v-carousel>
						<v-carousel
							v-else
							tag="article"
							:show-arrows="false"
							reverse-transition="fade-transition"
							transition="fade-transition"
							hide-delimiter-background
							height="400"
						>
							<v-carousel-item
								v-for="(el, i) in efectividadMobile"
								:key="i"
								tag="section"
							>
								<section class="text-center d-flex justify-center align-center">
									<v-card
										tag="section"
										height="300"
										width="350"
										class="mx-4 d-inline-block"
										style="border-radius: 25px"
										light
										flat
									>
										<v-card-text class="mt-3">
											<v-img
												contain
												width="120"
												height="60"
												class="mx-auto"
												:src="el.img"
												:lazy-src="el.img"
												:alt="el.text"
											/>
										</v-card-text>
										<v-card-text
											style="flex-direction: column; height: 180px"
											class="d-flex justify-space-between"
										>
											<article style="height: 120px; overflow-y: auto">
												{{ el.text }}
											</article>
											<h3 class="pt-2">
												<a style="text-decoration: none" :href="el.href">
													<span class="primary--text caption">
														Leer estudio completo
													</span>
												</a>
											</h3>
										</v-card-text>
									</v-card>
								</section>
							</v-carousel-item>
						</v-carousel>
					</v-col>
				</v-row>
			</v-container>
		</section>
		<v-img
			class="hidden-sm-and-down"
			:src="`https://cdn.hablaqui.cl/static/wave-part2.png`"
			:lazy-src="`https://cdn.hablaqui.cl/static/wave-part2.png`"
			style="width: 100%; height: auto"
		/>
		<v-img
			class="hidden-md-and-up"
			:src="`https://cdn.hablaqui.cl/static/efectividad_wave_2.png`"
			:lazy-src="`https://cdn.hablaqui.cl/static/efectividad_wave_2.png`"
			style="width: 100%; height: auto"
		/>
		<!-- SECTION 6 / download app -->
		<v-container tag="section">
			<v-row tag="section" no-gutters justify="center">
				<v-col
					tag="h2"
					cols="12"
					class="mt-10 mb-5 text-center text-h5 text-md-h4 font-weight-bold text--secondary"
				>
					Descarga nuestra aplicación
				</v-col>
				<v-col
					cols="5"
					sm="3"
					md="3"
					lg="2"
					tag="aside"
					class="my-md-10 d-flex align-center justify-center"
				>
					<v-img
						style="cursor: pointer; border-radius: 10px"
						height="50px"
						width="auto"
						class="ma-1"
						:src="`https://cdn.hablaqui.cl/static/google-play.png`"
						:lazy-src="`https://cdn.hablaqui.cl/static/google-play.png`"
						alt="descarcar nuestra aplicacion para android"
					/>
				</v-col>
				<v-col
					cols="5"
					sm="3"
					md="3"
					lg="2"
					tag="aside"
					class="my-md-10 d-flex align-center justify-center"
				>
					<v-img
						style="cursor: pointer; border-radius: 10px"
						height="50px"
						width="auto"
						class="ma-1"
						:src="`https://cdn.hablaqui.cl/static/ios.svg`"
						:lazy-src="`https://cdn.hablaqui.cl/static/ios.svg`"
						alt="descargar aplicacion para ios"
					/>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 7 / faq -->
		<v-container tag="section">
			<v-row tag="section">
				<v-col
					tag="h2"
					class="my-10 text-center text-md-left text-h4 text-md-h3 text--secondary font-weight-bold"
				>
					Preguntas frecuentes
				</v-col>
				<v-col tag="section" cols="12" class="text-left">
					<v-expansion-panels v-model="panel" tag="section" accordion flat dark multiple>
						<v-expansion-panel v-for="item in faq" :key="item.id" class="pa-0">
							<v-expansion-panel-header color="primary" class="py-3 pl-3" light>
								<h4 class="white--textfont-weight-bold">{{ item.title }}</h4>
							</v-expansion-panel-header>
							<v-expansion-panel-content class="white text--secondary pt-5">
								{{ item.desc }}
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-col>
				<v-col
					tag="section"
					cols="12"
					class="hidden-sm-and-down text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold mt-16"
				>
					<v-btn
						id="comenzar-4"
						style="border-radius: 15px"
						color="primary"
						x-large
						class="font-weight-bold body-1 py-8 px-10"
						nuxt
						to="/psicologos/"
					>
						Quiero empezar
					</v-btn>
				</v-col>
				<v-col
					cols="12"
					class="hidden-sm-and-down text-center body-1 font-weight-bold mt-6 text--secondary"
				>
					Comienza tu viaje de autoconocimiento y desarrollo personal ahora mismo
				</v-col>
			</v-row>
		</v-container>
		<Footer />
		<div class="primary-color" style="height: 30px"></div>
	</div>
</template>

<script>
import { mdiCheck } from '@mdi/js';

export default {
	components: {
		Appbar: () => import('@/components/AppbarWhite'),
		Footer: () => import('@/components/Footer'),
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiCheck,
			panel: [0],
			firstbox: [
				{
					id: 1,
					title: 'Encuentra un especialista  ',
					desc: 'Nosotros te ayudamos y buscamos a los mejores psicólogos online.',
				},
				{
					id: 2,
					title: 'Agenda la hora y día de tu consulta',
					desc: 'Agenda con total libertad cuando te resulte más conveniente.',
				},
				{
					id: 3,
					title: 'Disfruta de tu primera sesión en línea',
					desc: 'Conéctate por videollamada desde tu teléfono, tableta o computadora.',
				},
			],
			ventajas: [
				{
					id: 1,
					title: 'Comodidad',
					desc: 'Programa una sesión en vivo con tu psicólogo a la hora que te resulte más conveniente. Habla con tu psicólogo por videollamada, estés donde estés y sin tener que desplazarte',
					img: `https://cdn.hablaqui.cl/static/comodidad.png`,
					maxWidth: '250px',
				},
				{
					id: 2,
					title: 'Privacidad',
					desc: 'Disfruta de las sesiones con tu psicólogo de manera segura y privada a través de un teléfono, tablet o computador.',
					img: `https://cdn.hablaqui.cl/static/privacidad.png`,
					maxWidth: '214px',
				},
				{
					id: 3,
					title: 'Personalización',
					desc: 'Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios a través de una breve evaluación.',
					img: `https://cdn.hablaqui.cl/static/personalizacion.png`,
					maxWidth: '250px',
				},
			],
			reseñas: [
				{
					id: 1,
					title: 'David T. G.',
					desc: 'No imaginaba como podía ser hablar con alguien a través de una pantalla, pensaba que se perdería la calidez, pero no es así. Me encanta la libertad, el poder viajar o simplemente estar en casa y poder continuar con el proceso de acompañamiento.',
				},
				{
					id: 2,
					title: 'Maria K. H.',
					desc: 'Me gusta Hablaquí. Es bueno poder conversar sobre lo que siento y tener a alguien que se comunique conmigo todos los días para darme orientación. Me hace sentir segura y más decidida a hacer cosas.',
				},
				{
					id: 3,
					title: 'Francisca L. M.',
					desc: 'Dado que no me acomoda asistir terapia en persona busque una opción por internet. Llevo solo una sesión y no podría estar más feliz con la experiencia. Si es que estás pasando por un momento difícil y tienes los medios, dale una oportunidad.',
				},
				{
					id: 4,
					title: 'Verónica P. R.',
					desc: 'Es muy especial la conexión con mi psicóloga y el como me está ayudando. Que todo sea online ha sido una gran oportunidad, me costaba muchísimo encontrar tiempo para asistir a las sesiones presencialmente.',
				},
				{
					id: 5,
					title: 'Alberto S. A.',
					desc: 'Producto de la pandemia me comencé a sentir muy angustiado, poco a poco veía como mi vida entraba en crisis. Las sesiones me han ayudado a ir disminuyendo el malestar,  a conocerme mejor y tener más energía.',
				},
				{
					id: 6,
					title: 'Renata F. T.',
					desc: 'Me resultó fácil elegir a mi psicóloga, me siento muy cómoda con ella y solo fue cosa de contestar un formulario. Además, es mucho más cómodo y económico, ya no tengo que gastar ni preocuparme por el transporte.',
				},
			],
			faq: [
				{
					id: 1,
					title: '¿Quién será mi psicólogo?',
					desc: 'Te recomendamos un psicólogo online que se adecue a tus preferencias por medio de una breve evaluación haciendo uso de inteligencia artificial. También, puedes revisar manualmente el listado de especialistas y elegir.',
				},
				{
					id: 2,
					title: '¿Puedo iniciar terapia?',
					desc: 'Estamos disponibles para personas mayores de 18 años que deseen aproximarse al bienestar emocional por medio de acompañamiento psicológico. Por otro lado, no es apto para personas con ideación suicida, problemas de abuso de sustancias o esquizofrenia.',
				},
				{
					id: 3,
					title: '¿Necesito un diagnóstico?',
					desc: 'No. Nuestros psicólogos están certificados y pueden ayudarte a identificar el origen y manejo del malestar por medio de la terapia. Si tienes un diagnóstico de un psicólogo o psiquiatra, va a ser útil, pero no es necesario para comenzar.',
				},
				{
					id: 4,
					title: '¿Puedo cambiarme de psicólogo?',
					desc: 'Si te sientes insatisfecho con tu psicólogo, te recomendamos solicitar un cambio enviando un correo a cambios@hablaqui.com. No tendrás cobros adicionales, ni perderás días de suscripción.',
				},
			],
			efectividad: [
				[
					{
						id: 1,
						img: `https://cdn.hablaqui.cl/static/BaylorCollegeOfMedicine.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
						text: '“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
					},
					{
						id: 3,
						img: `https://cdn.hablaqui.cl/static/NewYorkUniversity.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
						text: '“El tratamiento de Trastono por Estrés Postraumático por medio de mensajería multimedia mostraró tasas de reducción de síntomas similares a las formas tradicionales de tratamiento. (2020)”',
					},
					{
						id: 5,
						img: `https://cdn.hablaqui.cl/static/ColumbiaUniversity.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
						text: '“Los hallazgos iniciales muestran una mejora casi total en el bienestar psicológico para el 90% de los que reciben tratamiento de terapia basada en mensajes de texto. (2015)”',
					},
				],
				[
					{
						id: 2,
						img: `https://cdn.hablaqui.cl/static/UniversityofCaliforniaBerkeley.webp`,
						href: 'https://mhealth.jmir.org/2019/1/e10948/',
						text: '“Los hallazgos del estudio sugieren que las plataformas de psicoterapia digital son particularmente efectivas para personas sin antecedentes de psicoterapia o que no han sido tratadas previamente. (2019)”',
					},
					{
						id: 4,
						img: `https://cdn.hablaqui.cl/static/TheLancet.png`,
						href: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(09)61257-5/fulltext',
						text: '“La terapia es eficaz cuando la realiza un terapeuta en línea, y los beneficios se mantienen durante más de ocho meses (2009)”',
					},
					{
						id: 6,
						img: `https://cdn.hablaqui.cl/static/BaylorCollegeOfMedicine.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
						text: '“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
					},
				],
			],
			efectividadMobile: [
				{
					id: 1,
					img: `https://cdn.hablaqui.cl/static/BaylorCollegeOfMedicine.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
					text: '“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
				},
				{
					id: 3,
					img: `https://cdn.hablaqui.cl/static/NewYorkUniversity.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
					text: '“El tratamiento de Trastono por Estrés Postraumático por medio de mensajería multimedia mostraró tasas de reducción de síntomas similares a las formas tradicionales de tratamiento. (2020)”',
				},
				{
					id: 5,
					img: `https://cdn.hablaqui.cl/static/ColumbiaUniversity.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
					text: '“Los hallazgos iniciales muestran una mejora casi total en el bienestar psicológico para el 90% de los que reciben tratamiento de terapia basada en mensajes de texto. (2015)”',
				},

				{
					id: 2,
					img: `https://cdn.hablaqui.cl/static/UniversityofCaliforniaBerkeley.webp`,
					href: 'https://mhealth.jmir.org/2019/1/e10948/',
					text: '“Los hallazgos del estudio sugieren que las plataformas de psicoterapia digital sonparticularmente efectivas para personas sin antecedentes de psicoterapia o que no han sido tratadas previamente. (2019)”',
				},
				{
					id: 4,
					img: `https://cdn.hablaqui.cl/static/TheLancet.png`,
					href: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(09)61257-5/fulltext',
					text: '“La terapia es eficaz cuando la realiza un terapeuta en línea, y los beneficios se mantienen durante más de ocho meses (2009)”',
				},
				{
					id: 6,
					img: `https://cdn.hablaqui.cl/static/BaylorCollegeOfMedicine.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
					text: '“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
				},
			],
			mainImageSrc: null,
			corousel: [
				{
					id: 1,
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima,ansiedad/estrés.',
					name: 'Aihnoa Con',
					image: `https://cdn.hablaqui.cl/static/Aihnoa_Con.webp`,
				},
				{
					id: 2,
					name: 'Joaquín Bustos',
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima, fobia social.',
					image: `https://cdn.hablaqui.cl/static/Joaquin_Bustos.webp`,
				},
				{
					id: 3,
					name: 'Jorge Calderon',
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoestima, duelo o perdida, ansiedad/estrés.',
					image: `https://cdn.hablaqui.cl/static/Jorge_Calderon.webp`,
				},
				{
					id: 4,
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima,ansiedad/estrés.',
					name: 'Tamara Stein',
					image: `https://cdn.hablaqui.cl/static/Tamara_Stein.webp`,
				},
			],
		};
	},
	jsonld() {
		return {
			'@context': 'http://www.schema.org',
			'@type': 'Organization',
			name: 'Hablaqui',
			url: this.$config.LANDING_URL,
			logo: this.$config.LANDING_URL,
			description:
				'Elige un psicólogo online especialista para tu caso, e inicia la terapia online sin salir de casa. +350 Psicólogos especialistas online. ¡Comienza ahora!',
		};
	},
	head() {
		const { path } = this.$route;
		const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
		const canonical = `${this.$config.LANDING_URL}${pathWithSlash}`;
		return {
			title: 'Psicólogos online desde $15.500 - Terapia online efectiva',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content:
						'Elige un psicólogo online especialista para tu caso, e inicia la terapia online sin salir de casa. +350 Psicólogos especialistas online. ¡Comienza ahora!',
				},
				{
					hid: 'robots',
					name: 'robots',
					content: 'index,follow',
				},
			],
			link: [{ rel: 'canonical', href: canonical }],
		};
	},
};
</script>

<style lang="scss" scoped>
.v-expansion-panel--active > .v-expansion-panel-header {
	min-height: 32px !important;
}

.v-expansion-panel-header {
	min-height: 32px !important;
}
</style>
