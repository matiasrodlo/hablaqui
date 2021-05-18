import Article from '../models/article';
import moment from 'moment';
import { okResponse } from '../utils/responses/functions';
const createArticle = async (body, thumbnail, user) => {
	const { title, HTMLbody, notOriginal, originalAuthor, originalLink } = body;
	const now = moment.now();
	const newArticle = {
		title,
		HTMLbody,
		notOriginal,
		originalAuthor,
		originalLink,
		thumbnail,
		author: user,
		rating: '',
	};

	Article.create(newArticle);

	return okResponse('articulo creado');
};

const getAllArticles = async () => {
	const articles = await Article.find({}).sort({ createdAt: -1 });
	return okResponse('articulos obtenidos', { articles });
};

const blogService = {
	createArticle,
	getAllArticles,
};

export default Object.freeze(blogService);
