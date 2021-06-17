import { Appointment, Cancellation } from '@entities/appointment';
import { User } from '@entities/user';
import { EntityID, right } from '@server/shared';
import { FindUnique, ICancellationsRepository, Save } from './cancellations';

export class FakeCancellationsRepository implements ICancellationsRepository {
  async save(cancellation: Cancellation): Promise<Save> {
    return Promise.resolve(right(cancellation));
  }

  async findByAppointment(appointment: Appointment): Promise<FindUnique> {
    const fixture = Cancellation.create({
      id: new EntityID(),
      appointment,
      cancelatedBy: {} as User,
      createdAt: new Date(),
      reason: 'reason'
    });

    return Promise.resolve(right(fixture.value as Cancellation));
  }
}
