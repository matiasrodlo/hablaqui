'use strict';

import { Router } from 'express';
import multer from '../middleware/multer';
import dataController from '../controllers/data';
import passport from 'passport';
import storage from '../middleware/storage';

const dataRouter = Router();

/** Meh */
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
