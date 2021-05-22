import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

interface IFormSubmitButton extends ButtonProps {
  label: string;
}

export const FormSubmitButton: React.FC<IFormSubmitButton> = ({ label, ...rest }) => (
  <Button
    backgroundColor="blue.500"
    _hover={{ backgroundColor: 'blue.500' }}
    fontSize="18px"
    color="white"
    size="md"
    h="64px"
    w="300px"
    {...rest}
  >
    {label}
  </Button>
);
