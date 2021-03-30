import { Router } from 'express';
import passport from 'passport';
import psychologistsController from '../controllers/psychologist';
import grantAccess from '../middleware/strategies/rbac';
import multer from 'multer';

const upload = multer({
    dest: 'uploads/'
});

const psychologistsRouter = Router();

psychologistsRouter.get(
    '/psychologists/all',
    [
        passport.authenticate('jwt', { session: false }),
        grantAccess('readAny', 'psychologists')
    ],
    psychologistsController.getAll
);

psychologistsRouter.post(
    '/psychologists/upload',
    upload.single('csvFile'),
    /*[
        passport.authenticate('jwt', { session: false }),
        grantAccess('readAny', 'psychologists')
    ],*/
    psychologistsController.uploadCsv
)

export default psychologistsRouter;