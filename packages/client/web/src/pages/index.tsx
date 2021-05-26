import React, { useCallback, useRef } from 'react';
import { Flex, Box, useToast, Stack, HStack, Link, Button } from '@chakra-ui/react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { MainFormContainer, FormSubmitButton, SplashBanner, Input } from '@/components';
import { ISignInFormDataDTO } from '@/dtos/signin';
import { signInValidation } from '@/validation/signin';

const Home: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();

  const handleSubmit = useCallback(
    async (data: ISignInFormDataDTO) => {
      formRef.current?.setErrors({});

      const errors = await signInValidation(data);

      if (errors) {
        formRef.current?.setErrors(errors);

        return;
      }

      toast({
        title: 'Sucesso total',
        status: 'success'
      });
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
