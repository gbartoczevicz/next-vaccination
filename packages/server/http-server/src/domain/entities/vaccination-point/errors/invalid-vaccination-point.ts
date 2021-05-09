export class InvalidVaccinationPoint extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
