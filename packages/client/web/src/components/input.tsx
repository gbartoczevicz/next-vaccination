import React, { useEffect, useRef } from 'react';
import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react';
import { useField } from '@unform/core';

type InputProps = ChakraInputProps;

export const Input: React.FC<InputProps> = ({ name, ...rest }) => {
  const inputRef = useRef<InputProps>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value'
    });
  }, [fieldName, registerField]);

  return (
    <ChakraInput
      name={name}
      ref={inputRef}
      bgColor="white"
      color="gray.400"
      fontWeight="normal"
      isInvalid={!!error}
      defaultValue={defaultValue}
      _placeholder={{ color: error ? 'red' : 'gray.400', fontSize: '16px' }}
      pr="4.5rem"
      h="72px"
      {...rest}
    />
  );
};
