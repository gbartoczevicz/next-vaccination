import { VaccinationPoint } from '@entities/vaccination-point';
import { Location, VaccinationPoint as Persistence } from '@prisma/client';
import { EntityID, IMapper } from '@server/shared';

export type VaccinationPointsPersistence = Omit<Persistence, 'createdAt' | 'updatedAt'> & {
  location: Location;
};

export class VaccinationPointsMapper implements IMapper<VaccinationPoint, VaccinationPointsPersistence> {
  get className(): string {
    return this.constructor.name;
  }

  toDomain(persistence: VaccinationPointsPersistence): VaccinationPoint {
    const { id, location, ...props } = persistence;

    const domainOrError = VaccinationPoint.create({
      ...props,
      id: new EntityID(id),
      location: {
        address: location.address,
        addressNumber: location.addressNumber,
        coordinate: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      }
    });

    if (domainOrError.isLeft()) {
      console.error(`[${this.className}]`, domainOrError.value);
    }

    return domainOrError.value as VaccinationPoint;
  }

  toPersistence(domain: VaccinationPoint): VaccinationPointsPersistence {
    const { id, name, document, phone, availability, location } = domain;

    const persistence: VaccinationPointsPersistence = {
      id: id.value,
      name,
      document,
      phone: phone.value,
      availability,
      location: {
        address: location.address,
        addressNumber: location.addressNumber,
        latitude: location.coordinate.latitude,
        longitude: location.coordinate.longitude,
        vaccinationPointId: id.value
      }
    };

    return persistence;
  }
}
