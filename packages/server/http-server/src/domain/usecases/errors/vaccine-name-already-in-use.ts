export class VaccineNameAlreadyInUse extends Error {
  constructor(name: string) {
    super(`Vaccine name ${name} is already in use`);
  }
}
