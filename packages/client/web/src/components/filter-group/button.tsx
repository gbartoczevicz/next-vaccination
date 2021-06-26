import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

export const FilterButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <Button
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
  </Button>
);
