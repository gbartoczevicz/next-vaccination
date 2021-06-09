import { makeUser } from '@entities/user/fake';
import { EntityID } from '@server/shared';
import { Patient } from './patient';

export const makePatient = ({ id = 'patient_id', avatar = 'avatar.png', ticket = 'ticket.pdf' }) => {
  const fixture = Patient.create({
    id: new EntityID(id),
    user: makeUser({}),
    avatar,
    ticket
  }).value;

  return fixture;
};
