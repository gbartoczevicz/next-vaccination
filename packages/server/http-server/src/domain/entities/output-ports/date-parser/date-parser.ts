export interface IDateParser {
  /**
   * @description Zulu: https://greenwichmeantime.com/time-zone/gmt-plus-0
   */
  parseToUTCZuluTime(dateToParse: Date): Date;
}
