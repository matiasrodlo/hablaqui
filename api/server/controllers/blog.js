import { logInfo } from '../config/pino';
import blogService from '../services/blog';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';

const blogController = {
	async createArticle(req, res) {
		try {
			const { body, user } = req;
			const thumbnail = req.file.cloudStoragePublicUrl;
			const { data, code } = await blogService.createArticle(
				body,
				thumbnail,
				user
			);
			logInfo('articulo creado');
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error creando el articulo');
		}
	},
	async getAllArticles(req, res) {
		try {
			const { data, code } = await blogService.getAllArticles();
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error consiguiendo los articulos');
		}
	},
	async getArticle(req, res) {
		try {
			const { params } = req;
			const { data, code } = await blogService.getArticle(params.slug);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error consiguiendo el articulo');
		}
	},
};

export default Object.freeze(blogController);
