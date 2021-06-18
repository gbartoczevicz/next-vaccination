import { HealthProfessional } from '@entities/health-professional';
import { User } from '@entities/user';
import { HealthProfessionalsPersistence } from '@external/mappers/health-professionals';
import { IMapper, left, right } from '@server/shared';
import { client } from '@shared/infra/database/prisma';
import { InfraError } from '@usecases/output-ports/errors';
import {
  FindUnique,
  IHealthProfessionalsRepository,
  Save
} from '@usecases/output-ports/repositories/health-professionals';

export class PrismaHealthProfessionalsRepo implements IHealthProfessionalsRepository {
  private healthProfessionalsMapper: IMapper<HealthProfessional, HealthProfessionalsPersistence>;

  constructor(healthProfessionalsMapper: IMapper<HealthProfessional, HealthProfessionalsPersistence>) {
    this.healthProfessionalsMapper = healthProfessionalsMapper;
  }

  async findByDocument(document: string): Promise<FindUnique> {
    try {
      const rawResult = await client.healthProfessional.findUnique({
        where: { document },
        include: {
          user: true,
          vaccinationPoint: {
            include: {
              location: true
            }
          }
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const domain = <HealthProfessional>this.healthProfessionalsMapper.toDomain(rawResult);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findById(id: string): Promise<FindUnique> {
    try {
      const rawResult = await client.healthProfessional.findUnique({
        where: { id },
        include: {
          user: true,
          vaccinationPoint: {
            include: {
              location: true
            }
          }
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const domain = <HealthProfessional>this.healthProfessionalsMapper.toDomain(rawResult);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByUser(user: User): Promise<FindUnique> {
    try {
      const rawResult = await client.healthProfessional.findUnique({
        where: { userId: user.id.value },
        include: {
          user: true,
          vaccinationPoint: {
            include: {
              location: true
            }
          }
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const domain = <HealthProfessional>this.healthProfessionalsMapper.toDomain(rawResult);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByUserAndIsResponsible(user: User): Promise<FindUnique> {
    try {
      const rawResult = await client.healthProfessional.findFirst({
        where: { userId: user.id.value, responsible: true },
        include: {
          user: true,
          vaccinationPoint: {
            include: {
              location: true
            }
          }
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const domain = <HealthProfessional>this.healthProfessionalsMapper.toDomain(rawResult);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByVaccinationPointIdAndIsResponsible(vaccinationPointId: string): Promise<FindUnique> {
    try {
      const rawResult = await client.healthProfessional.findFirst({
        where: { vaccinationPointId, responsible: true },
        include: {
          user: true,
          vaccinationPoint: {
            include: {
              location: true
            }
          }
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const domain = <HealthProfessional>this.healthProfessionalsMapper.toDomain(rawResult);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async save(healthProfessional: HealthProfessional): Promise<Save> {
    try {
      const persistence = <HealthProfessionalsPersistence>(
        this.healthProfessionalsMapper.toPersistence(healthProfessional)
      );

      const rawResult = await client.healthProfessional.upsert({
        where: {
          id: persistence.id
        },
        create: {
          id: persistence.id,
          document: persistence.document,
          responsible: persistence.responsible,
          userId: persistence.userId,
          vaccinationPointId: persistence.vaccinationPointId
        },
        update: {
          id: persistence.id,
          document: persistence.document,
          responsible: persistence.responsible,
          userId: persistence.userId,
          vaccinationPointId: persistence.vaccinationPointId
        },
        include: {
          user: true,
          vaccinationPoint: {
            include: {
              location: true
            }
          }
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const domain = <HealthProfessional>this.healthProfessionalsMapper.toDomain(rawResult);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }
}
