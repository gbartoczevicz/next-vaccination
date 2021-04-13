import { Router } from 'express';

import { usersRoutes } from '@modules/users/infra/http/routes';

const routes = Router();

routes.use(usersRoutes);

export { routes };
