import axios from '@/plugins/axios';
import { snackBarError } from '@/utils/snackbar';

export default {
	async createArticle({ commit }, payload) {
		try {
			await axios('/blog/new-article', {
				method: 'POST',
				data: payload,
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
