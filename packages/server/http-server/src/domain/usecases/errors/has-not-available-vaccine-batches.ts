export class HasNotAvailableVaccineBatches extends Error {
  constructor() {
    super('Vaccination Point has not available vaccine batches');
  }
}
