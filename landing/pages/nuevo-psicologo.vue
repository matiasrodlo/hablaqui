<!--
ESTE FORMULARIO NO PUEDE SALIR A PRODUCCION
SIN ANTES HACER QUE LA RUTA Y LOS ENDPOINTS SEAN SEGUROS
YA QUE POR AHORA CUALQUIER USUARIO CON EL LINK PUEDE REGISTRAR
CUALQUIER PERSONA
-->

<template>
	<v-container
		:class="$vuetify.breakpoint.smAndUp ? '' : 'white--text'"
		fluid
		class="login-image"
		style="overflow: auto"
	>
		<v-row justify="center" align="center" style="height: 100vh">
			<v-col cols="12" sm="6">
				<div class="mb-10">
					<div class="text-center text-h6 text-lg-h4 font-weight-bold text--secondary">
						Bienvenido al Regístro de psicologo
					</div>
					<div class="text-center text-h6 text-lg-h5 text--secondary">
						¡Nos alegra que estés aquí!
					</div>
				</div>
				<v-row justify="center" align="center" class="text-center">
					<v-col cols="12" sm="10" lg="8">
						<v-window v-model="step">
							<v-window-item :value="1">
								<label for="avatar">
									<v-avatar
										size="100"
										style="border: 1px solid #2070e5; cursor: pointer"
									>
										<v-img v-if="urlAvatar" :src="urlAvatar"></v-img>
										<icon v-else color="primary" x-large :icon="mdiAccount" />
									</v-avatar>
								</label>
								<p>
									Para subir una foto debe seguir esta serie de
									<v-btn
										text
										color="primary"
										class="py-0 my-0"
										href="https://drive.google.com/file/d/1Tmxd4XVcSs_t1-BrMoJB9NOY_N1fC_56/view?usp=sharing"
										target="_blank"
									>
										reglas
									</v-btn>
								</p>
								<v-file-input
									id="avatar"
									label="File input"
									filled
									prepend-icon="mdi-camera"
									class="d-none"
									@change="setAvatar"
								></v-file-input>
								<div
									class="
										text-center text-h6
										font-weight-bold
										text--secondary
										mb-2
									"
								>
									Datos personales
								</div>
								<v-row cols-12>
									<v-col cols-6>
										<v-text-field
											v-model="form.name"
											type="text"
											label="Nombre/s"
											outlined
											autocomplete="off"
											:error-messages="nameErrors"
										></v-text-field>
									</v-col>
									<v-col cols-6>
										<v-text-field
											v-model="form.lastName"
											type="text"
											label="Apellido/s"
											outlined
											autocomplete="off"
											:error-messages="nameErrors"
										></v-text-field>
									</v-col>
								</v-row>
								<v-radio-group v-model="form.gender" row>
									<v-radio label="Hombre" value="male"></v-radio>
									<v-radio label="Mujer" value="female"></v-radio>
									<v-checkbox
										v-model="form.isTrans"
										label="Transgenero"
									></v-checkbox>
								</v-radio-group>
								<v-text-field
									v-model="form.email"
									type="text"
									label="Correo electronico"
									outlined
									:error-messages="emailErrors"
									autocomplete="off"
								></v-text-field>
								<v-text-field
									v-model="form.username"
									type="text"
									label="Nombre de usuario"
									outlined
									autocomplete="off"
								></v-text-field>
								<v-select
									v-model="form.region"
									:items="regiones"
									label="Región"
									outlined
								></v-select>
								<v-select
									v-if="form.region"
									v-model="form.comuna"
									:items="comunas"
									outlined
									label="Comuna"
								></v-select>
								<v-text-field
									v-model="form.code"
									type="number"
									label="Codigo"
									outlined
									autocomplete="off"
								></v-text-field>
								<v-text-field
									v-model="form.password"
									label="Contraseña"
									outlined
									:error-messages="passwordErrors"
									:type="showPassword ? 'text' : 'password'"
									:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
									@click:append="showPassword = !showPassword"
								></v-text-field>
								<v-text-field
									v-model="form.repeatPassword"
									label="Repite contraseña"
									outlined
									:error-messages="repeatPasswordErrors"
									:type="showRepeatPassword ? 'text' : 'password'"
									:append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
									@click:append="showRepeatPassword = !showRepeatPassword"
								></v-text-field>
								<v-btn outlined rounded color="primary" @click="step = 2">
									Siguiente
								</v-btn>
							</v-window-item>
							<v-window-item :value="2">
								<div
									class="
										text-center text-h6
										font-weight-bold
										text--secondary
										mb-2
									"
								>
									Tus clientes quieren saber de ti cuentales que eres el mejor
								</div>
								<v-textarea
									v-model="form.personalDescription"
									type="text"
									label="Descripcion personal"
									outlined
									autocomplete="off"
								></v-textarea>
								<v-textarea
									v-model="form.professionalDescription"
									type="text"
									label="Descripcion profesional"
									outlined
									autocomplete="off"
								></v-textarea>
								<v-textarea
									v-model="form.experience"
									type="text"
									label="Experiencia (separar cada una por punto y coma)"
									height="100px"
									outlined
									autocomplete="off"
								></v-textarea>
								<v-textarea
									v-model="form.formation"
									type="text"
									label="Formacion (separar cada una por punto y coma)"
									height="100px"
									outlined
									autocomplete="off"
								></v-textarea>
								<div
									class="
										text-center text-h8
										font-weight-bold
										text--secondary
										mb-2
									"
								>
									Lenguajes
								</div>
								<v-row>
									<v-col cols="12" md="4">
										<v-checkbox
											v-model="form.languages"
											label="English"
											value="english"
										></v-checkbox>
									</v-col>
									<v-col cols="12" md="4">
										<v-checkbox
											v-model="form.languages"
											label="Español"
											value="spanish"
										></v-checkbox>
									</v-col>
								</v-row>
								<v-btn
									outlined
									rounded
									color="primary"
									class="ma-2"
									@click="step = 1"
								>
									Regresar
								</v-btn>
								<v-btn
									outlined
									rounded
									color="primary"
									class="ma-2"
									@click="step = 3"
								>
									Siguiente
								</v-btn>
							</v-window-item>
							<v-window-item :value="3">
								<div
									class="
										text-center text-h6
										font-weight-bold
										text--secondary
										mb-2
									"
								>
									Tus especialidades te ayudara a que puedan encontrarte mas
									rapido
								</div>
								<v-row justify="center" align="center">
									<v-col cols="6">
										<template v-for="(item, i) in specialties">
											<v-checkbox
												v-if="i <= 9"
												:key="i"
												v-model="form.specialties"
												:label="item"
												:value="item"
												hide-details
											></v-checkbox>
										</template>
									</v-col>
									<v-col cols="6">
										<template v-for="(item, i) in specialties">
											<v-checkbox
												v-if="i > 9"
												:key="i"
												v-model="form.specialties"
												:label="item"
												:value="item"
												hide-details
											></v-checkbox>
										</template>
									</v-col>
									<v-col
										cols="12"
										class="
											text-center text-h6
											font-weight-bold
											text--secondary
											mb-2
										"
									>
										Modelos terapeuticos
									</v-col>
									<v-col cols="4">
										<v-checkbox
											v-model="form.models"
											label="Psicoanálisis"
											value="Psicoanálisis"
											hide-details
										></v-checkbox>
									</v-col>
									<v-col cols="4">
										<v-checkbox
											v-model="form.models"
											label="Sistémico"
											value="Sistémico"
											hide-details
										></v-checkbox>
									</v-col>
									<v-col cols="4">
										<v-checkbox
											v-model="form.models"
											label="Humanista"
											value="Humanista"
											hide-details
										>
										</v-checkbox>
									</v-col>
									<v-col cols="6">
										<v-checkbox
											v-model="form.models"
											label="Cognitivo-conductual"
											value="Cognitivo-conductual"
											hide-details
										></v-checkbox>
									</v-col>
									<v-col cols="3">
										<v-checkbox
											v-model="form.models"
											label="Contextual"
											value="Contextual"
											hide-details
										></v-checkbox>
									</v-col>
								</v-row>
								<v-btn
									class="mt-10 mx-2"
									outlined
									rounded
									color="primary"
									@click="step = 2"
								>
									Regresar
								</v-btn>
								<v-btn
									class="mt-10 mx-2"
									rounded
									color="primary"
									@click="handleClick"
								>
									Regístrate
								</v-btn>
							</v-window-item>
						</v-window>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, sameAs, minLength, maxLength } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';
