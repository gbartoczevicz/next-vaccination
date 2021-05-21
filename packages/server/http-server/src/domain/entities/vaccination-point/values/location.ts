import { Either, left, right } from '@server/shared';
import { InvalidCoordinate, InvalidLocation } from '../errors';
import { Coordinate, ICoordinateProps } from './coordinate';

export interface ILocationProps {
  address: string;
  addressNumber: number;
  coordinate: ICoordinateProps;
}

export class Location {
  readonly address: string;

  readonly addressNumber: number;

  readonly coordinate: Coordinate;

  constructor(address: string, addressNumber: number, coordinate: Coordinate) {
    this.address = address;
    this.addressNumber = addressNumber;
    this.coordinate = coordinate;
  }

  static create(props: ILocationProps): Either<InvalidLocation | InvalidCoordinate, Location> {
    const { address, addressNumber, coordinate } = props;

    if (!address) {
      return left(new InvalidLocation('Address is required'));
    }

    if (!addressNumber) {
      return left(new InvalidLocation('Address number is required'));
    }

    const coordinateOrError = Coordinate.create(coordinate);

    if (coordinateOrError.isLeft()) {
      return left(coordinateOrError.value);
    }

    return right(new Location(address, addressNumber, coordinateOrError.value));
  }
}
