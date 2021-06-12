import { Phone } from '@entities/phone';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Coordinate } from '@entities/vaccination-point/values';
import { VaccinationPointsPersistence } from '@external/mappers/vaccination-points';
import { IMapper, left, right } from '@server/shared';
import { client } from '@shared/infra/database/prisma';
import { InfraError } from '@usecases/output-ports/errors';
import {
  FindAll,
  FindUnique,
  IVaccinationPointsRepository,
  makeHaversineFormulaQuery,
  Save
} from '@usecases/output-ports/repositories/vaccination-points';

export class PrismaVaccinationPointsRepo implements IVaccinationPointsRepository {
  private vaccintaionPointsMapper: IMapper<VaccinationPoint, VaccinationPointsPersistence>;

  constructor(vaccintaionPointsMapper: IMapper<VaccinationPoint, VaccinationPointsPersistence>) {
    this.vaccintaionPointsMapper = vaccintaionPointsMapper;
  }

  async findAllByApproximateCoordinate(coordinate: Coordinate): Promise<FindAll> {
    try {
      const rawNearestVaccinationPoints = await client.$queryRaw<VaccinationPointsPersistence[]>(`
        SELECT *,
        (${makeHaversineFormulaQuery(coordinate)}) AS distance 
          FROM vaccination_points
        HAVING distance < 28 
         ORDER BY distance
         LIMIT 0, 20;
      `);

      const nearestVaccinationPoints = rawNearestVaccinationPoints.map(
        (n) => <VaccinationPoint>this.vaccintaionPointsMapper.toDomain(n)
      );

      return right(nearestVaccinationPoints);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByCoordinate(coordinate: Coordinate): Promise<FindUnique> {
    try {
      const rawResult = await client.location.findUnique({
        where: {
          vaccination_points_coordinates: coordinate
        },
        include: {
          vaccinationPoint: true
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const { vaccinationPoint: rawVaccinationPoint, ...rawLocation } = rawResult;

      const vaccinationPoint = <VaccinationPoint>this.vaccintaionPointsMapper.toDomain({
        ...rawVaccinationPoint,
        location: rawLocation
      });

      return right(vaccinationPoint);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByDocument(document: string): Promise<FindUnique> {
    try {
      const rawResult = await client.vaccinationPoint.findUnique({
        where: {
          document
        },
        include: {
          Location: true
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const vaccinationPoint = <VaccinationPoint>this.vaccintaionPointsMapper.toDomain({
        ...rawResult,
        location: rawResult.Location
      });

      return right(vaccinationPoint);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findById(id: string): Promise<FindUnique> {
    try {
      const rawResult = await client.vaccinationPoint.findUnique({
        where: {
          id
        },
        include: {
          Location: true
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const vaccinationPoint = <VaccinationPoint>this.vaccintaionPointsMapper.toDomain({
        ...rawResult,
        location: rawResult.Location
      });

      return right(vaccinationPoint);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByPhone(phone: Phone): Promise<FindUnique> {
    try {
      const rawResult = await client.vaccinationPoint.findUnique({
        where: {
          phone: phone.value
        },
        include: {
          Location: true
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const vaccinationPoint = <VaccinationPoint>this.vaccintaionPointsMapper.toDomain({
        ...rawResult,
        location: rawResult.Location
      });

      return right(vaccinationPoint);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async save(vaccinationPoint: VaccinationPoint): Promise<Save> {
    try {
      const persistence = <VaccinationPointsPersistence>this.vaccintaionPointsMapper.toPersistence(vaccinationPoint);

      const rawSavedVaccinationPoint = await client.vaccinationPoint.upsert({
        where: {
          id: persistence.id
        },
        create: persistence,
        update: persistence,
        include: {
          Location: true
        }
      });

      const savedDomain = <VaccinationPoint>this.vaccintaionPointsMapper.toDomain({
        ...rawSavedVaccinationPoint,
        location: rawSavedVaccinationPoint.Location
      });

      return right(savedDomain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }
}
