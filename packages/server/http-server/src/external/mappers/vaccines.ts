import { Vaccine } from '@entities/vaccination-point';
import { Vaccine as Persistence } from '@prisma/client';
import { EntityID, IMapper } from '@server/shared';

export type VaccinesPersistence = Persistence;

export class VaccinesMapper implements IMapper<Vaccine, VaccinesPersistence> {
  get className(): string {
    return this.constructor.name;
  }

  toDomain(persistence: VaccinesPersistence): Vaccine {
    const { id, ...props } = persistence;

    const domainOrError = Vaccine.create({
      ...props,
      id: new EntityID(id)
    });

    if (domainOrError.isLeft()) {
      console.error(`[${this.className}]`, domainOrError.value);
    }

    return domainOrError.value as Vaccine;
  }

  toPersistence(domain: Vaccine): Persistence {
    const { id, ...props } = domain;

    const persistence: VaccinesPersistence = {
      ...props,
      id: id.value
    };

    return persistence;
  }
}
