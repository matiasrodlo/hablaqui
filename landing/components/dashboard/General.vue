<template>
	<div v-if="$auth.$state.user">
		<v-expansion-panels v-model="panel" multiple class="mb-4">
			<v-expansion-panel>
				<v-expansion-panel-header>
					<div>
						<div class="text-h6" style="color: #3c3c3b">Configuración personal</div>
						<div class="text--secondary">
							Revisa aquí tu nombre, apellido, zona horaria, tu dirección web,
							contraseña, entre otros.
						</div>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<v-row>
						<v-col cols="12" md="6">
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
						<v-col cols="12" md="6">
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
						<v-col cols="12" md="6">
							<v-text-field
								v-model="formUser.lastName"
								filled
								outlined
								dense
								hide-details
								label="Apellido"
							></v-text-field>
						</v-col>
						<v-col cols="12" md="6">
							<v-text-field
								v-model="formUser.phone"
								filled
								outlined
								hide-details
								dense
								label="Numero de telefono"
							></v-text-field>
						</v-col>
						<v-col cols="12" md="6">
							<v-menu
								ref="menu"
								v-model="bmenu"
								:close-on-content-click="false"
								transition="scale-transition"
								offset-y
								min-width="auto"
							>
								<template #activator="{ on, attrs }">
									<v-text-field
										v-model="birthDate"
										label="Fecha de nacimiento"
										readonly
										filled
										outlined
										hide-details
										dense
										v-bind="attrs"
										v-on="on"
									></v-text-field>
								</template>
								<v-date-picker
									v-model="birthDate"
									locale="es"
									:active-picker.sync="activePicker"
									:max="
										new Date(
											Date.now() - new Date().getTimezoneOffset() * 60000
										)
											.toISOString()
											.substr(0, 10)
									"
									min="1950-01-01"
									@change="save"
								></v-date-picker>
							</v-menu>
						</v-col>
						<v-col cols="12" md="6">
							<v-text-field
								v-model="formUser.city"
								filled
								outlined
								hide-details
								dense
								label="Pais/Ciudad"
								placeholder="Ejemplo: Chile, Santiago"
							></v-text-field>
						</v-col>
						<v-col cols="12" md="6">
							<v-select
								v-model="formUser.genre"
								:items="['Hombre', 'Mujer', 'Transgénero']"
								filled
								outlined
								hide-details
								dense
								label="Genero"
							></v-select>
						</v-col>
						<v-col cols="12" md="6">
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
												No se encontraron resultados que coincidan con
												"<strong>
													{{ zone }}
												</strong>
												" .
											</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
								</template>
							</v-combobox>
						</v-col>
						<v-col
							v-if="$auth.$state.user.role === 'psychologist'"
							cols="12"
							class="text-h6 py-0"
							style="color: #3c3c3b"
						>
							Mi dirección
							<v-tooltip bottom>
								<template #activator="{ on, attrs }">
									<v-btn icon v-bind="attrs" v-on="on">
										<icon :icon="mdiInformationOutline" />
									</v-btn>
								</template>
								<span>Para crear tu url personalizada </span>
							</v-tooltip>
						</v-col>
						<v-col v-if="$auth.$state.user.role === 'psychologist'" cols="12" md="6">
							<v-text-field
								v-model="username"
								:loading="!psychologist"
								filled
								outlined
								dense
								:hint="`https://hablaqui.cl/${username}`"
								label="Dirección"
								placeholder="daniel-cedeño"
								@input="() => (available = false)"
							>
								<template #append>
									<v-btn
										v-show="psychologist && psychologist.username !== username"
										:disabled="!username"
										color="primary"
										outlined
										small
										@click="check"
									>
										{{ available ? 'Disponible' : 'verificar' }}
									</v-btn>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" class="text-center">
							<v-btn
								:loading="loadingUser"
								color="primary"
								depressed
								:disabled="hasChanges"
								class="px-16"
								style="border-radius: 10px"
								@click="updateProfile"
							>
								Editar
							</v-btn>
						</v-col>
					</v-row>
					<update-password />
				</v-expansion-panel-content>
			</v-expansion-panel>

			<v-expansion-panel v-if="$auth.$state.user.role === 'psychologist'">
				<v-expansion-panel-header>
					<div>
						<div class="text-h6" style="color: #3c3c3b">Datos bancarios</div>
						<div class="text--secondary">
							Tus datos de facturación en un solo lugar.
						</div>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<bank-data :psychologist="psychologist" :set-psychologist="setPsychologist" />
				</v-expansion-panel-content>
			</v-expansion-panel>

			<v-expansion-panel v-if="$auth.$state.user.role === 'psychologist'">
				<v-expansion-panel-header>
					<div>
						<div class="text-h6" style="color: #3c3c3b">Información profesional</div>
						<div class="text--secondary">
							Datos profesionales, descripción personal y profesional
						</div>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<information-general-psi
						:psychologist="psychologist"
						:set-psychologist="setPsychologist"
					/>
				</v-expansion-panel-content>
			</v-expansion-panel>

			<v-expansion-panel v-if="$auth.$state.user.role === 'psychologist'">
				<v-expansion-panel-header>
					<div>
						<div class="text-h6" style="color: #3c3c3b">Experiencia y formación</div>
						<div class="text--secondary">
							Modelo terapéutico, especialidades, experiencia y formación
						</div>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<experiencia-formacion
						:psychologist="psychologist"
						:set-psychologist="setPsychologist"
					/>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import { cloneDeep } from 'lodash';
