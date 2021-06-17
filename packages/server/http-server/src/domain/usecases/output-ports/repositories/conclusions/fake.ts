import { Conclusion } from '@entities/appointment/conclusion';
import { right } from '@server/shared';
import { IConclusionsRepository, Save } from './conclusions';

export class FakeConclusionsRepository implements IConclusionsRepository {
  async save(conclusion: Conclusion): Promise<Save> {
    return Promise.resolve(right(conclusion));
  }
}
