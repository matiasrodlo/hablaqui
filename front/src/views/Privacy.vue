<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col
				cols="12"
				class="text--secondary font-weight-bold text-h5 text-md-h4 text-lg-h3 text-center"
			>
				Política de privacidad
			</v-col>
			<v-col cols="12" md="10" v-for="el in [1, 2, 3, 4]" :key="el">
				<strong>Lorem ipsum dolor sit amet, consectetuer adipiscing elit,</strong> sed diam
				nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut
				wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis
				nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in
				hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat
				nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit
				praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem
				ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod
				tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim
				veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex
				ea commodo consequat.
			</v-col>
			<v-col cols="5" class="text-left">
				<div style="color:#BDBDBD">
					Aviso de privacidad Términos y Condiciones
				</div>
				<div class="text--secondary">
					© 2019 Terapify Network, S.A.P.I. de C.V. Todos los derechos reservados.
				</div>
			</v-col>
			<v-col cols="5" class="text-right text--secondary">
				<v-chip color="primary" label class="mx-2 px-4"></v-chip>
				<v-chip color="primary" label class="mx-2 px-4"></v-chip>
				<v-chip color="primary" label class="ml-2 px-4"></v-chip>
				<div>Atención a clientes: clientes@hablaqui.com</div>
				<div>Soporte técnico: soporte@hablaaqui.com</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {};
</script>
