<template>
	<v-card max-width="300">
		<v-card-text>
			<v-window v-model="step">
				<v-window-item :value="1"><sign-in /></v-window-item>
				<v-window-item :value="2"><sign-up /></v-window-item>
			</v-window>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<small v-if="step == 1">¿No tienes una cuenta?</small>
			<small v-else>¿Tienes cuenta?</small>
			<v-btn text rounded color="primary" @click="setStep" small>
				{{ step == 1 ? 'Registrate' : 'Ingresa' }}
			</v-btn>
			<v-spacer></v-spacer>
		</v-card-actions>
		<v-card-actions>
			<v-spacer></v-spacer>
			<small>¿Olvidaste tu contraseña?</small>
			<v-spacer></v-spacer>
		</v-card-actions>
	</v-card>
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