import { mdiInformationOutline } from '@mdi/js';

export default {
	components: {
		UpdatePassword: () => import('~/components/dashboard/UpdatePassword'),
		BankData: () => import('~/components/dashboard/BankData'),
		InformationGeneralPsi: () => import('~/components/dashboard/InformationGeneralPsi'),
		ExperienciaFormacion: () => import('~/components/dashboard/ExperienciaFormacion'),
		Icon: () => import('~/components/Icon'),
	},
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
			mdiInformationOutline,
			activePicker: null,
			date: null,
			bmenu: false,
			panel: [],
			zone: '',
			formUser: {
				name: '',
				lastName: '',
				phone: '',
				email: '',
				timeZone: '',
				address: '',
				city: '',
				genre: '',
			},
			available: false,
			birthDate: '',
			username: '',
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
		hasChanges() {
			return (
				JSON.stringify({
					name: this.formUser.name,
					lastName: this.formUser.lastName,
					phone: this.formUser.phone,
					email: this.formUser.email,
					timeZone: this.formUser.timeZone,
					address: this.formUser.address,
					city: this.formUser.city,
					genre: this.formUser.genre,
					birthDate: this.birthDate,
					username: this.username,
				}) ===
				JSON.stringify({
					name: this.$auth.$state.user.name,
					lastName: this.$auth.$state.user.lastName,
					phone: this.$auth.$state.user.phone,
					email: this.$auth.$state.user.email,
					timeZone: this.$auth.$state.user.timeZone,
					city: this.$auth.$state.user.city,
					genre: this.$auth.$state.user.genre,
					birthDate: this.psychologist.birthDate,
					username: this.psychologist ? this.psychologist.username : '',
				})
			);
		},
	},
	watch: {
		bmenu(val) {
			val && setTimeout(() => (this.activePicker = 'YEAR'));
		},
	},
	async mounted() {
		this.formUser = {
			...cloneDeep(this.$auth.$state.user),
		};
		this.username = this.psychologist.username;
		this.birthDate = this.psychologist.birthDate;
		const { data } = await axios.get(`${this.$config.API_ABSOLUTE}/timezone.json`);
		this.timezone = data;
	},

	methods: {
		async updateProfile() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loadingUser = true;
				const user = await this.updateUser(this.formUser);
				if (this.$auth.$state.user.role === 'psychologist') {
					if (!this.available && this.username) {
						const available = await this.checkUsername(this.username);
						if (available)
							this.setPsychologist({
								...this.psychologist,
								username: this.username,
							});
					}
					const psychologist = await this.updatePsychologist({
						...this.psychologist,
						genre: this.formUser.genre,
						name: this.formUser.name,
						lastName: this.formUser.lastName,
						birthDate: this.birthDate,
					});
					this.username = psychologist.username;
					this.birthDate = psychologist.birthDate;
					this.setPsychologist(psychologist);
				}
				this.$auth.setUser(user);
				this.$v.$reset();
				this.loadingUser = false;
			}
		},
		async check() {
			this.available = await this.checkUsername(this.username);
		},
		save(date) {
			this.$refs.menu.save(date);
		},
		...mapActions({
			updatePsychologist: 'Psychologist/updatePsychologist',
			checkUsername: 'Psychologist/checkUsername',
			updateUser: 'User/updateUser',
		}),
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
