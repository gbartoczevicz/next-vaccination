import React from 'react';
import { Flex, Box, Text, Heading, Button, Divider } from '@chakra-ui/react';
import { MdFavorite as Heart } from 'react-icons/md';

import { App, AppointmentsSummary } from '@/components';

const groupButtonStyle = {
  colorScheme: '#617480',
  variant: 'link',
  fontSize: '20px',
  border: 'none',
  fontWeight: 'normal',
  _hover: {
    background: 'white',
    color: '#6C63FF'
  },
  marginRight: '10',
  marginLeft: '10'
};

const DashBoard: React.FC = () => {
  return (
    <App>
      <Box width="100%">
        <Flex justifyContent="space-between">
          <Box>
            <Heading as="h3">Progresso de vacinação </Heading>
          </Box>
          <Flex p="1" bg="white" width="45rem" borderRadius="8px" justifyContent="space-between">
            <Button {...groupButtonStyle}>Hoje</Button>
            <Button {...groupButtonStyle}> Ultimos 7 dias</Button>
            <Button {...groupButtonStyle}>Ultimos 30 dias</Button>
            <Button {...groupButtonStyle}> Todo tempo</Button>
          </Flex>
        </Flex>

        <Flex w="100%" justifyContent="space-around" marginTop="3rem">
          <Box color="#617480" borderRadius="20px" bg="white" height="8rem" width="20rem" p="5">
            <Box paddingLeft="5" bg="white" d="flex" alignItems="center">
              <Text fontSize="23">
                <Heart />
              </Text>
              <Text marginLeft="5" fontSize="xl">
                Total
              </Text>
            </Box>
            <Box
              alignItems="center"
              paddingLeft="5"
              paddingRight="5"
              bg="white"
              d="flex"
              justifyContent="space-between"
            >
              <Heading fontSize="40">80%</Heading>
              <Text fontSize="25">80 / 100</Text>
            </Box>
          </Box>

          <Box
            color="#617480"
            justifyContent="space-between"
            borderRadius="20px"
            bg="white"
            height="8rem"
            width="20rem"
            p="5"
          >
            <Box paddingLeft="5" bg="white" d="flex" alignItems="center">
              <Text fontSize="23">
                <Heart />
              </Text>
              <Text marginLeft="5" fontSize="xl">
                Prioritário
              </Text>
            </Box>
            <Box
              alignItems="center"
              paddingLeft="5"
              paddingRight="5"
              bg="white"
              d="flex"
              justifyContent="space-between"
            >
              <Heading fontSize="40">80%</Heading>
              <Text fontSize="25">80 / 100</Text>
            </Box>
          </Box>

          <Box
            color="#617480"
            justifyContent="space-between"
            borderRadius="20px"
            bg="white"
            height="8rem"
            width="20rem"
            p="5"
          >
            <Box paddingLeft="5" bg="white" d="flex" alignItems="center">
              <Text fontSize="23">
                <Heart />
              </Text>
              <Text marginLeft="5" fontSize="xl">
                Baixa Prioridade
              </Text>
            </Box>
            <Box
              alignItems="center"
              paddingLeft="5"
              paddingRight="5"
              bg="white"
              d="flex"
              justifyContent="space-between"
            >
              <Heading fontSize="40">80%</Heading>
              <Text fontSize="25">80 / 100</Text>
            </Box>
          </Box>
        </Flex>

        <Divider />

        <AppointmentsSummary />
      </Box>
    </App>
  );
};

export default DashBoard;
