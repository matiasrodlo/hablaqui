import { Router } from 'express';
import multer from '../middleware/multer';
import passport from 'passport';
import dataController from '../controllers/data';
import storage from '../middleware/storage';

const dataRouter = Router();

dataRouter.post(
	'/data/upload',
	[
		passport.authenticate('jwt', { session: true }),
		multer.single('csvFile'),
		storage,
	],
	dataController.uploadCsv
);

export default dataRouter;
