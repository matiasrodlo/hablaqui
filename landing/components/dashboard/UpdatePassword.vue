<template>
	<v-row>
		<v-col cols="12" class="text-h6 py-0" style="color: #3c3c3b"> Contraseña </v-col>
		<v-col cols="12" md="6">
			<v-text-field
				v-model="formPassword.oldPassword"
				filled
				outlined
				dense
				:type="showCurrentPassword ? 'text' : 'password'"
				:append-icon="showCurrentPassword ? mdiEye : mdiEyeOff"
				:error-messages="oldPasswordErrors"
				label="Contraseña actual"
				@click:append="showCurrentPassword = !showCurrentPassword"
			></v-text-field>
		</v-col>
		<v-col cols="12" md="6">
			<v-text-field
				v-model="formPassword.newPassword"
				filled
				outlined
				dense
				:error-messages="newPasswordErrors"
				label="Nueva Contraseña"
				:type="showNewPassword ? 'text' : 'password'"
				:append-icon="showNewPassword ? mdiEye : mdiEyeOff"
				@click:append="showNewPassword = !showNewPassword"
			></v-text-field>
		</v-col>
		<v-col cols="12" md="6">
			<v-text-field
				v-model="formPassword.repeatNewPassword"
				filled
				outlined
				dense
				:error-messages="repeatNewPasswordErrors"
				label="Repetir Contraseña"
				:type="showNewRepeatPassword ? 'text' : 'password'"
				:append-icon="showNewRepeatPassword ? mdiEye : mdiEyeOff"
				@click:append="showNewRepeatPassword = !showNewRepeatPassword"
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
				Guardar
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import { mdiEye, mdiEyeOff } from '@mdi/js';
/**
 * componente que actualiza tu contraseña
 */
export default {
	mixins: [validationMixin],
	data() {
		return {
			mdiEyeOff,
			mdiEye,
			showCurrentPassword: false,
			showNewPassword: false,
			showNewRepeatPassword: false,
			formPassword: {
				newPassword: '',
				repeatNewPassword: '',
				oldPassword: '',
			},
			loadingPassword: false,
		};
	},
	computed: {
		/**
		 * antigua contraseña
		 */
		oldPasswordErrors() {
			const errors = [];
			if (!this.$v.formPassword.oldPassword.$dirty) return errors;
			!this.$v.formPassword.oldPassword.required &&
				errors.push('Actual contraseña es querida');
			return errors;
		},
		/**
		 * valida errores en la contraseña ingresada
		 */
		newPasswordErrors() {
			const errors = [];
			if (!this.$v.formPassword.newPassword.$dirty) return errors;
			!this.$v.formPassword.newPassword.required && errors.push('La contraseña es querida');
			!this.$v.formPassword.newPassword.minLength && errors.push('Minimo 6 caracteres');
			!this.$v.formPassword.newPassword.maxLength && errors.push('Maximo 99 caracteres');
			return errors;
		},
		/**
		 * verifica que la repeticion de contraseña sea valida
		 */
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
		/**
		 * Actualiza la conseña
		 */
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
	/**
	 * validaciones
	 */
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
