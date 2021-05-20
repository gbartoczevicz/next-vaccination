import React from 'react';
import { Box, BoxProps, Heading } from '@chakra-ui/react';

interface IMainFormContainerProps extends BoxProps {
  title: string;
}

export const MainFormContainer: React.FC<IMainFormContainerProps> = ({ title, children, ...rest }) => (
  <Box {...rest}>
    <Heading fontWeight="medium" fontSize="3xl" marginBottom="6">
      {title}
    </Heading>
    <Box boxSize="sm">{children}</Box>
  </Box>
);
