import React, { useCallback, useRef } from 'react';
import { Flex, Box, useToast, Stack } from '@chakra-ui/react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { MainFormContainer, FormSubmitButton, SplashBanner, Input } from '@/components';
import { ISignUpResponsibleFormDataDTO } from '@/dtos/signup/responsible';
import { signUpResponsibleValidation } from '@/validation/signup/responsible';
import router from 'next/dist/client/router';

const SignUpResponsible: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();

  const handleSubmit = useCallback(
    async (data: ISignUpResponsibleFormDataDTO) => {
      formRef.current?.setErrors({});

      const errors = await signUpResponsibleValidation(data);

      if (errors) {
        console.log(errors);
        formRef.current?.setErrors(errors);
        return;
      }

      toast({
        title: 'Responsável cadastrado com sucesso!',
        status: 'success'
      });

      router.push('/signup/vaccination-point');
    },
    [toast]
  );

  return (
    <Flex h="100vh" w="100%">
      <Box flex="1">
        <SplashBanner />
      </Box>
      <Flex flex="1" alignItems="center" justifyContent="center">
        <MainFormContainer title="Realizar Cadastro">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Stack spacing={7} alignItems="center">
              <Input name="email" placeholder="E-mail" type="text" />
              <Input name="password" placeholder="Senha" type="password" />
              <Input name="passwordConfirmation" placeholder="Confirmar senha" type="password" />
              <FormSubmitButton label="Continuar" type="submit" bgColor="rgb(108,99,255,0.5)" />
            </Stack>
          </Form>
        </MainFormContainer>
      </Flex>
    </Flex>
  );
};

export default SignUpResponsible;
