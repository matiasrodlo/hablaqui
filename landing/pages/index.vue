<template>
	<div>
		<client-only>
			<div class="primary">
				<Appbar />
			</div>
			<!-- SECTION 1 / heading -->
			<div style="position: relative" class="white">
				<img
					class="white"
					:src="`${$config.LANDING_URL}/GH1.png`"
					style="height: 700px; width: 100%"
				/>
				<div style="position: absolute; top: 0; width: 100%">
					<v-container class="white--text" style="height: 700px">
						<v-row justify="center" align="center">
							<v-col cols="12" sm="6" class="text-center text-sm-left">
								<div
									class="text-lg-h2 text-md-h3 text-h5 font-weight-bold my-md-10"
								>
									Tu psicólogo Online
								</div>
								<div class="title my-5 my-md-10">
									Demos juntos el primer paso hacia el bienestar emocional. Habla
									de forma segura y privada con un psicólogo online cuando lo
									necesites.
								</div>
								<v-btn
									style="border-radius: 15px"
									color="white"
									x-large
									class="font-weight-bold pa-8 text-capitalize"
									depressed
									:href="`${$config.FRONTEND_URL}/auth`"
								>
									Quiero comenzar
								</v-btn>
								<div class="title mt-5 mt-md-10">Desde $15.500CLP a la semana</div>
							</v-col>
							<v-col cols="12" sm="6">
								<v-img
									:height="heightPhone"
									:src="`${$config.LANDING_URL}/tel.png`"
								></v-img>
							</v-col>
						</v-row>
					</v-container>
				</div>
			</div>
		</client-only>
		<!-- SETION 2 / como funciona -->
		<v-container class="pt-10">
			<v-row justify="center">
				<v-col
					cols="12"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold my-10"
				>
					Cómo funciona
				</v-col>
				<div class="text-h6 mb-6 text--secondary">
					Es fácil y seguro realizar terapia con un psicólogo online y continuar con tu
					estilo de vida con Hablaquí.
				</div>
			</v-row>
			<v-row>
				<v-col v-for="item in firstbox" :key="item.id" cols="12" sm="4">
					<v-card flat>
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
							<div class="title font-weight-bold">{{ item.title }}</div>
							<div class="body-1">
								{{ item.desc }}
							</div>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col
					cols="12"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold mb-10"
				>
					<v-btn
						style="border-radius: 15px"
						color="primary"
						x-large
						class="font-weight-bold pa-8"
						depressed
						:href="`${$config.FRONTEND_URL}/auth`"
					>
						Quiero comenzar
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 3 / Nuestros psicólogos -->
		<div style="position: relative">
			<img
				:src="`${$config.LANDING_URL}/container-blue.png`"
				style="height: 800px; width: 100%"
			/>
			<div style="position: absolute; top: 0; width: 100%">
				<v-container
					class="white--text"
					:class="$vuetify.breakpoint.smAndUp ? '' : 'primary'"
				>
					<v-row justify="space-between" align="center" style="height: 700px">
						<v-col cols="12" md="6" class="text-center text-md-left">
							<div class="text-lg-h3 text-md-h4 text-h6 font-weight-bold my-10">
								Nuestros psicólogos
							</div>
							<div class="my-10 subtitle-1">
								Contamos con un amplio equipo de psicólogos enfocados a potenciar el
								área que busques desarrollar. Todos nuestros profesionales son
								rigurosamente seleccionados, certificados, y cuentan con un alto
								nivel de formación y experiencia. Te garantizamos una atención
								efectiva y experta, pero también cálida y humana.
							</div>
							<v-btn
								style="border-radius: 15px"
								color="white"
								x-large
								class="font-weight-bold pa-8"
								depressed
								:href="`${$config.FRONTEND_URL}/psicologos/todos`"
							>
								Ver más psicólogos
							</v-btn>
						</v-col>
						<v-col cols="12" md="6" class="d-flex justify-center">
							<div style="box-shadow: 22px 22px 0px 0px #b2eceb; border-radius: 25px">
								<v-carousel
									cycle
									hide-delimiter-background
									hide-delimiters
									:show-arrows="false"
									reverse-transition="fade-transition"
									transition="fade-transition"
									:height="$vuetify.breakpoint.mdAndUp ? '395' : '285'"
									style="
										box-shadow: 12px 12px 0px 0px #03dfd8;
										border-radius: 25px;
									"
								>
									<v-carousel-item v-for="item in corousel" :key="item.id">
										<v-img
											:src="item.image"
											contain
											:max-width="$vuetify.breakpoint.mdAndUp ? '350' : '250'"
											class="d-flex justify-end"
										>
											<div
												style="
													background-color: #616161;
													position: absolute;
													bottom: 0;
													height: 100px;
													opacity: 0.6;
													width: 100%;
													border-radius: 0 0 20px 20px;
												"
												class="white--text"
											>
												<div class="pt-1 pl-2 font weight-regular">
													{{ item.title }}
												</div>
												<div
													class="pl-2"
													:class="
														$vuetify.breakpoint.mdAndUp
															? 'title'
															: 'body-1'
													"
												>
													{{ item.name }}
												</div>
												<div class="caption pl-2 font-weight-bold">
													<v-icon color="primary">mdi-check</v-icon
													>{{ item.subtitle }}
												</div>
											</div>
										</v-img>
									</v-carousel-item>
								</v-carousel>
							</div>
						</v-col>
					</v-row>
				</v-container>
			</div>
		</div>
		<!-- SECTION 4 / VENTAJAS  -->
		<v-container class="pt-10">
			<v-row justify="center">
				<v-col
					cols="12"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold"
				>
					Ventajas
				</v-col>
			</v-row>
			<v-row>
				<v-col v-for="item in ventajas" :key="item.id" cols="12" sm="4" class="my-16">
					<v-card flat>
						<v-card-text class="text-center">
							<img style="height: 120px" :src="item.img" />
						</v-card-text>
						<v-card-text class="text-center title font-weight-bold">
							{{ item.title }}
						</v-card-text>
						<v-card-text class="text-center body-1">
							{{ item.desc }}
						</v-card-text>
					</v-card>
				</v-col>
				<v-col
					cols="12"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold mb-10"
				>
					<v-btn
						style="border-radius: 15px"
						color="primary"
						x-large
						class="font-weight-bold pa-8"
						depressed
						:href="`${$config.FRONTEND_URL}/auth`"
					>
						Quiero empezar
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 5 / Efectividad -->
		<div style="position: relative" class="my-10">
			<img :src="`${$config.LANDING_URL}/blue2.png`" style="height: 700px; width: 100%" />
			<div style="position: absolute; top: 0">
				<v-img width="180" :src="`${$config.LANDING_URL}/plus.png`"></v-img>
			</div>
			<div style="position: absolute; top: 0; width: 100%">
				<v-container>
					<v-row>
						<v-col cols="12" class="white--text mt-16 text-center text-sm-left">
							<div class="text-lg-h2 text-md-h3 text-h5 font-weight-bold">
								Efectividad
							</div>
						</v-col>
					</v-row>
				</v-container>
				<v-container class="white--text">
					<v-row justify="center" align="center">
						<v-col cols="12">
							<v-carousel
								v-if="$vuetify.breakpoint.mdAndUp"
								:show-arrows="false"
								reverse-transition="fade-transition"
								transition="fade-transition"
								hide-delimiter-background
								height="400"
							>
								<v-carousel-item v-for="(item, i) in efectividad" :key="i">
									<div class="text-center d-flex justify-center align-center">
										<v-card
											v-for="el in item"
											:key="el.id"
											height="300"
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
												<div style="height: 120px; overflow-y: auto">
													{{ el.text }}
												</div>
												<div class="pt-2">
													<a
														class="primary--text"
														style="text-decoration: none"
														:href="el.href"
														>Leer estudio completo</a
													>
												</div>
											</v-card-text>
										</v-card>
									</div>
								</v-carousel-item>
							</v-carousel>
							<v-carousel
								v-else
								:show-arrows="false"
								reverse-transition="fade-transition"
								transition="fade-transition"
								hide-delimiter-background
								height="400"
							>
								<v-carousel-item v-for="(tag, i) in efectividadMobile" :key="i">
									<div class="text-center d-flex justify-center align-center">
										<v-card
											height="300"
											class="mx-4 d-inline-block"
											style="border-radius: 25px"
											light
											flat
										>
											<v-card-text>
												<img height="60" :src="tag.img" />
											</v-card-text>
											<v-card-text
												style="flex-direction: column; height: 240px"
												class="d-flex justify-content-end"
											>
												<div>{{ tag.text }}</div>
												<v-btn
													block
													link
													text
													color="blue"
													:href="tag.href"
												>
													Leer estudio completo
												</v-btn>
											</v-card-text>
										</v-card>
									</div>
								</v-carousel-item>
							</v-carousel>
						</v-col>
					</v-row>
				</v-container>
			</div>
		</div>
		<!-- SECTION 6 / download app -->
		<v-container>
			<v-row>
				<v-col
					cols="12"
					class="my-10 text-center text-lg-h4 font-weight-bold text--secondary"
				>
					Descarga nuestra aplicación
				</v-col>
				<v-col cols="12" class="my-16 d-flex align-center justify-center">
					<img
						style="cursor: pointer"
						height="75px"
						:src="`${$config.LANDING_URL}/google-play-badge.png`"
						alt="descarcar nuestra aplicaion"
					/>
					<img
						style="cursor: pointer"
						height="50px"
						:src="`${$config.LANDING_URL}/ios.svg`"
						alt="descarcar nuestra aplicaion"
					/>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 7 / faq -->
		<v-container>
			<v-row>
				<v-col
					class="my-10 text-center text-md-left text-lg-h3 text-md-h4 text-h6 text--secondary font-weight-bold"
				>
					Preguntas frecuentes
				</v-col>
				<v-col cols="12" class="text-left">
					<!-- <div>
						<div class="primary title pa-1 white--text" style="border-radius: 10px">
							{{ item.title }}
						</div>
						<div class="subtitle-2 my-6 text--secondary">{{ item.desc }}</div>
					</div> -->
					<v-expansion-panels v-model="panel" flat dark multiple>
						<v-expansion-panel v-for="item in faq" :key="item.id" class="pa-0">
							<v-expansion-panel-header
								color="primary"
								class="white--text pa-1"
								light
							>
								{{ item.title }}
							</v-expansion-panel-header>
							<v-expansion-panel-content class="white text--secondary pt-5">
								{{ item.desc }}
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-col>
				<v-col
					cols="12"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold"
				>
					<v-btn
						style="border-radius: 15px"
						color="primary"
						x-large
						class="font-weight-bold pa-8"
						depressed
						:href="`${$config.FRONTEND_URL}/auth`"
					>
						Quiero empezar
					</v-btn>
				</v-col>
				<v-col cols="12" class="text-center headline my-6 text--secondary">
					Comienza tu viaje de autoconocimiento y desarrollo personal ahora mismo
				</v-col>
			</v-row>
		</v-container>
		<v-container>
			<v-row align="center">
				<v-col cols="6" md="2">
					<v-img
						contain
						height="100"
						:src="`${$config.LANDING_URL}/Grafico Vida Tres Isapre.png`"
					></v-img>
				</v-col>
				<v-col cols="6" md="2">
					<v-img
						contain
						max-height="100"
						:src="`${$config.LANDING_URL}/logo_nmv_5cm.png`"
					></v-img>
				</v-col>
				<v-col cols="6" md="2">
					<v-img
						contain
						max-height="100"
						:src="`${$config.LANDING_URL}/fonasa.jpg`"
					></v-img>
				</v-col>
				<v-col cols="6" md="2">
					<v-img
						contain
						max-height="100"
						:src="`${$config.LANDING_URL}/banmedica.png`"
					></v-img>
				</v-col>
				<v-col cols="6" md="2">
					<v-img
						contain
						max-height="100"
						:src="`${$config.LANDING_URL}/colmena.png`"
					></v-img>
				</v-col>
				<v-col cols="6" md="2">
					<v-img
						contain
						max-height="100"
						:src="`${$config.LANDING_URL}/consalud.png`"
					></v-img>
				</v-col>
			</v-row>
		</v-container>
		<v-container>
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
						img: `${this.$config.LANDING_URL}/Baylor College Of Medicine.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
						text:
							'“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
					},
					{
						id: 3,
						img: `${this.$config.LANDING_URL}/New York University.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
						text:
							'“El tratamiento de Trastono por Estrés Postraumático por medio de mensajería multimedia mostraró tasas de reducción de síntomas similares a las formas tradicionales de tratamiento. (2020)”',
					},
					{
						id: 5,
						img: `${this.$config.LANDING_URL}/Columbia University.png`,
						href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
						text:
							'“Los hallazgos iniciales muestran una mejora casi total en el bienestar psicológico para el 90% de los que reciben tratamiento de terapia basada en mensajes de texto. (2015)”',
					},
				],
				[
					{
						id: 2,
						img: ``,
						href: 'https://mhealth.jmir.org/2019/1/e10948/',
						text:
							'“Los hallazgos del estudio sugieren que las plataformas de psicoterapia digital sonparticularmente efectivas para personas sin antecedentes de psicoterapia o que no han sido tratadas previamente. (2019)”',
					},
					{
						id: 4,
						img: ``,
						href:
							'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(09)61257-5/fulltext',
						text:
							'“La terapia es eficaz cuando la realiza un terapeuta en línea, y los beneficios se mantienen durante más de ocho meses (2009)”',
					},
				],
			],
			efectividadMobile: [
				{
					id: 1,
					img: `${this.$config.LANDING_URL}/Baylor College Of Medicine.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/26231819/',
					text:
						'“Incluso en entornos inestables e inseguros, las personas con síntomas de estrés postraumático muestran mejoras gracias a un tratamiento completamente online.” (2016)',
				},
				{
					id: 3,
					img: `${this.$config.LANDING_URL}/New York University.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
					text:
						'“El tratamiento de Trastono por Estrés Postraumático por medio de mensajería multimedia mostraró tasas de reducción de síntomas similares a las formas tradicionales de tratamiento. (2020)”',
				},
				{
					id: 5,
					img: `${this.$config.LANDING_URL}/Columbia University.png`,
					href: 'https://pubmed.ncbi.nlm.nih.gov/32347814/',
					text:
						'“Los hallazgos iniciales muestran una mejora casi total en el bienestar psicológico para el 90% de los que reciben tratamiento de terapia basada en mensajes de texto. (2015)”',
				},

				{
					id: 2,
					img: ``,
					href: 'https://mhealth.jmir.org/2019/1/e10948/',
					text:
						'“Los hallazgos del estudio sugieren que las plataformas de psicoterapia digital sonparticularmente efectivas para personas sin antecedentes de psicoterapia o que no han sido tratadas previamente. (2019)”',
				},
				{
					id: 4,
					img: ``,
					href:
						'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(09)61257-5/fulltext',
					text:
						'“La terapia es eficaz cuando la realiza un terapeuta en línea, y los beneficios se mantienen durante más de ocho meses (2009)”',
				},
			],
			mainImageSrc: null,
			corousel: [
				{
					id: 1,
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima,ansiedad/estrés.',
					name: 'Aihnoa Con',
					image: `${this.$config.LANDING_URL}/Aihnoa Con.png`,
				},
				{
					id: 2,
					name: 'Joaquín Bustos',
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima,ansiedad/estrés.',
					image: `${this.$config.LANDING_URL}/Joaquín Bustos.png`,
				},
				{
					id: 3,
					name: 'Jorge Calderon',
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima,ansiedad/estrés.',
					image: `${this.$config.LANDING_URL}/Jorge Calderon.png`,
				},
				{
					id: 4,
					title: 'Terapeuta de Hablaquí con licencia',
					subtitle: 'Autoconocimiento, autoestima,ansiedad/estrés.',
					name: 'Tamara Stein',
					image: `${this.$config.LANDING_URL}/Tamara Stein.png`,
				},
			],
		};
	},
	computed: {
		heightPhone() {
			if (this.$vuetify.breakpoint.xs) return '300px';
			else if (this.$vuetify.breakpoint.smAndDown) return '500px';
			else return '600px';
		},
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
