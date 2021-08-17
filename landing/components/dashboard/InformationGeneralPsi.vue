<template>
	<v-row class="mb-16 mt-10">
		<v-col cols="12">
			<div class="body-1 font-weight-bold secondary--text mb-2">Datos profesionales</div>
		</v-col>
		<v-col cols="12" md="6">
			<v-text-field
				label="Codigo"
				filled
				outlined
				dense
				type="text"
				:value="psychologist.code"
				@change="e => setPsychologist({ ...psychologist, code: e })"
			></v-text-field>
		</v-col>
		<v-col cols="12" md="6">
			<v-text-field
				label="Perfil de Linkedin"
				filled
				outlined
				dense
				type="text"
				:value="psychologist.linkedin"
				@change="e => setPsychologist({ ...psychologist, linkedin: e })"
			></v-text-field>
		</v-col>
		<v-col cols="12">
			<div class="body-1 font-weight-bold secondary--text mb-2">Descripción profesional</div>
		</v-col>
		<v-col cols="12">
			<v-textarea
				label="Descripción"
				no-resize
				filled
				outlined
				dense
				type="text"
				:value="psychologist.professionalDescription"
				counter
				:rules="rules"
				@change="e => setPsychologist({ ...psychologist, professionalDescription: e })"
			></v-textarea>
		</v-col>
		<v-col cols="12">
			<div class="body-1 font-weight-bold secondary--text mb-2">Presentación personal</div>
		</v-col>
		<v-col cols="12">
			<v-textarea
				label="Descripción"
				no-resize
				filled
				outlined
				dense
				type="text"
				:value="psychologist.personalDescription"
				counter
				:rules="rules"
				@change="e => setPsychologist({ ...psychologist, personalDescription: e })"
			></v-textarea>
		</v-col>
		<v-col cols="12" class="text-center">
			<v-btn color="primary" depressed class="px-16" style="border-radius: 10px">
				Guardar
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
export default {
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
			rules: [v => v.length <= 300 || 'Maximo 300 caracteres'],
		};
	},
};
</script>

<style lang="scss" scoped></style>
