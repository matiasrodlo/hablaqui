<template>
	<div>
		<div class="primary">
			<Appbar />
		</div>
		<!-- section 1 -->
		<div style="position: relative">
			<img src="container-blue.png" style="height: 500px; width: 100%" />
			<div style="position: absolute; top: 0; width: 100%">
				<div class="primary" style="height: 45px"></div>
				<v-container class="white--text" style="height: 400px">
					<v-row justify="center" align="center" style="height: 400px">
						<v-col cols="8" sm="6" xl="5" class="text-center text-sm-left">
							<div class="text-lg-h2 text-md-h3 text-h5 font-weight-bold">
								Tu psicólogo Online
							</div>
							<div class="title my-4">
								¡La salud mental y el bienestar están a tan solo unos clicks!
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
		<!-- section 2 -->
		<v-container class="pt-10">
			<v-row justify="center">
				<v-col
					cols="12"
					xl="10"
					class="text-left text-h5 text-sm-h4 text-md-h3 text--secondary font-weight-bold"
				>
					Cómo funciona
				</v-col>
			</v-row>
			<v-row justify="center">
				<v-col v-for="(item, i) in firstbox" :key="i" cols="12" sm="6" lg="3" xl="2">
					<v-card flat>
						<v-card-text class="text-center">
							<v-btn
								style="border: 8px solid #5eb3e4; cursor: initial"
								depressed
								fab
								width="100"
								height="100"
							>
								<v-avatar color="white" size="85"> </v-avatar>
							</v-btn>
						</v-card-text>
						<v-card-text class="text-center">
							<div class="title">{{ i + 1 }}. {{ item.title }}</div>
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
		<!-- section 3 -->
		<div style="position: relative">
			<img src="container-blue.png" style="height: 500px; width: 100%" />
			<div style="position: absolute; top: 0; width: 100%">
				<v-container class="white--text" style="height: 400px">
					<v-row justify="center" align="center" style="height: 400px">
						<v-col cols="12" class="mt-16 text-center text-sm-left">
							<div class="text-lg-h2 text-md-h3 text-h5 font-weight-bold">Planes</div>
						</v-col>
						<v-col cols="4" class="text-center hidden-sm-and-down">
							<v-card flat>
								<v-card-text> Plan $n </v-card-text>
								<v-card-text> Descripcion </v-card-text>
								<v-card-text> Precio $</v-card-text>
							</v-card>
						</v-col>
						<v-col cols="4" class="text-center hidden-sm-and-down">
							<v-card flat>
								<v-card-text> Plan $n </v-card-text>
								<v-card-text> Descripcion </v-card-text>
								<v-card-text> Precio $</v-card-text>
							</v-card>
						</v-col>
						<v-col cols="4" class="text-center hidden-sm-and-down">
							<v-card flat>
								<v-card-text> Plan $n </v-card-text>
								<v-card-text> Descripcion </v-card-text>
								<v-card-text> Precio $</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</v-container>
			</div>
		</div>
		<!-- section 4 -->
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
			<v-row justify="center">
				<v-col v-for="(item, i) in ventajas" :key="i" cols="12" sm="6" lg="3" xl="2">
					<v-card flat>
						<v-card-text class="text-center">
							<v-btn
								style="border: 8px solid #5eb3e4; cursor: initial"
								depressed
								fab
								width="100"
								height="100"
							>
								<v-avatar color="white" size="85"> </v-avatar>
							</v-btn>
						</v-card-text>
						<v-card-text class="text-center">
							<div class="title">{{ i + 1 }}. {{ item.title }}</div>
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
		<!-- SECTION 5 -->
		<div style="position: relative">
			<img src="container-blue.png" style="height: 500px; width: 100%" />
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
							<div class="caption my-4">
								Contamos con un amplio equipo de especialistas dedicados a lo quetú
								busques desarrollar. Todos nuestros profesionales sonrigurosamente
								seleccionados, certificados, y cuentan con un alto nivelde formación
								y experiencia. Te garantizamos una atención efectiva yexperta, pero
								también cálida y humana
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
		<v-container>
			<v-row>
				<v-col class="text-center">
					<v-btn
						:to="{ name: 'faq' }"
						rounded
						color="primary"
						x-large
						class="font-weight-bold"
						depressed
					>
						Preguntas frecuentes
						<v-icon right>mdi-chevron-right</v-icon>
					</v-btn>
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
					title:
						'¡La salud mental y el bienestar están a tan solo unos clicks! Crea tu cuenta y elige tu terapeuta',
					desc:
						'Te ayudamos a encontrar el especialista más indicado acorde a tus necesidades',
					img: '',
				},
				{
					title: 'Elige y paga el plan que más te acomode',
					desc:
						'Te ofrecemos planes convenientes. Pago 100% electrónico, rápido y seguro',
					img: '',
				},
				{
					title: 'Agenda tu consulta en un par de clicks',
					desc: 'Contamos con una plataforma para agendar con solo un click',
					img: '',
				},
				{
					title: 'Conéctate con tu terapeuta vía chat y video',
					desc: '¡Tu camino de bienestar comienza! conéctate a cualquier hora y lugar',
					img: '',
				},
			],
			ventajas: [
				{
					title: '100% SEGURO Y CONFIDENCIAL',
					desc: 'Protegemos tu información con altos estándares de seguridad',
					img: '',
				},
				{
					title: 'TE ASEGURAMOS TERAPEUTAS DE CALIDAD',
					desc:
						'No tienes que arriesgarte. Nuestros terapeutas son certificados, seleccionados y especializados',
					img: '',
				},
				{
					title: 'ACCESIBILIDAD DONDESEA Y CUANDO SEA',
					desc:
						'Accede a tu espacio terapéutico desde cualquier lugar y en los horarios que a ti te acomode',
					img: '',
				},
				{
					title: 'OBSERVA TU PROGRESOREAL EN LA TERAPIA',
					desc:
						'Contamos con un sistema de seguimiento de tu proceso, para que visualices con cretamente cómo vas en él',
					img: '',
				},
			],
		};
	},
};
</script>
