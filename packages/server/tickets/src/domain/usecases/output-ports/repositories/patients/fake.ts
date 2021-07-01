import { Patient } from '@entities/patient';
import { makeUser } from '@entities/user/fake';
import { EntityID, right } from '@server/shared';
import { FindUnique, IPatientsRepository, Save } from './patients';

export class FakePatientsRepository implements IPatientsRepository {
  async findById(id: string): Promise<FindUnique> {
    const fixture = Patient.create({
      id: new EntityID(id),
      user: makeUser({}),
      avatar: 'avatar.png'
    }).value as Patient;

    return Promise.resolve(right(fixture));
  }

  async save(patient: Patient): Promise<Save> {
    return Promise.resolve(right(patient));
  }
}
