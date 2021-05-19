import Article from '../models/article';
import { okResponse } from '../utils/responses/functions';
const createArticle = async (body, thumbnail, user) => {
	const {
		title,
		HTMLbody,
		notOriginal,
		originalAuthor,
		originalLink,
		categories,
	} = body;

	let slug = title
		.toLowerCase()
		.replace(/[^\w ]+/g, '')
		.replace(/ +/g, '-');
	const newArticle = {
		title,
		HTMLbody,
		notOriginal,
		originalAuthor,
		originalLink,
		thumbnail,
		slug,
		categories: JSON.parse(categories),
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
