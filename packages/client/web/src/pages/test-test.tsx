import React from 'react';
import { Flex, Heading, Icon } from '@chakra-ui/react';
import { MdLocalHospital as Hospital } from 'react-icons/md';

const TestTest: React.FC = () => (
  <>
    <Heading>Routing test page</Heading>

    <Flex>
      <Icon as={Hospital} w={8} h={8} color="red.500" />
    </Flex>
  </>
);

export default TestTest;
