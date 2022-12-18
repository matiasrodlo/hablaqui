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
			<div class="text-h6 secondary--text mb-2">RUT del titular</div>
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
			<div class="text-h6 secondary--text mb-2">Nombre completo del titular</div>
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
		<!-- email -->
		<v-col cols="12" md="6">
			<div class="text-h6 secondary--text mb-2">Email</div>
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
/**
 * formulario de datos bancarios
 */
export default {
	mixins: [validationMixin],
	props: {
		psychologist: {
			type: Object,
			default: null,
		},
		setPsychologist: {
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
		/**
		 * retorna error si no llena el campo
		 */
		bankError() {
			const errors = [];
			if (!this.$v.bankData.bank.$dirty) return errors;
			!this.$v.bankData.bank.required && errors.push('Banco es querido');
			return errors;
		},
		/**
		 * retorna error si no llena el campo
		 */
		accountTypeError() {
			const errors = [];
			if (!this.$v.bankData.accountType.$dirty) return errors;
			!this.$v.bankData.accountType.required && errors.push('El tipo de cuenta es querido');
			return errors;
		},
		/**
		 * retorna error si no llena el campo
		 */
		/**
		 * retorna error si no llena el campo
		 */
		accountNumberError() {
			const errors = [];
			if (!this.$v.bankData.accountNumber.$dirty) return errors;
			!this.$v.bankData.accountNumber.required &&
				errors.push('El numero de cuenta es querido');
			return errors;
		},
		/**
		 * retorna error si no llena el campo
		 */
		rutError() {
			const errors = [];
			if (!this.$v.bankData.rut.$dirty) return errors;
			!this.$v.bankData.rut.required && errors.push('El rut es querido');
			return errors;
		},
		/**
		 * retorna error si no llena el campo
		 */
		nameError() {
			const errors = [];
			if (!this.$v.bankData.name.$dirty) return errors;
			!this.$v.bankData.name.required && errors.push('El nombre es querido');
			return errors;
		},
		/**
		 * retorna error si no llena el campo
		 */
		emailError() {
			const errors = [];
			if (!this.$v.bankData.email.$dirty) return errors;
			!this.$v.bankData.email.required && errors.push('El correo electronico es querido');
			return errors;
		},
		/**
		 * es verdadero si tiene cambios por guardar
		 */
		hasChanges() {
			return (
				JSON.stringify(this.bankData) === JSON.stringify(this.psychologist.paymentMethod)
			);
		},
	},
	async mounted() {
		// si tiene metodos de pago el psicologo
		if (this.psychologist.paymentMethod)
			// guardamos una copia profunda que utilizaremos para editar estos datos
			this.bankData = cloneDeep(this.psychologist.paymentMethod);
		// listado de bancos
		let response = await fetch(`${this.$config.LANDING_URL}/bancos.json`);
		response = await response.json();
		this.banks = response;
	},
	methods: {
		/**
		 * actualiza los metodo de pago
		 */
		async handleSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loading = true;
				// actualiza
				const psychologist = await this.updatePaymentMethod(this.bankData);
				// establece los datos actualizados
				this.setPsychologist(psychologist);
				// hace una copia profunda y la guarda en la variable
				this.bankData = cloneDeep(psychologist.paymentMethod);
				this.loading = false;
			}
		},
		...mapActions({
			updatePaymentMethod: 'Psychologist/updatePaymentMethod',
		}),
	},
	/**
	 * validaciones
	 */
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
