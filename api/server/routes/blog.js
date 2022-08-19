'use strict';

import { Router } from 'express';
import multer from '../middleware/multer';
import passport from 'passport';
import storage from '../middleware/storage';
import blogController from '../controllers/blog';

const blogRouter = Router();
/**
 * No se usa
 */
/**
 * Crea un nuevo articulo
 * NECESITA AUTENTICACION
 * 
 * Archivo en campo 'thumbnail'
 * req.body = {
		title: string,
		HTMLbody: string,
		notOriginal: boolean,
		originalAuthor: string,
		originalSource: string,
		categories: string,
	}
 */
blogRouter.post(
	'/blog/new-article',
	[
		passport.authenticate('jwt', { session: true }),
		multer.single('thumbnail'),
		storage,
	],
	blogController.createArticle
);

/**
 * No se usa
 */
/**
 * Consigue todos los articulos
 */
blogRouter.get('/blog/all', blogController.getAllArticles);

/**
 * No se usa
 */
/**
 * Consigue el articulo con el slug especificado
 */
blogRouter.get('/blog/:slug', blogController.getArticle);

/**
 * No se usa
 */
/**
 * Actualiza las valoraciones del articulo.
 * slug: string, newRating: integer
 */
blogRouter.post(
	'/blog/:slug/update-rating/:newRating',
	blogController.updateRating
);

export default blogRouter;
