<template>
	<v-form @submit.prevent="onSubmit">
		<v-row no-gutters>
			<v-col cols="12">
				<v-text-field
					v-model="form.email"
					label="Correo electronico"
					type="email"
					outlined
				></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-text-field
					v-model="form.password"
					label="Contraseña"
					type="password"
					outlined
				></v-text-field>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-btn type="submit" block rounded color="primary">
					Entra
				</v-btn>
			</v-col>
		</v-row>
	</v-form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

export default {
	name: 'SignIn',
	mixins: [validationMixin],
	data() {
		return {
			form: null,
		};
	},
	created() {
		this.defaultData();
	},
	methods: {
		onSubmit() {
			console.log('submit...');
		},
		defaultData() {
			this.form = { email: '', password: '' };
		},
	},
	validations: {
		form: {
			email: {
				required,
				email,
			},
			password: {
				required,
			},
		},
	},
};
</script>
