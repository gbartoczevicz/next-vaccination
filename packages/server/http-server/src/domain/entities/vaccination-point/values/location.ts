import { Either, left, right } from '@server/shared';
import { InvalidLocation } from '../errors';

export interface ILocationProps {
  address: string;
  addressNumber: number;
  latitude: number;
  longitude: number;
}

export class Location {
  readonly address: string;

  readonly addressNumber: number;

  readonly latitude: number;

  readonly longitude: number;

  constructor(address: string, addressNumber: number, latitude: number, longitude: number) {
    this.address = address;
    this.addressNumber = addressNumber;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static create(props: ILocationProps): Either<InvalidLocation, Location> {
    const { address, addressNumber, latitude, longitude } = props;

    if (!address) {
      return left(new InvalidLocation('Address is required'));
    }

    if (!addressNumber) {
      return left(new InvalidLocation('Address number is required'));
    }

    if (!latitude) {
      return left(new InvalidLocation('Latitude is required'));
    }

    if (!longitude) {
      return left(new InvalidLocation('Longitude is required'));
    }

    return right(new Location(address, addressNumber, latitude, longitude));
  }
}
