import { Appointment, Cancellation } from '@entities/appointment';
import { EntityID, IMapper } from '@server/shared';
import { User } from '@entities/user';
import { Cancellation as Persistence } from '.prisma/client';
import { AppointmentsPersistence } from './appointments';
import { UsersPersistence } from './users';

export type CancellationsPersistence = Persistence & {
  appointment: AppointmentsPersistence;
  cancelatedBy: UsersPersistence;
};

export class CancellationsMapper implements IMapper<Cancellation, CancellationsPersistence> {
  private appointmentsMapper: IMapper<Appointment, AppointmentsPersistence>;

  private usersMapper: IMapper<User, UsersPersistence>;

  get className(): string {
    return this.constructor.name;
  }

  constructor(
    appointmentsMapper: IMapper<Appointment, AppointmentsPersistence>,
    usersMapper: IMapper<User, UsersPersistence>
  ) {
    this.appointmentsMapper = appointmentsMapper;
    this.usersMapper = usersMapper;
  }

  toDomain(persistence: CancellationsPersistence): Cancellation {
    const { id, appointment, cancelatedBy, ...props } = persistence;

    const domainOrError = Cancellation.create({
      ...props,
      id: new EntityID(id),
      appointment: <Appointment>this.appointmentsMapper.toDomain(appointment),
      cancelatedBy: <User>this.usersMapper.toDomain(cancelatedBy)
    });

    if (domainOrError.isLeft()) {
      console.error(`[${this.className}]`, domainOrError.value);
    }

    return domainOrError.value as Cancellation;
  }

  toPersistence(domain: Cancellation): CancellationsPersistence {
    const { id, appointment, cancelatedBy, ...props } = domain;

    const persistence: CancellationsPersistence = {
      ...props,
      id: id.value,
      appointmentId: appointment.id.value,
      appointment: <AppointmentsPersistence>this.appointmentsMapper.toPersistence(appointment),
      cancelatedById: cancelatedBy.id.value,
      cancelatedBy: <UsersPersistence>this.usersMapper.toPersistence(cancelatedBy)
    };

    return persistence;
  }
}
