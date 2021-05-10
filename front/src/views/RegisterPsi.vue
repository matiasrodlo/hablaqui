<template>
	<v-img :src="backgroundImg" height="100vh">
		<v-container
			:class="$vuetify.breakpoint.smAndUp ? '' : 'white--text'"
			fluid
			class="login-image"
		>
			<v-row justify="center" align="center" style="height: 100vh; overflow-y: auto">
				<v-col cols="12" sm="5">
					<!-- formulario -->
					<h1>Registro de Psicologos</h1>
					<v-form @submit.prevent="onSubmit">
						<v-text-field
							v-model="form.code"
							type="number"
							label="Codigo"
							outlined
							autocomplete="off"
						></v-text-field>
						<v-text-field
							v-model="form.name"
							type="text"
							label="Nombre completo"
							outlined
							autocomplete="off"
							:error-messages="nameErrors"
						></v-text-field>
						<v-textarea
							v-model="form.description"
							type="text"
							label="Descripcion"
							outlined
							autocomplete="off"
						></v-textarea>
						<v-text-field
							v-model="form.email"
							type="text"
							label="Correo electronico"
							outlined
							:error-messages="emailErrors"
							autocomplete="off"
						></v-text-field>
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
						<h3>Especialidades</h3>
						<v-container fluid>
							<v-checkbox
								v-model="form.specialties"
								label="Depresión"
								value="Depresión"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Ansiedad o estrés"
								value="Ansiedad o estrés"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Fobia social"
								value="Fobia social"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Trastorno obsesivo compulsivo"
								value="Trastorno obsesivo compulsivo"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Ansiedad generalizada"
								value="Ansiedad generalizada"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Autoconocimiento"
								value="Autoconocimiento"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Cambio de hábitos"
								value="Cambio de hábitos"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Autoestima"
								value="Autoestima"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Enfoque de género y diversidad"
								value="Enfoque de género y diversidad"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Dificultades interpersonales"
								value="Dificultades interpersonales"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Control de ira"
								value="Control de ira"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Duelo o perdida"
								value="Duelo o perdida"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Regulación emocional"
								value="Regulación emocional"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Trastornos del sueño"
								value="Trastornos del sueño"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Déficit atencional"
								value="Déficit atencional"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Sexualidad"
								value="Sexualidad"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Trastornos de la conducta alimentaria"
								value="Trastornos de la conducta alimentaria"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Trastornos de personalidad"
								value="Trastornos de personalidad"
							></v-checkbox
							><v-checkbox
								v-model="form.specialties"
								label="Trastornos del animo (bipolaridad)"
								value="Trastornos del animo (bipolaridad)"
							></v-checkbox>
						</v-container>
						<h3>Modelos</h3>
						<v-container fluid>
							<v-checkbox
								v-model="form.models"
								label="Psicoanálisis"
								value="Psicoanálisis"
							></v-checkbox
							><v-checkbox
								v-model="form.models"
								label="Cognitivo-conductual"
								value="Cognitivo-conductual"
							></v-checkbox
							><v-checkbox
								v-model="form.models"
								label="Humanista"
								value="Humanista"
							></v-checkbox
							><v-checkbox
								v-model="form.models"
								label="Sistémico"
								value="Sistémico"
							></v-checkbox>
							><v-checkbox
								v-model="form.models"
								label="Contextual"
								value="Contextual"
							></v-checkbox>
						</v-container>
						<h3>Foto de Perfil</h3>
						<p>
							Para poder subir una foto, esta tiene que seguir una serie de reglas,
							las puedes leer en
							<a
								href="https://drive.google.com/file/d/1Tmxd4XVcSs_t1-BrMoJB9NOY_N1fC_56/view?usp=sharing"
								target="_blank"
								>este documento</a
							>
						</p>
						<v-file-input
							v-model="form.avatar"
							label="File input"
							filled
							prepend-icon="mdi-camera"
						></v-file-input>
						<v-radio-group v-model="form.gender" column>
							<v-radio label="Hombre" value="male"></v-radio>
							<v-radio label="Mujer" value="female"></v-radio>
							<v-radio label="No binario" value="non-binary"></v-radio>
							<v-radio label="Prefiero no decirlo" value="n/a"></v-radio>
						</v-radio-group>

						<v-btn block rounded color="primary" type="submit">
							Regístrate
						</v-btn>
					</v-form>
				</v-col>
				<v-col class="12" sm="7"></v-col>
			</v-row>
		</v-container>
	</v-img>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, sameAs, minLength, maxLength } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
export default {
	mixins: [validationMixin],
	data() {
		return {
			form: null,
			repeatPassword: null,
			showPassword: false,
			showRepeatPassword: false,
			loading: false,
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
		async onSubmit() {
			//this.$v.$touch();
			const payload = this.setFormData();
			this.loading = true;
			await this.registerPsychologist(payload);
			this.loading = false;
		},
		...mapActions({ registerPsychologist: 'Psychologist/registerPsychologist' }),
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
