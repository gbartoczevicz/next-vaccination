export interface ICreateAvailabilityByPeriodDTO {
  vaccinationPointId: string;
  userId: string;
  morning: number;
  evening: number;
  dusk: number;
}
