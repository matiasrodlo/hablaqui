<template>
	<v-row align="center" justify="center" class="white--text py-16">
		<v-col cols="12" sm="6" md="3" class="text-center text-sm-left">
			<div class="headline text--secondary font-weight-bold">Acuerdos</div>
			<v-btn class="px-0 text-h6 text-md-h5 text--secondary" text link to="/politicas">
				Políticas de Privacidad
			</v-btn>
			<v-btn class="px-0 text-h6 text-md-h5 text--secondary" text link to="/condiciones">
				Terminos y Condiciones
			</v-btn>
		</v-col>
		<v-col
			cols="12"
			sm="6"
			md="3"
			class="text-center text-sm-left text-h6 text-md-h6 text--secondary"
		>
			<div class="font-weight-bold">Soporte Técnico</div>
			<div>c@hablaqui.com</div>
			<div>09:00am - 18:30pm</div>
		</v-col>
		<v-col cols="12" sm="6" md="3" class="headline text--secondary">
			<v-img contain max-height="60" :src="`${$config.LANDING_URL}/Startup .png`"></v-img>
			<v-img
				contain
				max-height="60"
				:src="`${$config.LANDING_URL}/Adolfo Ibañez .png`"
			></v-img>
		</v-col>
		<v-col cols="6" sm="6" md="3" class="headline text--secondary">
			<v-img max-width="350" :src="`${$config.LANDING_URL}/Web Pay .png`"></v-img>
		</v-col>
	</v-row>
</template>
