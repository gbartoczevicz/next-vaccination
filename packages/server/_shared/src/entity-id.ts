import { v4 as uuid } from 'uuid';

export class EntityID {
  readonly value: string;

  constructor(id?: string) {
    this.value = id || uuid();
  }

  toValue(): string {
    return this.value;
  }

  equals(id?: EntityID): boolean {
    if (!id) {
      return false;
    }

    if (!(id instanceof EntityID)) {
      return false;
    }

    return id.toValue() === this.toValue();
  }
}
