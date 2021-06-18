import { Appointment } from '@entities/appointment';
import { Patient } from '@entities/patient';
import { VaccinationPoint } from '@entities/vaccination-point';
import { EntityID, right } from '@server/shared';
import { FindAll, IAppointmentsRepository, Save } from './appointments';

export class FakeAppointmentsRepository implements IAppointmentsRepository {
  async save(appointment: Appointment): Promise<Save> {
    return Promise.resolve(right(appointment));
  }

  async findAllByVaccinationPointAndDate(vaccinationPoint: VaccinationPoint, date: Date): Promise<FindAll> {
    const fixture = Appointment.create({
      vaccinationPoint,
      date,
      patient: { id: new EntityID() } as Patient
    }).value as Appointment;

    return Promise.resolve(right([fixture]));
  }
}
