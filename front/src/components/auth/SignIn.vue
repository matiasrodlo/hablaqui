<template>
	<v-row>
		<v-col cols="12" class="text-center title primary--text text-uppercase">
			Iniciar sesión
		</v-col>
		<v-col cols="12">
			<v-text-field label="Correo electronico" type="text"></v-text-field>
		</v-col>
		<v-col cols="12">
			<v-text-field label="Contraseña" type="password"></v-text-field>
		</v-col>
		<v-col cols="12">
			<v-btn block rounded color="primary">
				Ingresar
			</v-btn>
		</v-col>
		<v-col cols="12" class="text-center">
			<google-btn />
		</v-col>
	</v-row>
</template>

<script>
export default {
	components: {
		GoogleBtn: () => import('@/components/auth/GoogleBtn'),
	},
};
</script>
