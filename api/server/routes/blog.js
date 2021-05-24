import { Router } from 'express';
import multer from '../middleware/multer';
import passport from 'passport';
import storage from '../middleware/storage';
import blogController from '../controllers/blog';

const blogRouter = Router();

blogRouter.post(
	'/blog/new-article',
	[
		passport.authenticate('jwt', { session: true }),
		multer.single('thumbnail'),
		storage,
	],
	blogController.createArticle
);

blogRouter.get('/blog/all', blogController.getAllArticles);

blogRouter.get('/blog/:slug', blogController.getArticle);

blogRouter.post(
	'/blog/:slug/update-rating/:newRating',
	blogController.updateRating
);

export default blogRouter;
