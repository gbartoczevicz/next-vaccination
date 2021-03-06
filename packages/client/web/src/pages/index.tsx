import React, { useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { Flex, Box, useToast, Stack, HStack, Link, Button } from '@chakra-ui/react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { MainFormContainer, FormSubmitButton, SplashBanner, Input } from '@/components';
import { ISignInFormDataDTO } from '@/dtos/signin';
import { getValidationErrors } from '@/utils/errors';

const Home: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: ISignInFormDataDTO) => {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail é obrigatório'),
        password: Yup.string().required('Senha é obrigatória')
      });

      try {
        await schema.validate(data, { abortEarly: false });

        router.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [toast]
  );

  return (
    <Flex h="100vh" w="100%">
      <Box flex="1">
        <SplashBanner />
      </Box>
      <Flex flex="1" alignItems="center" justifyContent="center">
        <MainFormContainer title="Fazer Login">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Stack spacing={4} alignItems="center">
              <Input name="email" placeholder="E-mail" type="text" />
              <Input name="password" placeholder="Senha" type="password" />

              <HStack align="center" justify="space-between" px={6} w="100%" h="72px">
                <Link fontWeight="medium" color="gray.400">
                  Cadastrar
                </Link>
                <Button fontWeight="medium" color="gray.400">
                  Esqueci a Senha
                </Button>
              </HStack>

              <FormSubmitButton label="Acessar" type="submit" />
            </Stack>
          </Form>
        </MainFormContainer>
      </Flex>
    </Flex>
  );
};

export default Home;
