import { Appointment } from '@entities/appointment';
import { Conclusion } from '@entities/appointment/conclusion';
import { HealthProfessional } from '@entities/health-professional';
import { VaccineBatch } from '@entities/vaccination-point';
import { EntityID, right } from '@server/shared';
import { FindUnique, IConclusionsRepository, Save } from './conclusions';

export class FakeConclusionsRepository implements IConclusionsRepository {
  async save(conclusion: Conclusion): Promise<Save> {
    return Promise.resolve(right(conclusion));
  }

  async findByAppointment(appointment: Appointment): Promise<FindUnique> {
    const fixture = Conclusion.create({
      id: new EntityID(),
      appointment,
      vaccinatedAt: new Date(),
      vaccinatedBy: {} as HealthProfessional,
      vaccineBatch: {} as VaccineBatch
    });

    return Promise.resolve(right(fixture.value as Conclusion));
  }
}
