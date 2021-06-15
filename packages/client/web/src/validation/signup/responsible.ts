import * as Yup from 'yup';

import { ISignUpResponsibleFormDataDTO } from '@/dtos/signup/responsible';
import { getValidationErrors, IErrors } from '@/utils/errors';

export const signUpResponsibleValidation = async (data: ISignUpResponsibleFormDataDTO): Promise<IErrors | null> => {
  const schema = Yup.object().shape({
    email: Yup.string().required('E-mail é obrigatório'),
    password: Yup.string().required('Senha é obrigatória')
  });
  // .test({
  //   name: 'passwords-match',
  //   test: function (value) {
  //     if (value.password === value.passwordConfirmation) return true;
  //     return this.createError({
  //       path: 'passwordConfirmation',
  //       message: 'As senhas devem ser iguais'
  //     });
  //   }
  // });

  let errors: IErrors;

  try {
    await schema.validate(data, { abortEarly: false });
  } catch (err) {
    errors = getValidationErrors(err as Yup.ValidationError);
  }

  return errors;
};
