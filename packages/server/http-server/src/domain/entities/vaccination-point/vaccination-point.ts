import { Phone } from '@entities/phone';
import { InvalidPhone } from '@entities/phone/errors';
import { Either, EntityID, left, right } from '@server/shared';
import { InvalidLocation, InvalidVaccinationPoint } from './errors';
import { Location, ILocationProps } from './values';

interface IVaccinationPointProps {
  id?: EntityID;
  name: string;
  phone: string;
  document: string;
  location: ILocationProps;
  availability: number;
}

export type CreateVaccinationPointErrors = InvalidVaccinationPoint | InvalidLocation | InvalidPhone;

type CreateVaccinationPoint = Either<CreateVaccinationPointErrors, VaccinationPoint>;

export class VaccinationPoint {
  readonly id: EntityID;

  readonly name: string;

  readonly phone: Phone;

  readonly document: string;

  readonly location: Location;

  readonly availability: number;

  constructor(name: string, phone: Phone, document: string, location: Location, availability: number, id?: EntityID) {
    this.id = id || new EntityID();
    this.name = name;
    this.phone = phone;
    this.document = document;
    this.location = location;
    this.availability = availability;
  }

  static create(props: IVaccinationPointProps): CreateVaccinationPoint {
    const { id, name, phone, document, location, availability } = props;

    if (!name) {
      return left(new InvalidVaccinationPoint('Name is required'));
    }

    if (availability == null || availability === undefined) {
      return left(new InvalidVaccinationPoint('Availability is required'));
    }

    if (availability < 0) {
      return left(new InvalidVaccinationPoint('Availability must be greater than 0'));
    }

    const phoneOrError = Phone.create(phone);

    if (phoneOrError.isLeft()) {
      return left(phoneOrError.value);
    }

    if (!document) {
      return left(new InvalidVaccinationPoint('Document is required'));
    }

    if (!location) {
      return left(new InvalidVaccinationPoint('Location is required'));
    }

    const locationOrError = Location.create(location);

    if (locationOrError.isLeft()) {
      return left(locationOrError.value);
    }

    const vaccinationPoint = new VaccinationPoint(
      name,
      phoneOrError.value,
      document,
      locationOrError.value,
      availability,
      id
    );

    return right(vaccinationPoint);
  }
}
