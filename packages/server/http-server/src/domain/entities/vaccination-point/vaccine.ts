import { Either, EntityID, left, right } from '@server/shared';
import { InvalidVaccine } from './errors';

interface IVaccineProps {
  id?: EntityID;
  name: string;
  description: string;
}

export class Vaccine {
  readonly id: EntityID;

  readonly name: string;

  readonly description: string;

  constructor(name: string, description: string, id?: EntityID) {
    this.id = id || new EntityID();
    this.name = name;
    this.description = description;
  }

  static create(props: IVaccineProps): Either<InvalidVaccine, Vaccine> {
    if (!props.name) {
      return left(new InvalidVaccine('Name is required'));
    }

    if (!props.description) {
      return left(new InvalidVaccine('Description is required'));
    }

    const vaccine = new Vaccine(props.name, props.description, props.id);

    return right(vaccine);
  }
}
