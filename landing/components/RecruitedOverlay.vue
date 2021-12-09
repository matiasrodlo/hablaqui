<template>
	<v-overlay
		v-if="$auth.$state.user.role === 'psychologist' && !$auth.$state.user.psychologist"
		color="white"
		:opacity="0.6"
	>
		<v-card light :max-width="$vuetify.breakpoint.smAndDown ? '350' : ''">
			<v-card-text class="body-1 font-weight-medium">
				Configura tu cuenta para activar tu perfil y ten acceso a cada sección.
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn text color="primary" to="perfil"> Ir a mi cuenta </v-btn>
			</v-card-actions>
		</v-card>
	</v-overlay>
</template>
