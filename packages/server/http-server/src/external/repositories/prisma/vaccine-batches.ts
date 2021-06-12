import { VaccinationPoint, VaccineBatch } from '@entities/vaccination-point';
import { VaccineBatchesPersistence } from '@external/mappers/vaccine-batches';
import { IMapper, left, right } from '@server/shared';
import { client } from '@shared/infra/database/prisma';
import { InfraError } from '@usecases/output-ports/errors';
import { FindAll, IVaccineBatchesRepository, Save } from '@usecases/output-ports/repositories/vaccine-batches';

export class PrismaVaccineBatchesRepo implements IVaccineBatchesRepository {
  private vaccineBatchesMapper: IMapper<VaccineBatch, VaccineBatchesPersistence>;

  constructor(vaccineBatchesMapper: IMapper<VaccineBatch, VaccineBatchesPersistence>) {
    this.vaccineBatchesMapper = vaccineBatchesMapper;
  }

  async save(vaccineBatch: VaccineBatch): Promise<Save> {
    try {
      const rawToSave = <VaccineBatchesPersistence>this.vaccineBatchesMapper.toPersistence(vaccineBatch);

      const rawSaved = await client.vaccineBatch.upsert({
        where: {
          id: rawToSave.id
        },
        create: {
          id: rawToSave.id,
          stock: rawToSave.stock,
          expirationDate: rawToSave.expirationDate,
          vaccinationPointId: rawToSave.vaccinationPointId,
          vaccineId: rawToSave.vaccineId
        },
        update: {
          id: rawToSave.id,
          stock: rawToSave.stock,
          expirationDate: rawToSave.expirationDate,
          vaccinationPointId: rawToSave.vaccinationPointId,
          vaccineId: rawToSave.vaccineId
        },
        include: {
          vaccinationPoint: {
            include: { Location: true }
          },
          vaccine: true
        }
      });

      const { vaccinationPoint, ...props } = rawSaved;

      const domain = <VaccineBatch>this.vaccineBatchesMapper.toDomain({
        ...props,
        vaccinationPoint: {
          ...vaccinationPoint,
          location: vaccinationPoint.Location
        }
      });

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findAllByVaccinationPointAndExpirationDateAfterThan(
    vaccinationPoint: VaccinationPoint,
    expirationDate: Date
  ): Promise<FindAll> {
    try {
      const rawResult = await client.vaccineBatch.findMany({
        where: {
          vaccinationPointId: vaccinationPoint.id.value,
          expirationDate: {
            gte: expirationDate
          }
        },
        include: {
          vaccinationPoint: { include: { Location: true } },
          vaccine: true
        }
      });

      const vaccineBathes = rawResult.map(
        (r) => <VaccineBatch>this.vaccineBatchesMapper.toDomain({
            ...r,
            vaccinationPoint: { ...r.vaccinationPoint, location: r.vaccinationPoint.Location }
          })
      );

      return right(vaccineBathes);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }
}
