<template>
	<div>
		<client-only>
			<nav class="primary">
				<Appbar />
			</nav>
			<!-- SECTION 1 / heading -->
			<section class="primary">
				<v-container class="white--text py-0">
					<v-row
						tag="section"
						justify="center"
						:align="$vuetify.breakpoint.mdAndUp ? 'center' : 'start'"
					>
						<v-col
							tag="section"
							cols="12"
							md="6"
							class="primary text-center text-md-left"
						>
							<h1 class="text-lg-h2 text-md-h3 text-h5 font-weight-bold my-10">
								Tu psicólogo Online
							</h1>
							<h3 class="title my-10">
								Demos juntos el primer paso hacia el bienestar emocional. Habla de
								forma segura y privada con un psicólogo online cuando lo necesites.
							</h3>
							<v-btn
								style="border-radius: 15px"
								color="white"
								x-large
								class="font-weight-bold body-1 py-8 px-10 text-capitalize"
								depressed
								nuxt
								:to="{ name: 'psicologos' }"
							>
								Quiero empezar
							</v-btn>
							<h3 class="body-1 font-weight-bold mt-10">
								Desde $15.500CLP a la semana
							</h3>
							<h3 class="body-1 mt-5">Convenios con Isapres y Fonasa.</h3>
						</v-col>
						<v-col v-if="$vuetify.breakpoint.mdAndUp" tag="section" cols="12" md="6">
							<v-img
								:style="
									$vuetify.breakpoint.lgAndUp ? 'height: 750px' : 'height: 600px'
								"
								contain
								:src="`${$config.LANDING_URL}/Recurso-02.png`"
								alt="habla aqui"
							/>
						</v-col>
					</v-row>
				</v-container>
			</section>
			<img
				v-if="$vuetify.breakpoint.mdAndUp"
				:src="`${$config.LANDING_URL}/wave1.png`"
				style="width: 100%"
			/>
			<img v-else :src="`${$config.LANDING_URL}/wave1-movil.png`" style="width: 100%" />
		</client-only>
		<!-- SETION 2 / como funciona -->
		<v-container tag="section" class="pt-md-10">
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
							<h3 class="title font-weight-bold mx-auto" style="max-width: 220px">
								{{ item.title }}
							</h3>
							<article class="body-1 mt-5 mx-auto" style="max-width: 250px">
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
						style="border-radius: 15px"
						color="primary"
						x-large
						class="font-weight-bold pa-8"
						depressed
						nuxt
						:to="{ name: 'psicologos' }"
					>
						Quiero empezar
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 3 / Nuestros psicólogos -->
		<img class="mt-10" :src="`${$config.LANDING_URL}/wave-blue-1.png`" style="width: 100%" />
		<section class="primary">
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
							v-if="$vuetify.breakpoint.mdAndUp"
							style="border-radius: 15px"
							color="white"
							x-large
							class="font-weight-bold body-1 py-8 px-10 ml-md-16 mt-10 mb-5"
							depressed
							:to="{ name: 'psicologos' }"
						>
							Ver más psicólogos
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
										contain
										eager
										:max-width="$vuetify.breakpoint.mdAndUp ? '350' : '250'"
										class="d-flex justify-end"
									>
										<aside
											style="
												background-color: #616161;
												position: absolute;
												bottom: 0;
												height: 135px;
												opacity: 0.6;
												width: 100%;
												border-radius: 0 0 20px 20px;
											"
											class="white--text"
										>
											<h4 class="pt-1 pl-2 font weight-regular">
												{{ item.title }}
											</h4>
											<h2
												class="pl-2 pt-3"
												:class="
													$vuetify.breakpoint.mdAndUp ? 'title' : 'body-1'
												"
											>
												{{ item.name }}
											</h2>
											<div>
												<v-row>
													<v-col cols="1" class="ml-2">
														<v-icon color="primary">mdi-check</v-icon>
													</v-col>
													<v-col class="body-2 pl-3 font-weight-bold"
														>{{ item.subtitle }}
													</v-col>
												</v-row>
											</div>
										</aside>
									</v-img>
								</v-carousel-item>
							</v-carousel>
						</section>
					</v-col>
					<v-col
						v-if="!$vuetify.breakpoint.mdAndUp"
						tag="section"
						cols="12"
						class="my-10 text-center"
					>
						<v-btn
							style="border-radius: 15px"
							color="white"
							x-large
							class="font-weight-bold pa-4"
							depressed
							:href="`${$config.FRONTEND_URL}/psicologos/todos`"
						>
							Ver más psicólogos
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</section>
		<img :src="`${$config.LANDING_URL}/wave-blue-2.png`" style="width: 100%" />
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
							<img style="height: 80px" :src="item.img" />
						</v-card-text>
						<v-card-text class="text-center pt-0">
							<h2 class="title font-weight-bold">{{ item.title }}</h2>
						</v-card-text>
						<v-card-text class="text-center">
							<h3 class="body-1 mx-auto" style="max-width: 250px">{{ item.desc }}</h3>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col
					tag="section"
					cols="12"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold mb-10"
				>
					<v-btn
						style="border-radius: 15px"
						color="primary"
						x-large
						class="font-weight-bold pa-8"
						depressed
						nuxt
						:to="{ name: 'comenzar' }"
					>
						Quiero empezar
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 5 / Efectividad -->
		<img class="mt-10" :src="`${$config.LANDING_URL}/wave-part1.png`" style="width: 100%" />
		<section style="position: relative" class="primary">
			<aside style="position: absolute; top: -10px">
				<v-img width="100" :src="`${$config.LANDING_URL}/plus.png`"></v-img>
			</aside>
			<v-container tag="aside" class="py-0">
				<v-row tag="aside">
					<v-col
						tag="section"
						cols="12"
						class="white--text py-16 text-center text-md-left"
					>
						<h2 class="text-md-h3 text-h4 font-weight-bold">Efectividad</h2>
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
											<img height="60" :src="el.img" />
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
											<img height="60" :src="el.img" />
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
		<img :src="`${$config.LANDING_URL}/wave-part2.png`" style="width: 100%" />
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
					cols="12"
					md="3"
					lg="2"
					tag="aside"
					class="my-md-10 d-flex align-center justify-center"
				>
					<img
						style="cursor: pointer"
						height="75px"
						:src="`${$config.LANDING_URL}/google-play-badge.png`"
						alt="descarcar nuestra aplicacion para android"
					/>
				</v-col>
				<v-col
					cols="12"
					md="3"
					lg="2"
					tag="aside"
					class="my-md-10 d-flex align-center justify-center"
				>
					<img
						style="cursor: pointer"
						height="50px"
						:src="`${$config.LANDING_URL}/ios.svg`"
						alt="descargar aplicacion para ios"
					/>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 7 / faq -->
		<v-container tag="section">
			<v-row tag="section">
				<v-col
					tag="h3"
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
					v-if="$vuetify.breakpoint.mdAndUp"
					tag="section"
					cols="12"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold mt-16"
				>
					<v-btn
						style="border-radius: 15px"
						color="primary"
						x-large
						class="font-weight-bold body-1 py-8 px-10"
						depressed
						nuxt
						:to="{ name: 'comenzar' }"
					>
						Quiero empezar
					</v-btn>
				</v-col>
				<v-col
					v-if="$vuetify.breakpoint.mdAndUp"
					cols="12"
					class="text-center body-1 font-weight-bold mt-6 text--secondary"
				>
					Comienza tu viaje de autoconocimiento y desarrollo personal ahora mismo
				</v-col>
			</v-row>
		</v-container>
		<section
			class="mt-16"
			:style="!$vuetify.breakpoint.mdAndUp ? 'background-color: #e3f2fd' : ''"
		>
			<v-container tag="section">
				<v-row tag="section" align="center">
					<v-col tag="section" cols="6" sm="2">
						<v-img
							alt="Vida Tres Isapre"
							contain
							height="100"
							:src="`${$config.LANDING_URL}/VidaTresIsapre.png`"
						></v-img>
					</v-col>
					<v-col tag="section" cols="6" sm="2">
						<v-img
							contain
							max-height="100"
							alt="nueva masvida"
							:src="`${$config.LANDING_URL}/nueva-masvida.png`"
						></v-img>
					</v-col>
					<v-col tag="section" cols="6" sm="2">
						<v-img
							contain
							alt="fonasa"
							max-height="100"
							:src="`${$config.LANDING_URL}/fonasa.jpg`"
						></v-img>
					</v-col>
					<v-col tag="section" cols="6" sm="2">
						<v-img
							contain
							max-height="100"
							alt="ban medica"
							:src="`${$config.LANDING_URL}/banmedica.png`"
						></v-img>
					</v-col>
					<v-col tag="section" cols="6" sm="2">
						<v-img
							contain
							max-height="100"
							alt="colmena"
							:src="`${$config.LANDING_URL}/colmena.png`"
						></v-img>
					</v-col>
					<v-col tag="section" cols="6" sm="2">
						<v-img
							contain
							max-height="100"
							alt="consalud"
							:src="`${$config.LANDING_URL}/consalud.png`"
						></v-img>
					</v-col>
				</v-row>
			</v-container>
		</section>
		<v-container tag="footer">
			<Footer />
		</v-container>
		<div class="primary" style="height: 30px"></div>
	</div>
