import * as Yup from 'yup';

import { IForgetPasswordDTO, ISignInFormDataDTO } from '@/dtos/signin';
import { getValidationErrors, IErrors } from '@/utils/errors';

export const signInValidation = async (data: ISignInFormDataDTO): Promise<IErrors | null> => {
  const schema = Yup.object().shape({
    email: Yup.string().required('E-mail é obrigatório'),
    password: Yup.string().required('Senha é obrigatória')
  });

  let errors: IErrors;

  try {
    await schema.validate(data, { abortEarly: false });
  } catch (err) {
    errors = getValidationErrors(err as Yup.ValidationError);
  }

  return errors;
};

export const forgetPasswordValidation = async (data: IForgetPasswordDTO): Promise<IErrors | null> => {
  const schema = Yup.object().shape({
    password: Yup.string().required('Senha é obrigatória')
  });

  let errors: IErrors;

  try {
    await schema.validate(data, { abortEarly: false });
  } catch (err) {
    errors = getValidationErrors(err as Yup.ValidationError);
  }

  return errors;
};
