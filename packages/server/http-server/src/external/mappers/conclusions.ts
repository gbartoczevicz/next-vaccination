import { Appointment } from '@entities/appointment';
import { Conclusion } from '@entities/appointment/conclusion';
import { HealthProfessional } from '@entities/health-professional';
import { VaccineBatch } from '@entities/vaccination-point';
import { Conclusion as Persistence } from '@prisma/client';
import { EntityID, IMapper } from '@server/shared';
import { AppointmentsPersistence } from './appointments';
import { HealthProfessionalsPersistence } from './health-professionals';
import { VaccineBatchesPersistence } from './vaccine-batches';

export type ConclusionsPersistence = Persistence & {
  appointment: AppointmentsPersistence;
  vaccineBatch: VaccineBatchesPersistence;
  vaccinatedBy: HealthProfessionalsPersistence;
};

export class ConclusionsMapper implements IMapper<Conclusion, ConclusionsPersistence> {
  private appointmentsMapper: IMapper<Appointment, AppointmentsPersistence>;

  private vaccineBatchesMapper: IMapper<VaccineBatch, VaccineBatchesPersistence>;

  private healthProfessionalsMapper: IMapper<HealthProfessional, HealthProfessionalsPersistence>;

  get className(): string {
    return this.constructor.name;
  }

  constructor(appointmentsMapper: IMapper<Appointment, AppointmentsPersistence>) {
    this.appointmentsMapper = appointmentsMapper;
  }

  toDomain(persistence: ConclusionsPersistence): Conclusion {
    const { id, appointment, vaccinatedAt, vaccineBatch, vaccinatedBy } = persistence;

    const domainOrError = Conclusion.create({
      id: new EntityID(id),
      vaccinatedAt,
      appointment: <Appointment>this.appointmentsMapper.toDomain(appointment),
      vaccinatedBy: <HealthProfessional>this.healthProfessionalsMapper.toDomain(vaccinatedBy),
      vaccineBatch: <VaccineBatch>this.vaccineBatchesMapper.toDomain(vaccineBatch)
    });

    if (domainOrError.isLeft()) {
      console.error(`[${this.className}]`, domainOrError.value);
    }

    return domainOrError.value as Conclusion;
  }

  toPersistence(domain: Conclusion): ConclusionsPersistence {
    const { id, appointment, vaccinatedAt, vaccineBatch, vaccinatedBy } = domain;

    const persistence: ConclusionsPersistence = {
      id: id.value,
      vaccinatedAt,
      appointmentId: appointment.id.value,
      vaccinatedById: vaccinatedBy.id.value,
      vaccineBatchId: vaccineBatch.id.value,
      appointment: <AppointmentsPersistence>this.appointmentsMapper.toPersistence(appointment),
      vaccineBatch: <VaccineBatchesPersistence>this.vaccineBatchesMapper.toPersistence(vaccineBatch),
      vaccinatedBy: <HealthProfessionalsPersistence>this.healthProfessionalsMapper.toPersistence(vaccinatedBy)
    };

    return persistence;
  }
}
