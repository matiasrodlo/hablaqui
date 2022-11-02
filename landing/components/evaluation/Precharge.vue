<template>
	<v-container v-show="image">
		<v-row align="center" justify="center">
			<v-col cols="12">
				<div class="text-center text-h6 font-weight-bold mt-4">
					Estamos buscando a los mejores especialistas
				</div>
			</v-col>
			<v-col cols="12" md="2" class="text-center text-md-right">
				<v-progress-circular indeterminate color="primary" size="130" :width="15">
					<div class="spinner">
						<v-avatar size="120">
							<v-img :src="image" :lazy-src="image"></v-img>
						</v-avatar>
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
						<icon color="white" :icon="el.done ? mdiCheck : mdiClose" />
					</v-btn>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mdiCheck, mdiClose } from '@mdi/js';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		avatar: {
			type: Array,
			default: () => [],
		},
		close: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			mdiCheck,
			mdiClose,
			image: '',
			items: [
				{ title: 'Analisis de preferencias', done: false },
				{ title: 'Busqueda de especialistas', done: false },
				{ title: 'Evaluación de alternativas', avatar: '', done: false },
				{ title: 'Selección de especialistas', done: false },
			],
		};
	},
	mounted() {
		setTimeout(() => {
			this.image = this.avatar[0];
			this.items[0].done = true;
			setTimeout(() => {
				this.image = this.avatar[1];
				this.items[1].done = true;
				setTimeout(() => {
					this.image = this.avatar[2];
					this.items[2].done = true;
					setTimeout(() => {
						this.image = this.avatar[3];
						this.items[3].done = true;
						setTimeout(() => {
							this.image = this.avatar[4];
							this.close();
						}, 1500);
					}, 1500);
				}, 1500);
			}, 1500);
		}, 50);
	},
};
</script>

<style lang="scss" scoped></style>
