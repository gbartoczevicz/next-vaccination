import { EntityID } from './EntityID';

export abstract class Entity<T> {
  protected readonly id: EntityID;

  public readonly props: T;

  constructor(props: T, id?: EntityID) {
    this.id = id || new EntityID();
    this.props = props;
  }

  public equals(entity?: Entity<T>): boolean {
    if (!entity) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    if (!(entity instanceof Entity)) {
      return false;
    }

    return this.id.equals(entity.id);
  }
}
