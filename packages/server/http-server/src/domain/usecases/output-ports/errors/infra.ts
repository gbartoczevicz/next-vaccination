export class InfraError extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
