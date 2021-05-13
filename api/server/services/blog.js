import Article from '../models/article';
import moment from 'moment';
import { okResponse } from '../utils/responses/functions';
const createArticle = async (body, thumbnail, user) => {
	const { title, HTMLbody, notOriginal, originalAuthor, originalLink } = body;
	const now = moment.now();
	const newArticle = {
		title,
		HTMLbody,
		date: now,
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

const blogService = {
	createArticle,
};

export default Object.freeze(blogService);
