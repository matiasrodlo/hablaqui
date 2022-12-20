<template>
	<v-form @submit.prevent="onSubmit">
		<v-row no-gutters>
			<v-col cols="6">
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
			<v-col cols="6">
				<v-text-field
					v-model="form.lastName"
					type="text"
					label="Apellido"
					outlined
					dense
					autocomplete="off"
					:error-messages="lastnameErrors"
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
			<v-col cols="12">
				<v-text-field
					v-model="form.phone"
					label="Teléfono"
					type="text"
					dense
					outlined
					:error-messages="phoneErrors"
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
					:append-icon="showPassword ? mdiEye : mdiEyeOff"
					:error-messages="passwordErrors"
					@click:append="showPassword = !showPassword"
				></v-text-field>
			</v-col>
			<v-col cols="12" class="d-flex align-center">
				<v-checkbox v-model="accept" class="d-inline-block"></v-checkbox>
				<span class="body-2 text-left" style="max-width: 300px">
					<span class="text--secondary">He leído y acepto los</span>
					<nuxt-link
						style="text-decoration: none"
						:to="{ name: 'condiciones' }"
						target="_blank"
					>
						Términos y condiciones
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
import { required, email, minLength, maxLength, helpers } from 'vuelidate/lib/validators';
import { mapMutations } from 'vuex';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';
const mustBePhone = helpers.regex('mustBePhone', /^\+?[0-9]*$/);

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
			mdiEye,
			mdiEyeOff,
			form: null,
			loading: false,
			showPassword: false,
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
		lastnameErrors() {
			const errors = [];
			if (!this.$v.form.lastName.$dirty) return errors;
			!this.$v.form.lastName.required && errors.push('El apellido es querido');
			!this.$v.form.lastName.maxLength && errors.push('Maximo 90 caracteres');
			!this.$v.form.lastName.minLength && errors.push('Minimo 3 caracteres');
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
		phoneErrors() {
			const errors = [];
			if (!this.$v.form.phone.$dirty) return errors;
			!this.$v.form.phone.required && errors.push('El celular es requerido');
			!this.$v.form.phone.mustBePhone && errors.push('Escriba un número válido');
			return errors;
		},
	},
	created() {
		this.defaultForm();
	},
	methods: {
		defaultForm() {
			this.form = {
				name: '',
				lastName: '',
				email: '',
				role: 'user',
				password: '',
				inviteCode: '',
				phone: '',
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
					const response = await this.$auth.loginWith('local', {
						data: { email: this.form.email, password: this.form.password },
					});
					this.$auth.setUser(response.data.user);
					if (this.$auth.$state.loggedIn) {
						if (this.$route.query.from === 'psy') {
							this.datalayer(this.$auth.$state.user, 'registro-match');
							return this.$router.push({ name: 'evaluacion' });
						}
						if (
							response.data.user.role === 'specialist' &&
							this.$auth.$state.user.psychologist
						) {
							return this.$router.push({ name: 'dashboard-chat' });
						}
						if (
							response.data.user.role === 'specialist' &&
							!this.$auth.$state.user.psychologist
						) {
							return this.$router.push({ name: 'postulacion' });
						}
						if (response.data.user.role === 'superuser')
							return this.$router.push({ name: 'dashboard-panel' });
						if (response.data.user.role === 'user') {
							// redirecionamos de nuevo a pagos luego de ingresar
							if (
								this.$route.query.date &&
								this.$route.query.start &&
								this.$route.query.end
							) {
								this.datalayer(this.$auth.$state.user, 'registro-pago');
								return this.$router.push(
									`/psicologos/pagos/?username=${this.$route.query.psychologist}&date=${this.$route.query.date}&start=${this.$route.query.start}&end=${this.$route.query.end}`
								);
							}
							// redirecionamos de nuevo a chat luego de ingresar
							if (this.$route.query.psychologist) {
								return this.$router.push(
									`/${this.$route.query.psychologist}/?chat=true`
								);
							}
							this.datalayer(this.$auth.$state.user, 'registro-natural');
							return this.$router.push({ name: 'dashboard-chat' });
						}
					}
				} catch (error) {
					this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
				} finally {
					this.loading = false;
				}
			}
		},
		datalayer(user, type) {
			const data = {
				'user-id': user._id,
				role: user.role,
				email: user.email,
				type,
				event: 'checkout',
			};
			window.dataLayer.push(data);
		},
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
			lastName: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(99),
			},
			email: {
				required,
				email,
			},
			phone: {
				required,
				mustBePhone,
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
