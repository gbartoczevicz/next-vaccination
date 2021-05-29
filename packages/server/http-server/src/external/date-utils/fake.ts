/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDateUtils } from '@entities/output-ports/date-utils';

export class FakeDateUtils implements IDateUtils {
  isTodayOrBefore(val: Date): boolean {
    const now = new Date().setHours(0, 0, 0, 0);

    return now >= val.getTime();
  }
}
