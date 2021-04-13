import { Router } from 'express';

import { createUserController } from '@modules/users/useCases/createUser';

const routes = Router();

routes.post('/users', (request, response) => createUserController.execute(request, response));

export { routes as usersRoutes };
