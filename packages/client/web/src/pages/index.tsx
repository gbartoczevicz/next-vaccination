import React from 'react';

import Link from 'next/link';
import { Flex, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';

const Home: React.FC = () => (
  <Flex>
    <Heading>Next Vaccination</Heading>
    <Text>Testing Theme Context</Text>

    <ChakraLink as={Link} href="/test-test" isExternal>
      Ir para test page
    </ChakraLink>
  </Flex>
);

export default Home;
