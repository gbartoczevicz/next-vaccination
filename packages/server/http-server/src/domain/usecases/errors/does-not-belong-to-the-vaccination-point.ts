export class DoesNotBelongToTheVaccinationPoint extends Error {
  constructor() {
    super('The current user does not belong to the vaccination point');
  }
}
