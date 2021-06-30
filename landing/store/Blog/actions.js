import { snackBarError, snackBarSuccess } from '@/utils/snackbar';

export default {
	async createArticle({ commit }, payload) {
		try {
			await this.$axios('/blog/new-article', {
				method: 'POST',
				data: payload,
			});
			snackBarSuccess('Articulo creado exitosamente')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
