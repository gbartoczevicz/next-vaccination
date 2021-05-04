import { UserPassword, IUserPasswordProps } from '@entities/user/values';
import { InvalidUserPassword } from '@entities/user/errors';
import { FakeEncrypter } from '@entities/output-ports/encrypter';
import { Either, left, right } from '@server/shared';

export const makePassword = (props: IUserPasswordProps): Either<InvalidUserPassword, UserPassword> => {
  const makedPassword = UserPassword.create(props);

  if (makedPassword.isLeft()) return left(makedPassword.value);

  makedPassword.value.injectDependencies(new FakeEncrypter());

  return right(makedPassword.value);
};
