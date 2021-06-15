import * as Yup from 'yup';

import { ISignUpVaccinationSpotFormDataDTO } from '@/dtos/signup/vaccination-spot';
import { getValidationErrors, IErrors } from '@/utils/errors';

export const SignUpVaccinationSpot = async (data: ISignUpVaccinationSpotFormDataDTO): Promise<IErrors | null> => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Digitar o nome.'),
    phone: Yup.number().required('Digitar o numero.'),
    document: Yup.string().required('Digitar o documento.'),
    street: Yup.string().required('Digitar a rua.'),
    streetNumber: Yup.string().required('Digitar o numero da rua.'),
    vacine: Yup.string().required('Indicar o tipo de vacina.'),
    quantity: Yup.number().required('Digitar a quantidade.'),
    expiration: Yup.date().required('Selecionar a data.')
  });

  let errors: IErrors;

  try {
    await schema.validate(data, { abortEarly: false });
  } catch (err) {
    errors = getValidationErrors(err as Yup.ValidationError);
  }

  return errors;
};
