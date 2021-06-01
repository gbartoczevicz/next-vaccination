export class WithoutVaccineBatchesWithinExpirationDate extends Error {
  constructor() {
    super('Vaccination Point without vaccine batches within expiration date');
  }
}
