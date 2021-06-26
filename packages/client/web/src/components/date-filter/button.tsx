import React from 'react';
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

export const DateFilterButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <ChakraButton
    colorScheme="#617480"
    variant="link"
    fontSize="20px"
    border="none"
    fontWeight="normal"
    marginRight="10"
    marginLeft="10"
    _hover={{
      background: 'white',
      color: '#6C63FF'
    }}
    {...props}
  >
    {children}
  </ChakraButton>
);
