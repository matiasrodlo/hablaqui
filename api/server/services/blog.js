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

	let rating = {
		average: 0.0,
		quantity: 0,
	};
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
		rating,
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

const updateRating = async (newRating, slug) => {
	newRating = Number(newRating);

	const article = await Article.findOne({ slug });

	let ratingFunction = (newRating, previousAverage, elements) => {
		return previousAverage + (newRating - previousAverage) / (elements + 1);
	};

	if (article.rating.quantity != 0) {
		await Article.findOneAndUpdate(
			{ slug },
			{
				$set: {
					'rating.average': ratingFunction(
						newRating,
						article.rating.average,
						article.rating.quantity
					),
					'rating.quantity': article.rating.quantity + 1,
				},
			}
		);
		return okResponse(`rating actualizado para ${slug}`);
	} else {
		await Article.findOneAndUpdate(
			{ slug },
			{
				$set: {
					'rating.average': newRating,
					'rating.quantity': 1,
				},
			}
		);
		return okResponse(`rating creado para ${slug}`);
	}
};

const blogService = {
	createArticle,
	getAllArticles,
	getArticle,
	updateRating,
};

export default Object.freeze(blogService);
