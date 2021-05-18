<template>
	<div>
		<v-container>
			<v-row justify="center">
				<v-col class="text-center headline font-weight-bold mt-12" cols="12">
					Nueva entrada
				</v-col>
				<v-col cols="12">
					<v-text-field
						hide-details
						v-model="form.title"
						label="Titulo"
						required
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<vue-editor v-model="form.HTMLbody"></vue-editor>
				</v-col>
				<v-col cols="12">
					<v-file-input
						accept="image/png, image/jpeg, image/bmp"
						placeholder="Foto de portada"
						prepend-icon="mdi-camera"
						label="Foto de portada"
						@change="setThumbnail"
					/>
				</v-col>
				<v-col cols="12">
					<v-text-field
						label="Ingresa el nombre del autor"
						v-model="form.originalAuthor"
					></v-text-field>
					<v-checkbox
						v-model="form.notOriginal"
						label="Este blog fue extraido de otro articulo?"
					></v-checkbox>
					<v-text-field
						v-if="form.notOriginal"
						label="Ingresa un link de referencia"
						v-model="form.originalLink"
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<h3>Categorias</h3>
					<v-checkbox
						class="d-inline-block ma-2"
						v-model="form.categories"
						value="Para empresas"
						label="Para empresas"
					></v-checkbox>
					<v-checkbox
						class="d-inline-block ma-2"
						v-model="form.categories"
						value="Salud y bienestar"
						label="Salud y bienestar"
					></v-checkbox>
					<v-checkbox
						class="d-inline-block ma-2"
						v-model="form.categories"
						value="Familia y amigos"
						label="Familia y amigos"
					></v-checkbox>
					<v-checkbox
						class="d-inline-block ma-2"
						v-model="form.categories"
						value="Autoconocimiento"
						label="Autoconocimiento"
					></v-checkbox>
					<v-checkbox
						class="d-inline-block ma-2"
						v-model="form.categories"
						value="Pareja y sexo"
						label="Pareja y sexo"
					></v-checkbox>
				</v-col>
				<v-col cols="12" class="text-center">
					<v-btn
						class="px-10 py-6"
						:loading="loading"
						color="primary"
						rounded
						@click="submitForm"
					>
						Crear entrada
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import { VueEditor } from 'vue2-editor';
import { mapActions } from 'vuex';
export default {
	components: {
		VueEditor,
	},
	data() {
		return { loading: false, form: null, thumbnailUrl: '' };
	},
	created() {
		this.defaultForm();
	},
	methods: {
		defaultForm() {
			this.form = {
				HTMLbody: '<p> Empieza a escribir </p>',
				title: '',
				notOriginal: false,
				originalAuthor: '',
				originalLink: '',
				thumbnail: '',
				categories: [],
			};
		},
		setFormData() {
			const formData = new FormData();
			formData.append('HTMLbody', this.form.HTMLbody);
			formData.append('title', this.form.title);
			formData.append('notOriginal', this.form.notOriginal);
			formData.append('originalAuthor', this.form.originalAuthor);
			formData.append('originalLink', this.form.originalLink);
			formData.append('thumbnail', this.form.thumbnail);
			formData.append('categories', JSON.stringify(this.form.categories));
			return formData;
		},

		async submitForm() {
			this.loading = true;
			const payload = this.setFormData();
			await this.createArticle(payload);
			this.defaultForm();
			this.loading = false;
		},
		setThumbnail(file) {
			this.thumbnailUrl = URL.createObjectURL(file);
			this.form.thumbnail = file;
		},
		...mapActions({
			createArticle: 'Blog/createArticle',
		}),
	},
};
</script>

<style></style>
