import { User } from '@entities/user';
import { Either, left } from '@server/shared';
import { WrongProperty } from '@usecases/errors/wrong-property';
import { InfraError } from '@usecases/output-ports/errors';
import { ILoginDTO } from './dto';

type Response = Either<InfraError, User>;

export class LoginUseCase {
  async execute(request: ILoginDTO): Promise<Response> {
    const hasWrongValueInRequest = Object.entries(request).filter((it) => {
      const propValue = it[1];
      return [null, undefined, '', false].includes(propValue);
    });

    if (hasWrongValueInRequest.length) {
      const isolateWrongProps = hasWrongValueInRequest.map((it) => it[0]);
      const wrongProps = isolateWrongProps.join(' and ');
      return left(new WrongProperty(wrongProps));
    }
  }
}
