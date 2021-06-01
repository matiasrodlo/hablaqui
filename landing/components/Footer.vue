<template>
	<v-row align="center" justify="center" class="white--text py-16">
		<v-col cols="12" sm="3" md="3" class="text-center text-sm-left">
			<div
				class="text--secondary font-weight-bold"
				:class="$vuetify.breakpoint.smOnly ? 'body-2' : 'text-md-h6'"
			>
				Acuerdos
			</div>
			<div>
				<v-btn
					class="px-0 text--secondary"
					text
					link
					to="/politicas"
					:class="$vuetify.breakpoint.smOnly ? 'caption' : 'body-1'"
				>
					Políticas de Privacidad
				</v-btn>
			</div>
			<div>
				<v-btn
					class="px-0 text-left text--secondary"
					text
					link
					to="/condiciones"
					:class="$vuetify.breakpoint.smOnly ? 'caption' : 'body-1'"
				>
					Terminos y Condiciones
				</v-btn>
			</div>
		</v-col>
		<v-col cols="12" sm="3" md="3" class="text-center text-sm-left text--secondary">
			<div
				class="font-weight-bold"
				:class="$vuetify.breakpoint.smOnly ? 'body-2' : 'text-md-h6'"
			>
				Soporte Técnico
			</div>
			<div class="py-2" :class="$vuetify.breakpoint.smOnly ? 'caption' : 'body-1'">
				c@hablaqui.com
			</div>
			<div class="py-2" :class="$vuetify.breakpoint.smOnly ? 'caption' : 'body-1'">
				09:00am - 18:30pm
			</div>
		</v-col>
		<v-col cols="12" sm="3" md="3" class="headline text--secondary">
			<v-img
				contain
				width="230"
				class="mx-auto"
				:src="`${$config.LANDING_URL}/Startup.png`"
			></v-img>
			<v-img
				contain
				height="60"
				width="170"
				class="mt-3 mx-auto"
				:src="`${$config.LANDING_URL}/Adolfo_Ibanez.png`"
			></v-img>
		</v-col>
		<v-col cols="6" sm="3" md="3" class="headline text--secondary">
			<v-img contain height="90" :src="`${$config.LANDING_URL}/Web_Pay.png`" />
		</v-col>
	</v-row>
</template>
