export class WrongProperty extends Error {
  constructor(prop: string) {
    super(`The property ${prop} is wrong for this case`);
  }
}
