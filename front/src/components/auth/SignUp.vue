<template>
	<v-row no-gutters>
		<v-col cols="12" class="text-center title primary--text text-uppercase">
			Registrate
		</v-col>
		<v-col cols="12">
			<v-text-field label="Correo electronico" type="text"></v-text-field>
		</v-col>
		<v-col cols="12">
			<v-text-field label="Contraseña" type="password"></v-text-field>
		</v-col>
		<v-col cols="12">
			<v-text-field label="Repite contraseña" type="password"></v-text-field>
		</v-col>
		<v-col cols="12">
			<v-btn block rounded color="primary">
				Registrar
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
export default {};
</script>
