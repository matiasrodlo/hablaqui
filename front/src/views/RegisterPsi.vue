<template>
	<v-img :src="backgroundImg" height="100vh">
		<v-container
			:class="$vuetify.breakpoint.smAndUp ? '' : 'white--text'"
			fluid
			class="login-image"
		>
			<v-row justify="center" align="center" style="height: 100vh">
				<v-col cols="12" sm="6">
					<div class="mb-10">
						<div
							class="text-center text-h6 text-lg-h4 font-weight-bold text--secondary"
						>
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
											style="border: 1px solid #2070E5; cursor: pointer;"
										>
											<v-img v-if="urlAvatar" :src="urlAvatar"></v-img>
											<v-icon color="primary" size="100" v-else
												>mdi-account</v-icon
											>
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
										@change="setAvatar"
										prepend-icon="mdi-camera"
										class="d-none"
									></v-file-input>
									<div
										class="text-center text-h6 font-weight-bold text--secondary mb-2"
									>
										Datos personales
									</div>
									<v-text-field
										v-model="form.name"
										type="text"
										label="Nombre completo"
										outlined
										autocomplete="off"
										:error-messages="nameErrors"
									></v-text-field>
									<v-radio-group row v-model="form.gender" column>
										<v-radio label="Hombre" value="male"></v-radio>
										<v-radio label="Mujer" value="female"></v-radio>
										<v-radio label="No binario" value="non-binary"></v-radio>
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
										:append-icon="
											showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'
										"
										@click:append="showRepeatPassword = !showRepeatPassword"
									></v-text-field>
									<v-btn outlined rounded color="primary" @click="step = 2">
										Siguiente
									</v-btn>
								</v-window-item>
								<v-window-item :value="2">
									<div
										class="text-center text-h6 font-weight-bold text--secondary mb-2"
									>
										Tus clientes quieren saber de ti cuentales que eres el mejor
									</div>
									<v-textarea
										v-model="form.description"
										type="text"
										label="Descripcion personal"
										outlined
										autocomplete="off"
									></v-textarea>
									<v-textarea
										v-model="form.experience"
										type="text"
										label="Experiencia"
										height="100px"
										outlined
										autocomplete="off"
									></v-textarea>
									<v-textarea
										v-model="form.formation"
										type="text"
										label="Formacion"
										height="100px"
										outlined
										autocomplete="off"
									></v-textarea>
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
										class="text-center text-h6 font-weight-bold text--secondary mb-2"
									>
										Tus especialidades te ayudara a que puedan encontrarte mas
										rapido
									</div>
									<v-row justify="center" align="center">
										<v-col cols="6">
											<template v-for="(item, i) in specialties">
												<v-checkbox
													:key="i"
													v-if="i <= 9"
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
													:key="i"
													v-if="i > 9"
													v-model="form.specialties"
													:label="item"
													:value="item"
													hide-details
												></v-checkbox>
											</template>
										</v-col>
										<v-col
											cols="12"
											class="text-center text-h6 font-weight-bold text--secondary mb-2"
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
				<v-col v-if="$vuetify.breakpoint.smAndUp" sm="6" class="login-plus-image">
					<v-window v-model="onboarding" class="login-circle-image">
						<v-window-item v-for="n in length" :key="`card-${n.id}`">
							<div class="text-center ">
								<v-list-item-avatar size="400" class="ml-4">
									<v-img :src="n.img"></v-img>
								</v-list-item-avatar>
							</div>
							<div class="text-h6 text-center white--text py-4">
								{{ n.text }}
							</div>
						</v-window-item>
					</v-window>
					<v-item-group v-model="onboarding" class="text-center" mandatory>
						<v-item
							v-for="n in length"
							:key="`btn-${n.id}`"
							v-slot="{ active, toggle }"
						>
							<v-btn :input-value="active" icon @click="toggle" color="#BDBDBD">
								<v-icon>mdi-record</v-icon>
							</v-btn>
						</v-item>
					</v-item-group>
				</v-col>
			</v-row>
		</v-container>
	</v-img>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, sameAs, minLength, maxLength } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';
export default {
	mixins: [validationMixin],
	data() {
		return {
			step: 1,
			onboarding: 0,
			form: null,
			repeatPassword: null,
			showPassword: false,
			showRepeatPassword: false,
			loading: false,
			terminado: false,
			urlAvatar: '',
			length: [
				{
					id: 1,
					img: 'img/auth.png',
					text:
						'Habla con tu psicólogo por videollamada, estés donde estés y sin tener que desplazarte',
				},
				{
					id: 2,
					img: 'img/auth.png',
					text: 'Disfruta de las sesiones con tu psicólogo de manera segura y privada',
				},
				{
					id: 3,
					img: 'img/auth.png',
					text:
						' Encontramos al especialista más adecuado para ti y que mejor se adapte a tus horarios',
				},
				{
					id: 4,
					img: 'img/auth.png',
					text:
						'Precios más asequibles, sin tener que renunciar a la calidad de una terapia presencial',
				},
			],
		};
	},
	created() {
		this.defaultForm();
	},
	computed: {
		backgroundImg() {
			if (this.$vuetify.breakpoint.smAndUp) return 'img/login.png';
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
	mounted() {
		this.getAppointments();
	},
	methods: {
		defaultForm() {
			this.repeatPassword = '';
			this.form = {
				code: '',
				name: '',
				description: '',
				email: '',
				experience: '',
				formation: '',
				password: '',
				specialties: [],
				models: [],
				gender: '',
				avatar: '',
			};
		},
		setFormData() {
			const formData = new FormData();
			formData.append('code', this.form.code);
			formData.append('name', this.form.name);
			formData.append('description', this.form.description);
			formData.append('email', this.form.email);
			formData.append('experience', this.form.experience);
			formData.append('formation', this.form.formation);
			formData.append('password', this.form.password);
			formData.append('specialties', JSON.stringify(this.form.specialties));
			formData.append('models', JSON.stringify(this.form.models));
			formData.append('gender', this.form.gender);
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
