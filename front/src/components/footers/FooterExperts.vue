<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="12" md="11" lg="10" xl="8">
				<v-row align="center" class="white--text py-16">
					<v-col cols="12" sm="12" md="3" class="text-center text-md-left">
						<div
							class="text--secondary font-weight-bold"
							:class="$vuetify.breakpoint.smOnly ? 'body-2' : 'text-md-h6'"
						>
							Acuerdos
						</div>
						<a
							class="d-block body-1 text--secondary"
							style="text-decoration: none"
							:href="`${landingUrl}/politicas`"
						>
							Políticas de Privacidad
						</a>
						<a
							class="d-block body-1 text--secondary"
							style="text-decoration: none"
							:href="`${landingUrl}/condiciones`"
						>
							Terminos y Condiciones
						</a>
					</v-col>
					<v-col
						cols="12"
						sm="12"
						md="3"
						class="text-center text-md-left text--secondary"
					>
						<div
							class="font-weight-bold"
							:class="$vuetify.breakpoint.smOnly ? 'body-2' : 'text-md-h6'"
						>
							Atención a clientes
						</div>
						<div class="body-1">
							c@hablaqui.com
						</div>
						<div class="body-1">
							09:00am - 18:30pm
						</div>
					</v-col>
					<v-col cols="12" sm="12" md="3">
						<v-img contain width="240" class="mx-auto" src="/img/Startup.png"></v-img>
						<v-img
							contain
							height="50"
							width="220"
							class="mt-3 mx-auto"
							src="/img/Adolfo_Ibanez.png"
						></v-img>
					</v-col>
					<v-col cols="12" sm="12" md="3">
						<v-img contain height="90" class="mx-auto" src="/img/WebPay.png" />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { landing } from '@/config';

export default {
	computed: {
		landingUrl() {
			return landing;
		},
	},
};
</script>
