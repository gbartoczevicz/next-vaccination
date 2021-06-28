import React from 'react';
import { Box, useRadio, UseRadioProps } from '@chakra-ui/react';

export const Button: React.FC<UseRadioProps> = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        _checked={{
          color: '#6C63FF'
        }}
        color="#000000"
        px={4}
        fontSize="20px"
        fontWeight="normal"
      >
        {props.children}
      </Box>
    </Box>
  );
};
