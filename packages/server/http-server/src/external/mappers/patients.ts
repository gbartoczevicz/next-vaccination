import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { Patient as Persistence } from '@prisma/client';
import { EntityID, IMapper } from '@server/shared';
import { UserPersistence } from './users';

export type PatientPersistence = Omit<Persistence, 'createdAt' | 'updatedAt'> & {
  user: UserPersistence;
};

export class PatientsMapper implements IMapper<Patient, PatientPersistence> {
  private usersMapper: IMapper<User, UserPersistence>;

  get className(): string {
    return this.constructor.name;
  }

  constructor(usersMapper: IMapper<User, UserPersistence>) {
    this.usersMapper = usersMapper;
  }

  toDomain(persistence: PatientPersistence): Patient {
    const { id, user, ...props } = persistence;

    const domainOrError = Patient.create({
      ...props,
      id: new EntityID(id),
      user: <User>this.usersMapper.toDomain(user)
    });

    if (domainOrError.isLeft()) {
      console.error(`[${this.className}]`, domainOrError.value);
    }

    return domainOrError.value as Patient;
  }

  toPersistence(domain: Patient): PatientPersistence {
    const { id, document, birthday, avatar, ticket, user } = domain;

    const rawPatient: PatientPersistence = {
      id: id.value,
      document,
      birthday: birthday.value,
      avatar,
      ticket,
      userId: user.id.value,
      user: <UserPersistence>this.usersMapper.toPersistence(user)
    };

    return rawPatient;
  }
}
