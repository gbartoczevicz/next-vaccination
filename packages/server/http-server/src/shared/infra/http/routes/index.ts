import { Router } from 'express';

import { EntityID } from '@server/shared';

const routes = Router();

routes.get('/test-uuid', (_, response) => {
  const idToCompare = new EntityID();

  const toBeTrue = new EntityID(idToCompare.toValue());
  const toBeFalse = new EntityID();

  console.log({
    idToCompare,
    toBeTrue,
    isEquals: toBeTrue.equals(idToCompare)
  });

  console.log({
    idToCompare,
    toBeFalse,
    isEquals: toBeFalse.equals(idToCompare)
  });

  return response.sendStatus(200);
});

routes.get('/', (request, response) => {
  console.log(request);

  return response.json({ message: 'Hello World' });
});

export { routes };
