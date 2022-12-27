<template>
	<v-form @submit.prevent="onSubmit">
		<v-row no-gutters>
			<!-- email -->
			<v-col cols="12">
				<v-text-field
					v-model="form.email"
					class="mt-2"
					label="Correo electronico"
					type="email"
					:dense="isDialog"
					outlined
					:error-messages="emailErrors"
				></v-text-field>
			</v-col>
			<!-- contraseña -->
			<v-col cols="12">
				<v-text-field
					v-model="form.password"
					label="Contraseña"
					outlined
					:dense="isDialog"
					:type="showPassword ? 'text' : 'password'"
					:append-icon="showPassword ? mdiEye : mdiEyeOff"
					:error-messages="passwordErrors"
					@click:append="showPassword = !showPassword"
				></v-text-field>
			</v-col>
			<!-- boton olvido contraseña -->
			<v-col cols="12" class="text-left">
				<v-btn
					text
					color="primary"
					class="px-0 body-2 font-weigth-medium"
					@click="setResetPassword"
					>¿Olvidó la contraseña?</v-btn
				>
			</v-col>
		</v-row>
		<!-- ingresar -->
		<v-row>
			<v-col cols="12">
				<v-btn :loading="loading" type="submit" block rounded color="primary">
					Entrar
				</v-btn>
			</v-col>
		</v-row>
	</v-form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import { mapMutations, mapActions } from 'vuex';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';
import { mdiEye, mdiEyeOff } from '@mdi/js';

/**
 * Componente para iniciar sesión
 */
export default {
	name: 'SignIn',
	mixins: [validationMixin],
	props: {
		isDialog: {
			type: Boolean,
			default: false,
		},
		setResetPassword: {
			type: Function,
			required: true,
		},
	},
	data() {
		return { mdiEye, mdiEyeOff, showPassword: false, form: null, loading: false };
	},
	computed: {
		/**
		 * Verifica que el email sea valido
		 * @returns array con los errores
		 */
		emailErrors() {
			const errors = [];
			if (!this.$v.form.email.$dirty) return errors;
			!this.$v.form.email.required && errors.push('Se requiere correo electrónico');
			!this.$v.form.email.email && errors.push('Escriba un correo electrónico valido');
			return errors;
		},
		/**
		 * Verifica que la contraseña sea valida
		 * @returns array con los errores
		 */
		passwordErrors() {
			const errors = [];
			if (!this.$v.form.password.$dirty) return errors;
			!this.$v.form.password.required && errors.push('Se requiere contraseña');
			return errors;
		},
	},
	created() {
		// establece los valores por defecto del formulacio
		this.defaultData();
	},
	methods: {
		/**
		 * Metodo para iniciar sesion
		 */
		async onSubmit() {
			// verificamos validacion
			const temporalMatchMaking = JSON.parse(localStorage.getItem('temporalMatchMaking'));
			this.$v.$touch();
			if (!this.$v.$invalid) {
				try {
					// activamos el loader
					this.loading = true;
					// iniciamos sesion y obtenemos en la respuesta el user
					const response = await this.$auth.loginWith('local', { data: this.form });
					// establecemos el user en el store y localstorage
					this.$auth.setUser(response.data.user);
					// verificamos una vez más si esta logeado
					if (this.$auth.$state.loggedIn) {
						if (temporalMatchMaking) {
							temporalMatchMaking.userId = this.$auth.user._id;
							await this.createMatchMakig(temporalMatchMaking);
							localStorage.removeItem('temporalMatchMaking');
							return this.$router.push('/psicologos');
						}
						// si llegamos al login con un query from=psy
						if (this.$route.query.from === 'psy')
							return this.$router.push({ name: 'evaluacion' });
						// si es role psicologo y esta aprobado
						if (
							response.data.user.role === 'psychologist' &&
							this.$auth.$state.user.psychologist
						) {
							return this.$router.push({ name: 'dashboard-chat' });
						}
						// si es role psicologo y no esta aprobado
						if (
							response.data.user.role === 'psychologist' &&
							!this.$auth.$state.user.psychologist
						) {
							return this.$router.push({ name: 'postulacion' });
						}
						// si es un superuser enviamos al panel
						if (response.data.user.role === 'superuser')
							return this.$router.push({ name: 'dashboard-panel' });
						// si es un usuario
						if (response.data.user.role === 'user') {
							// redirecionamos de nuevo a pagos luego de ingresar
							if (
								this.$route.query.date &&
								this.$route.query.start &&
								this.$route.query.end
							) {
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
							return this.$router.push({ name: 'dashboard-chat' });
						}
					}
				} catch (error) {
					if (error.response.status === 401) {
						alert('Correo o contraseña invalida');
					} else {
						// muestra mensaje de error
						this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
					}
				} finally {
					// desactivamos el loader
					this.loading = false;
				}
			}
		},
		defaultData() {
			this.form = { email: '', password: '' };
		},
		...mapActions({
			createMatchMakig: 'Psychologist/createMatchMakig',
		}),
		...mapMutations({
			setResumeView: 'Psychologist/setResumeView',
			snackBar: 'Snackbar/showMessage',
		}),
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