</template>

<script>
export default {
	components: {
		Appbar: () => import('@/components/AppbarWhite'),
		Footer: () => import('@/components/Footer'),
	},
	data() {
		return {
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
					desc:
						'Programa una sesión en vivo con tu psicólogo a la hora que te resulte más conveniente. Habla con tu psicólogo por videollamada, estés donde estés y sin tener que desplazarte',
					img: `${this.$config.LANDING_URL}/ico1.png`,
				},
				{
					id: 2,
					title: 'Privacidad',
					desc:
						'Disfruta de las sesiones con tu psicólogo de manera segura y privada a través de un teléfono, tablet o computador.',
					img: `${this.$config.LANDING_URL}/ico2.png`,
				},
				{
					id: 3,
					title: 'Personalización',
					desc:
						'Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios a través de una breve evaluación.',
					img: `${this.$config.LANDING_URL}/ico3.png`,
				},
			],
			reseñas: [
				{
					id: 1,
					title: 'David T. G.',
					desc:
						'No imaginaba como podía ser hablar con alguien a través de una pantalla, pensaba que se perdería la calidez, pero no es así. Me encanta la libertad, el poder viajar o simplemente estar en casa y poder continuar con el proceso de acompañamiento.',
				},
				{
					id: 2,
					title: 'Maria K. H.',
					desc:
						'Me gusta Hablaquí. Es bueno poder conversar sobre lo que siento y tener a alguien que se comunique conmigo todos los días para darme orientación. Me hace sentir segura y más decidida a hacer cosas.',
				},
				{
					id: 3,
					title: 'Francisca L. M.',
					desc:
						'Dado que no me acomoda asistir terapia en persona busque una opción por internet. Llevo solo una sesión y no podría estar más feliz con la experiencia. Si es que estás pasando por un momento difícil y tienes los medios, dale una oportunidad.',
				},
				{
					id: 4,
					title: 'Verónica P. R.',
					desc:
						'Es muy especial la conexión con mi psicóloga y el como me está ayudando. Que todo sea online ha sido una gran oportunidad, me costaba muchísimo encontrar tiempo para asistir a las sesiones presencialmente.',
				},
				{
					id: 5,
					title: 'Alberto S. A.',
					desc:
						'Producto de la pandemia me comencé a sentir muy angustiado, poco a poco veía como mi vida entraba en crisis. Las sesiones me han ayudado a ir disminuyendo el malestar,  a conocerme mejor y tener más energía.',
				},
				{
					id: 6,
					title: 'Renata F. T.',
					desc:
						'Me resultó fácil elegir a mi psicóloga, me siento muy cómoda con ella y solo fue cosa de contestar un formulario. Además, es mucho más cómodo y económico, ya no tengo que gastar ni preocuparme por el transporte.',
				},
			],
			faq: [
				{
					id: 1,
					title: '¿Quién será mi psicólogo?',
					desc:
						'Te recomendamos un psicólogo online que se adecue a tus preferencias por medio de una breve evaluación haciendo uso de inteligencia artificial. También, puedes revisar manualmente el listado de especialistas y elegir.',
				},
				{
					id: 2,
					title: '¿Puedo iniciar terapia?',
					desc:
						'Estamos disponibles para personas mayores de 18 años que deseen aproximarse al bienestar emocional por medio de acompañamiento psicológico. Por otro lado, no es apto para personas con Ideación suicida, problemas de abuso de sustancias o esquizofrenia.',
				},
				{
					id: 3,
					title: '¿Necesito un diagnóstico?',
					desc:
						'No. Nuestros psicólogos están certificados y pueden ayudarte a identificar el origen y manejo del malestar por medio de la terapia. Si tienes un diagnóstico de un psicólogo o psiquiatra, va a ser útil, pero no es necesario para comenzar.',
				},
				{
					id: 4,
					title: '¿Puedo cambiarme de psicólogo?',
					desc:
						'Si te sientes insatisfecho con tu psicólogo, te recomendamos solicitar un cambio enviando un correo a cambios@hablaqui.com. No tendrás cobros adicionales, ni perderás días de suscripción.',
				},
			],
			efectividad: [
				[
					{
						id: 1,
						img: `${this.$config.LANDING_URL}/BaylorCollegeOfMedicine.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
						text:
							'“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
					},
					{
						id: 3,
						img: `${this.$config.LANDING_URL}/NewYorkUniversity.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
						text:
							'“El tratamiento de Trastono por Estrés Postraumático por medio de mensajería multimedia mostraró tasas de reducción de síntomas similares a las formas tradicionales de tratamiento. (2020)”',
					},
					{
						id: 5,
						img: `${this.$config.LANDING_URL}/ColumbiaUniversity.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
						text:
							'“Los hallazgos iniciales muestran una mejora casi total en el bienestar psicológico para el 90% de los que reciben tratamiento de terapia basada en mensajes de texto. (2015)”',
					},
				],
				[
					{
						id: 2,
						img: `${this.$config.LANDING_URL}/Logo-UniversityofCaliforniaBerkeley.png`,
						href: 'https://mhealth.jmir.org/2019/1/e10948/',
						text:
							'“Los hallazgos del estudio sugieren que las plataformas de psicoterapia digital son particularmente efectivas para personas sin antecedentes de psicoterapia o que no han sido tratadas previamente. (2019)”',
					},
					{
						id: 4,
						img: `${this.$config.LANDING_URL}/Logo-TheLancet.png`,
						href:
							'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(09)61257-5/fulltext',
						text:
							'“La terapia es eficaz cuando la realiza un terapeuta en línea, y los beneficios se mantienen durante más de ocho meses (2009)”',
					},
					{
						id: 6,
						img: `${this.$config.LANDING_URL}/BaylorCollegeOfMedicine.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
						text:
							'“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
					},
				],
			],
			efectividadMobile: [
				{
					id: 1,
					img: `${this.$config.LANDING_URL}/BaylorCollegeOfMedicine.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
					text:
						'“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
				},
				{
					id: 3,
					img: `${this.$config.LANDING_URL}/NewYorkUniversity.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
					text:
						'“El tratamiento de Trastono por Estrés Postraumático por medio de mensajería multimedia mostraró tasas de reducción de síntomas similares a las formas tradicionales de tratamiento. (2020)”',
				},
				{
					id: 5,
					img: `${this.$config.LANDING_URL}/ColumbiaUniversity.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
					text:
						'“Los hallazgos iniciales muestran una mejora casi total en el bienestar psicológico para el 90% de los que reciben tratamiento de terapia basada en mensajes de texto. (2015)”',
				},

				{
					id: 2,
					img: `${this.$config.LANDING_URL}/Logo-UniversityofCaliforniaBerkeley.png`,
					href: 'https://mhealth.jmir.org/2019/1/e10948/',
					text:
						'“Los hallazgos del estudio sugieren que las plataformas de psicoterapia digital sonparticularmente efectivas para personas sin antecedentes de psicoterapia o que no han sido tratadas previamente. (2019)”',
				},
				{
					id: 4,
					img: `${this.$config.LANDING_URL}/Logo-TheLancet.png`,
					href:
						'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(09)61257-5/fulltext',
					text:
						'“La terapia es eficaz cuando la realiza un terapeuta en línea, y los beneficios se mantienen durante más de ocho meses (2009)”',
				},
				{
					id: 6,
					img: `${this.$config.LANDING_URL}/BaylorCollegeOfMedicine.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
					text:
						'“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
				},
			],
			mainImageSrc: null,
			corousel: [
				{
					id: 1,
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima,ansiedad/estrés.',
					name: 'Aihnoa Con',
					image: `${this.$config.LANDING_URL}/Aihnoa_Con.png`,
				},
				{
					id: 2,
					name: 'Joaquín Bustos',
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima, fobia social.',
					image: `${this.$config.LANDING_URL}/Joaquin_Bustos.png`,
				},
				{
					id: 3,
					name: 'Jorge Calderon',
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoestima, duelo o perdida, ansiedad/estrés.',
					image: `${this.$config.LANDING_URL}/Jorge_Calderon.png`,
				},
				{
					id: 4,
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima,ansiedad/estrés.',
					name: 'Tamara Stein',
					image: `${this.$config.LANDING_URL}/Tamara_Stein.png`,
				},
			],
		};
	},
	head() {
		return {
			title: 'hablaqui',
			meta: [
				{
					hid: 'descripción',
					nombre: 'descripción',
					contenido:
						'Encuentra un psicólogo online y cuida tu salud emocional sin salir de casa. Contamos con terapeutas y entrenadores de todas las especialidades. ¡Empezar ahora!',
				},
			],
		};
	},
};
</script>

<style scoped>
.v-expansion-panel--active > .v-expansion-panel-header {
	min-height: 32px !important;
}

.v-expansion-panel-header {
	min-height: 32px !important;
}
</style>
