<template>
	<v-form>
		<v-card flat class="rounded-lg">
			<v-card-title>
				<h3 class="primary--text font-weight-bold text-h4">Únete a la red</h3>
			</v-card-title>
			<v-card-text>
				<h3 class="text--disabled body-1">
					En solo unos pasos puedes unirte. Comienza creando tu cuenta.
				</h3>
			</v-card-text>
			<v-card-text>
				<v-row no-gutters>
					<v-col cols="6">
						<v-text-field
							v-model.trim="formData.name"
							dense
							label="Nombre"
							outlined
							:error-messages="nameErrors"
							class="mx-2"
						></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-text-field
							v-model.trim="formData.lastName"
							dense
							label="Apellido"
							outlined
							:error-messages="lastNameErrors"
							class="mx-2"
						></v-text-field>
					</v-col>
					<v-col cols="6"
						><v-text-field
							v-model="formData.rut"
							dense
							label="Rut"
							outlined
							:error-messages="rutErrors"
							class="mx-2"
						></v-text-field
					></v-col>
					<v-col cols="6">
						<v-text-field
							v-model="formData.email"
							dense
							:error-messages="emailErrors"
							class="mx-2"
							label="Correo"
							outlined
							type="email"
						></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-text-field
							v-model="formData.phone"
							dense
							:error-messages="phoneErrors"
							class="mx-2"
							label="Telefono"
							outlined
							type="text"
						></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-text-field
							v-model.trim="formData.username"
							dense
							:error-messages="usernameErrors"
							class="mx-2"
							label="username"
							outlined
							type="text"
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
						></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-checkbox v-model="terminos" class="mx-2">
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
			<v-card-actions>
				<v-btn color="primary" class="rounded-xl mx-auto px-10" @click="onSubmit">
					Regístrate ahora
				</v-btn>
			</v-card-actions>
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
		<v-dialog v-model="check" width="300">
			<v-sheet style="width: 300px; height: 50px">
				<v-alert dense outlined type="error" width="300" height="50">
					Username invalido
				</v-alert>
			</v-sheet>
		</v-dialog>
	</v-form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
	mixins: [validationMixin],
	data() {
		return {
			check: false,
			formData: {
				name: '',
				lastName: '',
				rut: '',
				username: '',
				email: '',
				phone: '',
				password: '',
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
		usernameErrors() {
			const errors = [];
			if (!this.$v.formData.username.$dirty) return errors;
			!this.$v.formData.username.required && errors.push('El username es querido');
			!this.$v.formData.username.minLength && errors.push('Minimo 6 caracteres');
			!this.$v.formData.username.maxLength && errors.push('Maximo 30 caracteres');
			return errors;
		},
		rutErrors() {
			const errors = [];
			if (!this.$v.formData.rut.$dirty) return errors;
			!this.$v.formData.rut.required && errors.push('El rut es querido');
			return errors;
		},
		phoneErrors() {
			const errors = [];
			if (!this.$v.formData.phone.$dirty) return errors;
			!this.$v.formData.phone.required && errors.push('El telefono es querido');
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
				// verificamos si el username es valido
				const available = await this.checkUsername(this.formData.username);
				if (!available) return (this.check = true);
				// procedemos a guardar
				this.loading = true;
				await this.registerPsychologist(this.formData);
				this.loading = false;
				this.formData = {
					name: '',
					lastName: '',
					rut: '',
					username: '',
					email: '',
					phone: '',
					password: '',
				};
				this.$v.$reset();
			}
		},
		...mapActions({
			registerPsychologist: 'Psychologist/registerPsychologist',
			checkUsername: 'Psychologist/checkUsername',
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
			username: {
				required,
				minLength: minLength(6),
				maxLength: maxLength(30),
			},
			rut: {
				required,
			},
			email: {
				required,
				email,
			},
			phone: {
				required,
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
