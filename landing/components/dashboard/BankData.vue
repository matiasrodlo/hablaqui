<template>
	<v-row class="mb-16">
		<v-col cols="12" class="d-flex justify-space-between align-center">
			<div>
				<div class="font-weight-regular caption text-md-h6" style="color: #3c3c3b">
					Ingrese la cuenta bancaría a la que desea que transfiramos<br />
				</div>
			</div>
			<v-btn
				depressed
				color="primary"
				style="border-radius: 10px"
				class="hidden-sm-and-down px-16"
				:disabled="hasChanges"
				:loading="loading"
				@click="handleSubmit"
			>
				Guardar
			</v-btn>
		</v-col>
		<!-- banco -->
		<v-col cols="12" md="6">
			<div
				class="text-h6 secondary--text mb-2"
				:class="bankError.length ? 'error--text' : ''"
			>
				Banco
			</div>
			<div class="d-flex align-center">
				<v-img
					:src="`https://cdn.hablaqui.cl/static/Grafico-datos-bancarios.png`"
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
						:loading="!banks.length"
						item-text="nombre"
						item-value="nombre"
						dense
						type="text"
						clearable
						no-data-text="No hay bancos en este momento para mostrar"
						:hide-details="!bankError.length"
					>
					</v-autocomplete>
				</div>
			</div>
		</v-col>
		<!-- rut del titular -->
		<v-col cols="12" md="6">
			<div class="text-h6 secondary--text mb-2">Rut</div>
			<div class="d-flex align-center">
				<v-img
					:src="`https://cdn.hablaqui.cl/static/dni.png`"
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
		<v-col cols="12" md="6">
			<div class="text-h6 secondary--text mb-2">Tipo de cuenta</div>
			<div class="d-flex align-center">
				<v-img
					:src="`https://cdn.hablaqui.cl/static/tipo-de-cuenta.png`"
					contain
					height="30"
					width="10%"
				></v-img>
				<div style="width: 90%">
					<v-select
						v-model="bankData.accountType"
						:items="['Cuenta vista', 'Cuenta ahorro', 'Cuenta corriente']"
						filled
						outlined
						dense
						:error-messages="accountTypeError"
						:hide-details="!accountTypeError.length"
					></v-select>
				</div>
			</div>
		</v-col>
		<!-- nombre del titular -->
		<v-col cols="12" md="6">
			<div class="text-h6 secondary--text mb-2">Nombre completo</div>
			<div class="d-flex align-center">
				<v-img
					:src="`https://cdn.hablaqui.cl/static/name-account.png`"
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
		<v-col cols="12" md="6">
			<div class="text-h6 secondary--text mb-2">Número de cuenta</div>
			<div class="d-flex align-center">
				<v-img
					:src="`https://cdn.hablaqui.cl/static/numero-cuenta.png`"
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
		<v-col cols="12" md="6">
			<div class="text-h6 secondary--text mb-2">Correo Electronico</div>
			<div class="d-flex align-center">
				<v-img
					:src="`https://cdn.hablaqui.cl/static/icon-email.png`"
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
		<v-col cols="12" class="text-center hidden-md-and-up">
			<v-btn
				depressed
				color="primary"
				style="border-radius: 10px"
				:disabled="hasChanges"
				:loading="loading"
				@click="handleSubmit"
			>
				Guardar
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

export default {
	mixins: [validationMixin],
	props: {
		specialist: {
			type: Object,
			default: null,
		},
		setSpecialist: {
			type: Function,
			required: true,
		},
	},
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
			loading: false,
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
		hasChanges() {
			return JSON.stringify(this.bankData) === JSON.stringify(this.specialist.paymentMethod);
		},
	},
	async mounted() {
		if (this.specialist.paymentMethod) this.bankData = cloneDeep(this.specialist.paymentMethod);
		let response = await fetch(`${this.$config.LANDING_URL}/bancos.json`);
		response = await response.json();
		this.banks = response;
	},
	methods: {
		async handleSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loading = true;
				const specialist = await this.updatePaymentMethod(this.bankData);
				this.setSpecialist(specialist);
				this.bankData = cloneDeep(specialist.paymentMethod);
				this.loading = false;
			}
		},
		...mapActions({
			updatePaymentMethod: 'Specialist/updatePaymentMethod',
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
