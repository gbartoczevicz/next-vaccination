export class InvalidVaccineBatch extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
