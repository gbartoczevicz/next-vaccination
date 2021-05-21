import { ICoordinateProps } from '@entities/vaccination-point/values';

export interface IGetNearbyVaccinationPointsDTO {
  userId: string;
  coordinate: ICoordinateProps;
}
