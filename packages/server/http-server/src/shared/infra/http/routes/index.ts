import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  console.log(request);

  return response.json({ message: 'Hello World' });
});

export { routes };
