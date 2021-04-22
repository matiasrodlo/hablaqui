import { Router } from 'express';
import multer from 'multer';
import dataController from '../controllers/data';

const upload = multer({});

const dataRouter = Router();

dataRouter.post(
	'/data/upload',
	upload.single('csvFile'),
	dataController.uploadCsv
);

export default dataRouter;
