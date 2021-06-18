import { HealthProfessional } from '@entities/health-professional';
import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { HealthProfessional as Persistence } from '@prisma/client';
import { EntityID, IMapper } from '@server/shared';
import { UsersPersistence } from './users';
import { VaccinationPointsPersistence } from './vaccination-points';

export type HealthProfessionalsPersistence = Omit<Persistence, 'createdAt' | 'updatedAt'> & {
  user: UsersPersistence;
  vaccinationPoint: VaccinationPointsPersistence;
};

export class HealthProfessionalsMapper implements IMapper<HealthProfessional, HealthProfessionalsPersistence> {
  private usersMapper: IMapper<User, UsersPersistence>;

  private vaccinationPointsMapper: IMapper<VaccinationPoint, VaccinationPointsPersistence>;

  get className(): string {
    return this.constructor.name;
  }

  constructor(
    usersMapper: IMapper<User, UsersPersistence>,
    vaccinationPointsMapper: IMapper<VaccinationPoint, VaccinationPointsPersistence>
  ) {
    this.usersMapper = usersMapper;
    this.vaccinationPointsMapper = vaccinationPointsMapper;
  }

  toDomain(persistence: HealthProfessionalsPersistence): HealthProfessional {
    const { id, user, vaccinationPoint, ...props } = persistence;

    const domainOrError = HealthProfessional.create({
      ...props,
      id: new EntityID(id),
      user: <User>this.usersMapper.toDomain(user),
      vaccinationPoint: <VaccinationPoint>this.vaccinationPointsMapper.toDomain(vaccinationPoint)
    });

    if (domainOrError.isLeft()) {
      console.error(`[${this.className}]`, domainOrError.value);
    }

    return domainOrError.value as HealthProfessional;
  }

  toPersistence(domain: HealthProfessional): HealthProfessionalsPersistence {
    const { id, user, vaccinationPoint, ...props } = domain;

    const persistence: HealthProfessionalsPersistence = {
      ...props,
      id: id.value,
      userId: user.id.value,
      vaccinationPointId: vaccinationPoint.id.value,
      user: <UsersPersistence>this.usersMapper.toPersistence(user),
      vaccinationPoint: <VaccinationPointsPersistence>this.vaccinationPointsMapper.toPersistence(vaccinationPoint)
    };

    return persistence;
  }
}
