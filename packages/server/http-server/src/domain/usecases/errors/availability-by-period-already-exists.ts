export class AvailabilityByPeriodAlreadyExists extends Error {
  constructor() {
    super('Availability by period already exists in this vaccination point');
  }
}
