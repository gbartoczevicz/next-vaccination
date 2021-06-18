import { Appointment, Cancellation } from '@entities/appointment';
import { CancellationsPersistence } from '@external/mappers/cancellations';
import { IMapper, left, right } from '@server/shared';
import { client } from '@shared/infra/database/prisma';
import { FindUnique, ICancellationsRepository, Save } from '@usecases/output-ports/repositories/cancellations';

export class PrismaCancellationsRepo implements ICancellationsRepository {
  private cancellationsMapper: IMapper<Cancellation, CancellationsPersistence>;

  constructor(cancellationsMapper: IMapper<Cancellation, CancellationsPersistence>) {
    this.cancellationsMapper = cancellationsMapper;
  }

  async save(cancellation: Cancellation): Promise<Save> {
    try {
      const rawToSave = <CancellationsPersistence>this.cancellationsMapper.toPersistence(cancellation);

      const resultRaw = await client.cancellation.create({
        data: {
          id: rawToSave.id,
          reason: rawToSave.reason,
          appointmentId: rawToSave.appointmentId,
          cancelatedById: rawToSave.cancelatedById,
          createdAt: rawToSave.createdAt
        },
        include: {
          appointment: {
            include: {
              patient: { include: { user: true } },
              vaccinationPoint: { include: { location: true } }
            }
          },
          cancelatedBy: true
        }
      });

      const domain = <Cancellation>this.cancellationsMapper.toDomain(resultRaw);

      return right(domain);
    } catch (err) {
      return left(err.message);
    }
  }

  async findByAppointment(appointment: Appointment): Promise<FindUnique> {
    try {
      const resultRaw = await client.cancellation.findFirst({
        where: { appointmentId: appointment.id.value },
        include: {
          appointment: {
            include: {
              patient: { include: { user: true } },
              vaccinationPoint: { include: { location: true } }
            }
          },
          cancelatedBy: true
        }
      });

      if (!resultRaw) {
        return right(null);
      }

      const domain = <Cancellation>this.cancellationsMapper.toDomain(resultRaw);

      return right(domain);
    } catch (err) {
      return left(err.message);
    }
  }
}
