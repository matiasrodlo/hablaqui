<template>
	<div v-if="$auth.$state.user">
		<v-row>
			<v-col cols="12" class="title">Configuración personal</v-col>
			<v-col cols="6">
				<v-text-field
					v-model="formUser.name"
					filled
					outlined
					readonly
					dense
					hide-details
					label="Nombre"
					:error-messages="nameErrors"
				></v-text-field>
			</v-col>
			<v-col cols="6">
				<v-text-field
					v-model="formUser.email"
					readonly
					filled
					hide-details
					outlined
					dense
					label="Correo electronico"
				></v-text-field>
			</v-col>
			<v-col cols="6">
				<v-text-field
					v-model="formUser.lastName"
					filled
					outlined
					dense
					hide-details
					label="Apellido"
				></v-text-field>
			</v-col>
			<v-col cols="6">
				<v-text-field
					v-model="formUser.phone"
					filled
					outlined
					hide-details
					dense
					label="Numero de telefono"
				></v-text-field>
			</v-col>
			<v-col cols="6">
				<v-combobox
					v-model="formUser.timeZone"
					dense
					filled
					hide-details
					label="Zona horaria"
					:items="timezone"
					outlined
					:search-input.sync="zone"
				>
					<template #no-data>
						<v-list-item>
							<v-list-item-content>
								<v-list-item-title>
									No se encontraron resultados que coincidan con "<strong>
										{{ zone }}
									</strong>
									" .
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
				</v-combobox>
			</v-col>
			<v-col cols="12" class="text-center">
				<v-btn
					:loading="loadingUser"
					color="primary"
					depressed
					class="px-16"
					style="border-radius: 10px"
					@click="updateProfile"
				>
					Editar
				</v-btn>
			</v-col>
		</v-row>
		<update-password />
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
	components: {
		UpdatePassword: () => import('~/components/dashboard/UpdatePassword'),
	},
	mixins: [validationMixin],
	data() {
		return {
			zone: '',
			formUser: {
				name: '',
				lastName: '',
				phone: '',
				email: '',
				timeZone: '',
			},
			timezone: [],
			loadingUser: false,
		};
	},
	computed: {
		nameErrors() {
			const errors = [];
			if (!this.$v.formUser.name.$dirty) return errors;
			!this.$v.formUser.name.required && errors.push('El nombre es querido');
			!this.$v.formUser.name.maxLength && errors.push('Maximo 90 caracteres');
			!this.$v.formUser.name.minLength && errors.push('Minimo 3 caracteres');
			return errors;
		},
	},
	async mounted() {
		this.formUser = { ...this.$auth.$state.user };
		const { data } = await axios.get(`${this.$config.API_ABSOLUTE}/timezone.json`);
		this.timezone = data;
	},
	methods: {
		async updateProfile() {
			this.$v.$touch();
			if (!this.$v.$invalid && this.hasChanges()) {
				this.loadingUser = true;
				const user = await this.updateUser(this.formUser);
				this.$auth.setUser(user);
				this.$v.$reset();
				this.loadingUser = false;
			}
		},
		hasChanges() {
			return (
				this.formUser.name !== this.$auth.$state.user.name ||
				this.formUser.lastName !== this.$auth.$state.user.lastName ||
				this.formUser.phone !== this.$auth.$state.user.phone ||
				this.formUser.timeZone !== this.$auth.$state.user.timeZone
			);
		},
		...mapActions({ updateUser: 'User/updateUser' }),
	},
	validations: {
		formUser: {
			name: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(99),
			},
		},
	},
};
</script>
