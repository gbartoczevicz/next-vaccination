import { Cancellation } from '@entities/appointment';
import { right } from '@server/shared';
import { ICancellationsRepository, Save } from './cancellations';

export class FakeCancellationsRepository implements ICancellationsRepository {
  async save(cancellation: Cancellation): Promise<Save> {
    return Promise.resolve(right(cancellation));
  }
}
