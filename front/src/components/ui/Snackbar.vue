<template>
	<v-snackbar v-model="show" :color="color" right top tile data-cy="snackBar">
		{{ message }}
		<template v-slot:action="{ attrs }">
			<v-btn dark text v-bind="attrs" @click="show = false">
				Cerrar
			</v-btn>
		</template>
	</v-snackbar>
</template>

<script>
export default {
	name: 'Snackbar',
	data() {
		return {
			show: false,
			message: '',
			color: '',
		};
	},
	created() {
		this.$store.subscribe((mutation, state) => {
			if (mutation.type === 'Snackbar/showMessage') {
				this.message = state.Snackbar.content;
				this.color = state.Snackbar.color;
				this.show = true;
			}
		});
	},
};
</script>
