<template>
	<div v-if="user">
		<v-row>
			<v-col cols="12" class="title">Información General</v-col>
			<v-col cols="12">
				<v-text-field
					v-model="formUser.name"
					filled
					outlined
					dense
					label="Nombre"
					:error-messages="nameErrors"
				></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-text-field
					v-model="formUser.lastName"
					filled
					outlined
					dense
					label="Apellido"
				></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-combobox
					dense
					filled
					label="Zona horaria"
					v-model="formUser.timeZone"
					:items="timezone"
					outlined
					:search-input.sync="zone"
				>
					<template v-slot:no-data>
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
			<v-col cols="12">
				<v-text-field
					v-model="formUser.email"
					readonly
					filled
					outlined
					dense
					label="Correo electronico"
				></v-text-field>
			</v-col>
			<v-col cols="12">
				<v-text-field
					v-model="formUser.phone"
					filled
					outlined
					dense
					label="Numero de telefono"
				></v-text-field>
			</v-col>
			<v-col cols="12" class="text-center">
				<v-btn
					@click="updateProfile"
					:loading="loadingUser"
					color="primary"
					depressed
					class="px-16"
					style="border-radius: 10px"
				>
					Editar
				</v-btn>
			</v-col>
		</v-row>
		<update-password />
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
import { api_absolute } from '@/config/index';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
	mixins: [validationMixin],
	components: {
		UpdatePassword: () => import('@/components/my-space/UpdatePassword'),
	},
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
		...mapGetters({ user: 'User/user' }),
	},
	async mounted() {
		this.formUser = { ...this.user };
		const { data } = await axios.get(`${api_absolute}/timezone.json`);
		this.timezone = data;
	},
	methods: {
		async updateProfile() {
			this.$v.$touch();
			if (!this.$v.$invalid && this.hasChanges()) {
				this.loadingUser = true;
				await this.updateUser(this.formUser);
				this.$v.$reset();
				this.loadingUser = false;
			}
		},
		hasChanges() {
			return (
				this.formUser.name != this.user.name ||
				this.formUser.lastName != this.user.lastName ||
				this.formUser.phone != this.user.phone ||
				this.formUser.timeZone != this.user.timeZone
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
