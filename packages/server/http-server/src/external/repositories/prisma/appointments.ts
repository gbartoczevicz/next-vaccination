import { Appointment } from '@entities/appointment';
import { VaccinationPoint } from '@entities/vaccination-point';
import { AppointmentsPersistence } from '@external/mappers/appointments';
import { IMapper, left, right } from '@server/shared';
import { client } from '@shared/infra/database/prisma';
import { InfraError } from '@usecases/output-ports/errors';
import { FindAll, IAppointmentsRepository, Save } from '@usecases/output-ports/repositories/appointments';

export class PrismaAppointmentsRepo implements IAppointmentsRepository {
  private appointmentsMapper: IMapper<Appointment, AppointmentsPersistence>;

  constructor(appointmentsMapper: IMapper<Appointment, AppointmentsPersistence>) {
    this.appointmentsMapper = appointmentsMapper;
  }

  async save(appointment: Appointment): Promise<Save> {
    try {
      const rawToSave = <AppointmentsPersistence>this.appointmentsMapper.toPersistence(appointment);

      const savedRaw = await client.appointment.upsert({
        where: {
          id: rawToSave.id
        },
        create: {
          id: rawToSave.id,
          date: rawToSave.date,
          patientId: rawToSave.patientId,
          vaccinationPointId: rawToSave.vaccinationPointId
        },
        update: {
          id: rawToSave.id,
          date: rawToSave.date,
          patientId: rawToSave.patientId,
          vaccinationPointId: rawToSave.vaccinationPointId
        },
        include: {
          patient: {
            include: {
              user: true
            }
          },
          vaccinationPoint: {
            include: {
              location: true
            }
          }
        }
      });

      const savedDomain = <Appointment>this.appointmentsMapper.toDomain(savedRaw);

      return right(savedDomain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findAllByVaccinationPointAndDate(vaccinationPoint: VaccinationPoint, date: Date): Promise<FindAll> {
    try {
      const rawResult = await client.appointment.findMany({
        where: {
          vaccinationPointId: vaccinationPoint.id.value,
          date
        },
        include: {
          patient: {
            include: {
              user: true
            }
          },
          vaccinationPoint: {
            include: {
              location: true
            }
          }
        }
      });

      const appointmentsDomin = rawResult.map((result) => <Appointment>this.appointmentsMapper.toDomain(result));

      return right(appointmentsDomin);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }
}
