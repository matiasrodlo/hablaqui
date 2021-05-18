<template>
	<div>
		<v-container>
			<h1 style="text-align: center;">Nueva entrada</h1>
			<v-text-field v-model="form.title" label="Titulo" required></v-text-field>
			<v-textarea
				v-model="form.shortDescription"
				label="Descripcion breve"
				:rules="rules"
				height="75px"
				class="mt-5"
				counter
				required
			></v-textarea>
			<vue-editor v-model="form.HTMLbody"></vue-editor>
			<v-file-input
				accept="image/png, image/jpeg, image/bmp"
				placeholder="Foto de portada"
				prepend-icon="mdi-camera"
				label="Foto de portada"
				@change="setThumbnail"
			></v-file-input>
			<v-checkbox
				v-model="form.notOriginal"
				label="Este blog fue extraido de otro articulo?"
			></v-checkbox>
			<v-container v-if="form.notOriginal">
				<v-text-field
					label="Ingresa el nombre del autor"
					v-model="form.originalAuthor"
				></v-text-field>
				<v-text-field
					label="Ingresa un link de referencia"
					v-model="form.originalLink"
				></v-text-field>
			</v-container>
			<v-btn color="primary" class="mt-10 mx-2" rounded @click="submitForm"
				>Crear entrada</v-btn
			>
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
		return {
			form: null,
			thumbnailUrl: '',
			rules: [v => v.length <= 140 || 'Maximo de 140 caracteres'],
		};
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
				shortDescription: '',
				thumbnail: '',
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

			return formData;
		},

		async submitForm() {
			const payload = this.setFormData();
			await this.createArticle(payload);
			this.submitted = true;
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
