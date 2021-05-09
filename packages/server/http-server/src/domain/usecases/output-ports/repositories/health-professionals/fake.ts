import { HealthProfessional } from '@entities/health-professional';
import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { EntityID, right } from '@server/shared';
import { FindUnique, IHealthProfessionalsRepository, Save } from './health-professionals';

const makeFixture = (document = 'health_professional_document') => ({
  document,
  user: User.create({
    id: new EntityID(),
    name: 'name',
    email: 'user@email.com',
    phone: '9999-9999',
    password: { password: 'secret' }
  }).value as User,
  vaccinationPoint: VaccinationPoint.create({
    id: new EntityID(),
    name: 'Vaccination Point',
    phone: '0000-0000',
    document: 'vaccination_point_document',
    location: {
      address: 'vaccination point address',
      addressNumber: 25,
      latitude: 20.0,
      longitude: 30.0
    }
  }).value as VaccinationPoint
});

export class FakeHealthProfessionalsRepository implements IHealthProfessionalsRepository {
  async findByDocument(document: string): Promise<FindUnique> {
    const fixture = HealthProfessional.create(makeFixture(document)).value as HealthProfessional;

    return Promise.resolve(right(fixture));
  }

  async save(healthProfessional: HealthProfessional): Promise<Save> {
    return Promise.resolve(right(healthProfessional));
  }
}
