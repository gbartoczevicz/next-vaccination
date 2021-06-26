export interface IVaccinationSummaryDTO {
  age_group: 'ALL' | 'YOUNG' | 'ADULT' | 'ELDERLY';
  appointments: {
    pending: number;
    concluded: number;
    percentage: number;
  };
}
