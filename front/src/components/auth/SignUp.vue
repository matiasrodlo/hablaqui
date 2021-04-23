<template>
	<v-form @submit.prevent="onSubmit">
		<v-row no-gutters>
			<v-col cols="12">
				<v-text-field
					v-model="form.name"
					type="text"
					label="Nombre"
					outlined
					autocomplete="off"
					:error-messages="nameErrors"
				></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-text-field
					v-model="form.email"
					label="Correo electronico"
					type="email"
					outlined
					:error-messages="emailErrors"
				></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-text-field
					autocomplete="off"
					v-model="form.inviteCode"
					label="Códico de Invitación"
					type="text"
					outlined
				></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-text-field
					v-model="form.password"
					label="Contraseña"
					outlined
					:type="showPassword ? 'text' : 'password'"
					:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
					:error-messages="passwordErrors"
					@click:append="showPassword = !showPassword"
				></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-text-field
					v-model="form.repeatPassword"
					label="Repite contraseña"
					outlined
					:error-messages="repeatPasswordErrors"
					:type="showRepeatPassword ? 'text' : 'password'"
					:append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
					@click:append="showRepeatPassword = !showRepeatPassword"
				></v-text-field>
			</v-col>
			<v-col cols="12" class="d-flex align-center">
				<v-checkbox class="d-inline-block" v-model="accept"></v-checkbox>
				<span class="caption">
					He leído y acepto los
					<a :href="`${landingUrl}/condiciones`">
						Términos y condiciones
					</a>
					y
					<a :href="`${landingUrl}/politicas`">
						la Política de privacidad.
					</a>
				</span>
			</v-col>
			<v-col cols="12">
				<v-btn :loading="loading" type="submit" block rounded color="primary">
					Registrar
				</v-btn>
			</v-col>
		</v-row>
	</v-form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, sameAs, minLength, maxLength } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import { landing } from '@/config';

export default {
	name: 'SignUp',
	mixins: [validationMixin],
	data() {
		return {
			form: null,
			loading: false,
			showPassword: false,
			showRepeatPassword: false,
			accept: false,
		};
	},
	computed: {
		landingUrl() {
			return landing;
		},
		conditionsErrors() {
			const errors = [];
			if (!this.$v.form.accept.$dirty) return errors;
			!this.$v.form.accept.required &&
				errors.push('Debes aceptar los terminos y condiciones y politicas de privacidad');
			return errors;
		},
		emailErrors() {
			const errors = [];
			if (!this.$v.form.email.$dirty) return errors;
			!this.$v.form.email.required && errors.push('El Correo electronico es querido');
			!this.$v.form.email.email && errors.push('Escriba un email valido');
			return errors;
		},
		nameErrors() {
			const errors = [];
			if (!this.$v.form.name.$dirty) return errors;
			!this.$v.form.name.required && errors.push('El nombre es querido');
			!this.$v.form.name.maxLength && errors.push('Maximo 90 caracteres');
			!this.$v.form.name.minLength && errors.push('Minimo 3 caracteres');
			return errors;
		},
		passwordErrors() {
			const errors = [];
			if (!this.$v.form.password.$dirty) return errors;
			!this.$v.form.password.required && errors.push('La contraseña es querida');
			!this.$v.form.password.minLength && errors.push('Minimo 6 caracteres');
			!this.$v.form.password.maxLength && errors.push('Maximo 99 caracteres');
			return errors;
		},
		repeatPasswordErrors() {
			const errors = [];
			if (!this.$v.form.password.$dirty) return errors;
			!this.$v.form.repeatPassword.required && errors.push('Repetir contraseña es querido');
			!this.$v.form.repeatPassword.sameAsPassword &&
				errors.push('Las contraseñas deben ser iguales');
			return errors;
		},
	},
	created() {
		this.defaultForm();
	},
	methods: {
		defaultForm() {
			this.repeatPassword = '';
			this.form = {
				name: '',
				email: '',
				password: '',
				inviteCode: '',
			};
		},
		async onSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loading = true;
				await this.register(this.form);
				this.loading = false;
			}
		},
		...mapActions({ register: 'User/register' }),
	},
	validations: {
		form: {
			name: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(99),
			},
			email: {
				required,
				email,
			},
			password: {
				required,
				minLength: minLength(6),
				maxLength: maxLength(99),
			},
			repeatPassword: {
				required,
				sameAsPassword: sameAs('password'),
			},
			accept: {
				required,
			},
		},
	},
};
</script>
