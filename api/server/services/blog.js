import { logInfo } from '../config/pino';
import Article from '../models/article';
import { conflictResponse, okResponse } from '../utils/responses/functions';
const createArticle = async (body, thumbnail, user) => {
	const {
		title,
		HTMLbody,
		notOriginal,
		originalAuthor,
		originalSource,
		categories,
	} = body;

	if (user.role != 'psychologist') {
		logInfo('Error de roles al crear un articulo');
		return conflictResponse('Lo siento, pero no eres un psicologo');
	}

	const author = user.psychologist.name;
	const authorDescription = user.psychologist.professionalDescription;
	const authorAvatar = user.psychologist.avatar;

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
		originalSource,
		thumbnail,
		slug,
		categories,
		author,
		authorDescription,
		authorAvatar,
		rating,
	};

	await Article.create(newArticle);

	logInfo('articulo creado');
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

const updateRating = async (newRating, slug, body) => {
	newRating = Number(newRating);
	const article = await Article.findOne({ slug });

	let ratingFunction = (newRating, previousAverage, elements) => {
		return previousAverage + (newRating - previousAverage) / (elements + 1);
	};

	let updatedRating = null;

	if (article.rating.quantity != 0) {
		updatedRating = await Article.findOneAndUpdate(
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
			},
			{
				returnOriginal: false,
			}
		);
	} else {
		updatedRating = await Article.findOneAndUpdate(
			{ slug },
			{
				$set: {
					'rating.average': newRating,
					'rating.quantity': 1,
				},
			},
			{
				returnOriginal: false,
			}
		);
	}
	return okResponse(`rating actualizado para ${slug}`, {
		rating: updatedRating.rating,
	});
};

const blogService = {
	createArticle,
	getAllArticles,
	getArticle,
	updateRating,
};

export default Object.freeze(blogService);
