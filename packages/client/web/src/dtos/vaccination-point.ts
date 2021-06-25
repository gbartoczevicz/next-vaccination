export interface IVaccinationPointDTO {
  id: string;
  name: string;
  avatar: string;
  address: {};
}

export interface IResponsibleDTO {
  id: string;
  name: string;
}

export interface IVaccinationPointSummaryDTO extends IVaccinationPointDTO {
  responsible: IResponsibleDTO;
}
