export class VaccinationPointAlreadyHaveResponsible extends Error {
  constructor() {
    super('Vaccination Point already have a responsible');
  }
}
