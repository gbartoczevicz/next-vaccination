import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { Either, EntityID, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { IPatientsRepository } from './patients';

export class FakePatientsRepository implements IPatientsRepository {
  async save(patient: Patient): Promise<Either<InfraError, Patient>> {
    return Promise.resolve(right(patient));
  }

  async findByDocument(document: string): Promise<Either<InfraError, Patient | null>> {
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
}
