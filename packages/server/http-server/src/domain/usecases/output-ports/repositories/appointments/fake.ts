import { Appointment } from '@entities/appointment';
import { right } from '@server/shared';
import { IAppointmentsRepository, Save } from './appointments';

export class FakeAppointmentsRepository implements IAppointmentsRepository {
  async save(appointment: Appointment): Promise<Save> {
    return Promise.resolve(right(appointment));
  }
}
