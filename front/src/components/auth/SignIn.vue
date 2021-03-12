<template>
	<div>
		<v-row no-gutters>
			<v-col cols="12">
				<v-text-field label="Correo electronico" type="text" outlined></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-text-field label="Contraseña" type="password" outlined></v-text-field>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-btn block rounded color="primary">
					Entra
				</v-btn>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {};
</script>
