export interface IDateUtils {
  isTodayOrBefore(date: Date): boolean;
  toStartOfDay(date: Date): Date;
}
