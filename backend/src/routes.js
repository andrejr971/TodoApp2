import { Router } from 'express';

/**
 *
 * impoert controlls
 */
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

/**
 *
 * import middlewares
 */

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

routes.post('/login', SessionController.store);

routes.use(authMiddlewares);
/**
 * routes users
 */
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

export default routes;
