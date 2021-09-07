<template>
	<v-form @submit.prevent="onSubmit">
		<v-row no-gutters>
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
			<v-col cols="12">
				<v-text-field
					v-model="form.password"
					label="Contraseña"
					outlined
					:dense="isDialog"
					:type="showPassword ? 'text' : 'password'"
					:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
					:error-messages="passwordErrors"
					@click:append="showPassword = !showPassword"
				></v-text-field>
			</v-col>
			<v-col cols="12" class="text-left primary--text"> ¿Olvidó la contraseña? </v-col>
		</v-row>
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
import { mapMutations } from 'vuex';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';

export default {
	name: 'SignIn',
	mixins: [validationMixin],
	props: {
		isDialog: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			showPassword: false,
			form: null,
			loading: false,
		};
	},
	computed: {
		emailErrors() {
			const errors = [];
			if (!this.$v.form.email.$dirty) return errors;
			!this.$v.form.email.required && errors.push('Se requiere correo electrónico');
			!this.$v.form.email.email && errors.push('Escriba un correo electrónico valido');
			return errors;
		},
		passwordErrors() {
			const errors = [];
			if (!this.$v.form.password.$dirty) return errors;
			!this.$v.form.password.required && errors.push('Se requiere contraseña');
			return errors;
		},
	},
	created() {
		this.defaultData();
	},
	methods: {
		async onSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				try {
					this.loading = true;
					const response = await this.$auth.loginWith('local', { data: this.form });
					this.$auth.setUser(response.data.user);
					if (this.$auth.$state.loggedIn)
						if (
							response.data.user.role === 'psychologist' &&
							!response.data.user.psychologist
						) {
							this.$router.push({ name: 'postulacion' });
						} else if (!this.isDialog) {
							if (this.$route.query.from === 'psy')
								this.$router.push({ name: 'evaluacion' });
							else if (
								this.$route.name !== 'psicologos' &&
								this.$route.name !== 'psicologos-id'
							)
								this.$router.push({ name: 'dashboard-chat' });
							else this.$router.push({ name: 'psicologos' });
						} else this.setResumeView(true);
				} catch (error) {
					this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
				} finally {
					this.loading = false;
				}
			}
		},
		defaultData() {
			this.form = { email: '', password: '' };
		},
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
