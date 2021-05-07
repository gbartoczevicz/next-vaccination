export interface IDateParser {
  /**
   * @description Format to UTC with 00:00 offset (Zulu)
   * and set time to 00:00:00.
   *
   * Zulu: https://greenwichmeantime.com/time-zone/gmt-plus-0
   */
  parseToUTCZuluTime(dateToParse: Date): Date;
}
