<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12">
				<div class="text-center text-h4 font-weight-bold mt-4">
					¡Ya está todo casi listo!
				</div>
				<div class="text-center text-h6 font-weight-bold mt-4">
					Espera un momento mientras encontramos los mejores especialistas según tus
					preferencias
				</div>
			</v-col>
			<v-col cols="12" md="2" class="text-center text-md-right">
				<v-progress-circular indeterminate color="primary" size="130" :width="15">
					<div class="spinner">
						<v-img width="120" :src="image"></v-img>
					</div>
				</v-progress-circular>
			</v-col>
			<v-col cols="12" md="4" lg="3" class="text-center text-md-left">
				<div
					v-for="(el, i) in items"
					:key="i"
					class="my-3 font-weight-bold d-flex align-center justify-space-between"
				>
					<span>{{ el.title }}</span>
					<v-btn style="width: 32px" fab depressed color="primary" x-small>
						<v-icon>{{ el.done ? 'mdi-check' : 'mdi-close' }}</v-icon>
					</v-btn>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	props: {
		avatar: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			image: '',
			items: [
				{ title: 'Calculando tu perfil', done: false },
				{ title: 'Buscando especialistas para ti', done: false },
				{ title: 'Analizando sugerencias', avatar: '', done: false },
				{ title: 'Seleccionando especialistas', done: false },
			],
		};
	},
	created() {
		setTimeout(() => {
			this.image = this.avatar[0];
			this.items[0].done = true;
		}, 400);
		setTimeout(() => {
			this.image = this.avatar[1];
			this.items[1].done = true;
		}, 800);
		setTimeout(() => {
			this.image = this.avatar[2];
			this.items[2].done = true;
		}, 1500);
		setTimeout(() => {
			this.image = this.avatar[3];
			this.items[3].done = true;
		}, 2300);
	},
};
</script>

<style lang="scss" scoped></style>
