<template>
	<v-form @submit.prevent="onSubmit">
		<v-row no-gutters>
			<v-col cols="12">
				<v-text-field
					v-model="form.name"
					type="text"
					label="Nombre"
					outlined
					dense
					autocomplete="off"
					:error-messages="nameErrors"
				></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-text-field
					v-model="form.email"
					label="Correo electronico"
					type="email"
					dense
					outlined
					:error-messages="emailErrors"
				></v-text-field>
			</v-col>
			<!-- <v-col cols="12">
				<v-text-field
					v-model="form.inviteCode"
					autocomplete="off"
					label="Código de Invitación(opcional)"
					type="text"
					dense
					outlined
				></v-text-field>
			</v-col> -->
			<v-col cols="12">
				<v-text-field
					v-model="form.password"
					label="Contraseña"
					outlined
					dense
					:type="showPassword ? 'text' : 'password'"
					:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
					:error-messages="passwordErrors"
					@click:append="showPassword = !showPassword"
				></v-text-field>
			</v-col>
			<!-- <v-col cols="12">
				<v-text-field
					v-model="form.repeatPassword"
					label="Repite contraseña"
					outlined
					dense
					:error-messages="repeatPasswordErrors"
					:type="showRepeatPassword ? 'text' : 'password'"
					:append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
					@click:append="showRepeatPassword = !showRepeatPassword"
				></v-text-field>
			</v-col> -->
			<v-col cols="12" class="d-flex align-center">
				<v-checkbox v-model="accept" class="d-inline-block"></v-checkbox>
				<span class="body-2 text-left" style="max-width: 300px">
					<span class="text--secondary">He leído y acepto los</span>
					<nuxt-link style="text-decoration: none" :to="{ name: 'condiciones' }">
						Términos y condiciones
					</nuxt-link>
					<span class="primary--text">y</span>
					<nuxt-link style="text-decoration: none" :to="{ name: 'politicas' }">
						la Política de privacidad.
					</nuxt-link>
				</span>
			</v-col>
			<v-col cols="12">
				<v-btn :loading="loading" type="submit" block rounded color="primary">
					Registrar
				</v-btn>
			</v-col>
		</v-row>
		<v-dialog v-model="dialog" width="300">
			<v-sheet style="width: 300px; height: 100px">
				<v-alert dense outlined type="error" width="300" height="100">
					Debes aceptar los
					<strong>terminos y condiciones</strong>
					<span class="primary--text">y</span>
					<strong>politicas de privacidad</strong>
				</v-alert>
			</v-sheet>
		</v-dialog>
	</v-form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators';
import { mapActions, mapMutations } from 'vuex';

export default {
	name: 'SignUp',
	mixins: [validationMixin],
	props: {
		isDialog: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			form: null,
			loading: false,
			showPassword: false,
			// showRepeatPassword: false,
			accept: false,
			dialog: false,
		};
	},
	computed: {
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
		// repeatPasswordErrors() {
		// 	const errors = [];
		// 	if (!this.$v.form.password.$dirty) return errors;
		// 	!this.$v.form.repeatPassword.required && errors.push('Repetir contraseña es querido');
		// 	!this.$v.form.repeatPassword.sameAsPassword &&
		// 		errors.push('Las contraseñas deben ser iguales');
		// 	return errors;
		// },
	},
	created() {
		this.defaultForm();
	},
	methods: {
		defaultForm() {
			this.form = {
				name: '',
				email: '',
				password: '',
				inviteCode: '',
			};
		},
		async onSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid && !this.accept) {
				return (this.dialog = true);
			}
			if (!this.$v.$invalid && this.accept) {
				try {
					this.loading = true;
					await this.$axios('/auth/register', {
						method: 'post',
						data: this.form,
					});
					await this.$auth.loginWith('local', {
						data: { email: this.form.email, password: this.form.password },
					});
					if (this.$auth.$state.loggedIn)
						if (this.$route.query.from === 'psy')
							this.$router.push({ name: 'evaluacion' });
						else if (
							this.$route.name !== 'psicologos' &&
							this.$route.name !== 'psicologos-id'
						)
							this.$router.push({ name: 'dashboard-chat' });
						else if (this.isDialog) this.setResumeView(true);
				} catch (error) {
					this.snackBar({ content: error.message, color: 'error' });
				} finally {
					this.loading = false;
				}
			}
		},
		...mapActions({ register: 'User/register' }),
		...mapMutations({
			setResumeView: 'Psychologist/setResumeView',
			snackBar: 'Snackbar/showMessage',
		}),
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
			// repeatPassword: {
			// 	required,
			// 	sameAsPassword: sameAs('password'),
			// },
		},
	},
};
</script>
