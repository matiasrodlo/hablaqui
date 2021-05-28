<template>
	<v-row align="start" justify="center" class="white--text py-16">
		<v-col cols="12" sm="3" md="3" class="text-center text-sm-left">
			<div class="body-1 text-md-h6 text--secondary font-weight-bold">Acuerdos</div>
			<div>
				<v-btn class="px-0 body-1 text--secondary" text link to="/politicas">
					Políticas de Privacidad
				</v-btn>
			</div>
			<div>
				<v-btn class="px-0 text-left body-1 text--secondary" text link to="/condiciones">
					Terminos y Condiciones
				</v-btn>
			</div>
		</v-col>
		<v-col cols="12" sm="3" md="3" class="text-center text-sm-left text--secondary">
			<div class="font-weight-bold body-1 text-md-h6">Soporte Técnico</div>
			<div class="py-2 body-1">c@hablaqui.com</div>
			<div class="py-2 body-1">09:00am - 18:30pm</div>
		</v-col>
		<v-col cols="12" sm="3" md="3" class="headline text--secondary">
			<v-img contain max-height="60" :src="`${$config.LANDING_URL}/Startup.png`"></v-img>
			<v-img
				contain
				max-height="60"
				:src="`${$config.LANDING_URL}/Adolfo_Ibanez.png`"
			></v-img>
		</v-col>
		<v-col cols="6" sm="3" md="3" class="headline text--secondary">
			<img style="max-width: 350px" :src="`${$config.LANDING_URL}/Web_Pay.png`" />
		</v-col>
	</v-row>
</template>
