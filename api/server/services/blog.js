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
		categories,
		author: user,
		rating: '',
	};

	await Article.create(newArticle);

	return okResponse('articulo creado');
};

const getAllArticles = async () => {
	const articles = await Article.find({}).sort({ createdAt: -1 });
	return okResponse('articulos obtenidos', { articles });
};

const getArticle = async slug => {
	const article = await Article.findOne({ slug });
	return okResponse(`articulo encontrado ${slug}`, { article });
};

const blogService = {
	createArticle,
	getAllArticles,
	getArticle,
};

export default Object.freeze(blogService);
