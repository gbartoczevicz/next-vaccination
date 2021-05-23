import { EntityID } from '@server/shared';
import { InvalidVaccine } from './errors';
import { Vaccine } from './vaccine';

const makeSut = () => ({ sut: Vaccine });

const makeFixture = ({ name = 'Vaccine Name', description = 'Vaccine Description' }) => ({ name, description });

describe('Vaccine Unitary Tests', () => {
  it('should create a valid object', () => {
    const { sut } = makeSut();

    const testable = sut.create(makeFixture({}));

    expect(testable.isRight()).toBeTruthy();

    const vaccine = testable.value as Vaccine;

    expect(vaccine.name).toEqual('Vaccine Name');
    expect(vaccine.description).toEqual('Vaccine Description');
  });

  it('should create a valid object with expected id', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture({}),
      id: new EntityID('vaccine_id')
    });

    expect(testable.isRight()).toBeTruthy();

    const vaccine = testable.value as Vaccine;

    expect(vaccine.id.value).toEqual('vaccine_id');
    expect(vaccine.name).toEqual('Vaccine Name');
    expect(vaccine.description).toEqual('Vaccine Description');
  });

  describe('Params validation', () => {
    it('should validate name', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        ...makeFixture({}),
        name: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidVaccine('Name is required'));
    });

    it('should validate description', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        ...makeFixture({}),
        description: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidVaccine('Description is required'));
    });
  });
});
