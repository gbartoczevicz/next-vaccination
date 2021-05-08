import { IDateParser } from '@entities/output-ports/date-parser';

export class FakeDateParser implements IDateParser {
  parseToUTCZuluTime(dateToParse: Date): Date {
    return new Date(dateToParse.getTime());
  }
}
