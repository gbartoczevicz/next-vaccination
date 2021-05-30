import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { EntityID, right } from '@server/shared';
import { IPatientsRepository, Save, FindUnique } from './patients';

export class FakePatientsRepository implements IPatientsRepository {
  async save(patient: Patient): Promise<Save> {
    return Promise.resolve(right(patient));
  }

  async findById(id: string): Promise<FindUnique> {
    const fixture = Patient.create({
      id: new EntityID(id),
      birthday: new Date(),
      document: '000.000.000-00',
      user: User.create({
        id: new EntityID(),
        name: 'name',
        email: 'user@email.com',
        phone: '9999-9999',
        password: { password: 'secret' }
      }).value as User,
      avatar: 'avatar.png'
    }).value as Patient;

    return Promise.resolve(right(fixture));
  }

  async findByDocument(document: string): Promise<FindUnique> {
    const fixture = Patient.create({
      birthday: new Date(),
      document,
      user: User.create({
        id: new EntityID(),
        name: 'name',
        email: 'user@email.com',
        phone: '9999-9999',
        password: { password: 'secret' }
      }).value as User,
      avatar: 'avatar.png'
    }).value as Patient;

    return Promise.resolve(right(fixture));
  }

  async findByUser(user: User): Promise<FindUnique> {
    const fixture = Patient.create({
      birthday: new Date(),
      document: '000.000.000-00',
      user
    }).value as Patient;

    return Promise.resolve(right(fixture));
  }
}
