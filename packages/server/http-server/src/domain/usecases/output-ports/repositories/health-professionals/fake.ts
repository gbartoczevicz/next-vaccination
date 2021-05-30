import { HealthProfessional } from '@entities/health-professional';
import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Coordinate } from '@entities/vaccination-point/values';
import { EntityID, right } from '@server/shared';
import { FindUnique, IHealthProfessionalsRepository, Save } from './health-professionals';

const makeFixture = ({
  document = 'health_professional_document',
  responsible = false,
  vaccinationPointId = 'vaccination_point_id',
  id = 'health_professional_id',
  userId = 'any_user_id'
}) => ({
  id: new EntityID(id),
  document,
  responsible,
  user: User.create({
    id: new EntityID(userId),
    name: 'name',
    email: 'user@email.com',
    phone: '9999-9999',
    password: { password: '1234567890' }
  }).value as User,
  vaccinationPoint: VaccinationPoint.create({
    id: new EntityID(vaccinationPointId),
    name: 'Vaccination Point',
    phone: '0000-0000',
    document: 'vaccination_point_document',
    location: {
      address: 'vaccination point address',
      addressNumber: 25,
      coordinate: Coordinate.create({
        latitude: 20.0,
        longitude: 30.0
      }).value as Coordinate
    },
    availability: 20
  }).value as VaccinationPoint
});

export class FakeHealthProfessionalsRepository implements IHealthProfessionalsRepository {
  async findById(id: string): Promise<FindUnique> {
    const fixture = HealthProfessional.create(makeFixture({ id })).value as HealthProfessional;

    return Promise.resolve(right(fixture));
  }

  async findByUser(user: User): Promise<FindUnique> {
    const fixture = HealthProfessional.create(makeFixture({ userId: user.id.value })).value as HealthProfessional;

    return Promise.resolve(right(fixture));
  }

  async findByUserAndIsResponsible(user: User): Promise<FindUnique> {
    const fixture = HealthProfessional.create({
      ...makeFixture({ userId: user.id.value }),
      responsible: true
    }).value as HealthProfessional;

    return Promise.resolve(right(fixture));
  }

  async findByDocument(document: string): Promise<FindUnique> {
    const fixture = HealthProfessional.create(makeFixture({ document })).value as HealthProfessional;

    return Promise.resolve(right(fixture));
  }

  async findByVaccinationPointIdAndIsResponsible(vaccinationPointId: string): Promise<FindUnique> {
    const fixture = HealthProfessional.create(makeFixture({ vaccinationPointId, responsible: true }))
      .value as HealthProfessional;

    return Promise.resolve(right(fixture));
  }

  async save(healthProfessional: HealthProfessional): Promise<Save> {
    return Promise.resolve(right(healthProfessional));
  }
}
