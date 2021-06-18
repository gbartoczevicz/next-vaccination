import { VaccinationPoint, Vaccine, VaccineBatch } from '@entities/vaccination-point';
import { VaccineBatch as Persistence } from '@prisma/client';
import { EntityID, IMapper } from '@server/shared';
import { VaccinationPointsPersistence } from './vaccination-points';
import { VaccinesPersistence } from './vaccines';

export type VaccineBatchesPersistence = Omit<Persistence, 'createdAt' | 'updatedAt'> & {
  vaccine: VaccinesPersistence;
  vaccinationPoint: VaccinationPointsPersistence;
};

export class VaccineBatchesMapper implements IMapper<VaccineBatch, VaccineBatchesPersistence> {
  private vaccinationPointsMapper: IMapper<VaccinationPoint, VaccinationPointsPersistence>;

  private vaccinesMapper: IMapper<Vaccine, VaccinesPersistence>;

  get className(): string {
    return this.constructor.name;
  }

  constructor(
    vaccinationPointsMapper: IMapper<VaccinationPoint, VaccinationPointsPersistence>,
    vaccinesMapper: IMapper<Vaccine, VaccinesPersistence>
  ) {
    this.vaccinationPointsMapper = vaccinationPointsMapper;
    this.vaccinesMapper = vaccinesMapper;
  }

  toDomain(persistence: VaccineBatchesPersistence): VaccineBatch {
    const { id, vaccinationPoint, vaccine, ...props } = persistence;

    const domainOrError = VaccineBatch.create({
      ...props,
      id: new EntityID(id),
      vaccinationPoint: <VaccinationPoint>this.vaccinationPointsMapper.toDomain(vaccinationPoint),
      vaccine: <Vaccine>this.vaccinesMapper.toDomain(vaccine)
    });

    if (domainOrError.isLeft()) {
      console.error(`[${this.className}]`, domainOrError.value);
    }

    return domainOrError.value as VaccineBatch;
  }

  toPersistence(domain: VaccineBatch): VaccineBatchesPersistence {
    const { id, vaccinationPoint, vaccine, expirationDate, stock } = domain;

    const persistence: VaccineBatchesPersistence = {
      id: id.value,
      stock,
      expirationDate: expirationDate.value,
      vaccineId: vaccine.id.value,
      vaccinationPointId: vaccinationPoint.id.value,
      vaccinationPoint: <VaccinationPointsPersistence>this.vaccinationPointsMapper.toPersistence(vaccinationPoint),
      vaccine: <VaccinesPersistence>this.vaccinesMapper.toPersistence(vaccine)
    };

    return persistence;
  }
}
