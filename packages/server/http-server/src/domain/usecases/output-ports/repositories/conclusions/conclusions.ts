import { Conclusion } from '@entities/appointment/conclusion';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type Save = Either<InfraError, Conclusion>;

export interface IConclusionsRepository {
  save(conclusion: Conclusion): Promise<Save>;
}
