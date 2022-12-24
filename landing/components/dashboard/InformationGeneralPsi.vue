<template>
	<v-row class="mb-16 mt-10">
		<v-col cols="12">
			<div class="body-1 font-weight-bold secondary--text mb-2">Datos profesionales</div>
		</v-col>
		<v-col cols="12" md="6">
			<v-text-field
				label="Código"
				filled
				disabled
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
			<v-btn
				color="primary"
				depressed
				class="px-16"
				style="border-radius: 10px"
				@click="onSubmite"
			>
				Guardar
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

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
			rules: [
				value => value.length <= 170 || 'Máximo 170 carácteres',
				value => !!value || 'Este campo es requerido.',
			],
		};
	},
	methods: {
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
		async onSubmite() {
			if(
				!(this.psychologist.personalDescription.length <= 170) ||
				!(this.psychologist.professionalDescription.length <= 170)
			)
			{
				this.snackBar({
						// Se genera un snackbar con la alerta correspondiente
						content: 'Excedió el límite de carácteres',
						color: 'error',
					});
			}
			else if (
				!this.psychologist.professionalDescription ||
				!this.psychologist.personalDescription
			)
			{
					this.snackBar({
						// Se genera un snackbar con la alerta correspondiente
						content: 'Complete los campos faltantes',
						color: 'error',
					});
				}
			else{
			const psychologist = await this.updatePsychologist(this.psychologist);
			this.setPsychologist(psychologist);
			}
		},
		...mapActions({
			updatePsychologist: 'Psychologist/updatePsychologist',
		}),
	},
};
</script>
