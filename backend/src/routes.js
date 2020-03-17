import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

/**
 *
 * impoert controlls
 */
import UserController from './app/controllers/UserController';
import AdministratorController from './app/controllers/AdministratorControllers';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import SectorController from './app/controllers/SectorController';
import AssignController from './app/controllers/AssignController';
import TodoController from './app/controllers/TodoController';
import TodosViewsController from './app/controllers/TodosViewsController';

/**
 *
 * import middlewares
 */

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.store);

routes.use(authMiddlewares);
/**
 * routes users
 */
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.get('/users', UserController.index);
routes.delete('/user/:id', UserController.delete);
routes.post('/files', upload.single('file'), FileController.store);

/**
 * routes adms
 */
routes.get('/administrators', AdministratorController.index);

/**
 * routes sectors
 */
routes.get('/sectors', SectorController.index);
routes.post('/sectors', SectorController.store);
routes.put('/sectors/:id', SectorController.update);
routes.delete('/sectors/:id', SectorController.delete);

/** routes to assign sector to user */
routes.post('/assign/:id', AssignController.store);
routes.delete('/assign/:id', AssignController.delete);

/**
 * routes todos
 */
routes.get('/my_todos', TodoController.show);
routes.post('/todos', TodoController.store);
routes.put('/todos/:id', TodoController.update);
routes.delete('/todos/:id', TodoController.delete);

/** routes list todos */
routes.get('/todos', TodosViewsController.index);
routes.get('/todos/:id', TodosViewsController.show);

export default routes;
