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
				:value="specialist.code"
				@change="e => setSpecialist({ ...specialist, code: e })"
			></v-text-field>
		</v-col>
		<v-col cols="12" md="6">
			<v-text-field
				label="Perfil de Linkedin"
				filled
				outlined
				dense
				type="text"
				:value="specialist.linkedin"
				@change="e => setSpecialist({ ...specialist, linkedin: e })"
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
				:value="specialist.professionalDescription"
				counter
				:rules="rules"
				@change="e => setSpecialist({ ...specialist, professionalDescription: e })"
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
				:value="specialist.personalDescription"
				counter
				:rules="rules"
				@change="e => setSpecialist({ ...specialist, personalDescription: e })"
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
import { mapActions } from 'vuex';

export default {
	props: {
		specialist: {
			type: Object,
			default: null,
		},
		setSpecialist: {
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
		async onSubmite() {
			if (
				!(this.specialist.personalDescription.length <= 170) ||
				!(this.specialist.professionalDescription.length <= 170)
			)
				alert('Excedió el máximo de carácteres');
			else if (
				!this.specialist.professionalDescription ||
				!this.specialist.personalDescription
			)
				alert('Complete los campos faltantes');
			else {
				const specialist = await this.updateSpecialist(this.specialist);
				this.setSpecialist(specialist);
			}
		},
		...mapActions({
			updateSpecialist: 'Specialist/updateSpecialist',
		}),
	},
};
</script>
