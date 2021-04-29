<template>
	<v-container>
		<v-row align="center" class="white--text py-16">
			<v-col cols="12" sm="3">
				<div class="headline text--secondary font-weight-bold">Acuerdos</div>
				<v-btn class="px-0 headline text--secondary" text link to="/politicas">
					Políticas de Privacidad
				</v-btn>
				<v-btn class="px-0 headline text--secondary" text link to="/condiciones">
					Terminos y Condiciones
				</v-btn>
			</v-col>
			<v-col cols="12" sm="3" class="headline text--secondary">
				<div class="font-weight-bold">Soporte Técnico</div>
				<div>c@hablaqui.com</div>
				<div>09:00am - 18:30pm</div>
			</v-col>
			<v-col cols="12" sm="3" class="headline text--secondary">
				<v-img contain max-height="60" :src="`${$config.LANDING_URL}/Startup .png`"></v-img>
				<v-img
					contain
					max-height="60"
					:src="`${$config.LANDING_URL}/Adolfo Ibañez .png`"
				></v-img>
			</v-col>
			<v-col cols="12" sm="3" class="headline text--secondary">
				<v-img height="120" :src="`${$config.LANDING_URL}/Web Pay .png`"></v-img>
			</v-col>
		</v-row>
	</v-container>
</template>
