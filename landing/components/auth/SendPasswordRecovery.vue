<template>
	<v-form @submit.prevent="onSubmit">
		<v-row no-gutters>
			<v-col cols="12">
				<v-text-field
					v-model="email"
					class="mt-2"
					label="Correo electronico"
					type="email"
					outlined
					:error-messages="emailErrors"
				></v-text-field>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-btn
					:disabled="loading"
					:loading="loading"
					type="submit"
					block
					rounded
					color="primary"
				>
					Enviar
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
	name: 'SendEmailRecoveryPassword',
	mixins: [validationMixin],
	props: {
		goBack: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			email: '',
			loading: false,
		};
	},
	computed: {
		emailErrors() {
			const errors = [];
			if (!this.$v.email.$dirty) return errors;
			!this.$v.email.required && errors.push('Se requiere correo electrónico');
			!this.$v.email.email && errors.push('Escriba un correo electrónico valido');
			return errors;
		},
	},
	methods: {
		async onSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				try {
					this.loading = true;
					const { data } = await this.$axios.get(
						`/auth/send-password-recover/${this.email}`
					);
					this.snackBar({
						content: data.message,
						color: 'success',
					});
					this.goBack();
				} catch (error) {
					this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
				} finally {
					this.loading = false;
				}
			}
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
	validations: {
		email: {
			required,
			email,
		},
	},
};
</script>

<style lang="scss" scoped></style>
