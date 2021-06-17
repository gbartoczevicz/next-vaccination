import { Appointment } from '@entities/appointment';
import { Patient } from '@entities/patient';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Appointment as Persistence } from '@prisma/client';
import { EntityID, IMapper } from '@server/shared';
import { PatientPersistence } from './patients';
import { VaccinationPointsPersistence } from './vaccination-points';

export type AppointmentsPersistence = Omit<Persistence, 'createdAt' | 'updatedAt'> & {
  patient: PatientPersistence;
  vaccinationPoint: VaccinationPointsPersistence;
};

export class AppointmentsMapper implements IMapper<Appointment, AppointmentsPersistence> {
  private vaccinationPointsMapper: IMapper<VaccinationPoint, VaccinationPointsPersistence>;

  private patientsMapper: IMapper<Patient, PatientPersistence>;

  get className(): string {
    return this.constructor.name;
  }

  constructor(
    vaccinationPointsMapper: IMapper<VaccinationPoint, VaccinationPointsPersistence>,
    patientsMapper: IMapper<Patient, PatientPersistence>
  ) {
    this.vaccinationPointsMapper = vaccinationPointsMapper;
    this.patientsMapper = patientsMapper;
  }

  toDomain(persistence: AppointmentsPersistence): Appointment {
    const { id, patient, vaccinationPoint, ...props } = persistence;

    const domainOrError = Appointment.create({
      ...props,
      id: new EntityID(id),
      patient: <Patient>this.patientsMapper.toDomain(patient),
      vaccinationPoint: <VaccinationPoint>this.vaccinationPointsMapper.toDomain(vaccinationPoint)
    });

    if (domainOrError.isLeft()) {
      console.error(`[${this.className}]`, domainOrError.value);
    }

    return domainOrError.value as Appointment;
  }

  toPersistence(domain: Appointment): AppointmentsPersistence {
    const { id, patient, vaccinationPoint, date } = domain;

    const persistence: AppointmentsPersistence = {
      id: id.value,
      date,
      patientId: patient.id.value,
      vaccinationPointId: vaccinationPoint.id.value,
      patient: <PatientPersistence>this.patientsMapper.toPersistence(patient),
      vaccinationPoint: <VaccinationPointsPersistence>this.vaccinationPointsMapper.toPersistence(vaccinationPoint)
    };

    return persistence;
  }
}
