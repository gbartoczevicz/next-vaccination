import React, { useState } from 'react';
import { Flex, Box, Input, Stack, InputGroup, InputRightElement, Button, HStack, Link } from '@chakra-ui/react';

import { MainFormContainer, FormSubmitButton, SplashBanner } from '@/components';

const Home: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <Flex h="100vh" w="100%">
      <Box flex="1">
        <SplashBanner />
      </Box>
      <Flex flex="1" alignItems="center" justifyContent="center">
        <MainFormContainer title="Fazer Login">
          <form>
            <Stack spacing={4} alignItems="center">
              <Input
                bgColor="white"
                color="gray.400"
                _placeholder={{ color: 'gray.400', fontSize: '16px' }}
                fontWeight="normal"
                placeholder="E-mail"
                h="72px"
                borderRadius="lg"
              />
              <InputGroup>
                <Input
                  bgColor="white"
                  color="gray.400"
                  fontWeight="normal"
                  _placeholder={{ color: 'gray.400', fontSize: '16px' }}
                  placeholder="Senha"
                  pr="4.5rem"
                  type={showPassword ? 'text' : 'password'}
                  h="72px"
                  borderRadius="lg"
                />
                <InputRightElement marginY="4" width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <HStack align="center" justify="space-between" px={6} w="100%" h="72px">
                <Link fontWeight="medium" color="gray.400">
                  Cadastrar
                </Link>
                <Button fontWeight="medium" color="gray.400">
                  Esqueci a Senha
                </Button>
              </HStack>
              <FormSubmitButton label="Acessar" />
            </Stack>
          </form>
        </MainFormContainer>
      </Flex>
    </Flex>
  );
};

export default Home;
