export class LocationAlreadyInUse extends Error {
  constructor() {
    super('Latitude and Longitude already in use');
  }
}
