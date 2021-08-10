<template>
	<v-row class="mb-16">
		<v-col cols="12" class="d-flex justify-space-between align-center">
			<div>
				<div class="text-h6 mb-2" style="color: #3c3c3b">Datos bancarios</div>
				<div
					class="font-weight-medium"
					style="color: #3c3c3b; line-height: 1.32; font-size: 18px"
				>
					Los siguientes datos serán utilizados para transferir <br />
					el dinero de los servicios vendidos por medio de Hablaquí.
				</div>
			</div>
			<v-btn
				depressed
				color="primary"
				style="border-radius: 10px"
				class="px-16"
				@click="handleSubmit"
			>
				Guardar
			</v-btn>
		</v-col>
		<!-- banco -->
		<v-col cols="6">
			<div
				class="text-h6 secondary--text mb-2"
				:class="bankError.length ? 'error--text' : ''"
			>
				Banco
			</div>
			<div class="d-flex align-center">
				<v-img
					:src="`${$config.LANDING_URL}/Grafico-datos-bancarios.png`"
					contain
					height="30"
					width="10%"
				></v-img>
				<div style="width: 90%">
					<v-autocomplete
						v-model="bankData.bank"
						:error-messages="bankError"
						filled
						outlined
						:items="banks"
						item-text="nombre"
						item-value="nombre"
						dense
						type="text"
						clearable
						:hide-details="!bankError.length"
					>
					</v-autocomplete>
				</div>
			</div>
		</v-col>
		<!-- rut del titular -->
		<v-col cols="6">
			<div class="text-h6 secondary--text mb-2">RUT del titular</div>
			<div class="d-flex align-center">
				<v-img
					:src="`${$config.LANDING_URL}/dni.png`"
					contain
					height="30"
					width="10%"
				></v-img>
				<div style="width: 90%">
					<v-text-field
						v-model="bankData.rut"
						filled
						outlined
						dense
						type="text"
						:error-messages="rutError"
						:hide-details="!rutError.length"
					></v-text-field>
				</div>
			</div>
		</v-col>
		<!-- tipo de cuenta -->
		<v-col cols="6">
			<div class="text-h6 secondary--text mb-2">Tipo de cuenta</div>
			<div class="d-flex align-center">
				<v-img
					:src="`${$config.LANDING_URL}/tipo-de-cuenta.png`"
					contain
					height="30"
					width="10%"
				></v-img>
				<div style="width: 90%">
					<v-text-field
						v-model="bankData.accountType"
						filled
						outlined
						dense
						type="text"
						:error-messages="accountTypeError"
						:hide-details="!accountTypeError.length"
					></v-text-field>
				</div>
			</div>
		</v-col>
		<!-- nombre del titular -->
		<v-col cols="6">
			<div class="text-h6 secondary--text mb-2">Nombre completo del titular</div>
			<div class="d-flex align-center">
				<v-img
					:src="`${$config.LANDING_URL}/name-account.png`"
					contain
					height="30"
					width="10%"
				></v-img>
				<div style="width: 90%">
					<v-text-field
						v-model="bankData.name"
						filled
						outlined
						dense
						type="text"
						:error-messages="nameError"
						:hide-details="!nameError.length"
					></v-text-field>
				</div>
			</div>
		</v-col>
		<!-- numero de cuenta -->
		<v-col cols="6">
			<div class="text-h6 secondary--text mb-2">Número de cuenta</div>
			<div class="d-flex align-center">
				<v-img
					:src="`${$config.LANDING_URL}/numero-cuenta.png`"
					contain
					height="30"
					width="10%"
				></v-img>
				<div style="width: 90%">
					<v-text-field
						v-model="bankData.accountNumber"
						filled
						outlined
						dense
						type="text"
						:error-messages="accountNumberError"
						:hide-details="!accountNumberError.length"
					></v-text-field>
				</div>
			</div>
		</v-col>
		<v-col cols="6">
			<div class="text-h6 secondary--text mb-2">Email</div>
			<div class="d-flex align-center">
				<v-img
					:src="`${$config.LANDING_URL}/icon-email.png`"
					contain
					height="30"
					width="10%"
				></v-img>
				<div style="width: 90%">
					<v-text-field
						v-model="bankData.email"
						filled
						outlined
						dense
						type="text"
						:error-messages="emailError"
						:hide-details="!emailError.length"
					></v-text-field>
				</div>
			</div>
		</v-col>
	</v-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
	mixins: [validationMixin],
	data() {
		return {
			bankData: {
				bank: '',
				accountType: '',
				accountNumber: '',
				rut: '',
				name: '',
				email: '',
			},
			banks: [],
		};
	},
	computed: {
		bankError() {
			const errors = [];
			if (!this.$v.bankData.bank.$dirty) return errors;
			!this.$v.bankData.bank.required && errors.push('Banco es querido');
			return errors;
		},
		accountTypeError() {
			const errors = [];
			if (!this.$v.bankData.accountType.$dirty) return errors;
			!this.$v.bankData.accountType.required && errors.push('El tipo de cuenta es querido');
			return errors;
		},
		accountNumberError() {
			const errors = [];
			if (!this.$v.bankData.accountNumber.$dirty) return errors;
			!this.$v.bankData.accountNumber.required &&
				errors.push('El numero de cuenta es querido');
			return errors;
		},
		rutError() {
			const errors = [];
			if (!this.$v.bankData.rut.$dirty) return errors;
			!this.$v.bankData.rut.required && errors.push('El rut es querido');
			return errors;
		},
		nameError() {
			const errors = [];
			if (!this.$v.bankData.name.$dirty) return errors;
			!this.$v.bankData.name.required && errors.push('El nombre es querido');
			return errors;
		},
		emailError() {
			const errors = [];
			if (!this.$v.bankData.email.$dirty) return errors;
			!this.$v.bankData.email.required && errors.push('El correo electronico es querido');
			return errors;
		},
	},
	async mounted() {
		let response = await fetch(`${this.$config.LANDING_URL}/bancos.json`);
		response = await response.json();
		this.banks = response;
	},
	methods: {
		handleSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				const payload = this.bankData;
				this.updatePaymentMethod(payload);
			}
		},
		...mapActions({
			updatePaymentMethod: 'Psychologist/updatePaymentMethod',
		}),
	},
	validations: {
		bankData: {
			bank: { required },
			accountType: { required },
			accountNumber: { required },
			rut: { required },
			name: { required },
			email: { required },
		},
	},
};
</script>
