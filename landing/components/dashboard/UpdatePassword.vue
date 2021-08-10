<template>
	<v-row>
		<v-col cols="12" class="text-h6 py-0" style="color: #3c3c3b"> Contraseña </v-col>
		<v-col cols="6">
			<v-text-field
				v-model="formPassword.oldPassword"
				filled
				outlined
				dense
				:error-messages="oldPasswordErrors"
				label="Contraseña actual"
				type="password"
			></v-text-field>
		</v-col>
		<v-col cols="6">
			<v-text-field
				v-model="formPassword.newPassword"
				filled
				outlined
				dense
				:error-messages="newPasswordErrors"
				label="Nueva Contraseña"
				type="password"
			></v-text-field>
		</v-col>
		<v-col cols="6">
			<v-text-field
				v-model="formPassword.repeatNewPassword"
				filled
				outlined
				dense
				:error-messages="repeatNewPasswordErrors"
				label="Repite la nueva contraseña"
				type="password"
			></v-text-field>
		</v-col>
		<v-col cols="12" class="text-center">
			<v-btn
				:loading="loadingPassword"
				:disabled="$v.$invalid"
				color="primary"
				depressed
				class="px-16"
				style="border-radius: 10px"
				@click="updatePass"
			>
				Actualizar nueva contraseña
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
	mixins: [validationMixin],
	data() {
		return {
			formPassword: {
				newPassword: '',
				repeatNewPassword: '',
				oldPassword: '',
			},
			loadingPassword: false,
		};
	},
	computed: {
		oldPasswordErrors() {
			const errors = [];
			if (!this.$v.formPassword.oldPassword.$dirty) return errors;
			!this.$v.formPassword.oldPassword.required &&
				errors.push('Actual contraseña es querida');
			return errors;
		},
		newPasswordErrors() {
			const errors = [];
			if (!this.$v.formPassword.newPassword.$dirty) return errors;
			!this.$v.formPassword.newPassword.required && errors.push('La contraseña es querida');
			!this.$v.formPassword.newPassword.minLength && errors.push('Minimo 6 caracteres');
			!this.$v.formPassword.newPassword.maxLength && errors.push('Maximo 99 caracteres');
			return errors;
		},
		repeatNewPasswordErrors() {
			const errors = [];
			if (!this.$v.formPassword.repeatNewPassword.$dirty) return errors;
			!this.$v.formPassword.repeatNewPassword.required &&
				errors.push('Repetir contraseña es querido');
			!this.$v.formPassword.repeatNewPassword.sameAsPassword &&
				errors.push('Las contraseñas deben ser iguales');
			return errors;
		},
	},
	methods: {
		async updatePass() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loadingPassword = true;
				await this.upatePassword(this.formPassword);
				this.formPassword = {
					newPassword: '',
					repeatNewPassword: '',
					oldPassword: '',
				};
				this.$v.$reset();
				this.loadingPassword = false;
			}
		},
		...mapActions({ upatePassword: 'User/upatePassword' }),
	},
	validations: {
		formPassword: {
			oldPassword: { required },
			newPassword: {
				required,
				minLength: minLength(6),
				maxLength: maxLength(99),
			},
			repeatNewPassword: {
				required,
				sameAsPassword: sameAs('newPassword'),
			},
		},
	},
};
</script>
