/**
 * SignUp Component
 *
 * A registration form for new users, supporting email/password sign-up, validation, and error handling.
 *
 * Key Features:
 * - Email and password registration
 * - Form validation and error messages
 * - Loading state
 * - Responsive design
 *
 * Requirements:
 * - Vuetify v-form, v-text-field, v-btn
 * - Vuelidate for validation
 * - Vuex for actions
 *
 * @component
 * @example
 * <SignUp />
 */
<template>
	<v-form @submit.prevent="onSubmit">
		<v-row no-gutters>
			<!-- First name input field -->
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
			<!-- Last name input field -->
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
			<!-- Email input field -->
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
			<!-- Phone input field -->
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
			<!-- Password input field with visibility toggle -->
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
			<!-- Terms and conditions checkbox -->
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
			<!-- Submit button -->
			<v-col cols="12">
				<v-btn :loading="loading" type="submit" block rounded color="primary">
					Registrar
				</v-btn>
			</v-col>
		</v-row>
		<!-- Terms and conditions warning dialog -->
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

// Phone number validation regex
const mustBePhone = helpers.regex('mustBePhone', /^\+?[0-9]*$/);

/** * Componente para iniciar sesión */
export default {
	name: 'SignUp',
	mixins: [validationMixin],

	/**
	 * Component props
	 * @property {Boolean} isDialog - Whether the component is rendered in a dialog
	 */
	props: {
		isDialog: {
			type: Boolean,
			default: false,
			description: 'Whether the component is rendered in a dialog'
		},
	},

	/**
	 * Component data
	 * @returns {Object} Component data
	 * @property {Object} mdiEye - Material Design icon for visible password
	 * @property {Object} mdiEyeOff - Material Design icon for hidden password
	 * @property {Object} form - Form data object
	 * @property {Boolean} loading - Loading state for form submission
	 * @property {Boolean} showPassword - Controls password field visibility
	 * @property {Boolean} accept - Terms and conditions acceptance state
	 * @property {Boolean} dialog - Controls terms warning dialog visibility
	 */
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
		/**
		 * Validates email input and returns error messages
		 * @returns {Array} Array of error messages
		 */
		emailErrors() {
			const errors = [];
			if (!this.$v.form.email.$dirty) return errors;
			!this.$v.form.email.required && errors.push('El Correo electronico es requerido');
			!this.$v.form.email.email && errors.push('Escriba un email valido');
			return errors;
		},

		/**
		 * Validates first name input and returns error messages
		 * @returns {Array} Array of error messages
		 */
		nameErrors() {
			const errors = [];
			if (!this.$v.form.name.$dirty) return errors;
			!this.$v.form.name.required && errors.push('El nombre es requerido');
			!this.$v.form.name.maxLength && errors.push('Máximo 90 caracteres');
			!this.$v.form.name.minLength && errors.push('Mínimo 3 caracteres');
			return errors;
		},

		/**
		 * Validates last name input and returns error messages
		 * @returns {Array} Array of error messages
		 */
		lastnameErrors() {
			const errors = [];
			if (!this.$v.form.lastName.$dirty) return errors;
			!this.$v.form.lastName.required && errors.push('El apellido es requerido');
			!this.$v.form.lastName.maxLength && errors.push('Máximo 90 caracteres');
			!this.$v.form.lastName.minLength && errors.push('Mínimo 3 caracteres');
			return errors;
		},

		/**
		 * Validates password input and returns error messages
		 * @returns {Array} Array of error messages
		 */
		passwordErrors() {
			const errors = [];
			if (!this.$v.form.password.$dirty) return errors;
			!this.$v.form.password.required && errors.push('La contraseña es requerida');
			!this.$v.form.password.minLength && errors.push('Mínimo 6 caracteres');
			!this.$v.form.password.maxLength && errors.push('Máximo 99 caracteres');
			return errors;
		},

		/**
		 * Validates phone input and returns error messages
		 * @returns {Array} Array of error messages
		 */
		phoneErrors() {
			const errors = [];
			if (!this.$v.form.phone.$dirty) return errors;
			!this.$v.form.phone.required && errors.push('El celular es requerido');
			!this.$v.form.phone.mustBePhone && errors.push('Escriba un número válido');
			return errors;
		},
	},

	/**
	 * Lifecycle hook that initializes form data
	 */
	created() {
		this.defaultForm();
	},

	methods: {
		/**
		 * Initializes form data with default values
		 */
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

		/**
		 * Handles form submission for user registration
		 * Manages registration process, authentication, and role-based redirects
		 * @returns {Promise<void>}
		 */
		async onSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid && !this.accept) {
				return (this.dialog = true);
			}
			if (!this.$v.$invalid && this.accept) {
				try {
					this.loading = true;
					// Register user
					await this.$axios('/auth/register', {
						method: 'post',
						data: this.form,
					});
					// Login after registration
					const response = await this.$auth.loginWith('local', {
						data: { email: this.form.email, password: this.form.password },
					});
					this.$auth.setUser(response.data.user);
					
					if (this.$auth.$state.loggedIn) {
						// Handle special evaluation redirect
						if (this.$route.query.from === 'spec') {
							this.datalayer(this.$auth.$state.user, 'registro-match');
							return this.$router.push({ name: 'evaluacion' });
						}
						
						// Handle specialist role redirects
						if (response.data.user.role === 'specialist') {
							if (this.$auth.$state.user.specialist) {
								return this.$router.push({ name: 'dashboard-chat' });
							}
							return this.$router.push({ name: 'postulacion' });
						}
						
						// Handle superuser redirect
						if (response.data.user.role === 'superuser')
							return this.$router.push({ name: 'dashboard-panel' });
						
						// Handle regular user redirects
						if (response.data.user.role === 'user') {
							// Redirect to payment page if payment details are present
							if (
								this.$route.query.date &&
								this.$route.query.start &&
								this.$route.query.end
							) {
								return this.$router.push(
									`/especialistas/pagos/?username=${this.$route.query.specialist}&date=${this.$route.query.date}&start=${this.$route.query.start}&end=${this.$route.query.end}`
								);
							}
							// Redirect to chat if specialist is specified
							if (this.$route.query.specialist) {
								return this.$router.push(
									`/${this.$route.query.specialist}/?chat=true`
								);
							}
							return this.$router.push({ name: 'dashboard-chat' });
						}
					}
				} catch (error) {
					this.snackBar({
						content: evaluateErrorReturn(error),
						color: 'error',
					});
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
			snackBar: 'Snackbar/showMessage',
		}),
	},

	/**
	 * Form validation rules
	 */
	validations: {
		form: {
			name: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(90),
			},
			lastName: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(90),
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

<style scoped>
/* Component-specific styles */
</style>
