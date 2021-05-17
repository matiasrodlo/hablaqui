import { Router } from 'express';
import passport from 'passport';
import multer from '../middleware/multer';
import storage from '../middleware/storage';
import blogController from '../controllers/blog';

const blogRouter = Router();

blogRouter.post(
	'/blog/new-article',
	[
		//passport.authenticate('jwt', { session: true }),
		multer.single('thumbnail'),
		storage,
	],
	blogController.createArticle
);

blogRouter.get('/blog/all', blogController.getAllArticles);

export default blogRouter;
