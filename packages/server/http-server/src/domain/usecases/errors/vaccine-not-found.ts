export class VaccineNotFound extends Error {
  constructor() {
    super('Vaccine not found');
  }
}
