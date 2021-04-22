import { Router } from 'express';
import multer from 'multer';
import passport from 'passport';
import dataController from '../controllers/data';
import storage from '../middleware/storage';

const upload = multer({
	dest: 'uploads/',
});

const dataRouter = Router();

dataRouter.post(
	'/data/upload',
	[
		passport.authenticate('jwt', { session: true }),
		upload.single('csvFile'),
		storage,
	],
	dataController.uploadCsv
);

export default dataRouter;
