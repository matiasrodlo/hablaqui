<template>
	<v-img :src="$vuetify.breakpoint.smAndUp ? '../assets/login.png' : null">
		<v-container fluid class="login-image">
			<v-row justify="center" align="center">
				<v-col cols="12" sm="6">
					<v-row justify="center">
						<v-col cols="6" sm="3" class="text-center">
							<v-img max-width="200" src="../assets/habla-aqui.png"></v-img>
						</v-col>
						<v-col cols="12" class="text-center text-h6 text-sm-h4 font-weight-bold">
							¡Me alegra que estés aquí!
						</v-col>
						<v-col cols="12" sm="10" md="8" class="text-center text-h5 text--secondary">
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
							nonummy nibh euismod
						</v-col>
					</v-row>
					<v-row justify="center" class="text-center">
						<v-col cols="12" sm="10" md="8">
							<v-window v-model="step">
								<v-window-item :value="1"><sign-in /></v-window-item>
								<v-window-item :value="2"><sign-up /></v-window-item>
							</v-window>
							<div class="mt-4 mb-2 text--secondary subtitle-1 font-weight-bold">
								<small v-if="step == 1">
									¿No eres parte de Hablaquí?
								</small>
								<small v-else>¿Ya tienes cuenta Hablaquí?</small>
							</div>
							<v-btn outlined block rounded color="primary" @click="setStep">
								{{ step == 1 ? 'Crea una cuenta' : 'Entra' }}
							</v-btn>
						</v-col>
					</v-row>
				</v-col>
				<v-col
					v-if="$vuetify.breakpoint.smAndUp"
					cols="12"
					sm="6"
					class="login-circle-image"
				>
					<v-row justify="center">
						<v-col cols="8" md="7" class="text-center">
							<v-list-item-avatar
								size="200"
								class="ml-4 "
								style="border: 10px solid white"
							>
								<v-btn
									color="#9D9D9C"
									class="login-plus-image elevation-0"
									fab
									width="200"
									height="200"
								></v-btn>
							</v-list-item-avatar>
						</v-col>
					</v-row>
					<v-row justify="center" class="text-center white--text">
						<v-col cols="6">
							Lorem ipsum dolor sit amet consectetur, fuga incidunt distinctio
							laudantium impedit voluptate.
						</v-col>
					</v-row>
					<v-row justify="center" class="text-center white--text">
						<v-col cols="6">
							<v-list-item-avatar
								size="10"
								class="ma-2"
								style="border: 10px solid white"
							>
							</v-list-item-avatar>
							<v-list-item-avatar
								size="10"
								class="ma-2"
								style="border: 10px solid white"
							>
							</v-list-item-avatar>
							<v-list-item-avatar
								size="10"
								class="ma-2"
								style="border: 10px solid white"
							>
							</v-list-item-avatar>
							<v-list-item-avatar
								size="10"
								class="ma-2"
								style="border: 10px solid white"
							>
							</v-list-item-avatar>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
	</v-img>
</template>

<script>
export default {
	components: {
		SignIn: () => import('@/components/auth/SignIn'),
		SignUp: () => import('@/components/auth/SignUp'),
	},
	data() {
		return {
			menu: false,
			step: 1,
		};
	},
	methods: {
		setStep() {
			if (this.step == 1) this.step = 2;
			else this.step = 1;
		},
	},
};
</script>

<style lang="scss" scoped>
.login-circle-image {
	background: url('../assets/circle-login.png') no-repeat;
	background-position-y: 90%;
	background-position-x: 70%;
	-webkit-background-size: 30%;
	-moz-background-size: 30%;
	-o-background-size: 30%;
	background-size: 30%;
}
.login-plus-image {
	background: url('../assets/plus-login.png') no-repeat;
	background-position-x: 60%;
	-webkit-background-size: 20%;
	-moz-background-size: 20%;
	-o-background-size: 20%;
	background-size: 20%;
}
</style>
