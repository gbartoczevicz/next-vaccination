import { EntityID } from '@server/shared';
import { User } from './user';

export const makeUser = ({ id = 'user_id', name = 'user name' }) => {
  const fixture = User.create({
    id: new EntityID(id) || new EntityID(),
    name
  }).value as User;

  return fixture;
};
