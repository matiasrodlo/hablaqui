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
				<v-text-field
					v-model="formData.rut"
					dense
					label="Rut"
					outlined
					class="my-3"
					:error-messages="rutErrors"
				></v-text-field>
				<v-text-field
					v-model="formData.email"
					dense
					:error-messages="emailErrors"
					label="Correo"
					outlined
					class="my-3"
					type="email"
				></v-text-field>
				<v-text-field
					v-model="formData.phone"
					dense
					:error-messages="phoneErrors"
					label="Telefono"
					outlined
					class="my-3"
					type="text"
				></v-text-field>
				<v-text-field
					v-model="formData.password"
					dense
					:error-messages="passwordErrors"
					label="Contraseña"
					type="password"
					outlined
					class="my-3"
				></v-text-field>
				<v-checkbox v-model="terminos">
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
			</v-card-text>
			<v-card-actions>
				<v-btn color="primary" class="rounded-xl mx-auto px-10"> Regístrate ahora </v-btn>
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
			formData: { rut: '', email: '', phone: '', password: '' },
			terminos: false,
			dialog: false,
			loading: false,
		};
	},
	computed: {
		rutErrors() {
			const errors = [];
			if (!this.$v.formData.rut.$dirty) return errors;
			!this.$v.formData.rut.required && errors.push('El Correo rut es querido');
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
			!this.$v.formData.email.required && errors.push('El telefono es querido');
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
			if (!this.$v.$invalid && !this.terminos) {
				return (this.dialog = true);
			}
			if (!this.$v.$invalid && this.accept) {
				this.loading = true;
				await this.registerPsychologist(this.formData);
				this.loading = false;
				this.formData = { rut: '', email: '', phone: '', password: '' };
				this.$v.$reset();
			}
		},
		...mapActions({
			registerPsychologist: 'Psychologist/registerPsychologist',
		}),
	},
	validations: {
		formData: {
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
