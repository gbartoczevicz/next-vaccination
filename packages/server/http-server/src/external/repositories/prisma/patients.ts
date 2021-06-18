import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { PatientPersistence } from '@external/mappers/patients';
import { IMapper, left, right } from '@server/shared';
import { client } from '@shared/infra/database/prisma';
import { InfraError } from '@usecases/output-ports/errors';
import { FindUnique, IPatientsRepository, Save } from '@usecases/output-ports/repositories/patients';

export class PrismaPatientsRepo implements IPatientsRepository {
  private patientsMapper: IMapper<Patient, PatientPersistence>;

  constructor(patientsMapper: IMapper<Patient, PatientPersistence>) {
    this.patientsMapper = patientsMapper;
  }

  async findByDocument(document: string): Promise<FindUnique> {
    try {
      const rawPatient = await client.patient.findUnique({
        where: { document },
        include: {
          user: true
        }
      });

      if (!rawPatient) {
        return left(null);
      }

      const patientDomain = <Patient>this.patientsMapper.toDomain(rawPatient);

      return right(patientDomain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findById(id: string): Promise<FindUnique> {
    try {
      const rawPatient = await client.patient.findUnique({
        where: { id },
        include: {
          user: true
        }
      });

      if (!rawPatient) {
        return left(null);
      }

      const patientDomain = <Patient>this.patientsMapper.toDomain(rawPatient);

      return right(patientDomain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByUser(user: User): Promise<FindUnique> {
    try {
      const rawPatient = await client.patient.findUnique({
        where: { userId: user.id.value },
        include: {
          user: true
        }
      });

      if (!rawPatient) {
        return left(null);
      }

      const patientDomain = <Patient>this.patientsMapper.toDomain(rawPatient);

      return right(patientDomain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async save(patient: Patient): Promise<Save> {
    try {
      const toSaveRawPatient = <PatientPersistence>this.patientsMapper.toPersistence(patient);

      const rawPatient = await client.patient.upsert({
        where: {
          id: toSaveRawPatient.id
        },
        create: {
          id: toSaveRawPatient.id,
          document: toSaveRawPatient.document,
          birthday: toSaveRawPatient.birthday,
          avatar: toSaveRawPatient.avatar,
          ticket: toSaveRawPatient.ticket,
          userId: toSaveRawPatient.userId
        },
        update: {
          id: toSaveRawPatient.id,
          document: toSaveRawPatient.document,
          birthday: toSaveRawPatient.birthday,
          avatar: toSaveRawPatient.avatar,
          ticket: toSaveRawPatient.ticket
        },
        include: {
          user: true
        }
      });

      const domain = <Patient>this.patientsMapper.toDomain(rawPatient);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }
}
