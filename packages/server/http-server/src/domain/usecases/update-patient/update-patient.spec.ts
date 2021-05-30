import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { EntityID, left, right } from '@server/shared';
import { DocumentAlreadyInUse } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakePatientsRepository } from '@usecases/output-ports/repositories/patients';
import { UpdatePatientUseCase } from './update-patient';

const makeSut = () => {
  const fakePatientsRepository = new FakePatientsRepository();

  return {
    sut: new UpdatePatientUseCase(fakePatientsRepository),
    fakePatientsRepository
  };
};

const makeBirthday = (date: Date) => {
  const dateAtStartOfDay = new Date(date);

  dateAtStartOfDay.setHours(0, 0, 0, 0);

  return dateAtStartOfDay;
};

const makeFixture = ({ document = 'updated_document', birthday = new Date() }) => {
  const user = User.create({
    id: new EntityID('to_keep_user_id'),
    name: 'any_correct_name',
    email: 'any_correct_email@mail.com',
    phone: '(99) 99999-9999',
    password: { password: 'any_correct_password' }
  }).value as User;

  const patient = Patient.create({
    id: new EntityID('to_keep_patient_id'),
    user,
    document: 'old_document',
    birthday: new Date(),
    avatar: 'avatar_to_keep.png',
    ticket: 'ticket_to_keep.pdf'
  }).value as Patient;

  return {
    patient,
    document,
    birthday
  };
};

describe('Update Patient UseCase Unitary Tests', () => {
  it('should update patient', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    jest.spyOn(fakePatientsRepository, 'findByDocument').mockImplementation(() => Promise.resolve(right(null)));

    const birthday = makeBirthday(new Date());

    const testable = await sut.execute(makeFixture({ birthday }));

    expect(testable.isRight()).toBeTruthy();

    const patient = testable.value as Patient;

    expect(patient.id.value).toEqual('to_keep_patient_id');
    expect(patient.document).toEqual('updated_document');
    expect(patient.avatar).toEqual('avatar_to_keep.png');
    expect(patient.ticket).toEqual('ticket_to_keep.pdf');
    expect(patient.birthday.value).toEqual(birthday);
    expect(patient.user.id.value).toEqual('to_keep_user_id');
  });

  it("should check if the patient's document is already in use", async () => {
    const { sut, fakePatientsRepository } = makeSut();

    jest.spyOn(fakePatientsRepository, 'findByDocument').mockImplementation(() => {
      const fixture = { id: new EntityID() } as Patient;

      return Promise.resolve(right(fixture));
    });

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new DocumentAlreadyInUse());
  });

  it('should validate findByDocument Infra Error', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    jest
      .spyOn(fakePatientsRepository, 'findByDocument')
      .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InfraError('Unexpected Error'));
  });
});
