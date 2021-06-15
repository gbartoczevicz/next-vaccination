import { Appointment } from '@entities/appointment';
import { Conclusion } from '@entities/appointment/conclusion';
import { VaccineBatch } from '@entities/vaccination-point';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type Save = Either<InfraError, Conclusion>;
export type FindUnique = Either<InfraError, Conclusion | null>;
export type FindAll = Either<InfraError, Conclusion[]>;

export interface IConclusionsRepository {
  save(conclusion: Conclusion): Promise<Save>;
  findByAppointment(appointment: Appointment): Promise<FindUnique>;
  findAllByVaccineBatch(vaccineBatch: VaccineBatch): Promise<FindAll>;
}
