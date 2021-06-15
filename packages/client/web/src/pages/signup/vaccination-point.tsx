import React, { useRef, useState } from 'react';
import { AspectRatio, Flex, Heading, useToast, Stack, Box, Spacer, Link, Text } from '@chakra-ui/react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { MainFormContainer, FormSubmitButton, Input, Map, AddVaccinationBatch } from '@/components';
import * as styles from '@/styles/vaccinationPoint';

import { MdKeyboardArrowLeft as ReturnIcon } from 'react-icons/md';

const SignUpVaccinationPoint: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();

  const handleSubmit = () => {};

  const addVaccinationBatch = () => {};

  const removeVaccinationBatch = () => {};

  return (
    <Flex backgroundColor="#F5F8FA">
      <Box pos="absolute" top="67px" right="132px">
        <Link>
          <Flex>
            <Text fontSize="27px">
              <ReturnIcon />
            </Text>
            <Link href="/signup/responsible" ml="35px" fontWeight="medium" fontSize="2x1">
              Voltar
            </Link>
          </Flex>
        </Link>
      </Box>
      <Flex flex="1" alignItems="center" justifyContent="center" mt="160px">
        <Box w="736px" borderRadius="10px" backgroundColor="#FFFFFF" p="65px" mb="72px">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Heading fontWeight="medium" fontSize="3xl" w="285px" h="84px" mb="60px">
              Cadastrar Ponto de Vacinação
            </Heading>
            <Box mb="60px">
              <Input
                style={styles.profilePictureInput}
                name="vaccinationPointPicture"
                placeholder="Enviar Foto"
                type="file"
                h="300px"
                w="600px"
                borderRadius="10px"
                bgColor="rgb(108,99,255,0.5)"
              />
            </Box>

            <Box mb="60px">
              <Heading fontWeight="medium" fontSize="2xl" marginBottom="42px">
                Dados
              </Heading>
              <Input
                name="name"
                placeholder="Nome da entidade"
                type="text"
                backgroundColor="#F5F8FA"
                mb="46px"
                w="600px"
              />
              <Input name="phone" placeholder="Telefone" type="phone" backgroundColor="#F5F8FA" w="280px" mr="40px" />
              <Input name="document" placeholder="Documento" type="number" backgroundColor="#F5F8FA" w="280px" />
            </Box>

            <Box mb="60px">
              <Heading fontWeight="medium" fontSize="2xl">
                Endereço
              </Heading>
              <Box w="600px" h="300px">
                <Map />
              </Box>
              <Input name="street" placeholder="Rua" type="text" backgroundColor="#F5F8FA" mb="46px" w="600px" />
              <Input name="streetNumber" placeholder="Nº" type="number" backgroundColor="#F5F8FA" mb="46px" w="600px" />
            </Box>

            <Box mb="60px">
              <Heading fontWeight="medium" fontSize="2xl" marginBottom="6">
                Lote inicial
              </Heading>
              <AddVaccinationBatch />
              <AddVaccinationBatch />
            </Box>

            <FormSubmitButton label="Confirmar" type="submit" ml="300px" bgColor="rgb(108,99,255,0.5)" />
          </Form>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SignUpVaccinationPoint;
