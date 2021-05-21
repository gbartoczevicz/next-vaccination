import { Either, left, right } from '@server/shared';
import { InvalidCoordinate } from '../errors';

export interface ICoordinateProps {
  latitude: number;
  longitude: number;
}

export class Coordinate {
  readonly latitude: number;

  readonly longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static create(props: ICoordinateProps): Either<InvalidCoordinate, Coordinate> {
    if (!props.latitude) {
      return left(new InvalidCoordinate('Latitude is required'));
    }

    if (!props.longitude) {
      return left(new InvalidCoordinate('Longitude is required'));
    }

    const coordinate = new Coordinate(props.latitude, props.longitude);

    return right(coordinate);
  }
}
