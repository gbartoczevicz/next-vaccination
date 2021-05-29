/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDateUtils } from '@entities/output-ports/date-utils';

export class FakeDateUtils implements IDateUtils {
  isTodayOrBefore(date: Date): boolean {
    const now = new Date().setHours(0, 0, 0, 0);

    return now >= date.getTime();
  }

  toStartOfDay(date: Date): Date {
    const dateAtStartOfDay = new Date(date);

    dateAtStartOfDay.setHours(0, 0, 0, 0);

    return dateAtStartOfDay;
  }
}
