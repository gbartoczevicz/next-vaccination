import { Vaccine } from '@entities/vaccination-point';
import { VaccinesPersistence } from '@external/mappers/vaccines';
import { IMapper, left, right } from '@server/shared';
import { client } from '@shared/infra/database/prisma';
import { InfraError } from '@usecases/output-ports/errors';
import { FindUnique, IVaccinesRepository, Save } from '@usecases/output-ports/repositories/vaccines';

export class PrismaVaccinesRepo implements IVaccinesRepository {
  private vaccinesMapper: IMapper<Vaccine, VaccinesPersistence>;

  constructor(vaccinesMapper: IMapper<Vaccine, VaccinesPersistence>) {
    this.vaccinesMapper = vaccinesMapper;
  }

  async findById(id: string): Promise<FindUnique> {
    try {
      const rawVaccine = await client.vaccine.findUnique({ where: { id } });

      if (!rawVaccine) {
        return right(null);
      }

      const domain = <Vaccine>this.vaccinesMapper.toDomain(rawVaccine);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByName(name: string): Promise<FindUnique> {
    try {
      const rawVaccine = await client.vaccine.findUnique({ where: { name } });

      if (!rawVaccine) {
        return right(null);
      }

      const domain = <Vaccine>this.vaccinesMapper.toDomain(rawVaccine);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async save(vaccine: Vaccine): Promise<Save> {
    try {
      const rawToSave = <VaccinesPersistence>this.vaccinesMapper.toPersistence(vaccine);

      const rawSaved = await client.vaccine.upsert({
        where: { id: rawToSave.id },
        create: rawToSave,
        update: rawToSave
      });

      const domain = <Vaccine>this.vaccinesMapper.toDomain(rawSaved);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }
}
