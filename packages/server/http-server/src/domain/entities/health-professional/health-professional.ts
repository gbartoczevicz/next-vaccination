import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Either, EntityID, left, right } from '@server/shared';
import { InvalidHealthProfessional } from './errors';

interface IHealthProfessionalProps {
  id?: EntityID;
  user: User;
  vaccinationPoint: VaccinationPoint;
  document: string;
}

type CreateHealthProfessional = Either<InvalidHealthProfessional, HealthProfessional>;

export class HealthProfessional {
  readonly id: EntityID;

  readonly user: User;

  readonly vaccinationPoint: VaccinationPoint;

  readonly document: string;

  constructor(user: User, vaccinationPoint: VaccinationPoint, document: string, id?: EntityID) {
    this.id = id || new EntityID();
    this.user = user;
    this.vaccinationPoint = vaccinationPoint;
    this.document = document;
  }

  static create(props: IHealthProfessionalProps): CreateHealthProfessional {
    if (!props.document) {
      return left(new InvalidHealthProfessional('Document is required'));
    }

    if (!props.user) {
      return left(new InvalidHealthProfessional('User is required'));
    }

    if (!props.vaccinationPoint) {
      return left(new InvalidHealthProfessional('Vaccination Point is required'));
    }

    const healthProfessional = new HealthProfessional(props.user, props.vaccinationPoint, props.document);

    return right(healthProfessional);
  }
}
