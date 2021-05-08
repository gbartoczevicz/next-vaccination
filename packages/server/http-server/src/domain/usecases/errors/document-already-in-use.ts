export class DocumentAlreadyInUse extends Error {
  constructor() {
    super('Document already in use');
  }
}
