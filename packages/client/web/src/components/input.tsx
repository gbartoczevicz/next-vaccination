import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input as ChakraInput, InputProps as ChakraInputProps, Tooltip, UseTooltipProps } from '@chakra-ui/react';
import { useField } from '@unform/core';

interface InputProps extends ChakraInputProps {
  tooltipPlacement?: UseTooltipProps['placement'];
}

export const Input: React.FC<InputProps> = ({ name, tooltipPlacement = 'auto', ...rest }) => {
  const inputRef = useRef<InputProps>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value'
    });
  }, [fieldName, registerField]);

  useEffect(() => {
    setIsInvalid(!isFocused && !isFilled && !!error);
  }, [isFocused, isFilled, error]);

  const handleOnFocus = useCallback(() => setIsFocused(true), []);

  const handleOnBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Tooltip label={error} isOpen={isInvalid} placement={tooltipPlacement} bg="red.600" color="white">
      <ChakraInput
        name={name}
        ref={inputRef}
        bgColor="white"
        color="gray.400"
        fontWeight="normal"
        isInvalid={isInvalid}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        defaultValue={defaultValue}
        _placeholder={{ color: isInvalid ? 'red.600' : 'gray.400', fontSize: '16px' }}
        pr="4.5rem"
        h="72px"
        {...rest}
      />
    </Tooltip>
  );
};
