export class InvalidAvailabilityByPeriod extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
