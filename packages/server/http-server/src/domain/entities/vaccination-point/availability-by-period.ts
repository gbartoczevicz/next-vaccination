import { Either, left, right } from '@server/shared';
import { InvalidAvailabilityByPeriod } from './errors';
import { VaccinationPoint } from './vaccination-point';

interface IAvailabilityByPeriodProps {
  morning: number;
  evening: number;
  dusk: number;
  vaccinationPoint: VaccinationPoint;
}

export class AvailabilityByPeriod {
  readonly morning: number;

  readonly evening: number;

  readonly dusk: number;

  readonly vaccinationPoint: VaccinationPoint;

  constructor(morning: number, evening: number, dusk: number, vaccinationPoint: VaccinationPoint) {
    this.morning = morning;
    this.evening = evening;
    this.dusk = dusk;
    this.vaccinationPoint = vaccinationPoint;
  }

  static create(props: IAvailabilityByPeriodProps): Either<InvalidAvailabilityByPeriod, AvailabilityByPeriod> {
    if (!props.morning) {
      return left(new InvalidAvailabilityByPeriod('Morning value is required'));
    }

    if (!props.evening) {
      return left(new InvalidAvailabilityByPeriod('Evening value is required'));
    }

    if (!props.dusk) {
      return left(new InvalidAvailabilityByPeriod('Dusk value is required'));
    }

    if (!props.vaccinationPoint) {
      return left(new InvalidAvailabilityByPeriod('Vaccination Point is required'));
    }

    const availabilityByPeriod = new AvailabilityByPeriod(
      props.morning,
      props.evening,
      props.dusk,
      props.vaccinationPoint
    );

    return right(availabilityByPeriod);
  }
}
