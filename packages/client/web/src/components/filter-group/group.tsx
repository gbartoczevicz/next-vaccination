import React from 'react';
import { ButtonGroup, ButtonGroupProps } from '@chakra-ui/react';

export const FilterButtonGroup: React.FC<ButtonGroupProps> = ({ children, ...props }) => (
  <ButtonGroup height="fit-content" bgColor="white" borderRadius="md" p="2" {...props}>
    {children}
  </ButtonGroup>
);
