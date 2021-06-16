<template>
	<v-row justify="center">
		<v-col cols="12" md="10" xl="8">
			<v-row align="center" justify="center" class="white--text py-16">
				<v-col cols="12" sm="3" md="3" class="text-center text-sm-left">
					<div
						class="text--secondary font-weight-bold"
						:class="$vuetify.breakpoint.smOnly ? 'body-2' : 'text-md-h6'"
					>
						Acuerdos
					</div>
					<nuxt-link
						class="d-block body-1 text--secondary"
						style="text-decoration: none"
						to="/politicas"
					>
						Políticas de Privacidad
					</nuxt-link>
					<nuxt-link
						class="d-block body-1 text--secondary"
						style="text-decoration: none"
						to="/condiciones"
					>
						Terminos y Condiciones
					</nuxt-link>
				</v-col>
				<v-col cols="12" sm="3" md="3" class="text-center text-sm-left text--secondary">
					<div
						class="font-weight-bold"
						:class="$vuetify.breakpoint.smOnly ? 'body-2' : 'text-md-h6'"
					>
						Atención a clientes
					</div>
					<div class="body-1">c@hablaqui.com</div>
					<div class="body-1">09:00am - 18:30pm</div>
				</v-col>
				<v-col cols="12" sm="3" md="3" class="headline text--secondary">
					<v-img
						contain
						width="240"
						class="mx-auto"
						:src="`${$config.LANDING_URL}/Startup.png`"
					></v-img>
					<v-img
						contain
						height="60"
						width="220"
						class="mt-3 mx-auto"
						:src="`${$config.LANDING_URL}/Adolfo_Ibanez.png`"
					></v-img>
				</v-col>
				<v-col cols="6" sm="3" md="3" class="headline text--secondary">
					<v-img contain height="90" :src="`${$config.LANDING_URL}/Web_Pay.png`" />
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>
