<template>
	<div>
		<v-img :src="`${$config.LANDING_URL}/especialistas.png`">
			<Appbar />
			<v-container tag="section" fluid style="height: calc(100% - 180px)">
				<v-row justify="center" align="center" style="height: 100%">
					<v-col cols="12" md="5">
						<h1 style="font-size: 60px" class="text-left white--text font-weight-bold">
							Únete a la red de salud <br />
							mental y bienestar
						</h1>
						<h2 class="mt-3 text-left white--text text-h5 font-weight-bold">
							Descubre los beneficios de ser parte de Hablaquí y brinda terapia online
							desde cualquier lugar
						</h2>
						<v-list dark color="transparent" class="text-h5">
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content>
									Oficina virtual práctica y segura.
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content>
									Acceso a clientes registrados.
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content>
									Crecimiento y desarrollo profesional.
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-icon>
									<icon color="white" :icon="mdiCheck" />
								</v-list-item-icon>
								<v-list-item-content>
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
				<v-col v-for="item in 6" :key="item" cols="12" md="4" class="my-16">
					<v-card tag="section" flat>
						<v-card-text class="text-center">
							<v-img
								height="113px"
								width="120px"
								contain
								class="mx-auto"
								:src="`${$config.LANDING_URL}/video-sesion.png`"
								:lazy-src="`${$config.LANDING_URL}/video-sesion.png`"
								alt="video sesion"
							/>
						</v-card-text>
						<v-card-text class="text-center pt-0">
							<h3 class="title font-weight-bold text-h5">
								Plataforma de video de sesión
							</h3>
						</v-card-text>
						<v-card-text class="text-center">
							<article class="body-1 mx-auto text-h6">
								En su nueva oficina virtual, atienda a clientes de todo el mundo
							</article>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
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
