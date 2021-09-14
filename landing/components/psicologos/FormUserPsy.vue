<template>
	<v-form>
		<v-card flat class="rounded-lg">
			<v-card-title class="mx-2">
				<h3 class="primary--text font-weight-bold text-h4">Únete a la red</h3>
			</v-card-title>
			<v-card-text class="py-0 mx-2">
				<h3 class="text--disabled body-1">
					En solo unos pasos puedes unirte. Comienza creando tu cuenta.
				</h3>
			</v-card-text>
			<v-card-text>
				<v-row no-gutters>
					<v-col cols="12" md="6">
						<v-text-field
							v-model.trim="formData.name"
							dense
							label="Nombre"
							outlined
							:error-messages="nameErrors"
							class="mx-2"
						></v-text-field>
					</v-col>
					<v-col cols="12" md="6">
						<v-text-field
							v-model.trim="formData.lastName"
							dense
							label="Apellido"
							outlined
							:error-messages="lastNameErrors"
							class="mx-2"
						></v-text-field>
					</v-col>
					<v-col cols="12" md="6">
						<v-text-field
							v-model="formData.rut"
							dense
							label="Rut"
							outlined
							:error-messages="rutErrors"
							class="mx-2"
						></v-text-field
					></v-col>
					<v-col cols="12" md="6">
						<v-text-field
							v-model="formData.email"
							dense
							:error-messages="emailErrors"
							class="mx-2"
							label="Correo"
							outlined
							type="email"
							autocomplete="off"
						></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field
							v-model="formData.password"
							dense
							:error-messages="passwordErrors"
							class="mx-2"
							label="Contraseña"
							type="password"
							outlined
							autocomplete="off"
						></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-checkbox v-model="terminos" hide-details class="mx-2 my-0">
							<template #label>
								<div class="caption">
									He leído y
									<nuxt-link to="condiciones" style="text-decoration: none">
										acepto los Términos y condiciones </nuxt-link
									>y
									<nuxt-link to="politicas" style="text-decoration: none">
										la Política de privacidad.
									</nuxt-link>
								</div>
							</template>
						</v-checkbox>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-text class="text-center">
				<v-btn
					:loading="loading"
					color="primary"
					class="rounded-xl mx-auto px-10"
					@click="onSubmit"
				>
					Regístrate ahora
				</v-btn>
			</v-card-text>
		</v-card>
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
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';

export default {
	mixins: [validationMixin],
	data() {
		return {
			formData: {
				name: '',
				lastName: '',
				rut: '',
				email: '',
				password: '',
				role: 'psychologist',
			},
			terminos: false,
			dialog: false,
			loading: false,
		};
	},
	computed: {
		nameErrors() {
			const errors = [];
			if (!this.$v.formData.name.$dirty) return errors;
			!this.$v.formData.name.required && errors.push('El nombre es querido');
			return errors;
		},
		lastNameErrors() {
			const errors = [];
			if (!this.$v.formData.lastName.$dirty) return errors;
			!this.$v.formData.lastName.required && errors.push('El apellido es querido');
			return errors;
		},
		rutErrors() {
			const errors = [];
			if (!this.$v.formData.rut.$dirty) return errors;
			!this.$v.formData.rut.required && errors.push('El rut es querido');
			return errors;
		},
		emailErrors() {
			const errors = [];
			if (!this.$v.formData.email.$dirty) return errors;
			!this.$v.formData.email.required && errors.push('El correo electronico es querido');
			!this.$v.formData.email.email && errors.push('Inserte un correo valido');
			return errors;
		},
		passwordErrors() {
			const errors = [];
			if (!this.$v.formData.password.$dirty) return errors;
			!this.$v.formData.password.required && errors.push('La contraseña es querida');
			!this.$v.formData.password.minLength && errors.push('Minimo 6 caracteres');
			!this.$v.formData.password.maxLength && errors.push('Maximo 99 caracteres');
			return errors;
		},
	},
	methods: {
		async onSubmit() {
			this.$v.$touch();
			// validamos que acepte los terminos y condiciones
			if (!this.$v.$invalid && !this.terminos) {
				return (this.dialog = true);
			}

			if (!this.$v.$invalid && this.terminos) {
				try {
					this.loading = true;
					// procedemos a guardar
					await this.$axios('/auth/register', {
						method: 'post',
						data: this.formData,
					});

					// iniciamos sesion
					const response = await this.$auth.loginWith('local', {
						data: { email: this.formData.email, password: this.formData.password },
					});
					this.$auth.setUser(response.data.user);

					// redireccionamos a postulacion como psicologo
					this.$router.push({ name: 'postulacion' });
				} catch (error) {
					this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
				} finally {
					this.loading = false;
				}
			}
		},
		...mapActions({
			register: 'User/register',
		}),
		...mapMutations({
			setResumeView: 'Psychologist/setResumeView',
			snackBar: 'Snackbar/showMessage',
		}),
	},
	validations: {
		formData: {
			name: {
				required,
			},
			lastName: {
				required,
			},
			rut: {
				required,
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
		},
	},
};
</script>

<style lang="scss" scoped></style>
