<template>
	<v-container>
		<v-row align="center" justify="center" style="height: 90vh;">
			<v-col cols="12" sm="8" md="4" lg="3">
				<h3 class="title my-4">Restaurar contraseña</h3>
				<!-- password -->
				<v-text-field
					id="password-input"
					v-model.trim="$v.formData.newPassword.$model"
					type="password"
					dense
					outlined
					filled
					label="Nueva contraseña"
					prepend-icon="mdi-lock"
					:error-messages="newPasswordErrors"
					@input="$v.formData.newPassword.$touch()"
					@blur="$v.formData.newPassword.$touch()"
				></v-text-field>
				<!-- repet password -->
				<v-text-field
					id="email-input"
					v-model.trim="$v.formData.repeatedPassword.$model"
					type="password"
					dense
					outlined
					filled
					prepend-icon="mdi-lock"
					label="Repita la contraseña"
					:error-messages="repetPasswordErrors"
					@input="$v.formData.repeatedPassword.$touch()"
					@blur="$v.formData.repeatedPassword.$touch()"
				></v-text-field>
				<!-- submit -->
				<v-btn
					:loading="loading"
					rounded
					block
					color="primary"
					class="mt-2"
					type="submit"
					variant="primary"
					@click="onSubmit"
				>
					Actualizar
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import axios from 'axios';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';
import { mapActions, mapMutations } from 'vuex';
import { api as baseURL } from '@/config/index.js';
import { generateSnackBarError } from '@/utils/snackbar';
import { logout } from '@/plugins/auth';

export default {
	name: 'PasswordReset',
	mixins: [validationMixin],
	data() {
		return {
			loading: false,
			formData: {
				newPassword: '',
				repeatedPassword: '',
			},
			temporalJwt: '',
		};
	},
	computed: {
		newPasswordErrors() {
			const errors = [];
			if (!this.$v.formData.newPassword.$dirty) return errors;
			!this.$v.formData.newPassword.required && errors.push('Campo querido');
			!this.$v.formData.newPassword.maxLength && errors.push('Maximo 100 caracteres');
			!this.$v.formData.newPassword.minLength && errors.push('Minimo 5 caracteres');
			return errors;
		},
		repetPasswordErrors() {
			const errors = [];
			if (!this.$v.formData.repeatedPassword.$dirty) return errors;
			!this.$v.formData.repeatedPassword.required && errors.push('Campo querido');
			!this.$v.formData.repeatedPassword.sameAsPassword &&
				errors.push('Las contraseñas no son iguales');
			return errors;
		},
	},
	validations: {
		formData: {
			newPassword: {
				required,
				minLength: minLength(5),
				maxLength: maxLength(100),
			},
			repeatedPassword: {
				required,
				sameAsPassword: sameAs('newPassword'),
			},
		},
	},
	created() {
		this.temporalJwt = this.$route.query.token;
		this.deleteQueryFromRoute();
	},
	methods: {
		async onSubmit() {
			try {
				this.$v.$touch();
				if (!this.$v.$invalid) {
					this.loading = !this.loading;
					await axios(`${baseURL}/user/password`, {
						method: 'patch',
						data: { password: this.formData.newPassword },
						headers: {
							Authorization: `Bearer ${this.temporalJwt}`,
						},
					});
					await logout();
					this.loading = !this.loading;
					this.$router.replace({ name: 'auth', path: '/auth' });
				}
			} catch (e) {
				this.snackbar(generateSnackBarError(e));
			} finally {
				this.loading = !this.loading;
			}
		},
		deleteQueryFromRoute() {
			this.$router.replace({ query: null });
		},
		...mapActions({
			updatePassword: 'User/updatePassword',
		}),
		...mapMutations({ snackbar: 'Snackbar/showMessage' }),
	},
};
</script>
