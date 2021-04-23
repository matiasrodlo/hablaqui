<template>
	<div>
		<div class="primary">
			<Appbar />
		</div>
		<!-- SECTION 1 / heading -->
		<div style="position: relative">
			<img
				:src="`${$config.LANDING_URL}/container-blue.png`"
				style="height: 500px; width: 100%"
			/>
			<div style="position: absolute; top: 0; width: 100%">
				<div class="primary" style="height: 45px"></div>
				<v-container class="white--text" style="height: 400px">
					<v-row justify="center" align="center" style="height: 400px">
						<v-col cols="12" sm="6" xl="5" class="text-center text-sm-left">
							<div class="text-lg-h2 text-md-h3 text-h5 font-weight-bold">
								Tu psicólogo Online
							</div>
							<div class="title my-4">
								Demos juntos el primer paso hacia el bienestar emocional. Habla de
								forma segura y privada con un psicólogo online cuando lo necesites.
							</div>
							<v-btn
								rounded
								color="white"
								x-large
								class="font-weight-bold"
								depressed
								:href="`${$config.FRONTEND_URL}/auth`"
							>
								QUIERO COMENZAR
							</v-btn>
							<div class="title my-4">Desde $15.500CLP a la semana</div>
						</v-col>
						<v-col cols="4" sm="6" xl="5" class="text-center hidden-sm-and-down">
							<v-btn
								style="border: 8px solid #5eb3e4; cursor: initial"
								depressed
								fab
								width="200"
								height="200"
							>
								<v-avatar color="white" size="185"> </v-avatar>
							</v-btn>
						</v-col>
					</v-row>
				</v-container>
			</div>
		</div>
		<!-- SETION 2 / como funciona -->
		<v-container class="pt-10">
			<v-row justify="center">
				<v-col
					cols="12"
					xl="10"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold"
				>
					Cómo funciona
					<div class="text-h6">
						Es fácil y seguro realizar terapia con un psicólogo online y continuar con
						tu estilo de vida con Hablaquí.
					</div>
				</v-col>
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
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold"
				>
					<v-btn
						rounded
						color="primary"
						x-large
						class="font-weight-bold"
						depressed
						:href="`${$config.FRONTEND_URL}/auth`"
					>
						QUIERO COMENZAR
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 3 / Nuestros psicólogos -->
		<div style="position: relative">
			<img
				:src="`${$config.LANDING_URL}/container-blue.png`"
				style="height: 500px; width: 100%"
			/>
			<div style="position: absolute; top: 0; width: 100%">
				<v-container
					class="white--text"
					:class="$vuetify.breakpoint.smAndUp ? '' : 'primary'"
					style="height: 500px"
				>
					<v-row justify="center" align="center" style="height: 500px">
						<v-col cols="12" sm="6" xl="5" class="text-center text-sm-left">
							<div class="text-lg-h2 text-md-h3 text-h5 font-weight-bold">
								Nuestros psicólogos
							</div>
							<div class="my-4">
								Contamos con un amplio equipo de psicólogos enfocados a potenciar el
								área que busques desarrollar. Todos nuestros profesionales son
								rigurosamente seleccionados, certificados, y cuentan con un alto
								nivel de formación y experiencia. Te garantizamos una atención
								efectiva y experta, pero también cálida y humana.
							</div>
							<v-btn
								rounded
								color="white"
								x-large
								class="font-weight-bold"
								depressed
								:href="`${$config.FRONTEND_URL}/psicologos/todos`"
							>
								Ver más psicólogos
							</v-btn>
						</v-col>
						<v-col cols="12" sm="6" xl="5" class="text-center">
							<v-row justify="center">
								<v-col cols="12" class="text-center">
									<v-btn
										style="border: 8px solid #5eb3e4; cursor: initial"
										depressed
										fab
										width="100"
										height="100"
									>
										<v-avatar color="white" size="85"> </v-avatar>
									</v-btn>
								</v-col>
								<v-col cols="4" sm="6" md="3">
									<v-btn
										style="border: 8px solid #5eb3e4; cursor: initial"
										depressed
										fab
										width="100"
										height="100"
									>
										<v-avatar color="white" size="85"> </v-avatar>
									</v-btn>
								</v-col>
								<v-col cols="4" sm="6" md="3">
									<v-btn
										style="border: 8px solid #5eb3e4; cursor: initial"
										depressed
										fab
										width="100"
										height="100"
									>
										<v-avatar color="white" size="85"> </v-avatar>
									</v-btn>
								</v-col>
							</v-row>
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
					xl="10"
					class="text-left text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold"
				>
					Ventajas
				</v-col>
			</v-row>
			<v-row>
				<v-col v-for="item in ventajas" :key="item.id" cols="12" sm="4" class="my-16">
					<v-card flat>
						<v-card-text class="text-center my-10">
							<v-btn depressed icon>
								<v-icon size="120" color="primary">{{ item.img }}</v-icon>
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
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold"
				>
					<v-btn
						rounded
						color="primary"
						x-large
						class="font-weight-bold"
						depressed
						:href="`${$config.FRONTEND_URL}/auth`"
					>
						PRUEBA AHORA
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 5 / RESEÑA -->
		<div style="position: relative">
			<img
				:src="`${$config.LANDING_URL}/container-blue.png`"
				style="height: 500px; width: 100%"
			/>
			<div style="position: absolute; top: 0; width: 100%">
				<v-container class="white--text" style="height: 400px">
					<v-row justify="center" align="center" style="height: 400px">
						<v-col cols="12" class="mt-16 text-center text-sm-left">
							<div class="text-lg-h2 text-md-h3 text-h5 font-weight-bold">
								Reseñas
							</div>
						</v-col>
						<v-col cols="12">
							<v-slide-group center-active show-arrows>
								<template #prev>
									<v-icon
										color="white"
										:size="$vuetify.breakpoint.smAndUp ? '70' : '30'"
										>mdi-chevron-left</v-icon
									>
								</template>
								<template #next>
									<v-icon
										color="white"
										:size="$vuetify.breakpoint.smAndUp ? '70' : '30'"
										>mdi-chevron-right</v-icon
									>
								</template>
								<v-slide-item
									v-for="item in reseñas"
									:key="item.id"
									v-slot="{ toggle }"
								>
									<v-card
										:height="$vuetify.breakpoint.smAndUp ? '250' : '310'"
										:width="$vuetify.breakpoint.smAndUp ? '300' : '220'"
										class="ma-4 text-center"
										style="border-radius: 25px"
										flat
										@click="toggle"
									>
										<v-card-text class="title">{{ item.title }}</v-card-text>
										<v-card-text>{{ item.desc }}</v-card-text>
									</v-card>
								</v-slide-item>
							</v-slide-group>
						</v-col>
					</v-row>
				</v-container>
			</div>
		</div>
		<!-- SECTION 6 / download app -->
		<v-container>
			<v-row>
				<v-col cols="12" class="text-center text-h3 text--secondary">
					Descarga nuestra aplicación
				</v-col>
				<v-col cols="12" class="text-center my-16">
					<v-btn color="black" x-large class="ma-2 white--text"> Google play </v-btn>
					<v-btn color="black" x-large class="ma-2 white--text"> itunes </v-btn>
				</v-col>
			</v-row>
		</v-container>
		<!-- SECTION 7 / faq -->
		<v-container>
			<v-row>
				<v-col class="mt-16 text-left text-h3 text--secondary">
					Preguntas frecuentes
				</v-col>
				<v-col cols="12" class="text-left">
					<div v-for="item in faq" :key="item.id">
						<div class="primary title pa-1 white--text" style="border-radius: 10px">
							{{ item.title }}
						</div>
						<div class="subtitle-2 my-6 text--secondary">{{ item.desc }}</div>
					</div>
				</v-col>
				<v-col
					cols="12"
					class="text-center text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold"
				>
					<v-btn
						rounded
						color="primary"
						x-large
						class="font-weight-bold"
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
		<Footer />
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
					img: 'mdi-monitor',
				},
				{
					id: 2,
					title: 'Privacidad',
					desc:
						'Disfruta de las sesiones con tu psicólogo de manera segura y privada a través de un teléfono, tablet o computador.',
					img: 'mdi-shield-lock',
				},
				{
					id: 3,
					title: 'Personalización',
					desc:
						'Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios a través de una breve evaluación.',
					img: 'mdi-face-agent',
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
		};
	},
};
</script>
