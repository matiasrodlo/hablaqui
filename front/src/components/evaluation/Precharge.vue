<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12">
				<div class="text-center text-h4 font-weight-bold">¡Ya está todo casi listo!</div>
				<div class="text-center caption font-weight-bold">
					Espera un momento mientras encontramos los mejores especialistas según tus
					preferencias
				</div>
			</v-col>
			<v-col cols="12" md="4" class="text-center text-md-right">
				<v-progress-circular indeterminate color="primary" size="130" :width="15">
					<div class="spinner"></div>
				</v-progress-circular>
			</v-col>
			<v-col cols="12" md="8" class="text-center text-md-left">
				<div
					v-for="el in items"
					:key="el"
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
	data() {
		return {
			items: [
				{ title: 'Calculando tu perfil', done: false },
				{ title: 'Buscando especialistas para ti', done: false },
				{ title: 'Analizando sugerencias', done: false },
				{ title: 'Seleccionando especialistas', done: false },
			],
		};
	},
	created() {
		setTimeout(() => {
			this.items[0].done = true;
		}, 200);
		setTimeout(() => {
			this.items[1].done = true;
		}, 500);
		setTimeout(() => {
			this.items[2].done = true;
		}, 1200);
		setTimeout(() => {
			this.items[3].done = true;
		}, 2000);
	},
};
</script>

<style lang="scss" scoped></style>