import { mdiAccount } from '@mdi/js';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	mixins: [validationMixin],
	data() {
		return {
			mdiAccount,
			carousel: 0,
			step: 1,
			onboarding: 0,
			form: null,
			repeatPassword: null,
			showPassword: false,
			showRepeatPassword: false,
			loading: false,
			terminado: false,
			urlAvatar: '',
			regiones: [],
			comunasRegiones: [],
			length: [
				{
					id: 1,
					img: `${this.$config.LANDING_URL}/auth.webp`,
					text: 'Habla con tu psicólogo por videollamada, estés donde estés y sin tener que desplazarte',
				},
				{
					id: 2,
					img: `${this.$config.LANDING_URL}/auth-2.webp`,
					text: 'Disfruta de las sesiones con tu psicólogo de manera segura y privada',
				},
				{
					id: 3,
					img: `${this.$config.LANDING_URL}/auth-3.webp`,
					text: ' Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios',
				},
				{
					id: 4,
					img: `${this.$config.LANDING_URL}/auth-4.webp`,
					text: 'Precios más asequibles, sin tener que renunciar a la calidad de una terapia presencial',
				},
			],
		};
	},
	computed: {
		backgroundImg() {
			if (this.$vuetify.breakpoint.smAndUp) return `${this.$config.LANDING_URL}/login.png`;
			return null;
		},
		emailErrors() {
			const errors = [];
			if (!this.$v.form.email.$dirty) return errors;
			!this.$v.form.email.required && errors.push('El Correo electronico es querido');
			!this.$v.form.email.email && errors.push('Escriba un email valido');
			return errors;
		},
		nameErrors() {
			const errors = [];
			if (!this.$v.form.name.$dirty) return errors;
			!this.$v.form.name.required && errors.push('El nombre es querido');
			!this.$v.form.name.maxLength && errors.push('Maximo 90 caracteres');
			!this.$v.form.name.minLength && errors.push('Minimo 3 caracteres');
			return errors;
		},
		passwordErrors() {
			const errors = [];
			if (!this.$v.form.password.$dirty) return errors;
			!this.$v.form.password.required && errors.push('La contraseña es querida');
			!this.$v.form.password.minLength && errors.push('Minimo 6 caracteres');
			!this.$v.form.password.maxLength && errors.push('Maximo 99 caracteres');
			return errors;
		},
		repeatPasswordErrors() {
			const errors = [];
			if (!this.$v.form.password.$dirty) return errors;
			!this.$v.form.repeatPassword.required && errors.push('Repetir contraseña es querido');
			!this.$v.form.repeatPassword.sameAsPassword &&
				errors.push('Las contraseñas deben ser iguales');
			return errors;
		},
		...mapGetters({
			specialties: 'Appointments/specialties',
		}),
	},
	watch: {
		'form.region'(newVal) {
			if (newVal) {
				this.comunas = this.comunasRegiones.find(item => {
					return item.region === this.form.region;
				}).comunas;
			}
		},
	},
	created() {
		this.defaultForm();
	},
	async mounted() {
		this.getAppointments();
		const response = await this.$axios.$get(
			`${this.$config.LANDING_URL}/comunas-regiones.json`
		);
		this.comunasRegiones = response;
		this.regiones = response.map(i => i.region);
	},
	methods: {
		defaultForm() {
			this.repeatPassword = '';
			this.form = {
				code: '',
				name: '',
				lastName: '',
				personalDescription: '',
				professionalDescription: '',
				email: '',
				username: '',
				experience: '',
				formation: '',
				password: '',
				specialties: [],
				models: [],
				languages: [],
				gender: '',
				avatar: '',
				isTrans: false,
			};
		},
		setFormData() {
			const formData = new FormData();
			formData.append('code', this.form.code);
			formData.append('name', this.form.name);
			formData.append('lastName', this.form.lastName);
			formData.append('personalDescription', this.form.personalDescription);
			formData.append('professionalDescription', this.form.professionalDescription);
			formData.append('email', this.form.email);
			formData.append('username', this.form.username);
			formData.append('comuna', this.form.comuna);
			formData.append('region', this.form.region);
			formData.append('experience', this.form.experience);
			formData.append('formation', this.form.formation);
			formData.append('password', this.form.password);
			formData.append('specialties', JSON.stringify(this.form.specialties));
			formData.append('models', JSON.stringify(this.form.models));
			formData.append('languages', JSON.stringify(this.form.languages));
			formData.append('gender', this.form.gender);
			formData.append('isTrans', this.form.isTrans);
			formData.append('avatar', this.form.avatar);

			return formData;
		},
		async handleClick() {
			// this.$v.$touch();
			const payload = this.setFormData();
			this.loading = true;
			await this.registerPsychologist(payload);
			this.loading = false;
			this.terminado = true;

			// Se devuelve todo a la normalidad para otro registro
			this.defaultForm();
			this.step = 1;
		},
		setAvatar(file) {
			this.urlAvatar = URL.createObjectURL(file);
			this.form.avatar = file;
		},
		...mapActions({
			getAppointments: 'Appointments/getAppointments',
			registerPsychologist: 'Psychologist/registerPsychologist',
		}),
	},
	validations: {
		form: {
			code: {
				required,
			},
			description: {
				required,
			},
			experience: {
				required,
			},
			formation: {
				required,
			},
			specialties: {
				required,
			},
			models: {
				required,
			},
			name: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(99),
			},
			email: {
				required,
				email,
			},
			password: {
				required,
				minLength: minLength(6),
				maxLength: maxLength(99),
			},
			repeatPassword: {
				required,
				sameAsPassword: sameAs('password'),
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.login-circle-image {
	background: url('/img/circle-login.png') no-repeat;
	background-position-y: 60%;
	background-position-x: 75%;
	-webkit-background-size: 25%;
	-moz-background-size: 25%;
	-o-background-size: 25%;
	background-size: 25%;
}
.login-plus-image {
	background: url('/img/plus-login.png') no-repeat;
	background-position-x: 70%;
	-webkit-background-size: 7%;
	-moz-background-size: 7%;
	-o-background-size: 7%;
	background-size: 7%;
}
</style>
