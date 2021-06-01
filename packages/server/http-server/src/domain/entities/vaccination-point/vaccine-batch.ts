import { Either, EntityID, left, right } from '@server/shared';
import { InvalidExpirationDate, InvalidVaccineBatch } from './errors';
import { VaccinationPoint } from './vaccination-point';
import { Vaccine } from './vaccine';
import { ExpirationDate } from './values';
import { makeExpirationDate } from './values/factories/make-expiration-date';

export interface IVaccineBatchProps {
  id?: EntityID;
  vaccine: Vaccine;
  vaccinationPoint: VaccinationPoint;
  expirationDate: Date;
  stock: number;
}

export class VaccineBatch {
  readonly id?: EntityID;

  readonly vaccine: Vaccine;

  readonly vaccinationPoint: VaccinationPoint;

  readonly expirationDate: ExpirationDate;

  readonly stock: number;

  constructor(
    vaccine: Vaccine,
    vaccinationPoint: VaccinationPoint,
    expirationDate: ExpirationDate,
    stock: number,
    id?: EntityID
  ) {
    this.id = id || new EntityID();
    this.vaccine = vaccine;
    this.vaccinationPoint = vaccinationPoint;
    this.expirationDate = expirationDate;
    this.stock = stock;
  }

  static create(props: IVaccineBatchProps): Either<InvalidVaccineBatch | InvalidExpirationDate, VaccineBatch> {
    if (!props) {
      return left(new InvalidVaccineBatch('Props is required'));
    }

    const { vaccine, vaccinationPoint, expirationDate, stock } = props;

    const expirationDateOrError = makeExpirationDate(expirationDate);

    if (expirationDateOrError.isLeft()) {
      return left(expirationDateOrError.value);
    }

    if (!vaccine) {
      return left(new InvalidVaccineBatch('Vaccine is required'));
    }

    if (!vaccinationPoint) {
      return left(new InvalidVaccineBatch('Vaccination Point is required'));
    }

    if (stock == null || stock === undefined) {
      return left(new InvalidVaccineBatch('Stock is required'));
    }

    if (stock < 0) {
      return left(new InvalidVaccineBatch('Stock must be greater than 0'));
    }

    const vaccineBatch = new VaccineBatch(vaccine, vaccinationPoint, expirationDateOrError.value, stock, props.id);

    return right(vaccineBatch);
  }
}
