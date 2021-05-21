import React, { useEffect, useRef } from 'react';
import { Input as ChakraInput, InputProps as ChakraInputProps, Tooltip, UseTooltipProps } from '@chakra-ui/react';
import { useField } from '@unform/core';

interface InputProps extends ChakraInputProps {
  tooltipPlacement?: UseTooltipProps['placement'];
}

export const Input: React.FC<InputProps> = ({ name, tooltipPlacement = 'auto', ...rest }) => {
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
    <Tooltip label={error} isOpen={!!error} placement={tooltipPlacement} bg="red.600" color="white">
      <ChakraInput
        name={name}
        ref={inputRef}
        bgColor="white"
        color="gray.400"
        fontWeight="normal"
        isInvalid={!!error}
        defaultValue={defaultValue}
        _placeholder={{ color: error ? 'red.600' : 'gray.400', fontSize: '16px' }}
        pr="4.5rem"
        h="72px"
        {...rest}
      />
    </Tooltip>
  );
};
