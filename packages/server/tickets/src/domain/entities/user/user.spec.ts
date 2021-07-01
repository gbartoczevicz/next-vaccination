import { User } from '@entities/user';
import { InvalidUser } from '@entities/user/errors';
import { EntityID } from '@server/shared';

const makeSut = () => ({ sut: User });

describe('User Unitary Tests', () => {
  it('should create a valid user', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      id: new EntityID('user_already_created'),
      name: 'any_name'
    });

    expect(testable.isRight()).toBeTruthy();

    const user = testable.value as User;

    expect(user.id.value).toEqual('user_already_created');
    expect(user.name).toEqual('any_name');
  });

  describe('param validation', () => {
    it('should validate ID param', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        id: null,
        name: 'any_name'
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidUser('ID is required'));
    });

    it('should validate name param', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        id: new EntityID(),
        name: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidUser('Name is required'));
    });
  });
});
