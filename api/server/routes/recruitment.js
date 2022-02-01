'use strict';

import { Router } from 'express';
import recruitmentController from '../controllers/recruitment';
import passport from 'passport';
import permission from '../middleware/permission';

const { corsApi } = permission;

const recruitmentRouter = Router();
/**
 * @description: Route to post a new recruitment profile for psychologist
 * @route: /api/v1/recruitment/register
 * @method: POST
 * @access: public (authenticated)
 */
recruitmentRouter.post(
	'/recruitment/register',
	[corsApi, passport.authenticate('jwt', { session: true })],
	recruitmentController.register
);
/**
 * @description: Route to update a recruitment profile for psychologist
 * @route: /api/v1/recruitment/update
 * @method: PUT
 * @access: public (authenticated)
 */
recruitmentRouter.put(
	'/recruitment/update',
	[corsApi, passport.authenticate('jwt', { session: true })],
	recruitmentController.update
);
/**
 * @description: Route to get the recruitment profile of psychologist by email
 * @route: /api/v1/recruitment/:email
 * @method: GET
 * @access: public (authenticated)
 */
recruitmentRouter.get(
	'/recruitment/:email',
	[corsApi, passport.authenticate('jwt', { session: true })],
	recruitmentController.get
);
/**
 * @description: Route to get all recruitment profile of psychologist
 * @route: /api/v1/recruitment
 * @method: GET
 * @access: public (authenticated)
 */
recruitmentRouter.get(
	'/recruitment',
	[corsApi, passport.authenticate('jwt', { session: true })],
	recruitmentController.getAll
);
/**
 * @description: Route to approve a Recruitment profile and to create a new psychologist profile
 * @route: /api/v1/recruitment/approve/:email
 * @method: POST
 * @access: public (authenticated)
 * @param: email
 **/
recruitmentRouter.post(
	'/recruitment/approve/:email',
	[corsApi, passport.authenticate('jwt', { session: true })],
	recruitmentController.approve
);

export default recruitmentRouter;
