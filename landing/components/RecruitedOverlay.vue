<template>
	<v-overlay
		v-if="$auth.$state.user.role === 'psychologist' && !$auth.$state.user.psychologist"
		color="white"
		:opacity="0.6"
	>
		<v-card light :max-width="$vuetify.breakpoint.smAndDown ? '550' : ''">
			<v-card-text class="body-1 font-weight-medium">
				Tu perfil se encuentra en proceso de verificación.  <br/><br/>
				Recibirás un correo de confirmación cuando tu perfil sea verificado y se encuentre activado. <br/><br/> 
				Si tienes dudas, puedes escribirnos a soporte@hablaqui.cl
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn text color="primary" to="perfil"> Ir a mi cuenta </v-btn>
			</v-card-actions>
		</v-card>
	</v-overlay>
</template>
