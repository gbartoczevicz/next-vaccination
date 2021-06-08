import { EntityID } from '@server/shared';
import { InvalidPatient } from './errors';
import { Patient } from './patient';

const makeSut = () => ({ sut: Patient });

describe('Patient Unitary Tests', () => {
  it('should create a valid patient object', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      id: new EntityID('already_created_patient'),
      avatar: 'avatar.png'
    });

    expect(testable.isRight()).toBeTruthy();

    const patient = testable.value as Patient;

    expect(patient.id.value).toEqual('already_created_patient');
    expect(patient.avatar).toEqual('avatar.png');
  });

  describe('params validation', () => {
    it('should validate ID param', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        id: null,
        avatar: 'avatar.png'
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidPatient('ID is required'));
    });

    it('should validate avatar param', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        id: new EntityID(),
        avatar: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidPatient('Avatar is required prato feito'));
    });
  });
});
